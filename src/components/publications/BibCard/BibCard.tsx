import clsx from 'clsx';
import type { ReactNode } from 'react';
import { getAuthorString, getJournalAndYear, type CrossrefAuthor } from '../../../utils/publications';
import { PublicationButton } from '../PublicationButton';
import { BibtexButton } from '../BibtexButton';
import { OpenAccessButton } from '../OpenAccessButton';
import './BibCard.css';

export interface BibCardProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  title?: string;
  author?: string[] | CrossrefAuthor[];
  shortName?: string;
  year?: string | number;
  journal?: string;
  doi?: string;
  preventOpenAccessFetch?: boolean;
  openAccessUrl?: string;
  children?: ReactNode;
}

export const BibCard = ({ title = '', ...otherProps }: BibCardProps) => {
  const props = { title, ...otherProps };
  const url = props.doi ? `https://doi.org/${props.doi}` : undefined;

  const titleElement = url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      dangerouslySetInnerHTML={{ __html: props.title || '' }}
    />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: props.title || '' }} />
  );

  return (
    <div id={props.id} data-testid="bib-card" className={clsx('ms-bib-card', props.className)}>
      <p data-testid="bib-card-title" className="ms-bib-card-title">
        {titleElement}
      </p>
      <p data-testid="bib-card-authors" className="ms-bib-card-authors">
        {getAuthorString(props.author)}
      </p>
      {props.doi ? (
        <div className="ms-bib-card-buttons ms-tags">
          <PublicationButton doi={props.doi} url={url}>
            {getJournalAndYear(props.journal, props.year)}
          </PublicationButton>
          {!props.preventOpenAccessFetch ? <OpenAccessButton doi={props.doi} url={props.openAccessUrl} /> : null}
          <BibtexButton doi={props.doi} />
        </div>
      ) : null}
      {props.children}
    </div>
  );
};
