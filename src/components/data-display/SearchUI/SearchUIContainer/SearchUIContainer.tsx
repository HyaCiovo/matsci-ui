import type { SearchUIContainerProps } from '../types';
import { SearchUIContextProvider } from '../SearchUIContextProvider';

export const SearchUIContainer = ({
  apiEndpoint,
  apiKey,
  autocompleteFormulaUrl,
  defaultQuery,
  searchOnMount,
  children,
}: SearchUIContainerProps) => {
  return (
    <SearchUIContextProvider
      apiEndpoint={apiEndpoint}
      apiKey={apiKey}
      autocompleteFormulaUrl={autocompleteFormulaUrl}
      defaultQuery={defaultQuery}
      searchOnMount={searchOnMount}
    >
      {children}
    </SearchUIContextProvider>
  );
};
