import { useMemo } from 'react';
import { useSearchUIContext } from '../SearchUIContextProvider';

export interface SearchUIDataHeaderProps {
  exportDataButton?: React.ReactNode;
}

const pluralize = (label: string, count: number) => (count === 1 ? label : `${label}s`);

export const SearchUIDataHeader = ({ exportDataButton }: SearchUIDataHeaderProps) => {
  const { results, totalResults, loading, resultLabel, error } = useSearchUIContext();

  const title = useMemo(() => {
    if (loading) {
      return `Loading ${pluralize(resultLabel, 2)}...`;
    }

    if (totalResults === 0) {
      return `All 0 ${pluralize(resultLabel, 0)}`;
    }

    return `All ${totalResults.toLocaleString()} ${pluralize(resultLabel, totalResults)}`;
  }, [loading, resultLabel, totalResults]);

  return (
    <div className="mpc-search-ui-data-header box">
      <div className="is-flex is-justify-content-space-between is-align-items-center">
        <div>
          <p data-testid="data-table-title" className="title is-5">
            {title}
          </p>
          <p className="subtitle is-7">
            Showing {results.length.toLocaleString()} of {totalResults.toLocaleString()}
          </p>
          {error ? <p className="help is-danger">{error}</p> : null}
        </div>
        <div className="is-flex is-align-items-center" style={{ gap: '0.75rem' }}>
          {loading ? <progress className="progress is-small is-primary" max="100" /> : null}
          {exportDataButton}
        </div>
      </div>
    </div>
  );
};
