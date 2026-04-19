import { useEffect, useMemo, useRef } from 'react';
import { FaTable, FaThLarge } from 'react-icons/fa';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { SearchUIViewType } from '../types';

export interface SearchUIDataHeaderProps {
  exportDataButton?: React.ReactNode;
}

const pluralize = (label: string, count: number) => (count === 1 ? label : `${label}s`);

export const SearchUIDataHeader = ({ exportDataButton }: SearchUIDataHeaderProps) => {
  const {
    apiEndpoint,
    activeFilters,
    columns,
    defaultLimit,
    defaultSkip,
    error,
    hasSortMenu,
    limitKey,
    loading,
    query,
    removeFilters,
    resultLabel,
    results,
    setColumns,
    setView,
    setResultsPerPage,
    setResultsRef,
    setSortAscending,
    setSortField,
    skipKey,
    sortFields,
    totalResults,
    view,
  } = useSearchUIContext();
  const ref = useRef<HTMLDivElement>(null);
  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);
  const lowerBound = totalResults === 0 ? 0 : currentSkip + 1;
  const visibleResultCount = apiEndpoint ? results.length : Math.min(results.length, currentLimit);
  const upperBound = totalResults === 0 ? 0 : Math.min(totalResults, currentSkip + visibleResultCount);
  const primarySortField = String(sortFields[0] ?? '').replace(/^-/, '');
  const sortAscending = !String(sortFields[0] ?? '').startsWith('-');
  const resultsPerPageOptions = [10, 15, 30, 50, 75];

  const title = useMemo(() => {
    if (loading) {
      return `Loading ${pluralize(resultLabel, 2)}...`;
    }

    if (totalResults === 0) {
      return `All 0 ${pluralize(resultLabel, 0)}`;
    }

    return `All ${totalResults.toLocaleString()} ${pluralize(resultLabel, totalResults)}`;
  }, [loading, resultLabel, totalResults]);

  useEffect(() => {
    setResultsRef(ref);
  }, [setResultsRef]);

  return (
    <div className="mpc-search-ui-data-header box" ref={ref}>
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <div>
          <p data-testid="data-table-title" className="title is-5">
            {title}
          </p>
          <p className="subtitle is-7">
            Showing {lowerBound.toLocaleString()}-{upperBound.toLocaleString()} of {totalResults.toLocaleString()}
          </p>
          {error ? <p className="help is-danger">{error}</p> : null}
        </div>
        <div className="is-flex is-align-items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          {activeFilters.length > 0 ? (
            <div className="is-flex is-align-items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
              {activeFilters.map((filter) => (
                <button
                  key={filter.params.join('-')}
                  type="button"
                  className="button is-small"
                  onClick={() => void removeFilters(filter.params)}
                >
                  {filter.name}: {Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value)} x
                </button>
              ))}
            </div>
          ) : null}
          {hasSortMenu ? (
            <>
              <label className="is-size-7">
                <span className="mr-2">Sort by</span>
                <select
                  value={primarySortField}
                  onChange={(event) => void setSortField(event.target.value)}
                  data-testid="search-ui-sort-field"
                >
                  {columns.filter((column) => !column.hidden).map((column) => (
                    <option key={column.selector} value={column.selector}>
                      {String(column.title)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="is-size-7">
                <span className="mr-2">Direction</span>
                <select
                  value={sortAscending ? 'asc' : 'desc'}
                  onChange={(event) => void setSortAscending(event.target.value === 'asc')}
                  data-testid="search-ui-sort-direction"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </label>
            </>
          ) : null}
          <label className="is-size-7">
            <span className="mr-2">Results per page</span>
            <select
              value={currentLimit}
              onChange={(event) => void setResultsPerPage(Number(event.target.value))}
              data-testid="search-ui-results-per-page"
            >
              {resultsPerPageOptions.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <div className="field has-addons" data-testid="search-ui-view-switcher">
            <div className="control">
              <button
                type="button"
                className={`button is-small ${view === SearchUIViewType.TABLE ? 'is-primary' : ''}`}
                aria-pressed={view === SearchUIViewType.TABLE}
                data-testid="search-ui-view-table"
                onClick={() => setView(SearchUIViewType.TABLE)}
              >
                <span className="icon is-small">
                  <FaTable />
                </span>
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className={`button is-small ${view === SearchUIViewType.SYNTHESIS ? 'is-primary' : ''}`}
                aria-pressed={view === SearchUIViewType.SYNTHESIS}
                data-testid="search-ui-view-synthesis"
                onClick={() => setView(SearchUIViewType.SYNTHESIS)}
              >
                <span className="icon is-small">
                  <FaThLarge />
                </span>
              </button>
            </div>
          </div>
          {view === SearchUIViewType.TABLE ? (
            <details>
              <summary className="button is-small">Columns</summary>
              <div className="box mt-2">
                {columns.map((column) => (
                  <label key={column.selector} className="is-flex is-align-items-center mb-2" style={{ gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={!column.hidden}
                      onChange={(event) =>
                        setColumns(
                          columns.map((candidate) =>
                            candidate.selector === column.selector
                              ? { ...candidate, hidden: !event.target.checked }
                              : candidate
                          )
                        )
                      }
                    />
                    <span>{String(column.title)}</span>
                  </label>
                ))}
              </div>
            </details>
          ) : null}
          {loading ? <progress className="progress is-small is-primary" max="100" /> : null}
          {exportDataButton}
        </div>
      </div>
    </div>
  );
};
