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
import type {
  ActiveFilter,
  Column,
  ConditionalRowStyle,
  FilterGroup,
  SearchUIContextValue,
} from '../types';
import {
  getActiveFilters,
  initFilterGroups,
  isNotEmpty,
  parseSearchQuery,
  preprocessQueryParams,
  serializeSearchQuery,
} from '../utils';

interface SearchUIContextProviderProps extends PropsWithChildren {
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  defaultQuery?: Record<string, any>;
  searchOnMount?: boolean;
  columns?: Column[];
  filterGroups?: FilterGroup[];
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
  filterGroups = [],
  resultLabel = 'result',
  conditionalRowStyles = [],
  selectableRows = false,
  initialResults = [],
  initialTotalResults,
  children,
}: SearchUIContextProviderProps) => {
  const initializedFilterGroups = useMemo(() => initFilterGroups(filterGroups), [filterGroups]);
  const initialQuery = useMemo(
    () =>
      typeof window === 'undefined'
        ? defaultQuery
        : parseSearchQuery(window.location.search, initializedFilterGroups, defaultQuery),
    [defaultQuery, initializedFilterGroups]
  );

  const [query, setQueryState] = useState<Record<string, any>>(initialQuery);
  const [results, setResults] = useState<any[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults ?? initialResults.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() =>
    getActiveFilters(initializedFilterGroups, initialQuery)
  );

  const setQuery = useCallback((nextQuery: Record<string, any>) => {
    setQueryState(nextQuery);
    setActiveFilters(getActiveFilters(initializedFilterGroups, nextQuery));
  }, [initializedFilterGroups]);

  const resetSearch = useCallback(() => {
    setQueryState(defaultQuery);
    setResults([]);
    setTotalResults(0);
    setError(null);
    setActiveFilters(getActiveFilters(initializedFilterGroups, defaultQuery));
  }, [defaultQuery, initializedFilterGroups]);

  const submitSearch = useCallback(
    async (nextQuery?: Record<string, any>) => {
      const resolvedQuery = nextQuery ?? query;
      setQueryState(resolvedQuery);
      setActiveFilters(getActiveFilters(initializedFilterGroups, resolvedQuery));

      if (!apiEndpoint) {
        setResults([]);
        setTotalResults(0);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const processedQuery = preprocessQueryParams(resolvedQuery, initializedFilterGroups, defaultQuery);
        const response = await axios.get(apiEndpoint, {
          params: processedQuery,
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
    [apiEndpoint, apiKey, defaultQuery, initializedFilterGroups, query]
  );

  const applyQuery = useCallback(
    async (nextQuery: Record<string, any>) => {
      if (apiEndpoint) {
        await submitSearch(nextQuery);
      } else {
        setQuery(nextQuery);
      }
    },
    [apiEndpoint, setQuery, submitSearch]
  );

  const setFilterValue = useCallback(
    async (value: any, param: string, overrides: string[] = []) => {
      const nextQuery = { ...query, [param]: value };
      overrides.forEach((override) => {
        delete nextQuery[override];
      });
      if (!isNotEmpty(value)) {
        delete nextQuery[param];
      }
      await applyQuery(nextQuery);
    },
    [applyQuery, query]
  );

  const setFilterValues = useCallback(
    async (values: any[], params: string[], overrides: string[] = []) => {
      const nextQuery = { ...query };
      params.forEach((param, index) => {
        const value = values[index];
        if (isNotEmpty(value)) {
          nextQuery[param] = value;
        } else {
          delete nextQuery[param];
        }
      });
      overrides.forEach((override) => {
        delete nextQuery[override];
      });
      await applyQuery(nextQuery);
    },
    [applyQuery, query]
  );

  const removeFilters = useCallback(
    async (params: string[]) => {
      const nextQuery = { ...query };
      params.forEach((param) => {
        delete nextQuery[param];
      });
      await applyQuery(nextQuery);
    },
    [applyQuery, query]
  );

  const resetFilters = useCallback(async () => {
    await applyQuery(defaultQuery);
  }, [applyQuery, defaultQuery]);

  useEffect(() => {
    if (searchOnMount) {
      void submitSearch(initialQuery);
    }
  }, [initialQuery, searchOnMount, submitSearch]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextSearch = serializeSearchQuery(query, defaultQuery);
    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }, [defaultQuery, query]);

  const value = useMemo<SearchUIContextValue>(
    () => ({
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      columns,
      filterGroups: initializedFilterGroups,
      activeFilters,
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
      setFilterValue,
      setFilterValues,
      removeFilters,
      resetFilters,
    }),
    [
      activeFilters,
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      columns,
      conditionalRowStyles,
      error,
      initializedFilterGroups,
      loading,
      removeFilters,
      resetFilters,
      query,
      resetSearch,
      resultLabel,
      results,
      selectableRows,
      selectedRows,
      setFilterValue,
      setFilterValues,
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
