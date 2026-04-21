import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { ActiveFilterButtons } from '../../ActiveFilterButtons';
import { useSearchUIContext } from '../SearchUIContextProvider';

export interface SearchUIDataHeaderProps {
  exportDataButton?: React.ReactNode;
}

const pluralize = (label: string, count: number) => (count === 1 ? label : `${label}s`);

export const SearchUIDataHeader = ({ exportDataButton }: SearchUIDataHeaderProps) => {
  const {
    activeFilters,
    columns,
    defaultLimit,
    defaultSkip,
    limitKey,
    loading,
    query,
    removeFilters,
    resultLabel,
    setColumns,
    setResultsRef,
    skipKey,
    totalResults,
  } = useSearchUIContext();
  const ref = useRef<HTMLDivElement>(null);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);
  const lowerBound = totalResults === 0 ? 0 : currentSkip + 1;
  const upperBound = totalResults === 0 ? 0 : Math.min(totalResults, currentSkip + currentLimit);
  const visibleSelectorColumns = columns.filter((column) => !column.excludeFromColumnsSelector);
  const allColumnsVisible = visibleSelectorColumns.every((column) => !column.hidden);

  const title = useMemo(() => {
    if (loading) {
      return `Loading ${pluralize(resultLabel, 2)}...`;
    }

    return `All ${totalResults.toLocaleString()} ${pluralize(resultLabel, totalResults)}`;
  }, [loading, resultLabel, totalResults]);

  useEffect(() => {
    setResultsRef(ref);
  }, [setResultsRef]);

  useEffect(() => {
    if (!columnsMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!columnsMenuRef.current?.contains(event.target as Node)) {
        setColumnsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [columnsMenuOpen]);

  const toggleAllColumns = (checked: boolean) => {
    setColumns(
      columns.map((column) =>
        column.excludeFromColumnsSelector ? column : { ...column, hidden: !checked }
      )
    );
  };

  return (
    <div className="mpc-search-ui-data-header box" ref={ref}>
      <div className="mpc-search-ui-data-header-content">
        <div>
          <p data-testid="data-table-title" className="title is-5">
            {title}
          </p>
          <p className="subtitle is-7">Showing {lowerBound.toLocaleString()}-{upperBound.toLocaleString()}</p>
        </div>
        <div className="mpc-search-ui-data-header-controls">
          <div className="mpc-data-table-columns" ref={columnsMenuRef}>
            <button
              type="button"
              className="button mpc-data-table-columns-trigger"
              aria-expanded={columnsMenuOpen}
              onClick={() => setColumnsMenuOpen((open) => !open)}
            >
              <span>Columns</span>
              <FaCaretDown aria-hidden="true" />
            </button>
            {columnsMenuOpen ? (
              <div className="mpc-data-table-columns-menu">
                <label className="is-select-all">
                  <input type="checkbox" checked={allColumnsVisible} onChange={(event) => toggleAllColumns(event.target.checked)} />
                  <span>Select all</span>
                </label>
                {visibleSelectorColumns.map((column) => (
                  <label key={column.selector}>
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
            ) : null}
          </div>
          {exportDataButton}
        </div>
      </div>
      {activeFilters.length > 0 ? (
        <ActiveFilterButtons filters={activeFilters} onClick={(params) => void removeFilters(params)} />
      ) : null}
    </div>
  );
};
