import axios from 'axios';
import {
  createContext,
  type PropsWithChildren,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ActiveFilter,
  Column,
  ConditionalRowStyle,
  FilterGroup,
  SearchUILegacyState,
  SearchUIContextValue,
} from '../types';
import { SearchUIViewType } from '../types';
import {
  getActiveFilters,
  initFilterGroups,
  isNotEmpty,
  parseSearchQuery,
  preprocessQueryParams,
  serializeSearchQuery,
} from '../utils';
import { getRowValueFromSelectorString } from '../../../../utils/table';

interface SearchUIContextProviderProps extends PropsWithChildren {
  id?: string;
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  matscholarEndpoint?: string;
  apiEndpointParams?: Record<string, any>;
  defaultQuery?: Record<string, any>;
  searchOnMount?: boolean;
  columns?: Column[];
  filterGroups?: FilterGroup[];
  resultLabel?: string;
  hasSortMenu?: boolean;
  conditionalRowStyles?: ConditionalRowStyle[];
  selectableRows?: boolean;
  selectedRows?: any[];
  results?: any[];
  initialResults?: any[];
  initialTotalResults?: number;
  sortFields?: (string | null | undefined)[];
  sortKey?: string;
  skipKey?: string;
  limitKey?: string;
  fieldsKey?: string;
  totalKey?: string;
  defaultLimit?: number;
  defaultSkip?: number;
  view?: SearchUIViewType;
  debounce?: number;
  disableRichColumnHeaders?: boolean;
  cardOptions?: any;
  setProps?: (value: any) => any;
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

const getTotalResultsFromResponse = (data: any, results: any[], totalKey: string) =>
  getRowValueFromSelectorString(totalKey, data) ??
  data?.meta?.total_doc ??
  data?.meta?.total_results ??
  data?.total_results ??
  data?.count ??
  results.length;

const serializeAxiosParams = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      searchParams.set(key, value.filter((item) => item !== undefined && item !== null && item !== '').join(','));
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
};

const extractMatscholarMaterialIds = (data: any) => {
  const results = Array.isArray(data?.results) ? data.results : Array.isArray(data?.data?.results) ? data.data.results : [];
  return results.flatMap((result: any) => {
    if (Array.isArray(result?.material_id)) {
      return result.material_id;
    }
    if (result?.material_id) {
      return [result.material_id];
    }
    return [];
  });
};

