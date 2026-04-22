import * as React from 'react';
import type { Locale } from '../i18n/messages';
import { messages } from '../i18n/messages';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  tr: (text: string) => string;
  formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
}

const LocaleContext = React.createContext<LocaleContextValue | undefined>(undefined);

export function getCurrentLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('locale');
    if (stored === 'tr') return 'tr';
  }

  if (typeof document !== 'undefined' && document.documentElement.lang === 'tr') {
    return 'tr';
  }

  return 'en';
}

export function getCurrentLocaleCode() {
  return getCurrentLocale() === 'tr' ? 'tr-TR' : 'en-US';
}

export function formatDateForLocale(
  input: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(getCurrentLocaleCode(), options).format(new Date(input));
}

export function formatNumberForLocale(
  input: number,
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(getCurrentLocaleCode(), options).format(input);
}

export function formatCurrencyForLocale(input: number, currency?: string) {
  const locale = getCurrentLocale();
  return new Intl.NumberFormat(getCurrentLocaleCode(), {
    style: 'currency',
    currency: currency ?? (locale === 'tr' ? 'TRY' : 'USD'),
    maximumFractionDigits: 0,
  }).format(input);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    return stored === 'tr' ? 'tr' : 'en';
  });

  React.useEffect(() => {
    document.documentElement.lang = locale === 'tr' ? 'tr' : 'en';
    localStorage.setItem('locale', locale);
  }, [locale]);

  const tr = React.useCallback(
    (text: string) => {
      if (!text || locale === 'en') return text;
      return messages.tr[text] ?? text;
    },
    [locale],
  );

  const localeCode = locale === 'tr' ? 'tr-TR' : 'en-US';

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      tr,
      formatDate: (input, options) => new Intl.DateTimeFormat(localeCode, options).format(new Date(input)),
      formatNumber: (input, options) => new Intl.NumberFormat(localeCode, options).format(input),
      formatCurrency: (input, currency = locale === 'tr' ? 'TRY' : 'USD') =>
        new Intl.NumberFormat(localeCode, { style: 'currency', currency, maximumFractionDigits: 0 }).format(input),
    }),
    [locale, localeCode, tr],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = React.useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

export function localizeNode(node: React.ReactNode, tr: (text: string) => string): React.ReactNode {
  if (typeof node === 'string') {
    return tr(node);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => <React.Fragment key={index}>{localizeNode(child, tr)}</React.Fragment>);
  }

  if (React.isValidElement(node) && node.props && 'children' in node.props) {
    const props = node.props as { children?: React.ReactNode };
    return React.cloneElement(node, undefined, localizeNode(props.children, tr));
  }

  return node;
}
