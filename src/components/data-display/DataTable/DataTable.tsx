import clsx from 'clsx';
import {
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Markdown } from '../Markdown';
import { Tooltip } from '../Tooltip';
import { Paginator, type PaginatorTexts } from '../Paginator';
import { Checkbox } from '../../data-entry/Checkbox';
import { Column, ColumnFormat, ConditionalRowStyle } from '../SearchUI/types';
import {
  formatColumnValue,
  getColumnsFromKeys,
  getRowValueFromSelectorString,
  matchesConditionalStyle,
} from '../../../utils/table';
import { formatTemplate } from '../../../text/formatTemplate';
import { mergeTexts } from '../../../text/mergeTexts';
import './DataTable.css';

export interface DataTableProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any[];
  columns?: Column[];
  sortField?: string;
  sortAscending?: boolean;
  secondarySortField?: string;
  secondarySortAscending?: boolean;
  conditionalRowStyles?: ConditionalRowStyle[];
  selectableRows?: boolean;
  selectedRows?: any[];
  singleSelectableRows?: boolean;
  hasHeader?: boolean;
  headerClassName?: string;
  resultLabel?: string;
  resultLabelPlural?: string;
  pagination?: boolean;
  paginationIsExpanded?: boolean;
  footer?: React.ReactNode;
  disableRichColumnHeaders?: boolean;
  texts?: Partial<DataTableTexts>;
}

const DEFAULT_PAGE_SIZE = 10;
const EMPTY_ROWS: any[] = [];
const EMPTY_STYLES: ConditionalRowStyle[] = [];

export interface DataTableTexts {
  columns: string;
  selectAll: string;
  ariaSelectAllRows: string;
  ariaSelectRowTemplate: string;
  rowsPerPage: string;
  ariaRowsPerPage: string;
  pageSummaryTemplate: string;
  ariaFirstPage: string;
  ariaPreviousPage: string;
  ariaNextPage: string;
  ariaLastPage: string;
  paginator?: Partial<PaginatorTexts>;
}

const DEFAULT_TEXTS: DataTableTexts = {
  columns: 'Columns',
  selectAll: 'Select all',
  ariaSelectAllRows: 'Select all rows',
  ariaSelectRowTemplate: 'Select row {rowId}',
  rowsPerPage: 'Rows per page',
  ariaRowsPerPage: 'Rows per page',
  pageSummaryTemplate: '{start}-{end} of {total}',
  ariaFirstPage: 'First page',
  ariaPreviousPage: 'Previous page',
  ariaNextPage: 'Next page',
  ariaLastPage: 'Last page',
};

const getInitialSorting = (props: DataTableProps): SortingState => {
  const sorting: SortingState = [];
  if (props.sortField) {
    sorting.push({ id: props.sortField, desc: props.sortAscending === false });
  }
  if (props.secondarySortField) {
    sorting.push({
      id: props.secondarySortField,
      desc: props.secondarySortAscending === false,
    });
  }
  return sorting;
};

const getRowKey = (row: any, index: number) => row?._index ?? row?.material_id ?? index;
const toCssLength = (value?: string) => (value && value.trim().length > 0 ? value : undefined);
const addCssLengths = (current: string | undefined, next: string | undefined) => {
  if (!current) {
    return next;
  }
  if (!next) {
    return current;
  }
  return `calc(${current} + ${next})`;
};

const getColumnAlign = (column?: Column) => {
  if (column?.align) {
    return column.align;
  }
  if (column?.right) {
    return 'right';
  }
  if (column?.center) {
    return 'center';
  }
  return 'left';
};

const getFixedSide = (column?: Column): 'left' | 'right' | null => {
  if (!column?.fixed) {
    return null;
  }
  if (column.fixed === 'right') {
    return 'right';
  }
  return 'left';
};

const getSortableColumnValue = (column: Column, row: any) => {
  const rawValue = getRowValueFromSelectorString(column.selector, row);

  if (rawValue == null) {
    return '';
  }

  if (typeof rawValue === 'number') {
    return rawValue;
  }

  if (typeof rawValue === 'boolean') {
    return rawValue ? 1 : 0;
  }

  if (typeof rawValue === 'string') {
    return rawValue.toLowerCase();
  }

  if (Array.isArray(rawValue)) {
    return rawValue.join(',').toLowerCase();
  }

  if (typeof rawValue === 'object') {
    return JSON.stringify(rawValue).toLowerCase();
  }

  return String(rawValue).toLowerCase();
};

