import { Suspense, lazy } from 'react';

const Markdown = lazy(() => import('./Markdown').then((mod) => ({ default: mod.Markdown })));

export interface LazyMarkdownTextProps {
  text?: string | null;
  className?: string;
}

export function LazyMarkdownText({ text, className }: Readonly<LazyMarkdownTextProps>) {
  if (!text) {
    return null;
  }

  return (
    <Suspense fallback={<div className={className}>{text}</div>}>
      <Markdown className={className}>{text}</Markdown>
    </Suspense>
  );
}
