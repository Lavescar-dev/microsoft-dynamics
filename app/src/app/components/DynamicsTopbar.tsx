import { Link, useNavigate } from 'react-router';
import {
  Add24Regular,
  Alert24Regular,
  ChevronRight24Regular,
  Dismiss24Regular,
  Globe24Regular,
  Navigation24Regular,
  QuestionCircle24Regular,
  Search24Regular,
  Settings24Regular
} from '@fluentui/react-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useShell } from '../shell/ShellProvider';
import { siteMapItems, type SiteMapItem } from '../shell/siteMap';
import { useLocale } from '../contexts/LocaleContext';

type SearchEntry =
  | { id: string; type: 'item'; item: SiteMapItem }
  | { id: string; type: 'create'; label: string; href: string; icon: typeof Add24Regular };

const quickCreateEntries = [
  { id: 'new-lead', label: 'New Lead', href: '/leads/new', icon: Add24Regular },
  { id: 'new-opportunity', label: 'New Opportunity', href: '/opportunities/new', icon: Add24Regular },
  { id: 'new-account', label: 'New Account', href: '/accounts/new', icon: Add24Regular },
  { id: 'new-contact', label: 'New Contact', href: '/contacts/new', icon: Add24Regular },
  { id: 'new-case', label: 'New Case', href: '/cases/new', icon: Add24Regular },
  { id: 'new-campaign', label: 'New Campaign', href: '/marketing/campaigns/new', icon: Add24Regular },
  { id: 'new-segment', label: 'New Segment', href: '/marketing/segments/new', icon: Add24Regular },
  { id: 'new-journey', label: 'New Journey', href: '/marketing/customer-journeys/new', icon: Add24Regular },
  { id: 'new-work-order', label: 'New Work Order', href: '/field-service/work-orders/new', icon: Add24Regular },
];

