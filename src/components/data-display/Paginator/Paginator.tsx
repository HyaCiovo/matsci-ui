import clsx from 'clsx';
import { Dropdown } from '../../navigation/Dropdown';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { formatTemplate, mergeTexts } from '../../../utils/text';

export interface PaginatorProps {
  rowsPerPage: number;
  rowCount: number;
  onChangePage: (page: number) => any;
  onChangeRowsPerPage?: (rowsPerPage: number) => any;
  currentPage: number;
  isTop?: boolean;
  className?: string;
  texts?: Partial<PaginatorTexts>;
}

export interface PaginatorTexts {
  jumpTo: string;
  rowsPerPageTemplate: string;
  ariaLabelPagination: string;
  previous: string;
  next: string;
  ariaLabelGoToPageTemplate: string;
  ariaLabelPageTemplate: string;
}

const RESULTS_PER_PAGE_OPTIONS = [10, 15, 30, 50, 75];
const DEFAULT_TEXTS: PaginatorTexts = {
  jumpTo: 'Jump to',
  rowsPerPageTemplate: '{rowsPerPage} / page',
  ariaLabelPagination: 'pagination',
  previous: 'Previous',
  next: 'Next',
  ariaLabelGoToPageTemplate: 'Go to page {page}',
  ariaLabelPageTemplate: 'Page {page}',
};

const getPageCount = (rowCount: number, rowsPerPage: number) => {
  if (!rowsPerPage || rowCount <= 0) {
    return 1;
  }

  return Math.max(1, Math.ceil(rowCount / rowsPerPage));
};

const getVisiblePages = (currentPage: number, pageCount: number) => {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3] as const;
  }

  if (currentPage >= pageCount - 1) {
    return [pageCount - 2, pageCount - 1, pageCount] as const;
  }

  return [currentPage - 1, currentPage, currentPage + 1] as const;
};

export const Paginator = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage,
  isTop = false,
  className,
  texts: textsProp,
}: PaginatorProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const pageCount = getPageCount(rowCount, rowsPerPage);
  const visiblePages = getVisiblePages(currentPage, pageCount);
  const resultsPerPageOptions = [10, 15, 30, 50, 75];
  const jumpToPageOptions = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div data-testid="ms-paginator" className={clsx('ms-paginator', className)}>
      <div className="ms-paginator-controls">
        <Dropdown
          className="ms-paginator-dropdown"
          triggerLabel={texts.jumpTo}
          triggerClassName="ms-button ms-is-small"
          isUp={!isTop}
        >
          {jumpToPageOptions.map((page) => (
            <button
              key={page}
              type="button"
              className={clsx('ms-dropdown-item', { 'ms-is-active': page === currentPage })}
              onClick={() => onChangePage(page)}
            >
              {page}
            </button>
          ))}
        </Dropdown>
        {onChangeRowsPerPage ? (
          <Dropdown
            className="ms-paginator-dropdown"
            triggerLabel={formatTemplate(texts.rowsPerPageTemplate, { rowsPerPage })}
            triggerClassName="ms-button ms-is-small"
            isUp={!isTop}
          >
            {resultsPerPageOptions.map((value) => (
              <button
                key={value}
                type="button"
                className={clsx('ms-dropdown-item', { 'ms-is-active': value === rowsPerPage })}
                onClick={() => onChangeRowsPerPage(Number(value))}
              >
                {value}
              </button>
            ))}
          </Dropdown>
        ) : null}
      </div>

      <nav
        className="ms-pagination ms-is-small ms-is-centered"
        role="navigation"
        aria-label={texts.ariaLabelPagination}
      >
        <button
          className="ms-pagination-previous"
          disabled={currentPage === 1}
          aria-hidden={currentPage === 1}
          onClick={() => currentPage > 1 && onChangePage(currentPage - 1)}
        >
          <FaArrowLeft />
          <span className="ms-ml-1 ms-is-hidden-touch">{texts.previous}</span>
        </button>
        <button
          className="ms-pagination-next"
          disabled={currentPage === pageCount}
          aria-hidden={currentPage === pageCount}
          onClick={() => currentPage < pageCount && onChangePage(currentPage + 1)}
        >
          <span className="ms-mr-1 ms-is-hidden-touch">{texts.next}</span>
          <FaArrowRight />
        </button>
        <ul className="ms-pagination-list">
          {visiblePages.map((page) => (
            <li key={page}>
              <a
                className={clsx('ms-pagination-link', { 'ms-is-current': page === currentPage })}
                aria-label={
                  page === currentPage
                    ? formatTemplate(texts.ariaLabelGoToPageTemplate, { page })
                    : formatTemplate(texts.ariaLabelPageTemplate, { page })
                }
                onClick={() => onChangePage(page)}
              >
                {page.toLocaleString()}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
