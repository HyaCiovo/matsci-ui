import React from 'react';
import { useStorybookLocale } from './LocaleProvider';

function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);

  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={`code-${index}`} className="ms-docs-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={`text-${index}`}>{part}</React.Fragment>;
  });
}

export function I18nText({ en, zh }: { en: React.ReactNode; zh: React.ReactNode }) {
  const locale = useStorybookLocale();
  const value = locale === 'zh' ? zh : en;

  if (typeof value === 'string') {
    return <>{renderInlineCode(value)}</>;
  }

  return <>{value}</>;
}
