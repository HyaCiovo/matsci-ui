import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { SearchUIDataHeader } from '../SearchUIDataHeader';
import { SearchUIDataView } from '../SearchUIDataView';
import { SearchUIFilters } from '../SearchUIFilters';

export interface SearchUIGridProps {
  exportDataButton?: ReactNode;
  filtersContent?: ReactNode;
}

export const SearchUIGrid = ({ exportDataButton, filtersContent }: SearchUIGridProps) => {
  const { error, filterGroups, results } = useSearchUIContext();
  const resolvedFiltersContent = filtersContent ?? (filterGroups.length > 0 ? <SearchUIFilters /> : null);
  const isEmptyState = Boolean(error) || !results || results.length === 0;

  return (
    <div className="ms-search-ui-content ms-columns">
      {resolvedFiltersContent ? (
        <div className="ms-search-ui-left ms-column ms-is-narrow ms-is-12-mobile">{resolvedFiltersContent}</div>
      ) : null}
      <div className={clsx('ms-search-ui-right ms-column', { 'ms-is-empty-state': isEmptyState })}>
        <SearchUIDataHeader exportDataButton={exportDataButton} />
        <SearchUIDataView />
      </div>
    </div>
  );
};
