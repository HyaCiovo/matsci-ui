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
  const { filterGroups } = useSearchUIContext();
  const resolvedFiltersContent = filtersContent ?? (filterGroups.length > 0 ? <SearchUIFilters /> : null);

  return (
    <div className="ms-search-ui-content ms-columns">
      {resolvedFiltersContent ? (
        <div className="ms-search-ui-left ms-column ms-is-narrow ms-is-12-mobile">{resolvedFiltersContent}</div>
      ) : null}
      <div className="ms-search-ui-right ms-column">
        <SearchUIDataHeader exportDataButton={exportDataButton} />
        <SearchUIDataView />
      </div>
    </div>
  );
};
