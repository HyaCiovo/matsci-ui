import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkHighlight from 'remark-highlight.js';
import remarkMath from 'remark-math';

export interface MarkdownProps {
  id?: string;
  className?: string;
  dedent?: boolean;
  loading_state?: { is_loading?: boolean } | null;
  style?: React.CSSProperties;
  children?: string | string[];
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

  return (
    <div
      id={id}
      className={rootClassName}
      style={style}
      data-dash-is-loading={loading_state?.is_loading || undefined}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkHighlight as any]}
        rehypePlugins={[rehypeSlug, rehypeKatex]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};
