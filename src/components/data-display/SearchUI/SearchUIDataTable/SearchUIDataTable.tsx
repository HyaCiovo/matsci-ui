import { useMemo } from 'react';
import { DataTable } from '../../DataTable';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { getRowValueFromSelectorString } from '../../../../utils/table';

const compareValues = (left: any, right: any) => {
  if (left === right) {
    return 0;
  }
  if (left === undefined || left === null) {
    return 1;
  }
  if (right === undefined || right === null) {
    return -1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
};

export const SearchUIDataTable = () => {
  const {
    apiEndpoint,
    columns,
    defaultLimit,
    defaultSkip,
    limitKey,
    query,
    results,
    resultLabel,
    conditionalRowStyles,
    selectableRows,
    selectedRows,
    setSelectedRows,
    skipKey,
    sortFields,
  } = useSearchUIContext();

  const primarySortField = String(sortFields[0] ?? '').replace(/^-/, '');
  const secondarySortField = String(sortFields[1] ?? '').replace(/^-/, '');
  const sortAscending = !String(sortFields[0] ?? '').startsWith('-');
  const secondarySortAscending = !String(sortFields[1] ?? '').startsWith('-');
  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);

  const displayResults = useMemo(() => {
    if (apiEndpoint) {
      return results;
    }

    const sortableResults = [...results];
    const sortDescriptors = [sortFields[0], sortFields[1]].filter(Boolean) as string[];

    if (sortDescriptors.length > 0) {
      sortableResults.sort((left, right) => {
        for (const descriptor of sortDescriptors) {
          const descending = descriptor.startsWith('-');
          const selector = descriptor.replace(/^-/, '');
          const comparison = compareValues(
            getRowValueFromSelectorString(selector, left),
            getRowValueFromSelectorString(selector, right)
          );

          if (comparison !== 0) {
            return descending ? -comparison : comparison;
          }
        }

        return 0;
      });
    }

    return sortableResults.slice(currentSkip, currentSkip + currentLimit);
  }, [apiEndpoint, currentLimit, currentSkip, results, sortFields]);

  return (
    <div className="ms-search-ui-data-table">
      <DataTable
        data={displayResults}
        columns={columns}
        resultLabel={resultLabel}
        conditionalRowStyles={conditionalRowStyles}
        selectableRows={selectableRows}
        selectedRows={selectedRows}
        sortField={primarySortField || undefined}
        sortAscending={sortAscending}
        secondarySortField={secondarySortField || undefined}
        secondarySortAscending={secondarySortAscending}
        pagination={false}
        setProps={({ selectedRows: nextSelectedRows }: { selectedRows?: any[] }) => {
          const normalizedNextSelectedRows = nextSelectedRows ?? [];
          if (JSON.stringify(normalizedNextSelectedRows) !== JSON.stringify(selectedRows)) {
            setSelectedRows(normalizedNextSelectedRows);
          }
        }}
      />
    </div>
  );
};
