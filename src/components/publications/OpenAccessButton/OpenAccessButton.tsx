import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '../../data-display/Tooltip';
import { mergeTexts } from '../../../text/mergeTexts';
import openAccessButtonLogo from './oabColorPng';
import './OpenAccessButton.css';
import { fetchJson } from '../../../utils/http';

export interface OpenAccessButtonProps {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  target?: string;
  compact?: boolean;
  texts?: Partial<OpenAccessButtonTexts>;
}

export interface OpenAccessButtonTexts {
  label: string;
  tooltip: string;
}

const DEFAULT_TEXTS: OpenAccessButtonTexts = {
  label: 'Open Access',
  tooltip: 'Open Access',
};

export const OpenAccessButton = ({
  className = 'ms-tag',
  target = '_blank',
  doi,
  url: urlProp,
  compact = false,
  id,
  texts: textsProp,
}: OpenAccessButtonProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const [openAccessUrl, setOpenAccessUrl] = useState<string | undefined>(urlProp);
  const [cannotFetchOpenAccessUrl, setCannotFetchOpenAccessUrl] = useState(() => !doi);
  const didFetchRef = useRef(false);

  useEffect(() => {
    setOpenAccessUrl(urlProp);
    setCannotFetchOpenAccessUrl(!doi);
    didFetchRef.current = false;
  }, [doi, urlProp]);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    if (openAccessUrl || cannotFetchOpenAccessUrl || !doi) {
      return;
    }

    const controller = new AbortController();
    fetchJson<{ url?: string }>(`https://bg.api.oa.works/find?id=${encodeURIComponent(doi)}`, {
      signal: controller.signal,
    })
      .then((result) => {
        if (result.url) {
          setOpenAccessUrl(result.url);
        } else {
          setCannotFetchOpenAccessUrl(true);
        }
      })
      .catch(() => setCannotFetchOpenAccessUrl(true));

    return () => controller.abort();
  }, [cannotFetchOpenAccessUrl, doi, openAccessUrl]);

  if (!openAccessUrl && cannotFetchOpenAccessUrl) {
    return null;
  }

  return (
    <Tooltip
      disable={!compact}
      trigger={
        <a
          id={id}
          data-testid="open-access-button"
          target={target}
          rel={target === '_blank' ? 'noreferrer' : undefined}
          href={openAccessUrl}
          className={clsx('ms-open-access-button', className)}
        >
          {openAccessUrl ? <img src={openAccessButtonLogo} /> : <div className="ms-loader ms-open-access-loader" />}
          {!compact ? <span className="ms-ml-1">{texts.label}</span> : null}
        </a>
      }
    >
      {texts.tooltip}
    </Tooltip>
  );
};
