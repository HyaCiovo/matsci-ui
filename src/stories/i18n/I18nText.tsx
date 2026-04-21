import React from 'react';
import { useStorybookLocale } from './LocaleProvider';

export function I18nText({ en, zh }: { en: React.ReactNode; zh: React.ReactNode }) {
  const locale = useStorybookLocale();
  return <>{locale === 'zh' ? zh : en}</>;
}

