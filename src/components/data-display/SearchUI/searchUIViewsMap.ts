import type { ComponentType } from 'react';
import { SearchUIDataTable } from './SearchUIDataTable';
import { SearchUISynthesisRecipeCards } from './SearchUISynthesisRecipeCards';
import { SearchUIViewType } from './types';

export type SearchUIViewTypeMap = Partial<Record<SearchUIViewType, ComponentType>>;

export const searchUIViewsMap: SearchUIViewTypeMap = {
  [SearchUIViewType.TABLE]: SearchUIDataTable,
  [SearchUIViewType.SYNTHESIS]: SearchUISynthesisRecipeCards,
};
