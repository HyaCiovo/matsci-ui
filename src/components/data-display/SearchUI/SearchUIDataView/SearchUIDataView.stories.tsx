import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataView } from './SearchUIDataView';
import { ColumnFormat, type Column } from '../types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: '/materials' },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
  },
];

const meta = {
  title: 'Search UI/SearchUIDataView',
  component: SearchUIDataView,
} satisfies Meta<typeof SearchUIDataView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: () => (
    <SearchUIContainer columns={columns} resultLabel="material" initialResults={[]} initialTotalResults={0}>
      <SearchUIDataView />
    </SearchUIContainer>
  ),
};

export const WithResults: Story = {
  render: () => (
    <SearchUIContainer
      columns={columns}
      resultLabel="material"
      initialResults={[{ material_id: 'mp-149', formula_pretty: 'Si' }]}
      initialTotalResults={1}
    >
      <SearchUIDataView />
    </SearchUIContainer>
  ),
};
