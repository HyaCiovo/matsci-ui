import type { ReactNode } from 'react';

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
  query: Record<string, any>;
  results: any[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  submitSearch: (nextQuery?: Record<string, any>) => Promise<void>;
  resetSearch: () => void;
  setQuery: (nextQuery: Record<string, any>) => void;
}

export interface SearchUIContainerProps {
  apiEndpoint?: string;
  apiKey?: string;
  autocompleteFormulaUrl?: string;
  defaultQuery?: Record<string, any>;
  searchOnMount?: boolean;
  children?: ReactNode;
}
