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
import { useEffect, useMemo, useState } from 'react';
import { Markdown } from '../Markdown';
import { Column, ColumnFormat, ConditionalRowStyle } from '../SearchUI/types';
import { formatColumnValue, getColumnsFromKeys, matchesConditionalStyle } from '../../../utils/table';
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
}

const DEFAULT_PAGE_SIZE = 10;
const EMPTY_ROWS: any[] = [];
const EMPTY_STYLES: ConditionalRowStyle[] = [];

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

export const DataTable = ({
  className = 'box p-0',
  resultLabel = 'record',
  resultLabelPlural = `${resultLabel}s`,
  headerClassName = 'title is-6',
  data,
  columns,
  selectedRows,
  conditionalRowStyles,
  setProps,
  ...props
}: DataTableProps) => {
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
    }

    return resolvedColumns.map((column) => ({
      id: column.selector,
      accessorFn: (row: any) => row,
      enableSorting: column.sortable !== false && column.selector !== '_isSelected',
      size: column.width ? parseInt(column.width, 10) : undefined,
      header: () => (column.title === '' ? '' : column.title),
      cell: ({ row }: { row: any }) => {
        if (column.formatType === ColumnFormat.RADIO) {
          return (
            <input
              type="radio"
              checked={row.getIsSelected()}
              onChange={() => row.toggleSelected()}
              aria-label={`Select row ${row.id}`}
            />
          );
        }

        return formatColumnValue(column, row.original);
      },
      meta: column,
    }));
  }, [columnDefs, props.singleSelectableRows]);

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

  useEffect(() => {
    if (!setProps) {
      return;
    }

    const selected = table.getSelectedRowModel().rows.map((row) => row.original);
    setProps({ selectedRows: selected });
  }, [rowSelection, setProps, table]);

  const visibleSelectorColumns = columnDefs.filter((column) => !column.excludeFromColumnsSelector);
  const rows = props.pagination ? table.getRowModel().rows : table.getPrePaginationRowModel().rows;

  return (
    <div id={props.id} className={clsx('mpc-data-table', className)}>
      {props.hasHeader ? (
        <div className="mpc-data-table-header">
          <div className="mpc-data-table-toolbar">
            <div className={headerClassName}>
              {data.length} {data.length === 1 ? resultLabel : resultLabelPlural}
            </div>
            <div className="mpc-data-table-columns">
              <details>
                <summary className="button is-small">Columns</summary>
                <div className="mpc-data-table-columns-menu">
                  {visibleSelectorColumns.map((column) => (
                    <label key={column.selector}>
                      <input
                        type="checkbox"
                        checked={table.getColumn(column.selector)?.getIsVisible() ?? true}
                        onChange={(event) => table.getColumn(column.selector)?.toggleVisibility(event.target.checked)}
                      />
                      <span>{column.title}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mpc-data-table-scroll" data-testid="react-data-table-container">
        <table className="mpc-data-table-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column.columnDef.meta as Column;
                  return (
                    <th
                      key={header.id}
                      className={clsx({
                        'is-right': column?.right,
                        'is-center': column?.center,
                      })}
                      onClick={header.column.getToggleSortingHandler()}
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
                  className={clsx({ 'is-clickable': props.selectableRows })}
                  style={conditionalStyle?.style}
                  onClick={props.selectableRows ? () => row.toggleSelected() : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    const column = cell.column.columnDef.meta as Column;
                    return (
                      <td
                        key={cell.id}
                        className={clsx({
                          'is-right': column?.right,
                          'is-center': column?.center,
                        })}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {props.pagination ? (
        <div className="mpc-data-table-pagination">
          <button type="button" className="button is-small" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button type="button" className="button is-small" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </button>
        </div>
      ) : null}

      {props.footer ? (
        <div className="mpc-data-table-footer">
          <Markdown>{String(props.footer)}</Markdown>
        </div>
      ) : null}
    </div>
  );
};
