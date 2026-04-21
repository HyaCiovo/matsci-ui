import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import mofColumns from '../constants/mofColumns.json';
import mofFilterGroups from '../constants/mofFilterGroups.json';
import { STORYBOOK_API_KEY } from '../constants';
import {
  Column,
  FilterGroup,
  SearchUIContainerProps
} from '../../components/data-display/SearchUI/types';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUIFilters } from '../../components/data-display/SearchUI/SearchUIFilters';

export default {
  component: SearchUIFilters,
  title: 'Search UI/SearchUIFilters'
};

export const Basic: StoryFn<SearchUIContainerProps> = (args) => (
  <SearchUIContainer
    disableRichColumnHeaders
    resultLabel="material"
    columns={columns as Column[]}
    filterGroups={filterGroups as FilterGroup[]}
    apiEndpoint="https://api.materialsproject.org/summary/"
    autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
    apiKey={STORYBOOK_API_KEY}
  >
    <SearchUIFilters />
  </SearchUIContainer>
);

Basic.storyName = 'SearchUIFilters';
