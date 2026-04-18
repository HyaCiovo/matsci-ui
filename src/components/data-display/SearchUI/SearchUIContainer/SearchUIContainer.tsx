import type { SearchUIContainerProps } from '../types';
import { SearchUIContextProvider } from '../SearchUIContextProvider';

export const SearchUIContainer = ({
  apiEndpoint,
  apiKey,
  autocompleteFormulaUrl,
  defaultQuery,
  searchOnMount,
  columns,
  resultLabel,
  conditionalRowStyles,
  selectableRows,
  initialResults,
  initialTotalResults,
  children,
}: SearchUIContainerProps) => {
  return (
    <SearchUIContextProvider
      apiEndpoint={apiEndpoint}
      apiKey={apiKey}
      autocompleteFormulaUrl={autocompleteFormulaUrl}
      defaultQuery={defaultQuery}
      searchOnMount={searchOnMount}
      columns={columns}
      resultLabel={resultLabel}
      conditionalRowStyles={conditionalRowStyles}
      selectableRows={selectableRows}
      initialResults={initialResults}
      initialTotalResults={initialTotalResults}
    >
      {children}
    </SearchUIContextProvider>
  );
};
