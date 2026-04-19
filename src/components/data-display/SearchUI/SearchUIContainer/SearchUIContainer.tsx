import classNames from 'classnames';
import type { SearchUIContainerProps } from '../types';
import { SearchUIContextProvider } from '../SearchUIContextProvider';

export const SearchUIContainer = ({
  id,
  className,
  apiEndpoint,
  apiKey,
  autocompleteFormulaUrl,
  matscholarEndpoint,
  apiEndpointParams,
  defaultQuery,
  searchOnMount,
  columns,
  filterGroups,
  resultLabel,
  hasSortMenu,
  conditionalRowStyles,
  selectableRows,
  selectedRows,
  results,
  initialResults,
  initialTotalResults,
  sortFields,
  sortKey,
  skipKey,
  limitKey,
  fieldsKey,
  totalKey,
  defaultLimit,
  defaultSkip,
  view,
  debounce,
  disableRichColumnHeaders,
  cardOptions,
  setProps,
  children,
}: SearchUIContainerProps) => {
  return (
    <div id={id} className={classNames('mpc-search-ui', className)}>
      <SearchUIContextProvider
        id={id}
        className={className}
        apiEndpoint={apiEndpoint}
        apiKey={apiKey}
        autocompleteFormulaUrl={autocompleteFormulaUrl}
        matscholarEndpoint={matscholarEndpoint}
        apiEndpointParams={apiEndpointParams}
        defaultQuery={defaultQuery}
        searchOnMount={searchOnMount}
        columns={columns}
        filterGroups={filterGroups}
        resultLabel={resultLabel}
        hasSortMenu={hasSortMenu}
        conditionalRowStyles={conditionalRowStyles}
        selectableRows={selectableRows}
        selectedRows={selectedRows}
        results={results}
        initialResults={initialResults}
        initialTotalResults={initialTotalResults}
        sortFields={sortFields}
        sortKey={sortKey}
        skipKey={skipKey}
        limitKey={limitKey}
        fieldsKey={fieldsKey}
        totalKey={totalKey}
        defaultLimit={defaultLimit}
        defaultSkip={defaultSkip}
        view={view}
        debounce={debounce}
        disableRichColumnHeaders={disableRichColumnHeaders}
        cardOptions={cardOptions}
        setProps={setProps}
      >
        {children}
      </SearchUIContextProvider>
    </div>
  );
};
