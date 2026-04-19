import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { BibCard } from '../BibCard';

export interface CrossrefCardProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  crossrefEntry?: any;
  identifier?: string;
  errorMessage?: string;
  preventOpenAccessFetch?: boolean;
}

export const CrossrefCard = ({
  errorMessage = 'Could not find reference',
  ...otherProps
}: CrossrefCardProps) => {
  const props = { errorMessage, ...otherProps };
  const [crossref, setCrossref] = useState(props.crossrefEntry);
  const [failedRequest, setFailedRequest] = useState(false);
  const didFetchRef = useRef(false);

  useEffect(() => {
    setCrossref(props.crossrefEntry);
  }, [props.crossrefEntry]);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    if (crossref || !props.identifier) {
      return;
    }

    const controller = new AbortController();
    axios
      .get(`https://api.crossref.org/works/${props.identifier}`, { signal: controller.signal })
      .then((result) => {
        if (result.data?.message) {
          setCrossref(result.data.message);
        }
      })
      .catch(() => setFailedRequest(true));

    return () => controller.abort();
  }, [crossref, props.identifier]);

  if (!crossref) {
    return (
      <div id={props.id} className={clsx(props.className)}>
        {failedRequest ? props.errorMessage : 'Loading...'}
      </div>
    );
  }

  return (
    <BibCard
      id={props.id}
      className={props.className}
      title={crossref?.title?.join?.(' ') ?? crossref?.title}
      author={crossref?.author}
      year={crossref?.created?.['date-parts']?.[0]?.[0]}
      journal={crossref?.['container-title']?.join?.(', ') ?? crossref?.['container-title']}
      shortName={crossref?.['short-container-title']?.[0]}
      doi={crossref?.DOI}
      preventOpenAccessFetch={props.preventOpenAccessFetch}
      openAccessUrl={crossref?.openAccessUrl}
    />
  );
};

