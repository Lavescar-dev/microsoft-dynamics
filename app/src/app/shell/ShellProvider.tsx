import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { findSiteMapItem, getCanonicalSiteMapHref, homeItem, siteMapAreas, siteMapItems, type SiteMapItem } from './siteMap';
import { useLocale } from '../contexts/LocaleContext';

type ShellContextValue = {
  isCompact: boolean;
  isMobile: boolean;
  isSidebarOpen: boolean;
  expandedAreas: string[];
  expandedGroups: string[];
  pinnedItems: SiteMapItem[];
  recentItems: SiteMapItem[];
  activeItem: SiteMapItem;
  searchQuery: string;
  searchResults: SiteMapItem[];
  isSearchOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleArea: (title: string) => void;
  toggleGroup: (title: string, areaTitle?: string) => void;
  togglePinned: (item: SiteMapItem) => void;
  setSearchQuery: (query: string) => void;
  setSearchOpen: (open: boolean) => void;
};

const EXPANDED_AREAS_KEY = 'dynamics-shell-expanded-areas';
const EXPANDED_GROUPS_KEY = 'dynamics-shell-expanded-groups';
const PINNED_ITEMS_KEY = 'dynamics-shell-pinned-items';
const RECENT_ITEMS_KEY = 'dynamics-shell-recent-items';
const SIDEBAR_COMPACT_KEY = 'dynamics-shell-sidebar-compact';

const defaultPinned = ['/', '/leads', '/accounts'];
const defaultExpandedAreas = ['Customer Engagement'];
const defaultExpandedGroups = ['Sales'];

const ShellContext = createContext<ShellContextValue | undefined>(undefined);

function readStoredArray(key: string, fallback: string[]) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function storeArray(key: string, value: string[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function resolveItems(hrefs: string[]) {
  return hrefs
    .map((href) => siteMapItems.find((item) => item.href === href) ?? (href === homeItem.href ? homeItem : null))
    .filter(Boolean) as SiteMapItem[];
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const { tr } = useLocale();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedAreas, setExpandedAreas] = useState<string[]>(defaultExpandedAreas);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(defaultExpandedGroups);
  const [pinnedHrefs, setPinnedHrefs] = useState<string[]>(defaultPinned);
  const [recentHrefs, setRecentHrefs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const syncViewport = () => {
      const nextIsMobile = window.innerWidth < 768;
      const nextIsCompact = nextIsMobile ? false : window.innerWidth < 1200;

      setIsMobile(nextIsMobile);
      setIsCompact(nextIsCompact || window.localStorage.getItem(SIDEBAR_COMPACT_KEY) === 'true');
      setIsSidebarOpen(!nextIsMobile);
    };

    setExpandedAreas(readStoredArray(EXPANDED_AREAS_KEY, defaultExpandedAreas));
    setExpandedGroups(readStoredArray(EXPANDED_GROUPS_KEY, defaultExpandedGroups));
    setPinnedHrefs(readStoredArray(PINNED_ITEMS_KEY, defaultPinned));
    setRecentHrefs(readStoredArray(RECENT_ITEMS_KEY, []));
    syncViewport();

    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    if (!location.pathname) return;

    const currentItem = findSiteMapItem(location.pathname);
    const canonicalHref = getCanonicalSiteMapHref(location.pathname);
    const matchingArea = siteMapAreas.find((area) =>
      area.groups.some((group) => group.items.some((item) => item.href === canonicalHref))
    );
    const matchingGroup = matchingArea?.groups.find((group) =>
      group.items.some((item) => item.href === canonicalHref)
    );

    if (matchingArea) {
      setExpandedAreas((prev) => {
        const next = prev.length === 1 && prev[0] === matchingArea.title ? prev : [matchingArea.title];
        if (next !== prev) {
          storeArray(EXPANDED_AREAS_KEY, next);
        }
        return next;
      });
    }

    if (matchingGroup) {
      setExpandedGroups((prev) => {
        const next = prev.length === 1 && prev[0] === matchingGroup.title ? prev : [matchingGroup.title];
        if (next !== prev) {
          storeArray(EXPANDED_GROUPS_KEY, next);
        }
        return next;
      });
    }

    setRecentHrefs((prev) => {
      const next = [canonicalHref, ...prev.filter((href) => href !== canonicalHref)].slice(0, 6);
      storeArray(RECENT_ITEMS_KEY, next);
      return next;
    });

    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeItem = useMemo(() => findSiteMapItem(location.pathname), [location.pathname]);
  const pinnedItems = useMemo(() => resolveItems(pinnedHrefs), [pinnedHrefs]);
  const recentItems = useMemo(
    () => resolveItems(recentHrefs).filter((item) => item.href !== activeItem.href),
    [recentHrefs, activeItem.href]
  );
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return siteMapItems
      .filter((item) => {
        const name = item.name.toLowerCase();
        const translatedName = tr(item.name).toLowerCase();
        return name.includes(query) || translatedName.includes(query);
      })
      .slice(0, 8);
  }, [searchQuery, tr]);

  function toggleSidebar() {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
      return;
    }

    setIsCompact((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_COMPACT_KEY, String(next));
      return next;
    });
  }

  function closeSidebar() {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }

  function toggleArea(title: string) {
    setExpandedAreas((prev) => {
      const next = prev.includes(title) ? prev.filter((value) => value !== title) : [title];
      storeArray(EXPANDED_AREAS_KEY, next);
      return next;
    });
  }

  function toggleGroup(title: string, areaTitle?: string) {
    setExpandedGroups((prev) => {
      const siblingGroups = areaTitle
        ? siteMapAreas.find((area) => area.title === areaTitle)?.groups.map((group) => group.title) ?? []
        : [];
      const preservedGroups = prev.filter((value) => !siblingGroups.includes(value));
      const next = prev.includes(title) ? prev.filter((value) => value !== title) : [...preservedGroups, title];
      storeArray(EXPANDED_GROUPS_KEY, next);
      return next;
    });
  }

  function togglePinned(item: SiteMapItem) {
    setPinnedHrefs((prev) => {
      const next = prev.includes(item.href) ? prev.filter((href) => href !== item.href) : [item.href, ...prev].slice(0, 8);
      storeArray(PINNED_ITEMS_KEY, next);
      return next;
    });
  }

  return (
    <ShellContext.Provider
      value={{
        isCompact,
        isMobile,
        isSidebarOpen,
        expandedAreas,
        expandedGroups,
        pinnedItems,
        recentItems,
        activeItem,
        searchQuery,
        searchResults,
        isSearchOpen,
        toggleSidebar,
        closeSidebar,
        toggleArea,
        toggleGroup,
        togglePinned,
        setSearchQuery,
        setSearchOpen
      }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error('useShell must be used within ShellProvider');
  }
  return context;
}
