import type { ComponentType } from 'react';
import { SearchUIDataCards } from './SearchUIDataCards';
import { SearchUIDataTable } from './SearchUIDataTable';
import { SearchUISynthesisRecipeCards } from './SearchUISynthesisRecipeCards';
import { SearchUIViewType } from './types';

export type SearchUIViewTypeMap = Partial<Record<SearchUIViewType, ComponentType>>;

export const searchUIViewsMap: SearchUIViewTypeMap = {
  [SearchUIViewType.CARDS]: SearchUIDataCards,
  [SearchUIViewType.TABLE]: SearchUIDataTable,
  [SearchUIViewType.SYNTHESIS]: SearchUISynthesisRecipeCards,
};
