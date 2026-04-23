import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaLink } from 'react-icons/fa';
import { ActiveFilterButtons } from '../../ActiveFilterButtons';
import { Checkbox } from '../../../data-entry/Checkbox';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { formatTemplate } from '../../../../utils/text';
import { mergeTexts } from '../../../../utils/text';

export interface SearchUIDataHeaderProps {
  exportDataButton?: React.ReactNode;
  texts?: Partial<SearchUIDataHeaderTexts>;
}

export interface SearchUIDataHeaderTexts {
  loadingTitleTemplate: string;
  allTitleTemplate: string;
  showingTemplate: string;
  columns: string;
  selectAll: string;
}

const DEFAULT_TEXTS: SearchUIDataHeaderTexts = {
  loadingTitleTemplate: 'Loading {label}...',
  allTitleTemplate: 'All {total} {label}',
  showingTemplate: 'Showing {lower}-{upper}',
  columns: 'Columns',
  selectAll: 'Select all',
};

const pluralize = (label: string, count: number) => (count === 1 ? label : `${label}s`);

export const SearchUIDataHeader = ({ exportDataButton, texts: textsProp }: SearchUIDataHeaderProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
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
  const resultsId = useId().replace(/:/g, '');
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [titleHover, setTitleHover] = useState(false);
  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);
  const lowerBound = totalResults === 0 ? 0 : currentSkip + 1;
  const upperBound = totalResults === 0 ? 0 : Math.min(totalResults, currentSkip + currentLimit);
  const visibleSelectorColumns = columns.filter((column) => !column.excludeFromColumnsSelector);
  const allColumnsVisible = visibleSelectorColumns.every((column) => !column.hidden);

  const title = useMemo(() => {
    if (loading) {
      return (
        <p data-testid="data-table-title" className="ms-title ms-is-5 ms-has-text-weight-normal">
          {formatTemplate(texts.loadingTitleTemplate, { label: pluralize(resultLabel, 2) })}
        </p>
      );
    }

    if (activeFilters.length === 0 && totalResults > 0) {
      return (
        <div data-testid="data-table-title">
          <a
            href={`#${resultsId}`}
            className="ms-title ms-is-5"
            onMouseOver={() => setTitleHover(true)}
            onMouseLeave={() => setTitleHover(false)}
            onClick={() => setTitleHover(false)}
          >
            <span className="ms-has-text-weight-normal">All </span>
            <span className="ms-has-text-weight-bold">
              {totalResults.toLocaleString()} {pluralize(resultLabel, totalResults)}
            </span>
            {titleHover ? <FaLink className="ms-is-size-7 ms-ml-1" /> : null}
          </a>
        </div>
      );
    }

    return (
      <div data-testid="data-table-title">
        <a
          href={`#${resultsId}`}
          className="ms-title ms-is-5"
          onMouseOver={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
          onClick={() => setTitleHover(false)}
        >
          <span className="ms-has-text-weight-bold">{totalResults.toLocaleString()}</span>
          {totalResults === 1 ? (
            <span>
              <span className="ms-has-text-weight-bold"> {resultLabel}</span>
              <span className="ms-has-text-weight-normal"> matches</span>
            </span>
          ) : (
            <span>
              <span className="ms-has-text-weight-bold"> {pluralize(resultLabel, totalResults)}</span>
              <span className="ms-has-text-weight-normal"> match</span>
            </span>
          )}
          <span className="ms-has-text-weight-normal"> your search</span>
          {titleHover ? <FaLink className="ms-is-size-7 ms-ml-1" /> : null}
        </a>
      </div>
    );
  }, [
    activeFilters.length,
    loading,
    resultLabel,
    resultsId,
    texts.loadingTitleTemplate,
    titleHover,
    totalResults,
  ]);

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
    <div id={resultsId} className="ms-search-ui-data-header ms-box" ref={ref}>
      <div className="ms-search-ui-data-header-content">
        <div>
          {title}
          <p className="ms-subtitle ms-is-7">
            {formatTemplate(texts.showingTemplate, {
              lower: lowerBound.toLocaleString(),
              upper: upperBound.toLocaleString(),
            })}
          </p>
        </div>
        <div className="ms-progress-container">
          {loading ? <progress className="ms-progress ms-is-small ms-is-primary" max={100} /> : null}
        </div>
        <div className="ms-search-ui-data-header-controls">
          <div className="ms-data-table-columns" ref={columnsMenuRef}>
            <button
              type="button"
              className="ms-button ms-data-table-columns-trigger"
              aria-expanded={columnsMenuOpen}
              onClick={() => setColumnsMenuOpen((open) => !open)}
            >
              <span>{texts.columns}</span>
              <FaCaretDown aria-hidden="true" />
            </button>
            {columnsMenuOpen ? (
              <div className="ms-data-table-columns-menu">
                <label className="ms-is-select-all">
                  <Checkbox checked={allColumnsVisible} onCheckedChange={(checked) => toggleAllColumns(checked === true)} />
                  <span>{texts.selectAll}</span>
                </label>
                {visibleSelectorColumns.map((column) => (
                  <label key={column.selector}>
                    <Checkbox
                      checked={!column.hidden}
                      onCheckedChange={(checked) =>
                        setColumns(
                          columns.map((candidate) =>
                            candidate.selector === column.selector
                              ? { ...candidate, hidden: !(checked === true) }
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
