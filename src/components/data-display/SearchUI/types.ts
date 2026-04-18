import type { ReactNode } from 'react';

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
  isSearchBarField?: boolean;
}

export enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL',
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES',
  FORMULA = 'FORMULA',
  LINK = 'LINK',
  BOOLEAN = 'BOOLEAN',
  RADIO = 'RADIO',
}

export interface Column {
  title: string | number;
  selector: string;
  formatType?: ColumnFormat;
  formatOptions?: Record<string, any>;
  units?: string;
  conversionFactor?: number;
  hidden?: boolean;
  omit?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  tooltip?: string;
  right?: boolean;
  center?: boolean;
  sortable?: boolean;
  style?: Record<string, any>;
  excludeFromColumnsSelector?: boolean;
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

export interface SearchUIContextValue {
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  columns: Column[];
  filterGroups: FilterGroup[];
  activeFilters: ActiveFilter[];
  resultLabel: string;
  conditionalRowStyles: ConditionalRowStyle[];
  selectableRows: boolean;
  selectedRows: any[];
  query: Record<string, any>;
  results: any[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  submitSearch: (nextQuery?: Record<string, any>) => Promise<void>;
  resetSearch: () => void;
  setQuery: (nextQuery: Record<string, any>) => void;
  setSelectedRows: (rows: any[]) => void;
  setFilterValue: (value: any, param: string, overrides?: string[]) => Promise<void>;
  setFilterValues: (values: any[], params: string[], overrides?: string[]) => Promise<void>;
  removeFilters: (params: string[]) => Promise<void>;
  resetFilters: () => Promise<void>;
}

export interface SearchUIContainerProps {
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
  children?: ReactNode;
}
