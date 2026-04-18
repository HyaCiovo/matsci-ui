import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataTable } from './SearchUIDataTable';
import { ColumnFormat, type Column } from '../types';

const results = [
  {
    material_id: 'mp-149',
    formula_pretty: 'Si',
    symmetry: { crystal_system: 'cubic' },
  },
  {
    material_id: 'mp-13',
    formula_pretty: 'Fe2O3',
    symmetry: { crystal_system: 'trigonal' },
  },
  {
    material_id: 'mp-390',
    formula_pretty: 'LiFePO4',
    symmetry: { crystal_system: 'orthorhombic' },
  },
];

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      baseUrl: '/materials',
    },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
  },
  {
    title: 'Crystal System',
    selector: 'symmetry.crystal_system',
  },
];

const meta = {
  title: 'Search UI/SearchUIDataTable',
  component: SearchUIDataTable,
} satisfies Meta<typeof SearchUIDataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <SearchUIContainer columns={columns} resultLabel="material" initialResults={results} initialTotalResults={3}>
      <SearchUIDataTable />
    </SearchUIContainer>
  ),
};
