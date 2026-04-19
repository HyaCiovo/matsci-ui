import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LockOpen } from 'lucide-react';
import { Tooltip } from '../../data-display/Tooltip';
import './OpenAccessButton.css';

export interface OpenAccessButtonProps {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  target?: string;
  compact?: boolean;
}

export const OpenAccessButton = ({
  className = 'tag',
  target = '_blank',
  doi,
  url: urlProp,
  compact = false,
  id,
}: OpenAccessButtonProps) => {
  const [openAccessUrl, setOpenAccessUrl] = useState<string | undefined>(urlProp);
  const [cannotFetchOpenAccessUrl, setCannotFetchOpenAccessUrl] = useState(() => !doi);
  const didFetchRef = useRef(false);

  const tooltipId = useMemo(
    () => (doi ? `open-access-tooltip-${encodeURIComponent(doi)}` : undefined),
    [doi]
  );

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
    const request = axios.get(`https://bg.api.oa.works/find?id=${doi}`, { signal: controller.signal }) as any;
    if (!request || typeof request.then !== 'function') {
      return () => controller.abort();
    }

    request
      .then((result: any) => {
        if (result.data?.url) {
          setOpenAccessUrl(result.data.url);
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
    <a
      id={id}
      data-testid="open-access-button"
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      href={openAccessUrl}
      className={clsx('mpc-open-access-button', className)}
      data-tooltip-id={tooltipId}
    >
      {openAccessUrl ? <LockOpen /> : <span className="mpc-open-access-loader" />}
      {!compact ? <span className="ml-1">Open Access</span> : null}
      {compact && tooltipId ? <Tooltip id={tooltipId}>Open Access</Tooltip> : null}
    </a>
  );
};
