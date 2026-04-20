import type { CSSProperties, ReactNode, RefObject } from 'react';

export enum FilterType {
  SLIDER = 'SLIDER',
  MATERIALS_INPUT = 'MATERIALS_INPUT',
  TEXT_INPUT = 'TEXT_INPUT',
  SELECT = 'SELECT',
  THREE_STATE_BOOLEAN_SELECT = 'THREE_STATE_BOOLEAN_SELECT',
  SELECT_SPACEGROUP_SYMBOL = 'SELECT_SPACEGROUP_SYMBOL',
  SELECT_SPACEGROUP_NUMBER = 'SELECT_SPACEGROUP_NUMBER',
  SELECT_CRYSTAL_SYSTEM = 'SELECT_CRYSTAL_SYSTEM',
  SELECT_POINTGROUP = 'SELECT_POINTGROUP',
  CHECKBOX_LIST = 'CHECKBOX_LIST',
}

export interface Filter {
  name: string;
  type: FilterType;
  params: string[];
  active?: boolean;
  conversionFactor?: number;
  units?: string;
  props?: Record<string, any>;
  tooltip?: string;
  overrides?: string[];
  isSearchBarField?: boolean;
  makeLowerCase?: boolean;
  hidden?: boolean;
}

export interface FilterGroup {
  name: string;
  expanded?: boolean;
  alwaysExpanded?: boolean;
  filters: Filter[];
}

export interface ActiveFilter {
  name: string;
  value: any;
  params: string[];
  defaultValue?: any;
  conversionFactor?: number;
  searchParams?: SearchParam[];
  isSearchBarField?: boolean;
}

export interface SearchParam {
  field: string;
  value: any;
}

export interface SearchParams {
  [id: string]: any;
}

export type FilterValues = Partial<Record<string, any>>;

export enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL',
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES',
  FORMULA = 'FORMULA',
  LINK = 'LINK',
  ARRAY = 'ARRAY',
  BOOLEAN = 'BOOLEAN',
  BOOLEAN_CLASS = 'BOOLEAN_CLASS',
  SPACEGROUP_SYMBOL = 'SPACEGROUP_SYMBOL',
  POINTGROUP = 'POINTGROUP',
  TAG = 'TAG',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  DICT = 'DICT',
  CONTRIBS_FILES_DOWNLOAD = 'CONTRIBS_FILES_DOWNLOAD',
  PUBLICATION = 'PUBLICATION',
}

export interface Column {
  title: string | number;
  selector: string;
  render?: (row: any, column: Column) => ReactNode;
  formatType?: ColumnFormat;
  formatOptions?: Record<string, any>;
  units?: string;
  conversionFactor?: number;
  hidden?: boolean;
  isTop?: boolean;
  isBottom?: boolean;
  omit?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  tooltip?: string;
  cellTooltip?: string;
  align?: 'left' | 'center' | 'right';
  right?: boolean;
  center?: boolean;
  sortable?: boolean;
  sortIconPosition?: 'left' | 'right';
  fixed?: boolean | 'left' | 'right';
  style?: Record<string, any>;
  headerStyle?: CSSProperties;
  excludeFromColumnsSelector?: boolean;
  hideName?: boolean;
  nameString?: string;
  onChange?: (row: any) => void;
}

export interface ConditionalRowStyle {
  selector: string;
  value: any;
  condition: 'lt' | 'gt' | 'eq';
  style: Record<string, any>;
}

export interface SearchUIInputTypeConfig {
  field: string;
}

export type SearchUIAllowedInputTypesMap = Partial<Record<string, SearchUIInputTypeConfig>>;

export enum SearchUIViewType {
  TABLE = 'table',
  CARDS = 'cards',
  SYNTHESIS = 'synthesis',
}

export interface SearchUILegacyState {
  id?: string;
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  matscholarEndpoint?: string;
  apiEndpointParams: Record<string, any>;
  hasSortMenu: boolean;
  view: SearchUIViewType;
  columns: Column[];
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  resultLabel: string;
  conditionalRowStyles: ConditionalRowStyle[];
  selectableRows: boolean;
  selectedRows: any[];
  defaultLimit: number;
  defaultSkip: number;
  sortKey: string;
  skipKey: string;
  limitKey: string;
  fieldsKey: string;
  totalKey: string;
  sortFields: (string | null | undefined)[];
  resultsRef: RefObject<HTMLDivElement> | null;
  results: any[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  debounce: number;
  searchBarValue: string;
  disableRichColumnHeaders?: boolean;
  cardOptions?: any;
  setProps: (value: any) => any;
}

export interface SearchUIContextValue {
  id?: string;
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  matscholarEndpoint?: string;
  apiEndpointParams: Record<string, any>;
  hasSortMenu: boolean;
  view: SearchUIViewType;
  columns: Column[];
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  resultLabel: string;
  conditionalRowStyles: ConditionalRowStyle[];
  selectableRows: boolean;
  selectedRows: any[];
  defaultLimit: number;
  defaultSkip: number;
  sortKey: string;
  skipKey: string;
  limitKey: string;
  fieldsKey: string;
  totalKey: string;
  sortFields: (string | null | undefined)[];
  resultsRef: RefObject<HTMLDivElement> | null;
  debounce: number;
  searchBarValue: string;
  state: SearchUILegacyState;
  query: Record<string, any>;
  results: any[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  submitSearch: (nextQuery?: Record<string, any>) => Promise<void>;
  resetSearch: () => void;
  setQuery: (nextQuery: Record<string, any>) => void;
  setSelectedRows: (rows: any[]) => void;
  setPage: (page: number) => Promise<void>;
  setResultsPerPage: (pageSize: number) => Promise<void>;
  setSort: (sortField: string, sortAscending: boolean) => Promise<void>;
  setSortField: (sortField: string) => Promise<void>;
  setSortAscending: (sortAscending: boolean) => Promise<void>;
  setView: (view: SearchUIViewType) => void;
  setColumns: (columns: Column[]) => void;
  setResultsRef: (resultsRef: RefObject<HTMLDivElement> | null) => void;
  setFilterValue: (value: any, param: string, overrides?: string[]) => Promise<void>;
  setFilterValues: (values: any[], params: string[], overrides?: string[]) => Promise<void>;
  removeFilter: (param: string) => Promise<void>;
  removeFilters: (params: string[]) => Promise<void>;
  resetFilters: () => Promise<void>;
}

export interface SearchState extends SearchUIContainerProps {
  setProps: (value: any) => any;
  sortFields: (string | null | undefined)[];
  sortKey: string;
  skipKey: string;
  limitKey: string;
  fieldsKey: string;
  totalKey: string;
  defaultLimit?: number;
  defaultSkip?: number;
  totalResults?: number;
  activeFilters?: ActiveFilter[];
  loading?: boolean;
  error?: string | null;
  searchBarValue?: string;
  resultsRef?: RefObject<HTMLDivElement> | null;
}

export interface SearchContextValue {
  state: SearchState;
  query: SearchParams;
}

export interface SearchUIContainerProps {
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
  children?: ReactNode;
}