export const SearchUIContextProvider = ({
  id,
  className,
  apiEndpoint,
  apiKey,
  autocompleteFormulaUrl,
  matscholarEndpoint,
  apiEndpointParams = {},
  defaultQuery = {},
  searchOnMount,
  columns = [],
  filterGroups = [],
  resultLabel = 'result',
  hasSortMenu = true,
  conditionalRowStyles = [],
  selectableRows = false,
  selectedRows: initialSelectedRows = [],
  results: legacyResults = [],
  initialResults = [],
  initialTotalResults,
  sortFields = ['material_id'],
  sortKey = '_sort_fields',
  skipKey = '_skip',
  limitKey = '_limit',
  fieldsKey = '_fields',
  totalKey = 'meta.total_doc',
  defaultLimit = 15,
  defaultSkip = 0,
  view = SearchUIViewType.TABLE,
  debounce = 0,
  disableRichColumnHeaders,
  cardOptions,
  setProps = () => null,
  children,
}: SearchUIContextProviderProps) => {
  const initializedFilterGroups = useMemo(() => initFilterGroups(filterGroups), [filterGroups]);
  const normalizedDefaultQuery = useMemo(
    () => ({
      [sortKey]: sortFields,
      [limitKey]: defaultLimit,
      [skipKey]: defaultSkip,
      ...defaultQuery,
    }),
    [defaultLimit, defaultQuery, defaultSkip, limitKey, skipKey, sortFields, sortKey]
  );
  const initialQuery = useMemo(
    () =>
      typeof window === 'undefined'
        ? normalizedDefaultQuery
        : parseSearchQuery(window.location.search, initializedFilterGroups, normalizedDefaultQuery),
    [initializedFilterGroups, normalizedDefaultQuery]
  );

  const [query, setQueryState] = useState<Record<string, any>>(initialQuery);
  const [currentView, setCurrentView] = useState<SearchUIViewType>(view);
  const [currentColumns, setCurrentColumns] = useState<Column[]>(columns);
  const normalizedInitialResults = initialResults.length > 0 ? initialResults : legacyResults;
  const [results, setResults] = useState<any[]>(normalizedInitialResults);
  const [totalResults, setTotalResults] = useState(initialTotalResults ?? normalizedInitialResults.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>(initialSelectedRows);
  const [resultsRef, setResultsRef] = useState<RefObject<HTMLDivElement> | null>(null);
  const matscholarCacheRef = useRef<{ query: string; materialIds: string[] } | null>(null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(() =>
    getActiveFilters(initializedFilterGroups, initialQuery)
  );
  const searchBarValue = useMemo(() => {
    const searchBarFilter = activeFilters.find((filter) => filter.isSearchBarField === true);
    return searchBarFilter?.value ? String(searchBarFilter.value) : '';
  }, [activeFilters]);

  const setQuery = useCallback((nextQuery: Record<string, any>) => {
    setQueryState(nextQuery);
    setActiveFilters(getActiveFilters(initializedFilterGroups, nextQuery));
  }, [initializedFilterGroups]);

  const resetSearch = useCallback(() => {
    setQueryState(normalizedDefaultQuery);
    setResults([]);
    setTotalResults(0);
    setError(null);
    setActiveFilters(getActiveFilters(initializedFilterGroups, normalizedDefaultQuery));
  }, [initializedFilterGroups, normalizedDefaultQuery]);

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
        const processedQuery = preprocessQueryParams(
          { ...resolvedQuery, ...apiEndpointParams },
          initializedFilterGroups,
          normalizedDefaultQuery,
          sortKey
        );
        processedQuery[fieldsKey] = currentColumns.map((column) => column.selector);
        const freeTextQuery = processedQuery.q;

        if (freeTextQuery && matscholarEndpoint) {
          const matscholarCache = matscholarCacheRef.current;
          const cachedMaterialIds =
            matscholarCache && matscholarCache.query === freeTextQuery ? matscholarCache.materialIds : null;
          const materialIds =
            cachedMaterialIds ??
            extractMatscholarMaterialIds(
              (
                await axios.get(matscholarEndpoint, {
                  params: { q: freeTextQuery },
                  paramsSerializer: serializeAxiosParams,
                })
              ).data
            );

          if (!cachedMaterialIds) {
            matscholarCacheRef.current = {
              query: String(freeTextQuery),
              materialIds,
            };
          }
          const resolvedSkip = Number(processedQuery[skipKey] ?? normalizedDefaultQuery[skipKey] ?? defaultSkip);
          const resolvedLimit = Number(processedQuery[limitKey] ?? normalizedDefaultQuery[limitKey] ?? defaultLimit);
          const materialIdChunk = materialIds.slice(resolvedSkip, resolvedSkip + resolvedLimit);

          if (materialIdChunk.length === 0) {
            setResults([]);
            setTotalResults(materialIds.length);
            setError(null);
            return;
          }

          const { q: _query, [skipKey]: _skip, ...apiParams } = processedQuery;
          const response = await axios.get(apiEndpoint, {
            params: {
              ...apiParams,
              material_ids: materialIdChunk,
            },
            paramsSerializer: serializeAxiosParams,
            headers: apiKey ? { 'X-Api-Key': apiKey } : undefined,
          });
          const nextResults = getResultsFromResponse(response.data);
          setResults(nextResults);
          setTotalResults(materialIds.length);
          setError(null);
          return;
        }

        const response = await axios.get(apiEndpoint, {
          params: processedQuery,
          paramsSerializer: serializeAxiosParams,
          headers: apiKey ? { 'X-Api-Key': apiKey } : undefined,
        });
        const nextResults = getResultsFromResponse(response.data);
        setResults(nextResults);
        setTotalResults(getTotalResultsFromResponse(response.data, nextResults, totalKey));
      } catch (caughtError) {
        setResults([]);
        setTotalResults(0);
        setError(caughtError instanceof Error ? caughtError.message : 'Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    },
    [
      apiEndpoint,
      apiEndpointParams,
      apiKey,
      currentColumns,
      defaultLimit,
      defaultSkip,
      fieldsKey,
      initializedFilterGroups,
      matscholarEndpoint,
      normalizedDefaultQuery,
      query,
      skipKey,
      limitKey,
      totalKey,
    ]
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
      const filterIsActivating = isNotEmpty(value);
      if (filterIsActivating) {
        overrides.forEach((override) => {
          delete nextQuery[override];
        });
      }
      if (!isNotEmpty(value)) {
        delete nextQuery[param];
      }
      delete nextQuery[skipKey];
      await applyQuery(nextQuery);
    },
    [applyQuery, query, skipKey]
  );

  const setFilterValues = useCallback(
    async (values: any[], params: string[], overrides: string[] = []) => {
      const nextQuery = { ...query };
      const filterIsActivating = values.some((v) => isNotEmpty(v));
      params.forEach((param, index) => {
        const value = values[index];
        if (isNotEmpty(value)) {
          nextQuery[param] = value;
        } else {
          delete nextQuery[param];
        }
      });
      if (filterIsActivating) {
        overrides.forEach((override) => {
          delete nextQuery[override];
        });
      }
      delete nextQuery[skipKey];
      await applyQuery(nextQuery);
    },
    [applyQuery, query, skipKey]
  );

  const removeFilters = useCallback(
    async (params: string[]) => {
      const nextQuery = { ...query };
      params.forEach((param) => {
        delete nextQuery[param];
      });
      delete nextQuery[skipKey];
      await applyQuery(nextQuery);
    },
    [applyQuery, query, skipKey]
  );

  const resetFilters = useCallback(async () => {
    await applyQuery(normalizedDefaultQuery);
  }, [applyQuery, normalizedDefaultQuery]);

  const setPage = useCallback(
    async (page: number) => {
      const resolvedLimit = Number(query[limitKey] ?? normalizedDefaultQuery[limitKey] ?? defaultLimit);
      const nextQuery = { ...query };
      const nextSkip = page > 1 ? (page - 1) * resolvedLimit : defaultSkip;

      if (nextSkip === normalizedDefaultQuery[skipKey]) {
        delete nextQuery[skipKey];
      } else {
        nextQuery[skipKey] = nextSkip;
      }

      await applyQuery(nextQuery);

      if (resultsRef?.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [applyQuery, defaultLimit, defaultSkip, limitKey, normalizedDefaultQuery, query, resultsRef, skipKey]
  );

  const setResultsPerPage = useCallback(
    async (pageSize: number) => {
      const nextQuery = { ...query };

      if (pageSize === normalizedDefaultQuery[limitKey]) {
        delete nextQuery[limitKey];
      } else {
        nextQuery[limitKey] = pageSize;
      }

      delete nextQuery[skipKey];
      await applyQuery(nextQuery);
    },
    [applyQuery, limitKey, normalizedDefaultQuery, query, skipKey]
  );

  const setSort = useCallback(
    async (sortField: string, sortAscending: boolean) => {
      const existingSort = (query[sortKey] ?? normalizedDefaultQuery[sortKey] ?? sortFields) as (
        | string
        | null
        | undefined
      )[];
      const nextSortFields = [...existingSort];
      nextSortFields[0] = `${sortAscending ? '' : '-'}${sortField}`;

      const nextQuery = {
        ...query,
        [sortKey]: nextSortFields,
      };

      delete nextQuery[skipKey];
      await applyQuery(nextQuery);
    },
    [applyQuery, normalizedDefaultQuery, query, skipKey, sortFields, sortKey]
  );

  const setSortField = useCallback(
    async (sortField: string) => {
      const activeSortField = ((query[sortKey] ?? normalizedDefaultQuery[sortKey] ?? sortFields)?.[0] ?? '') as string;
      const sortAscending = !String(activeSortField).startsWith('-');
      await setSort(sortField, sortAscending);
    },
    [normalizedDefaultQuery, query, setSort, sortFields, sortKey]
  );

  const setSortAscending = useCallback(
    async (sortAscending: boolean) => {
      const activeSortField = ((query[sortKey] ?? normalizedDefaultQuery[sortKey] ?? sortFields)?.[0] ?? '') as string;
      const normalizedSortField = String(activeSortField).replace(/^-/, '');

      if (!normalizedSortField) {
        return;
      }

      await setSort(normalizedSortField, sortAscending);
    },
    [normalizedDefaultQuery, query, setSort, sortFields, sortKey]
  );

  const setView = useCallback((nextView: SearchUIViewType) => {
    setCurrentView(nextView);
  }, []);

  const setColumns = useCallback((nextColumns: Column[]) => {
    setCurrentColumns(nextColumns);
  }, []);

  const removeFilter = useCallback(
    async (param: string) => {
      const nextQuery = { ...query };
      delete nextQuery[param];
      await applyQuery(nextQuery);
    },
    [applyQuery, query]
  );

  const setResultsRefValue = useCallback((nextResultsRef: RefObject<HTMLDivElement> | null) => {
    setResultsRef(nextResultsRef);
  }, []);

  const isMountedRef = useRef(false);

  useEffect(() => {
    if (isMountedRef.current) {
      return;
    }
    isMountedRef.current = true;

    const shouldSearchOnMount = searchOnMount ?? Boolean(apiEndpoint);
    if (shouldSearchOnMount) {
      void submitSearch(initialQuery);
    }
  }, [apiEndpoint, initialQuery, searchOnMount, submitSearch]);

  const setPropsRef = useRef(setProps);
  useEffect(() => {
    setPropsRef.current = setProps;
  }, [setProps]);

  useEffect(() => {
    setPropsRef.current({
      results,
      selectedRows,
    });
  }, [results, selectedRows]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const nextSearch = serializeSearchQuery(query, normalizedDefaultQuery, window.location.search);
    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
    if (window.location.search !== nextSearch) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [normalizedDefaultQuery, query]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handlePopState = () => {
      const nextQuery = parseSearchQuery(window.location.search, initializedFilterGroups, normalizedDefaultQuery);
      if (apiEndpoint) {
        void submitSearch(nextQuery);
      } else {
        setQuery(nextQuery);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [apiEndpoint, initializedFilterGroups, normalizedDefaultQuery, setQuery, submitSearch]);

  const legacyState = useMemo<SearchUILegacyState>(
    () => ({
      id,
      className,
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      matscholarEndpoint,
      apiEndpointParams,
      hasSortMenu,
      view: currentView,
      columns: currentColumns,
      filterGroups: initializedFilterGroups,
      activeFilters,
      resultLabel,
      conditionalRowStyles,
      selectableRows,
      selectedRows,
      defaultLimit,
      defaultSkip,
      sortKey,
      skipKey,
      limitKey,
      fieldsKey,
      totalKey,
      sortFields: (query[sortKey] ?? normalizedDefaultQuery[sortKey] ?? sortFields) as (string | null | undefined)[],
      resultsRef,
      results,
      totalResults,
      loading,
      error,
      debounce,
      searchBarValue,
      disableRichColumnHeaders,
      cardOptions,
      setProps,
    }),
    [
      activeFilters,
      apiEndpoint,
      apiEndpointParams,
      apiKey,
      autocompleteFormulaUrl,
      cardOptions,
      className,
      conditionalRowStyles,
      currentColumns,
      currentView,
      debounce,
      defaultLimit,
      defaultSkip,
      disableRichColumnHeaders,
      error,
      fieldsKey,
      hasSortMenu,
      id,
      initializedFilterGroups,
      limitKey,
      loading,
      matscholarEndpoint,
      normalizedDefaultQuery,
      query,
      resultLabel,
      results,
      resultsRef,
      searchBarValue,
      selectableRows,
      selectedRows,
      setProps,
      skipKey,
      sortFields,
      sortKey,
      totalKey,
      totalResults,
    ]
  );

  const value = useMemo<SearchUIContextValue>(
    () => ({
      id,
      className,
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      matscholarEndpoint,
      apiEndpointParams,
      hasSortMenu,
      view: currentView,
      columns: currentColumns,
      filterGroups: initializedFilterGroups,
      activeFilters,
      resultLabel,
      conditionalRowStyles,
      selectableRows,
      selectedRows,
      defaultLimit,
      defaultSkip,
      sortKey,
      skipKey,
      limitKey,
      fieldsKey,
      totalKey,
      sortFields: (query[sortKey] ?? normalizedDefaultQuery[sortKey] ?? sortFields) as (string | null | undefined)[],
      resultsRef,
      debounce,
      searchBarValue,
      state: legacyState,
      query,
      results,
      totalResults,
      loading,
      error,
      submitSearch,
      resetSearch,
      setQuery,
      setSelectedRows,
      setPage,
      setResultsPerPage,
      setSort,
      setSortField,
      setSortAscending,
      setView,
      setColumns,
      setResultsRef: setResultsRefValue,
      setFilterValue,
      setFilterValues,
      removeFilter,
      removeFilters,
      resetFilters,
    }),
    [
      activeFilters,
      apiEndpointParams,
      apiEndpoint,
      apiKey,
      autocompleteFormulaUrl,
      matscholarEndpoint,
      className,
      conditionalRowStyles,
      currentColumns,
      currentView,
      debounce,
      defaultLimit,
      defaultSkip,
      error,
      fieldsKey,
      hasSortMenu,
      id,
      initializedFilterGroups,
      limitKey,
      loading,
      normalizedDefaultQuery,
      legacyState,
      removeFilter,
      removeFilters,
      resetFilters,
      query,
      resetSearch,
      resultLabel,
      results,
      resultsRef,
      searchBarValue,
      selectableRows,
      selectedRows,
      setColumns,
      setFilterValue,
      setFilterValues,
      setPage,
      setQuery,
      setResultsPerPage,
      setResultsRefValue,
      setSelectedRows,
      setSort,
      setSortAscending,
      setSortField,
      setView,
      skipKey,
      sortFields,
      sortKey,
      submitSearch,
      totalKey,
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

export const useSearchUIContextActions = () => {
  const context = useSearchUIContext();
  return {
    setPage: context.setPage,
    setResultsPerPage: context.setResultsPerPage,
    setSort: context.setSort,
    setSortField: context.setSortField,
    setSortAscending: context.setSortAscending,
    setView: context.setView,
    setColumns: context.setColumns,
    setFilterValue: context.setFilterValue,
    setFilterValues: context.setFilterValues,
    removeFilter: context.removeFilter,
    removeFilters: context.removeFilters,
    resetFilters: context.resetFilters,
    setResultsRef: context.setResultsRef,
    setSelectedRows: context.setSelectedRows,
    submitSearch: context.submitSearch,
  };
};