const renderColumnHeader = (column: Column, disableRichColumnHeaders?: boolean) => {
  if (disableRichColumnHeaders) {
    return column.title === '' ? '' : column.title;
  }

  return (
    <Tooltip
      disable={!column.tooltip}
      trigger={
        <div
          className={clsx({
            'ms-column-header-right': column?.right,
            'ms-column-header-center': column?.center,
            'ms-column-header-left': !column?.right && !column?.center,
            'ms-tooltip-label': column?.tooltip,
          })}
        >
          <div>{column.title === '' ? '' : column.title}</div>
          {column.units ? <div className="ms-column-units">({column.units})</div> : null}
        </div>
      }
    >
      {column.tooltip}
    </Tooltip>
  );
};

type ColumnMeta = Column & {
  _resolvedWidth?: string;
  _resolvedMinWidth?: string;
  _resolvedMaxWidth?: string;
  _resolvedAlign: 'left' | 'center' | 'right';
  _fixedSide: 'left' | 'right' | null;
  _stickyOffset?: string;
};

export const DataTable = ({
  className = 'ms-box ms-p-0',
  resultLabel = 'record',
  resultLabelPlural = `${resultLabel}s`,
  headerClassName = 'ms-title ms-is-6',
  data,
  columns,
  selectedRows,
  conditionalRowStyles,
  setProps,
  texts: textsProp,
  ...props
}: DataTableProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const normalizedSelectedRows = selectedRows ?? EMPTY_ROWS;
  const normalizedConditionalRowStyles = conditionalRowStyles ?? EMPTY_STYLES;
  const columnDefs = useMemo(() => columns ?? getColumnsFromKeys(data[0]), [columns, data]);
  const [sorting, setSorting] = useState<SortingState>(() => getInitialSorting({ ...props, data, columns }));
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(columnDefs.map((column) => [column.selector, !column.hidden]))
  );
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);

  useEffect(() => {
    setColumnVisibility(Object.fromEntries(columnDefs.map((column) => [column.selector, !column.hidden])));
  }, [columnDefs]);

  useEffect(() => {
    const selectedMap = Object.fromEntries(
      normalizedSelectedRows.map((row, index) => [String(getRowKey(row, index)), true])
    );
    setRowSelection(selectedMap);
  }, [normalizedSelectedRows]);

  const tableColumns = useMemo(() => {
    const resolvedColumns = [...columnDefs];

    if (props.singleSelectableRows) {
      resolvedColumns.unshift({
        title: '',
        selector: '_isSelected',
        formatType: ColumnFormat.RADIO,
        width: '48px',
        excludeFromColumnsSelector: true,
      });
    } else if (props.selectableRows) {
      resolvedColumns.unshift({
        title: '',
        selector: '_isSelected',
        width: '48px',
        excludeFromColumnsSelector: true,
      } as Column);
    }

    const columnMetas: ColumnMeta[] = resolvedColumns.map((column) => ({
      ...column,
      _resolvedWidth: toCssLength(column.width),
      _resolvedMinWidth: toCssLength(column.minWidth),
      _resolvedMaxWidth: toCssLength(column.maxWidth),
      _resolvedAlign: getColumnAlign(column),
      _fixedSide: getFixedSide(column),
    }));

    let leftOffset: string | undefined;
    columnMetas.forEach((column) => {
      if (column._fixedSide !== 'left') {
        return;
      }
      column._stickyOffset = leftOffset ?? '0px';
      leftOffset = addCssLengths(leftOffset, column._resolvedWidth ?? column._resolvedMinWidth ?? '48px');
    });

    let rightOffset: string | undefined;
    [...columnMetas].reverse().forEach((column) => {
      if (column._fixedSide !== 'right') {
        return;
      }
      column._stickyOffset = rightOffset ?? '0px';
      rightOffset = addCssLengths(rightOffset, column._resolvedWidth ?? column._resolvedMinWidth ?? '48px');
    });

    return columnMetas.map((column) => ({
      id: column.selector,
      accessorFn: (row: any) => getSortableColumnValue(column, row),
      enableSorting: column.sortable !== false && column.selector !== '_isSelected',
      size: column.width ? parseInt(column.width, 10) : undefined,
      header: ({ table, column: tableColumn }: { table: any; column: any }) => {
        if (column.selector === '_isSelected') {
          if (props.singleSelectableRows) {
            return <div className="ms-selection-control" aria-hidden="true" />;
          }

          return (
            <label className="ms-selection-control">
              <Checkbox
                aria-label={texts.ariaSelectAllRows}
                checked={
                  table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                    ? 'indeterminate'
                    : table.getIsAllPageRowsSelected()
                }
                onCheckedChange={(checked) => {
                  if (checked === 'indeterminate') {
                    return;
                  }
                  table.toggleAllPageRowsSelected(checked === true);
                }}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
          );
        }

        const canSort = tableColumn.getCanSort();
        const sortState = tableColumn.getIsSorted();
        const sortIcon = canSort ? (
          <span
            className={clsx('ms-column-sort-icon', {
              'ms-is-asc': sortState === 'asc',
              'ms-is-desc': sortState === 'desc',
              'ms-is-idle': !sortState,
            })}
            aria-hidden="true"
          >
            {sortState === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        ) : null;

        return (
          <div
            className={clsx('ms-column-header-content', {
              'ms-is-sortable': canSort,
              'ms-is-sort-icon-left': column.sortIconPosition === 'left',
            })}
          >
            {column.sortIconPosition === 'left' ? sortIcon : null}
            <span className="ms-column-header-label">
              {renderColumnHeader(column, props.disableRichColumnHeaders)}
            </span>
            {column.sortIconPosition !== 'left' ? sortIcon : null}
          </div>
        );
      },
      cell: ({ row }: { row: any }) => {
        if (column.formatType === ColumnFormat.RADIO) {
          return (
            <label className="ms-selection-control">
              <input
                type="radio"
                checked={row.getIsSelected()}
                onChange={() => row.toggleSelected()}
                onClick={(event) => event.stopPropagation()}
                aria-label={formatTemplate(texts.ariaSelectRowTemplate, { rowId: row.id })}
              />
            </label>
          );
        }

        if (column.selector === '_isSelected') {
          return (
            <label className="ms-selection-control">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(checked) => {
                  if (checked === 'indeterminate') {
                    return;
                  }
                  row.toggleSelected(checked === true);
                }}
                onClick={(event) => event.stopPropagation()}
                aria-label={formatTemplate(texts.ariaSelectRowTemplate, { rowId: row.id })}
              />
            </label>
          );
        }

        if (column.render) {
          return column.render(row.original, column);
        }

        return formatColumnValue(column, row.original);
      },
      meta: column,
      sortingFn: (leftRow: any, rightRow: any) => {
        const leftValue = getSortableColumnValue(column, leftRow.original);
        const rightValue = getSortableColumnValue(column, rightRow.original);

        if (typeof leftValue === 'number' && typeof rightValue === 'number') {
          return leftValue === rightValue ? 0 : leftValue > rightValue ? 1 : -1;
        }

        return String(leftValue).localeCompare(String(rightValue), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      },
    }));
  }, [columnDefs, props.disableRichColumnHeaders, props.selectableRows, props.singleSelectableRows]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      pagination,
    },
    enableRowSelection: !!props.selectableRows,
    enableMultiRowSelection: !props.singleSelectableRows,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowId: (row, index) => String(getRowKey(row, index)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const setPropsRef = useRef(setProps);
  const columnsMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setPropsRef.current = setProps;
  }, [setProps]);

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

  useEffect(() => {
    if (!setPropsRef.current) {
      return;
    }

    const selected = table.getSelectedRowModel().rows.map((row) => row.original);
    setPropsRef.current({ data, selectedRows: selected });
  }, [data, rowSelection, table]);

  const visibleSelectorColumns = columnDefs.filter((column) => !column.excludeFromColumnsSelector);
  const showPagination = !!props.pagination && data.length > DEFAULT_PAGE_SIZE;
  const rows = showPagination ? table.getRowModel().rows : table.getPrePaginationRowModel().rows;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = showPagination ? table.getPageCount() || 1 : 1;
  const pageStart = data.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const pageEnd = showPagination ? Math.min(pageStart + table.getState().pagination.pageSize - 1, data.length) : data.length;
  const handleRowsPerPageChange = (pageSize: number) => {
    table.setPageSize(pageSize);
    table.setPageIndex(0);
  };
  const allColumnsVisible = visibleSelectorColumns.every(
    (column) => table.getColumn(column.selector)?.getIsVisible() ?? true
  );
  const toggleAllColumns = (checked: boolean) => {
    visibleSelectorColumns.forEach((column) => table.getColumn(column.selector)?.toggleVisibility(checked));
  };

  const getColumnStyle = (column?: ColumnMeta) => {
    if (!column) {
      return undefined;
    }

    const style = {
      width: column._resolvedWidth,
      minWidth: column._resolvedMinWidth ?? column._resolvedWidth,
      maxWidth: column._resolvedMaxWidth,
      ...(column.style ?? {}),
    } as CSSProperties;

    if (column._fixedSide === 'left') {
      style.position = 'sticky';
      style.left = column._stickyOffset ?? '0px';
      style.zIndex = 2;
      style.background = '#fff';
    } else if (column._fixedSide === 'right') {
      style.position = 'sticky';
      style.right = column._stickyOffset ?? '0px';
      style.zIndex = 2;
      style.background = '#fff';
    }

    return style;
  };

  const getHeaderStyle = (column?: ColumnMeta) => {
    return {
      ...getColumnStyle(column),
      ...(column?.headerStyle ?? {}),
    } as CSSProperties | undefined;
  };

  const handleHeaderSortToggle = (columnId: string, canSort: boolean) => {
    if (!canSort) {
      return;
    }

    setSorting((current) => {
      const existing = current.find((item) => item.id === columnId);
      return [{ id: columnId, desc: existing ? !existing.desc : true }];
    });
  };

  return (
    <div id={props.id} className={clsx('ms-data-table', className)}>
      {props.hasHeader ? (
        <div className="ms-data-table-header">
          <div className="ms-data-table-toolbar">
            <div className={headerClassName}>
              {data.length} {data.length === 1 ? resultLabel : resultLabelPlural}
            </div>
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
                        checked={table.getColumn(column.selector)?.getIsVisible() ?? true}
                        onCheckedChange={(checked) => table.getColumn(column.selector)?.toggleVisibility(checked === true)}
                      />
                      <span>{column.title}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="ms-data-table-scroll" data-testid="react-data-table-container">
        <table className="ms-data-table-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef.meta as ColumnMeta;
                  return (
                    <th
                      key={header.id}
                      className={clsx({
                        'ms-selection-cell': header.column.id === '_isSelected',
                        'ms-is-right': column?._resolvedAlign === 'right',
                        'ms-is-center': column?._resolvedAlign === 'center',
                        'ms-is-fixed-left': column?._fixedSide === 'left',
                        'ms-is-fixed-right': column?._fixedSide === 'right',
                      })}
                      style={getHeaderStyle(column)}
                      onClick={() => handleHeaderSortToggle(header.column.id, header.column.getCanSort())}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => {
              const conditionalStyle = normalizedConditionalRowStyles.find((style) =>
                matchesConditionalStyle(row.original, style)
              );

              return (
                <tr
                  key={row.id}
                  className={clsx({ 'ms-is-clickable': props.selectableRows })}
                  style={conditionalStyle?.style}
                  onClick={props.selectableRows ? () => row.toggleSelected() : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column.columnDef.meta as ColumnMeta;
                    return (
                      <td
                        key={cell.id}
                        className={clsx({
                          'ms-selection-cell': cell.column.id === '_isSelected',
                          'ms-is-right': column?._resolvedAlign === 'right',
                          'ms-is-center': column?._resolvedAlign === 'center',
                          'ms-is-fixed-left': column?._fixedSide === 'left',
                          'ms-is-fixed-right': column?._fixedSide === 'right',
                          'ms-is-ellipsis': !!(column?._resolvedWidth || column?._resolvedMaxWidth || column?._resolvedMinWidth),
                        })}
                        style={getColumnStyle(column)}
                      >
                        <div className="ms-data-table-cell-content">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showPagination ? props.paginationIsExpanded ? (
        <div className="ms-data-table-pagination">
          <Paginator
            rowCount={data.length}
            rowsPerPage={table.getState().pagination.pageSize}
            currentPage={currentPage}
            onChangePage={(page) => table.setPageIndex(page - 1)}
            onChangeRowsPerPage={handleRowsPerPageChange}
            texts={texts.paginator}
          />
        </div>
      ) : (
        <div className="ms-data-table-pagination ms-data-table-pagination-compact">
          <div className="ms-data-table-pagination-summary">
            <label className="ms-is-size-7">
              <span className="ms-mr-2">{texts.rowsPerPage}</span>
              <div className="ms-select ms-is-small">
                <select
                  aria-label={texts.ariaRowsPerPage}
                  value={table.getState().pagination.pageSize}
                  onChange={(event) => handleRowsPerPageChange(Number(event.target.value))}
                >
                  {[10, 15, 30, 50, 75].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <span className="ms-is-size-7">
              {formatTemplate(texts.pageSummaryTemplate, {
                start: pageStart,
                end: pageEnd,
                total: data.length,
              })}
            </span>
          </div>
          <div className="ms-data-table-pagination-actions">
            <button
              type="button"
              className="ms-button ms-is-small ms-is-ghost"
              aria-label={texts.ariaFirstPage}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              type="button"
              className="ms-button ms-is-small ms-is-ghost"
              aria-label={texts.ariaPreviousPage}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <FaAngleLeft />
            </button>
            <button
              type="button"
              className="ms-button ms-is-small ms-is-ghost"
              aria-label={texts.ariaNextPage}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleRight />
            </button>
            <button
              type="button"
              className="ms-button ms-is-small ms-is-ghost"
              aria-label={texts.ariaLastPage}
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!table.getCanNextPage()}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      ) : null}

      {props.footer ? (
        <div className="ms-data-table-footer">
          <Markdown>{String(props.footer)}</Markdown>
        </div>
      ) : null}
    </div>
  );
};
