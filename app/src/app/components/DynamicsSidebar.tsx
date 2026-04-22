import { Link } from 'react-router';
import {
  ChevronDown24Regular,
  ChevronRight24Regular,
  Document24Regular,
  Folder24Regular,
  Grid24Regular,
  Home24Regular,
  Pin24Regular,
  Settings24Regular
} from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import { cn } from './ui/utils';
import { useShell } from '../shell/ShellProvider';
import { siteMapAreas, type SiteMapItem } from '../shell/siteMap';
import { useLocale } from '../contexts/LocaleContext';

function SiteMapLink({
  item,
  compact,
  active,
  pinned,
  onPinToggle,
  className
}: {
  item: SiteMapItem;
  compact: boolean;
  active: boolean;
  pinned?: boolean;
  onPinToggle?: (item: SiteMapItem) => void;
  className?: string;
}) {
  const { tr } = useLocale();

  return (
    <div className="group relative">
      <Link
        to={item.href}
        title={tr(item.name)}
        className={cn(
          'flex items-center gap-2.5 py-2 rounded-sm text-sm transition-all border-l-2 border-transparent',
          compact ? 'px-3 justify-center' : 'px-3',
          active
            ? 'bg-gray-200 text-gray-950 font-medium border-l-[#0B71C7]'
            : 'text-gray-900 hover:bg-gray-200 hover:text-gray-950',
          className
        )}
      >
        <item.icon className="w-4 h-4 shrink-0" />
        {!compact && <span className="truncate">{tr(item.name)}</span>}
      </Link>

      {!compact && onPinToggle && (
        <button
          type="button"
          title={tr(pinned ? 'Unpin' : 'Pin')}
          aria-label={tr(pinned ? 'Unpin' : 'Pin')}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onPinToggle(item);
          }}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity',
            active ? 'text-gray-950' : 'text-gray-700'
          )}
        >
          <Pin24Regular className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function DynamicsSidebar() {
  const { tr } = useLocale();
  const {
    activeItem,
    closeSidebar,
    expandedAreas,
    expandedGroups,
    isCompact,
    isMobile,
    isSidebarOpen,
    pinnedItems,
    recentItems,
    toggleArea,
    toggleGroup,
    togglePinned
  } = useShell();
  const [isRecentOpen, setRecentOpen] = useState(true);
  const [isPinnedOpen, setPinnedOpen] = useState(true);

  useEffect(() => {
    if (recentItems.length === 0) {
      setRecentOpen(false);
    }
  }, [recentItems.length]);

  useEffect(() => {
    if (pinnedItems.length === 0) {
      setPinnedOpen(false);
    }
  }, [pinnedItems.length]);

  return (
    <>
      {isMobile && isSidebarOpen ? (
        <button
          type="button"
          aria-label={tr('Close navigation')}
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/30"
        />
      ) : null}

      <div
        className="bg-[#f3f2f1] dark:bg-gray-950 text-gray-950 dark:text-white flex flex-col border-r border-gray-200 dark:border-white/5"
        style={{
          width: isCompact && !isMobile ? '3.5rem' : '14rem',
          position: isMobile ? 'fixed' : 'relative',
          inset: isMobile ? '0 auto 0 0' : undefined,
          height: isMobile ? '100vh' : undefined,
          zIndex: isMobile ? 40 : undefined,
          transform: isMobile && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 200ms ease, width 200ms ease'
        }}
      >
        <div className={cn('px-3 py-3 border-b border-gray-200 dark:border-white/5', isCompact && !isMobile && 'px-2.5')}>
          <div className={cn('flex items-center gap-2', isCompact && !isMobile && 'justify-center')}>
            <Grid24Regular className="w-6 h-6 text-gray-950 dark:text-white" />
            {!isCompact && <h1 className="text-base font-semibold leading-none">Dynamics 365</h1>}
          </div>
          {!isCompact && <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">{tr('Sales Hub')}</p>}
        </div>

        <nav className="flex-1 px-2 py-2.5 space-y-1 overflow-y-auto">
          <div className="mb-2">
            <SiteMapLink
              item={{ name: 'Home', href: '/', icon: Home24Regular }}
              compact={isCompact}
              active={activeItem.href === '/'}
            />
          </div>

          {!isCompact && (
            <>
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setRecentOpen((current) => !current)}
                  className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 hover:text-gray-950 transition-colors"
                >
                    <span>{tr('Recent')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{recentItems.length}</span>
                    {isRecentOpen ? <ChevronDown24Regular className="w-3 h-3" /> : <ChevronRight24Regular className="w-3 h-3" />}
                  </div>
                </button>
                {isRecentOpen ? (
                  <div className="mt-0.5 space-y-0.5">
                    {recentItems.length > 0 ? (
                      recentItems.map((item) => (
                        <SiteMapLink
                          key={`recent-${item.href}`}
                          item={item}
                          compact={false}
                          active={activeItem.href === item.href}
                          pinned={pinnedItems.some((pinned) => pinned.href === item.href)}
                          onPinToggle={togglePinned}
                          className="pl-7 pr-3"
                        />
                      ))
                    ) : (
                      <div className="flex items-center gap-2.5 py-2 rounded text-sm text-gray-600 px-3">
                        <Document24Regular className="w-4 h-4" />
                        <span>{tr('No recent items')}</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => setPinnedOpen((current) => !current)}
                  className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 hover:text-gray-950 transition-colors"
                >
                    <span>{tr('Pinned')}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">{pinnedItems.length}</span>
                    {isPinnedOpen ? <ChevronDown24Regular className="w-3 h-3" /> : <ChevronRight24Regular className="w-3 h-3" />}
                  </div>
                </button>
                {isPinnedOpen ? (
                  <div className="mt-0.5 space-y-0.5">
                    {pinnedItems.length > 0 ? (
                      pinnedItems.map((item) => (
                        <SiteMapLink
                          key={`pinned-${item.href}`}
                          item={item}
                          compact={false}
                          active={activeItem.href === item.href}
                          pinned
                          onPinToggle={togglePinned}
                          className="pl-7 pr-3"
                        />
                      ))
                    ) : (
                      <div className="flex items-center gap-2.5 py-2 rounded text-sm text-gray-600 px-3">
                        <Folder24Regular className="w-4 h-4" />
                        <span>{tr('No pinned items')}</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          )}

          {siteMapAreas.map((area) => {
            const areaExpanded = expandedAreas.includes(area.title);

            return (
              <div key={area.title} className="mb-2">
                <button
                  type="button"
                  onClick={() => toggleArea(area.title)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 hover:text-gray-950 transition-colors',
                    isCompact && 'justify-center'
                  )}
                  title={area.title}
                >
                  {!isCompact && <span>{tr(area.title)}</span>}
                  {isCompact ? null : areaExpanded ? <ChevronDown24Regular className="w-3 h-3" /> : <ChevronRight24Regular className="w-3 h-3" />}
                </button>

                {areaExpanded && !isCompact && (
                  <div className="mt-0.5 space-y-1">
                    {area.groups.map((group) => {
                      const groupExpanded = expandedGroups.includes(group.title);

                      return (
                        <div key={group.title}>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.title, area.title)}
                            className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-semibold text-gray-600 hover:text-gray-950 transition-colors"
                          >
                            <span>{tr(group.title)}</span>
                            {groupExpanded ? <ChevronDown24Regular className="w-3 h-3" /> : <ChevronRight24Regular className="w-3 h-3" />}
                          </button>
                          {groupExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                              {group.items.map((item) => (
                                <SiteMapLink
                                  key={item.href}
                                  item={item}
                                  compact={false}
                                  active={activeItem.href === item.href}
                                  pinned={pinnedItems.some((pinned) => pinned.href === item.href)}
                                  onPinToggle={togglePinned}
                                  className="pl-7 pr-3"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {areaExpanded && isCompact && (
                  <div className="mt-0.5 space-y-0.5">
                    {area.groups.flatMap((group) => group.items).map((item) => (
                      <SiteMapLink
                        key={item.href}
                        item={item}
                        compact
                        active={activeItem.href === item.href}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-200 dark:border-white/10">
          <Link
            to="/settings"
            title={tr('Settings')}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors w-full border-l-2 border-transparent',
              isCompact && 'justify-center',
              activeItem.href === '/settings'
                ? 'bg-gray-200 text-gray-950 font-medium border-l-[#0B71C7]'
                : 'text-gray-900 hover:bg-gray-200 hover:text-gray-950'
            )}
          >
            <Settings24Regular className="w-4 h-4" />
            {!isCompact && <span>{tr('Settings')}</span>}
          </Link>
        </div>
      </div>
    </>
  );
}
