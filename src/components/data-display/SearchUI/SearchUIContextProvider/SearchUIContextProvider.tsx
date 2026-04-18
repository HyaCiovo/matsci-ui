import axios from 'axios';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Column, ConditionalRowStyle, SearchUIContextValue } from '../types';

interface SearchUIContextProviderProps extends PropsWithChildren {
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  defaultQuery?: Record<string, any>;
  searchOnMount?: boolean;
  columns?: Column[];
  resultLabel?: string;
  conditionalRowStyles?: ConditionalRowStyle[];
  selectableRows?: boolean;
  initialResults?: any[];
  initialTotalResults?: number;
}

const SearchUIContext = createContext<SearchUIContextValue | undefined>(undefined);

const getResultsFromResponse = (data: any) => {
  if (Array.isArray(data?.data)) {
    return data.data;
  }
  if (Array.isArray(data?.results)) {
    return data.results;
  }
  return [];
};

const getTotalResultsFromResponse = (data: any, results: any[]) => {
  return (
    data?.meta?.total_doc ??
    data?.meta?.total_results ??
    data?.total_results ??
    data?.count ??
    results.length
  );
};

export const SearchUIContextProvider = ({
  apiEndpoint,
  apiKey,
  autocompleteFormulaUrl,
  defaultQuery = {},
  searchOnMount = false,
  columns = [],
  resultLabel = 'result',
  conditionalRowStyles = [],
  selectableRows = false,
  initialResults = [],
  initialTotalResults,
  children,
}: SearchUIContextProviderProps) => {
  const [query, setQueryState] = useState<Record<string, any>>(defaultQuery);
  const [results, setResults] = useState<any[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults ?? initialResults.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const setQuery = useCallback((nextQuery: Record<string, any>) => {
    setQueryState(nextQuery);
  }, []);

  const resetSearch = useCallback(() => {
    setQueryState(defaultQuery);
    setResults([]);
    setTotalResults(0);
    setError(null);
  }, [defaultQuery]);

  const submitSearch = useCallback(
    async (nextQuery?: Record<string, any>) => {
      const resolvedQuery = nextQuery ?? query;
      setQueryState(resolvedQuery);

      if (!apiEndpoint) {
        setResults([]);
        setTotalResults(0);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(apiEndpoint, {
          params: resolvedQuery,
          headers: apiKey ? { 'X-Api-Key': apiKey } : undefined,
        });
        const nextResults = getResultsFromResponse(response.data);
        setResults(nextResults);
        setTotalResults(getTotalResultsFromResponse(response.data, nextResults));
      } catch (caughtError) {
        setResults([]);
        setTotalResults(0);
        setError(caughtError instanceof Error ? caughtError.message : 'Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, apiKey, query]
  );

  useEffect(() => {
    if (searchOnMount) {
      void submitSearch(defaultQuery);
    }
  }, [defaultQuery, searchOnMount, submitSearch]);

  const value = useMemo<SearchUIContextValue>(
    () => ({
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      columns,
      resultLabel,
      conditionalRowStyles,
      selectableRows,
      selectedRows,
      query,
      results,
      totalResults,
      loading,
      error,
      submitSearch,
      resetSearch,
      setQuery,
      setSelectedRows,
    }),
    [
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      columns,
      conditionalRowStyles,
      error,
      loading,
      query,
      resetSearch,
      resultLabel,
      results,
      selectableRows,
      selectedRows,
      setQuery,
      setSelectedRows,
      submitSearch,
      totalResults,
    ]
  );

  return <SearchUIContext.Provider value={value}>{children}</SearchUIContext.Provider>;
};

export const useSearchUIContext = () => {
  const context = useContext(SearchUIContext);
  if (!context) {
    throw new Error('useSearchUIContext must be used within a SearchUIContextProvider');
  }
  return context;
};
