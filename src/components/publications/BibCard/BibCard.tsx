import classNames from 'classnames';
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

const stripHtml = (value?: string) => (value ? value.replace(/<[^>]*>/g, '') : '');

export const BibCard = ({ title = '', ...otherProps }: BibCardProps) => {
  const props = { title, ...otherProps };
  const url = props.doi ? `https://doi.org/${props.doi}` : undefined;
  const titleText = stripHtml(props.title);

  const titleElement = url ? (
    <a href={url} target="_blank" rel="noreferrer">
      {titleText}
    </a>
  ) : (
    <span>{titleText}</span>
  );

  return (
    <div id={props.id} data-testid="bib-card" className={classNames('mpc-bib-card', props.className)}>
      <p data-testid="bib-card-title" className="mpc-bib-card-title">
        {titleElement}
      </p>
      <p data-testid="bib-card-authors" className="mpc-bib-card-authors">
        {getAuthorString(props.author)}
      </p>
      {props.doi ? (
        <div className="mpc-bib-card-buttons tags">
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

