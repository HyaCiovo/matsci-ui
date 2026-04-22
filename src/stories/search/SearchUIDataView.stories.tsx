import type { Meta, StoryObj } from '@storybook/react';
import columns from '../constants/columns.json';
import filterGroups from '../constants/filterGroups.json';
import { STORYBOOK_API_KEY } from '../constants';
import {
  Column,
  FilterGroup,
  SearchUIContainerProps
} from '../../components/data-display/SearchUI/types';
import { SearchUIContainer } from '../../components/data-display/SearchUI/SearchUIContainer';
import { SearchUIDataView } from '../../components/data-display/SearchUI/SearchUIDataView';

const meta = {
  component: SearchUIDataView,
  title: 'Search UI/SearchUIDataView'
} satisfies Meta<typeof SearchUIDataView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <SearchUIContainer
      disableRichColumnHeaders
      resultLabel="material"
      columns={columns as Column[]}
      filterGroups={filterGroups as FilterGroup[]}
      apiEndpoint="https://api.materialsproject.org/summary/"
      autocompleteFormulaUrl="https://api.materialsproject.org/materials/formula_autocomplete/"
      apiKey={STORYBOOK_API_KEY}
    >
      <SearchUIDataView />
    </SearchUIContainer>
  )
};