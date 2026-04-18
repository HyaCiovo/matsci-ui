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
    <div className="mpc-search-ui-content columns">
      {resolvedFiltersContent ? (
        <div className="mpc-search-ui-left column is-narrow is-12-mobile">{resolvedFiltersContent}</div>
      ) : null}
      <div className="mpc-search-ui-right column">
        <SearchUIDataHeader exportDataButton={exportDataButton} />
        <SearchUIDataView />
      </div>
    </div>
  );
};