export function DynamicsTopbar() {
  const { locale, setLocale, tr } = useLocale();
  const navigate = useNavigate();
  const {
    activeItem,
    isSearchOpen,
    pinnedItems,
    recentItems,
    searchQuery,
    searchResults,
    setSearchOpen,
    setSearchQuery,
    toggleSidebar
  } = useShell();

  const searchRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isQuickCreateOpen, setQuickCreateOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const activeContextItem = useMemo(
    () => siteMapItems.find((item) => item.href === activeItem.href) ?? activeItem,
    [activeItem]
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
        setQuickCreateOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [setSearchOpen]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
        setQuickCreateOpen(false);
        searchInputRef.current?.focus();
        return;
      }

      if (!isTypingTarget && event.key === '/') {
        event.preventDefault();
        setSearchOpen(true);
        setQuickCreateOpen(false);
        searchInputRef.current?.focus();
        return;
      }

      if (event.key === 'Escape') {
        setSearchOpen(false);
        setQuickCreateOpen(false);
      }
    }

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [setSearchOpen]);

  const quickItems = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      return searchResults;
    }

    return [...recentItems.slice(0, 4), ...pinnedItems.slice(0, 4)];
  }, [pinnedItems, recentItems, searchQuery, searchResults]);

  const matchingCreateEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return quickCreateEntries.slice(0, 4);
    }

    return quickCreateEntries.filter((entry) => {
      const source = entry.label.toLowerCase();
      const translated = tr(entry.label).toLowerCase();
      return source.includes(query) || translated.includes(query);
    });
  }, [searchQuery, tr]);

  const combinedEntries = useMemo<SearchEntry[]>(() => {
    const itemEntries = quickItems.map((item) => ({ id: `item-${item.href}`, type: 'item' as const, item }));
    const createEntries = matchingCreateEntries.map((entry) => ({
      id: `create-${entry.href}`,
      type: 'create' as const,
      label: entry.label,
      href: entry.href,
      icon: entry.icon,
    }));

    return [...itemEntries, ...createEntries];
  }, [matchingCreateEntries, quickItems]);

  useEffect(() => {
    setActiveSearchIndex(0);
  }, [searchQuery, isSearchOpen]);

  function resolveActiveEntry(entry: SearchEntry) {
    if (entry.type === 'item') {
      navigate(entry.item.href);
      setSearchOpen(false);
      setSearchQuery('');
      return;
    }

    navigate(entry.href);
    setSearchOpen(false);
    setSearchQuery('');
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearchOpen || combinedEntries.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveSearchIndex((current) => (current + 1) % combinedEntries.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveSearchIndex((current) => (current - 1 + combinedEntries.length) % combinedEntries.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const nextEntry = combinedEntries[activeSearchIndex];
      if (nextEntry) {
        resolveActiveEntry(nextEntry);
      }
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleSidebar}>
            <Navigation24Regular className="w-4 h-4 dark:text-gray-300" />
          </Button>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-[11px] text-gray-600 dark:text-gray-400">{tr('Production')}</div>
            <div className="text-sm text-gray-900 dark:text-gray-200 font-semibold">{tr('Sales Hub')}</div>
          </div>

          <div ref={searchRef} className="relative flex-1">
            <Search24Regular className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
                setQuickCreateOpen(false);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search for records..."
              className="pl-9 h-8 bg-[#f3f2f1] dark:bg-gray-700 dark:text-white border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-[#0B71C7] focus:ring-1 focus:ring-[#0B71C7]"
            />

            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm z-20">
                <div className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center justify-between">
                  <span>{searchQuery.trim().length > 0 ? tr('Search results') : tr('Recent and pinned')}</span>
                  <span className="text-[11px] text-gray-500">Ctrl+K</span>
                </div>
                <div className="max-h-72 overflow-y-auto py-1">
                  {quickItems.length > 0 ? (
                    quickItems.map((item, index) => (
                      <Link
                        key={`search-${item.href}`}
                        to={item.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#f3f2f1] dark:hover:bg-gray-700 ${
                          activeSearchIndex === index ? 'bg-[#f3f2f1] dark:bg-gray-700' : ''
                        }`}
                      >
                          <item.icon className="w-4 h-4" />
                          <div className="min-w-0">
                          <div>{tr(item.name)}</div>
                          {'groupTitle' in item && item.groupTitle ? (
                            <div className="text-[11px] text-gray-500">{tr(item.areaTitle)} • {tr(item.groupTitle)}</div>
                          ) : null}
                        </div>
                      </Link>
                    ))
                  ) : null}
                  {matchingCreateEntries.length > 0 ? (
                    <>
                      <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-gray-500">{tr('Quick create')}</div>
                      {matchingCreateEntries.map((entry, index) => {
                        const entryIndex = quickItems.length + index;
                        return (
                          <Link
                            key={entry.id}
                            to={entry.href}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className={`flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#f3f2f1] dark:hover:bg-gray-700 ${
                              activeSearchIndex === entryIndex ? 'bg-[#f3f2f1] dark:bg-gray-700' : ''
                            }`}
                          >
                            <entry.icon className="w-4 h-4" />
                            <span>{tr(entry.label)}</span>
                          </Link>
                        );
                      })}
                    </>
                  ) : null}
                  {quickItems.length === 0 && matchingCreateEntries.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{tr('No matching records')}</div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setQuickCreateOpen((current) => !current);
              setSearchOpen(false);
            }}
          >
            <Add24Regular className="w-4 h-4 mr-2" />
            {tr('New')}
          </Button>
          {isQuickCreateOpen ? (
            <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm z-20">
              <div className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400">{tr('Quick create')}</div>
              <div className="py-1">
                {quickCreateEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    to={entry.href}
                    onClick={() => setQuickCreateOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-[#f3f2f1] dark:hover:bg-gray-700"
                  >
                    <entry.icon className="w-4 h-4" />
                    <span>{tr(entry.label)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Globe24Regular className="w-4 h-4 mr-2 dark:text-gray-300" />
                <span className="text-xs font-medium">{locale === 'tr' ? 'TR' : 'EN'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{tr('Language & Region')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value === 'tr' ? 'tr' : 'en')}>
                <DropdownMenuRadioItem value="en">{tr('English (United States)')}</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="tr">{tr('Turkish (Türkiye)')}</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Alert24Regular className="w-4 h-4 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F25022] rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate('/settings')}
          >
            <Settings24Regular className="w-4 h-4 dark:text-gray-300" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700">
            <QuestionCircle24Regular className="w-4 h-4 dark:text-gray-300" />
          </Button>
          <div className="w-8 h-8 rounded-sm bg-[#0B71C7] flex items-center justify-center text-white text-xs font-semibold ml-2 cursor-pointer hover:bg-[#106ebe] transition-colors">
            SJ
          </div>
        </div>
      </div>

      <div className="h-9 flex items-center px-4 text-sm bg-[#f5f5f5] dark:bg-gray-900">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-[#0B71C7] hover:underline transition-colors">
            {tr(activeContextItem.areaTitle ?? 'Sales')}
          </Link>
          {activeContextItem.groupTitle ? (
            <>
              <ChevronRight24Regular className="w-4 h-4" />
              <span>{tr(activeContextItem.groupTitle)}</span>
            </>
          ) : null}
          <ChevronRight24Regular className="w-4 h-4" />
          <span className="text-gray-900 dark:text-gray-200 font-semibold">{tr(activeItem.name)}</span>
        </div>
        {isSearchOpen ? (
          <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-200">
              <Dismiss24Regular className="w-3 h-3" />
              {tr('Clear')}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
