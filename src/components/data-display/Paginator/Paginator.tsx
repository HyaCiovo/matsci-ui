import classNames from 'classnames';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Paginator.css';

export interface PaginatorProps {
  rowsPerPage: number;
  rowCount: number;
  onChangePage: (page: number) => any;
  onChangeRowsPerPage?: (rowsPerPage: number) => any;
  currentPage: number;
  isTop?: boolean;
  className?: string;
}

const RESULTS_PER_PAGE_OPTIONS = [10, 15, 30, 50, 75];

const getPageCount = (rowCount: number, rowsPerPage: number) => {
  if (!rowsPerPage || rowCount <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(rowCount / rowsPerPage));
};

const getVisiblePages = (currentPage: number, pageCount: number) => {
  if (pageCount <= 6) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage < 4) {
    return [1, 2, 3, 4, 'ellipsis-start', pageCount] as const;
  }

  if (currentPage > pageCount - 3) {
    return [1, 'ellipsis-end', pageCount - 3, pageCount - 2, pageCount - 1, pageCount] as const;
  }

  return [1, 'ellipsis-end', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-start', pageCount] as const;
};

export const Paginator = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage,
  className,
}: PaginatorProps) => {
  const pageCount = getPageCount(rowCount, rowsPerPage);
  const visiblePages = getVisiblePages(currentPage, pageCount);

  return (
    <div data-testid="mpc-paginator" className={classNames('mpc-paginator', className)}>
      <div className="mpc-paginator-controls">
        <label className="is-size-7">
          <span className="mr-2">Jump to</span>
          <select
            data-testid="mpc-jump-to-page-menu"
            value={currentPage}
            onChange={(event) => onChangePage(Number(event.target.value))}
          >
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
        </label>
        {onChangeRowsPerPage ? (
          <label className="is-size-7">
            <span className="mr-2">Rows per page</span>
            <select
              data-testid="results-per-page-menu"
              value={rowsPerPage}
              onChange={(event) => onChangeRowsPerPage(Number(event.target.value))}
            >
              {RESULTS_PER_PAGE_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <nav className="mpc-paginator-pages" aria-label="pagination">
        <button
          type="button"
          className="button is-small"
          disabled={currentPage === 1}
          aria-hidden={currentPage === 1}
          onClick={() => onChangePage(currentPage - 1)}
        >
          <FaArrowLeft />
          <span className="ml-1">Previous</span>
        </button>
        {visiblePages.map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={page}
              type="button"
              className={classNames('button is-small', { 'is-primary': page === currentPage })}
              aria-label={page === currentPage ? `Go to page ${page}` : `Page ${page}`}
              onClick={() => onChangePage(page)}
            >
              {page.toLocaleString()}
            </button>
          ) : (
            <span key={`${page}-${index}`} className="px-1">
              &hellip;
            </span>
          )
        )}
        <button
          type="button"
          className="button is-small"
          disabled={currentPage === pageCount}
          aria-hidden={currentPage === pageCount}
          onClick={() => onChangePage(currentPage + 1)}
        >
          <span className="mr-1">Next</span>
          <FaArrowRight />
        </button>
      </nav>
    </div>
  );
};
