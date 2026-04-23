import { Children, isValidElement, useEffect, useMemo, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { bundledLanguages, codeToHtml } from 'shiki/bundle/web';

const SHIKI_THEME = 'github-dark-default';

const shikiCache = new Map<string, Promise<string>>();

function flattenText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(flattenText).join('');
  if (isValidElement(children)) return flattenText(children.props.children);
  return '';
}

function detectLanguage(className?: string): string | undefined {
  if (!className) return undefined;

  const match = className.match(/(?:^|\s)(?:language|lang)-([a-z0-9+#.-]+)/i);
  if (!match) return undefined;

  return match[1]?.toLowerCase();
}

function resolveLanguage(language?: string) {
  if (!language) return undefined;

  const aliases: Record<string, string> = {
    shellsession: 'bash',
    shellscript: 'bash',
    console: 'bash',
    text: '',
    plaintext: '',
    txt: '',
  };

  const normalized = aliases[language] ?? language;
  if (!normalized) return undefined;

  return Object.prototype.hasOwnProperty.call(bundledLanguages, normalized) ? normalized : undefined;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderPlainHtml(code: string) {
  return `<pre class="shiki shiki-themes github-dark-default"><code>${escapeHtml(code)}</code></pre>`;
}

function getHighlightedHtml(code: string, language?: string) {
  const cacheKey = `${SHIKI_THEME}::${language ?? 'plain'}::${code}`;
  const cached = shikiCache.get(cacheKey);
  if (cached) return cached;

  const htmlPromise = language
    ? codeToHtml(code, { lang: language, theme: SHIKI_THEME })
    : Promise.resolve(renderPlainHtml(code));

  shikiCache.set(cacheKey, htmlPromise);
  return htmlPromise;
}

type DocsCodeProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

export function ShikiDocsCode({ className, children, ...rest }: DocsCodeProps) {
  const rawCode = useMemo(() => flattenText(children), [children]);
  const isBlock = Boolean(className) || /[\n\r]/.test(rawCode);
  const language = useMemo(() => resolveLanguage(detectLanguage(className)), [className]);
  const [html, setHtml] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isBlock) return;

    let cancelled = false;
    getHighlightedHtml(rawCode, language)
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(renderPlainHtml(rawCode));
      });

    return () => {
      cancelled = true;
    };
  }, [isBlock, language, rawCode]);

  if (!isBlock) {
    return (
      <code className={['ms-docs-inline-code', className].filter(Boolean).join(' ')} {...rest}>
        {children}
      </code>
    );
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="ms-docs-codeblock" {...rest}>
      <button
        type="button"
        className="ms-docs-codeblock__copy"
        onClick={copyCode}
        aria-label={copied ? 'Copied code' : 'Copy code'}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <div
        className="ms-docs-codeblock__inner"
        dangerouslySetInnerHTML={{ __html: html || renderPlainHtml(rawCode) }}
      />
    </div>
  );
}
