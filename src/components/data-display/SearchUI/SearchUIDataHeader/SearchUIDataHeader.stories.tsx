import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataHeader } from './SearchUIDataHeader';
import { SearchUIDataView } from '../SearchUIDataView';
import { ColumnFormat, type Column } from '../types';

const columns: Column[] = [
  { title: 'Material ID', selector: 'material_id', formatType: ColumnFormat.LINK, formatOptions: { baseUrl: '/materials' } },
  { title: 'Formula', selector: 'formula_pretty', formatType: ColumnFormat.FORMULA },
];

const meta = {
  title: 'Search UI/SearchUIDataHeader',
  component: SearchUIDataHeader,
} satisfies Meta<typeof SearchUIDataHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <SearchUIContainer
      columns={columns}
      resultLabel="material"
      initialResults={[{ material_id: 'mp-149', formula_pretty: 'Si' }]}
      initialTotalResults={54321}
    >
      <SearchUIDataHeader />
    </SearchUIContainer>
  ),
};

export const WithViewSwitcher: Story = {
  render: () => (
    <SearchUIContainer
      columns={columns}
      resultLabel="recipe"
      initialResults={[
        { material_id: 'mp-149', formula_pretty: 'Si', doi: '10.1000/example-1' },
        { material_id: 'mp-13', formula_pretty: 'Fe2O3', doi: '10.1000/example-2' },
      ]}
      initialTotalResults={2}
    >
      <SearchUIDataHeader />
      <SearchUIDataView />
    </SearchUIContainer>
  ),
};
