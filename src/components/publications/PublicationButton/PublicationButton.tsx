import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import './PublicationButton.css';
import { getJournalAndYear } from '../../../utils/publications';
import { fetchJson, fetchText } from '../../../utils/http';

export interface PublicationButtonProps {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  target?: string;
  compact?: boolean;
  showTooltip?: boolean;
  children?: React.ReactNode;
}

const parseDoiFromUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith('https://doi.org/')) return url.split('https://doi.org/')[1];
  if (url.startsWith('http://doi.org/')) return url.split('http://doi.org/')[1];
  return undefined;
};

export const PublicationButton = ({
  className = 'tag',
  target = '_blank',
  doi: doiProp,
  url: urlProp,
  compact = false,
  showTooltip: showTooltipProp,
  children,
  id,
}: PublicationButtonProps) => {
  const showTooltip = showTooltipProp ?? compact;
  const doi = useMemo(() => doiProp ?? parseDoiFromUrl(urlProp), [doiProp, urlProp]);
  const [url, setUrl] = useState<string | undefined>(() => urlProp ?? (doiProp ? `https://doi.org/${doiProp}` : undefined));
  const [linkLabel, setLinkLabel] = useState<React.ReactNode>(children);
  const [tooltipText, setTooltipText] = useState<string | undefined>();
  const didFetchRef = useRef(false);

  useEffect(() => {
    setUrl(urlProp ?? (doiProp ? `https://doi.org/${doiProp}` : undefined));
    setLinkLabel(children);
  }, [children, doiProp, urlProp]);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    if (!doi) {
      return;
    }

    const controller = new AbortController();

    if (!children) {
      fetchJson<{ message?: any }>(`https://api.crossref.org/works/${doi}`, { signal: controller.signal })
        .then((result) => {
          if (result.message) {
            let journal: string | undefined;
            let year: string | undefined;
            if (Array.isArray(result.message['container-title'])) {
              journal = result.message['container-title'].join(', ');
            }
            if (result.message?.created?.['date-parts']?.[0]?.[0]) {
              year = result.message.created['date-parts'][0][0];
            }
            setLinkLabel(getJournalAndYear(journal, year) || 'Publication');
            if (!url && result.message.URL) {
              setUrl(result.message.URL);
            }
          }
        })
        .catch(() => undefined);
    }

    if (showTooltip) {
      fetchText(`https://api.crossref.org/works/${doi}/transform/text/x-bibliography`, {
        signal: controller.signal,
      })
        .then((text) => {
          const urlIndex = text.indexOf('. http');
          const trimmed = urlIndex > -1 ? text.slice(0, urlIndex + 1) : text;
          setTooltipText(trimmed);
        })
        .catch(() => undefined);
    }

    return () => controller.abort();
  }, [children, doi, showTooltip, url]);

  if (!url) {
    return null;
  }

  return (
    <Tooltip
      disable={!tooltipText}
      html
      trigger={
        <a
          data-testid="publication-button"
          id={id}
          className={clsx('mpc-publication-button', className)}
          href={url}
          target={target}
          rel={target === '_blank' ? 'noreferrer' : undefined}
        >
          <FaBook />
          {!compact ? <span className="ml-1">{linkLabel || 'Publication'}</span> : null}
        </a>
      }
    >
      <span dangerouslySetInnerHTML={{ __html: tooltipText ?? '' }} />
    </Tooltip>
  );
};
