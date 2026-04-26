import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

export interface MarkdownProps {
  id?: string;
  className?: string;
  dedent?: boolean;
  loading_state?: { is_loading?: boolean } | null;
  style?: React.CSSProperties;
  children?: string | string[];
}

interface MarkdownEnhancers {
  rehypeKatex?: unknown;
  remarkHighlight?: unknown;
  remarkMath?: unknown;
}

const dedentLines = (text: string) => {
  const lines = text.split(/\r\n|\r|\n/);
  let commonPrefix: string | null = null;

  for (const line of lines) {
    const match = line.match(/^\s*(?=\S)/);
    if (!match) continue;

    const prefix = match[0];
    if (commonPrefix === null) {
      commonPrefix = prefix;
      continue;
    }

    for (let i = 0; i < commonPrefix.length; i += 1) {
      if (prefix[i] !== commonPrefix[i]) {
        commonPrefix = commonPrefix.slice(0, i);
        break;
      }
    }

    if (!commonPrefix) break;
  }

  const commonLength = commonPrefix?.length ?? 0;
  return lines.map((line) => (line.match(/\S/) ? line.slice(commonLength) : '')).join('\n');
};

export const Markdown = ({
  id,
  className,
  dedent = true,
  loading_state,
  style,
  children,
}: MarkdownProps) => {
  const source = Array.isArray(children) ? children.join('\n') : children ?? '';
  const markdown = dedent ? dedentLines(source) : source;
  const rootClassName = ['ms-markdown', className].filter(Boolean).join(' ');
  const needsMath = useMemo(() => /(^|[^\\])\$[^$\n]+\$|(^|\n)\$\$/.test(markdown), [markdown]);
  const needsHighlight = useMemo(() => /(^|\n)```/.test(markdown), [markdown]);
  const [enhancers, setEnhancers] = useState<MarkdownEnhancers>({});

  useEffect(() => {
    let cancelled = false;

    if (!needsMath && !needsHighlight) {
      setEnhancers({});
      return () => {
        cancelled = true;
      };
    }

    void (async () => {
      const next: MarkdownEnhancers = {};

      if (needsMath) {
        const [{ default: remarkMath }, { default: rehypeKatex }] = await Promise.all([
          import('remark-math'),
          import('rehype-katex'),
        ]);
        next.remarkMath = remarkMath;
        next.rehypeKatex = rehypeKatex;
      }

      if (needsHighlight) {
        const { default: remarkHighlight } = await import('remark-highlight.js');
        next.remarkHighlight = remarkHighlight;
      }

      if (!cancelled) {
        setEnhancers(next);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsHighlight, needsMath]);

  const remarkPlugins = useMemo(
    () => [
      remarkGfm,
      ...(enhancers.remarkMath ? [enhancers.remarkMath] : []),
      ...(enhancers.remarkHighlight ? [enhancers.remarkHighlight] : []),
    ],
    [enhancers]
  );
  const rehypePlugins = useMemo(
    () => [rehypeSlug, ...(enhancers.rehypeKatex ? [enhancers.rehypeKatex] : [])],
    [enhancers]
  );

  return (
    <div
      id={id}
      className={rootClassName}
      style={style}
      data-dash-is-loading={loading_state?.is_loading || undefined}
    >
      <ReactMarkdown remarkPlugins={remarkPlugins as any} rehypePlugins={rehypePlugins as any}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
