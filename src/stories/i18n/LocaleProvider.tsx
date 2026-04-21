import React, { createContext, useContext } from 'react';

export type StorybookLocale = 'en' | 'zh';

const LocaleContext = createContext<StorybookLocale>('en');

export function StorybookLocaleProvider({
  locale,
  children,
}: {
  locale: StorybookLocale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useStorybookLocale() {
  return useContext(LocaleContext);
}

