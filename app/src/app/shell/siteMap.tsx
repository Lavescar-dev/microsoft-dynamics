import type { ComponentType } from 'react';
import {
  Archive24Regular,
  AppGeneric24Regular,
  ArrowTrendingLines24Regular,
  BookInformation24Regular,
  Box24Regular,
  BrainCircuit24Regular,
  Briefcase24Regular,
  Building24Regular,
  CalendarLtr24Regular,
  Cart24Regular,
  ChartMultiple24Regular,
  ContentView24Regular,
  Cube24Regular,
  DataBarVertical24Regular,
  DocumentBulletList24Regular,
  Headset24Regular,
  Home24Regular,
  Megaphone24Regular,
  People24Regular,
  PeopleSwap24Regular,
  PeopleTeam24Regular,
  PersonAdd24Regular,
  Receipt24Regular,
  ShoppingBag24Regular,
  Target24Regular,
  Wallet24Regular,
  Wrench24Regular
} from '@fluentui/react-icons';

export type SiteMapItem = {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  areaTitle?: string;
  groupTitle?: string;
};

export type SiteMapGroup = {
  title: string;
  items: SiteMapItem[];
};

export type SiteMapArea = {
  title: string;
  groups: SiteMapGroup[];
};

export const homeItem: SiteMapItem = {
  name: 'Home',
  href: '/',
  icon: Home24Regular
};

export const settingsItem: SiteMapItem = {
  name: 'Settings',
  href: '/settings',
  icon: AppGeneric24Regular,
  areaTitle: 'Administration',
  groupTitle: 'System'
};

export const siteMapAreas: SiteMapArea[] = [
  {
    title: 'My Work',
    groups: [
      {
        title: 'Workspace',
        items: [
          { name: 'Dashboard', href: '/', icon: Home24Regular },
          { name: 'Activities', href: '/activities', icon: CalendarLtr24Regular }
        ]
      }
    ]
  },
  {
    title: 'Customer Engagement',
    groups: [
      {
        title: 'Sales',
        items: [
          { name: 'Sales', href: '/sales', icon: ArrowTrendingLines24Regular },
          { name: 'Leads', href: '/leads', icon: PersonAdd24Regular },
          { name: 'Opportunities', href: '/opportunities', icon: Target24Regular },
          { name: 'Accounts', href: '/accounts', icon: Building24Regular },
          { name: 'Contacts', href: '/contacts', icon: People24Regular },
          { name: 'Quotes', href: '/quotes', icon: DocumentBulletList24Regular },
          { name: 'Orders', href: '/orders', icon: Cart24Regular },
          { name: 'Invoices', href: '/invoices', icon: Receipt24Regular },
          { name: 'Products', href: '/products', icon: Cube24Regular },
          { name: 'Competitors', href: '/competitors', icon: PeopleSwap24Regular }
        ]
      },
      {
        title: 'Marketing',
        items: [
          { name: 'Marketing', href: '/marketing', icon: Megaphone24Regular },
          { name: 'Campaigns', href: '/marketing/campaigns', icon: DocumentBulletList24Regular },
          { name: 'Segments', href: '/marketing/segments', icon: Target24Regular },
          { name: 'Customer Journeys', href: '/marketing/customer-journeys', icon: CalendarLtr24Regular },
          { name: 'Customer Insights', href: '/customer-insights', icon: ChartMultiple24Regular }
        ]
      },
      {
        title: 'Service',
        items: [
          { name: 'Customer Service', href: '/customer-service', icon: Headset24Regular },
          { name: 'Cases', href: '/cases', icon: Archive24Regular },
          { name: 'Knowledge Articles', href: '/knowledge', icon: BookInformation24Regular },
          { name: 'Queues', href: '/queues', icon: ContentView24Regular },
          { name: 'Field Service', href: '/field-service', icon: Wrench24Regular },
          { name: 'Work Orders', href: '/field-service/work-orders', icon: DocumentBulletList24Regular },
          { name: 'Schedule Board', href: '/field-service/schedule-board', icon: CalendarLtr24Regular }
        ]
      }
    ]
  },
  {
    title: 'ERP & Operations',
    groups: [
      {
        title: 'Operations',
        items: [
          { name: 'Business Central', href: '/business-central', icon: AppGeneric24Regular },
          { name: 'Finance', href: '/finance', icon: Wallet24Regular },
          { name: 'Supply Chain', href: '/supply-chain', icon: Box24Regular },
          { name: 'Project Operations', href: '/project-operations', icon: Briefcase24Regular },
          { name: 'Commerce', href: '/commerce', icon: ShoppingBag24Regular },
          { name: 'Human Resources', href: '/human-resources', icon: PeopleTeam24Regular }
        ]
      }
    ]
  },
  {
    title: 'Intelligence',
    groups: [
      {
        title: 'Insights',
        items: [
          { name: 'Reports', href: '/reports', icon: DataBarVertical24Regular },
          { name: 'Copilot', href: '/copilot', icon: BrainCircuit24Regular }
        ]
      }
    ]
  }
];

export const siteMapItems = siteMapAreas.flatMap((area) =>
  area.groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      areaTitle: area.title,
      groupTitle: group.title
    }))
  )
);

const allSiteMapItems = [...siteMapItems, settingsItem];

function normalizePathname(pathname: string) {
  const normalized = pathname.split('?')[0]?.split('#')[0] ?? '/';
  return normalized === '' ? '/' : normalized;
}

export function getCanonicalSiteMapHref(pathname: string) {
  const normalizedPath = normalizePathname(pathname);
  const exactMatch = allSiteMapItems.find((item) => item.href === normalizedPath);

  if (exactMatch) {
    return exactMatch.href;
  }

  const prefixMatches = allSiteMapItems
    .filter((item) => item.href !== '/' && normalizedPath.startsWith(`${item.href}/`))
    .sort((left, right) => right.href.length - left.href.length);

  return prefixMatches[0]?.href ?? homeItem.href;
}

export function findSiteMapItem(pathname: string) {
  const canonicalHref = getCanonicalSiteMapHref(pathname);
  return allSiteMapItems.find((item) => item.href === canonicalHref) ?? homeItem;
}
