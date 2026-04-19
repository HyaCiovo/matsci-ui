import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { SortDropdown } from '../../data-display/SortDropdown';
import { BibjsonCard } from '../BibjsonCard';
import { CrossrefCard } from '../CrossrefCard';
import './BibFilter.css';

export interface BibFilterProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  bibEntries: any[];
  format?: 'crossref' | 'bibjson';
  sortField?: string;
  ascending?: boolean;
  resultClassName?: string;
  preventOpenAccessFetch?: boolean;
}

const normalizeSortValue = (value: any) => {
  if (value === undefined || value === null) return '';
  if (Array.isArray(value)) return value.join(' ');
  if (typeof value === 'object') {
    if (value.family) return value.family;
    if (value.given && value.family) return `${value.given} ${value.family}`;
  }
  return String(value);
};

const defaultBibSort = (field: string, asc: boolean) => (a: any, b: any) => {
  const valueA = normalizeSortValue(a?.[field]);
  const valueB = normalizeSortValue(b?.[field]);
  const comparison = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
  return asc ? comparison : -comparison;
};

const crossrefSort = (field: string, asc: boolean) => (a: any, b: any) => {
  const mapField = field === 'author' ? 'author' : field;
  const valueA = mapField === 'author' ? normalizeSortValue(a?.author?.[0]) : normalizeSortValue(a?.[mapField]);
  const valueB = mapField === 'author' ? normalizeSortValue(b?.author?.[0]) : normalizeSortValue(b?.[mapField]);
  const comparison = valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
  return asc ? comparison : -comparison;
};

export const BibFilter = ({
  format = 'bibjson',
  sortField = 'year',
  ascending = false,
  ...otherProps
}: BibFilterProps) => {
  const props = { format, sortField, ascending, ...otherProps };
  const [searchValue, setSearchValue] = useState('');
  const [sortFieldState, setSortFieldState] = useState(props.sortField);
  const [sortAsc, setSortAsc] = useState(props.ascending);

  const sortFn = useMemo(() => (props.format === 'crossref' ? crossrefSort : defaultBibSort), [props.format]);

  const filteredEntries = useMemo(() => {
    const tokens = searchValue.toUpperCase().split(' ').filter(Boolean);
    if (!tokens.length) return props.bibEntries;
    return props.bibEntries.filter((entry) => {
      const entryStr = JSON.stringify(entry).toUpperCase();
      return tokens.every((token) => entryStr.includes(token));
    });
  }, [props.bibEntries, searchValue]);

  const bibEntriesState = useMemo(
    () => [...filteredEntries].sort(sortFn(sortFieldState, sortAsc)),
    [filteredEntries, sortAsc, sortFieldState, sortFn]
  );

  return (
    <div id={props.id} data-testid="bibjson-filter" className={classNames('mpc-bib-filter', props.className)}>
      <div className="mpc-bib-filter-controls">
        <input
          className="mpc-bib-filter-input input"
          role="searchbox"
          type="search"
          aria-label="publication search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <SortDropdown
          sortValues={bibEntriesState}
          sortOptions={[
            { label: 'Year', value: 'year' },
            { label: 'Author', value: 'author' },
            { label: 'Title', value: 'title' },
          ]}
          sortField={sortFieldState}
          setSortField={setSortFieldState}
          sortAscending={sortAsc}
          setSortAscending={setSortAsc}
          sortFn={sortFn}
        />
      </div>
      <div className="mpc-bib-filter-results">
        {bibEntriesState.map((entry, i) =>
          props.format === 'bibjson' ? (
            <BibjsonCard
              key={`${i}-${entry?.doi ?? ''}`}
              className={props.resultClassName}
              bibjsonEntry={entry}
              preventOpenAccessFetch={props.preventOpenAccessFetch}
            />
          ) : (
            <CrossrefCard
              key={`${i}-${entry?.DOI ?? ''}`}
              className={props.resultClassName}
              crossrefEntry={entry}
              preventOpenAccessFetch={props.preventOpenAccessFetch}
            />
          )
        )}
      </div>
    </div>
  );
};
