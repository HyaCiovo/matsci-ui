import clsx from 'clsx';
import type React from 'react';

export interface BibtexButtonProps extends React.HTMLProps<HTMLAnchorElement> {
  id?: string;
  className?: string;
  doi?: string;
  url?: string;
  target?: string;
}

export const BibtexButton = ({ className = 'ms-tag', target = '_blank', doi, url, ...otherProps }: BibtexButtonProps) => {
  const bibtexUrl = url || (doi ? `https://www.doi2bib.org/bib/${doi}` : undefined);

  if (!bibtexUrl) {
    return null;
  }

  return (
    <a
      data-testid="bibtex-button"
      className={clsx('ms-bibtex-button', className)}
      style={{ backgroundColor: 'transparent' }}
      href={bibtexUrl}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      {...otherProps}
    >
      BibTeX
    </a>
  );
};

