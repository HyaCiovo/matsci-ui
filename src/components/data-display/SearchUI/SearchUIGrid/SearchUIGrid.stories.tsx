import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIGrid } from './SearchUIGrid';
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

const results = [
  { material_id: 'mp-149', formula_pretty: 'Si' },
  { material_id: 'mp-13', formula_pretty: 'Fe2O3' },
];

const meta = {
  title: 'Search UI/SearchUIGrid',
  component: SearchUIGrid,
} satisfies Meta<typeof SearchUIGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <SearchUIContainer columns={columns} resultLabel="material" initialResults={results} initialTotalResults={2}>
      <SearchUIGrid />
    </SearchUIContainer>
  ),
};

export const WithFiltersSlot: Story = {
  render: () => (
    <SearchUIContainer columns={columns} resultLabel="material" initialResults={results} initialTotalResults={2}>
      <SearchUIGrid
        filtersContent={
          <div className="box">
            <strong>Filters Placeholder</strong>
            <p className="mt-2">This slot will be replaced by `SearchUIFilters` in a later round.</p>
          </div>
        }
      />
    </SearchUIContainer>
  ),
};
