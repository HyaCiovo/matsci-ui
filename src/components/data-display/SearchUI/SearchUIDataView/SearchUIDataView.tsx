import { FaExclamationTriangle } from 'react-icons/fa';
import { SearchUIDataTable } from '../SearchUIDataTable';
import { useSearchUIContext } from '../SearchUIContextProvider';

export const SearchUIDataView = () => {
  const { error, results } = useSearchUIContext();

  if (error) {
    return (
      <div className="react-data-table-message box">
        <p>
          <FaExclamationTriangle className="mr-2" />
          There was an error with your search.
        </p>
        <p>You may have entered an invalid search value, or the API may be temporarily unavailable.</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="react-data-table-message box">
        <p>No records match your search criteria</p>
      </div>
    );
  }

  return (
    <div className="mpc-search-ui-data-view">
      <SearchUIDataTable />
    </div>
  );
};
