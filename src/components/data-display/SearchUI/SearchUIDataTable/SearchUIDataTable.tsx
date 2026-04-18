import { DataTable } from '../../DataTable';
import { useSearchUIContext } from '../SearchUIContextProvider';

export const SearchUIDataTable = () => {
  const {
    columns,
    results,
    resultLabel,
    conditionalRowStyles,
    selectableRows,
    selectedRows,
    setSelectedRows,
  } = useSearchUIContext();

  return (
    <div className="mpc-search-ui-data-table">
      <DataTable
        data={results}
        columns={columns}
        resultLabel={resultLabel}
        conditionalRowStyles={conditionalRowStyles}
        selectableRows={selectableRows}
        selectedRows={selectedRows}
        pagination
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
