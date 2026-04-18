import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import { ColumnFormat, type Column } from '../SearchUI/types';

const records = [
  {
    material_id: 'mp-1006278',
    formula_pretty: 'AcEuAu2',
    volume: 117.0806,
    density: 10.9619,
    symmetry: {
      crystal_system: 'cubic',
    },
    is_stable: true,
  },
  {
    material_id: 'mp-1020592',
    formula_pretty: 'Sr4Li2Si4N8O',
    volume: 492.8624,
    density: 4.0751,
    symmetry: {
      crystal_system: 'tetragonal',
    },
    is_stable: true,
  },
  {
    material_id: 'mp-1029602',
    formula_pretty: 'Sc2(CN2)3',
    volume: 304.9836,
    density: 2.2865,
    symmetry: {
      crystal_system: 'trigonal',
    },
    is_stable: true,
  },
];

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      baseUrl: 'https://next-gen.materialsproject.org/materials',
      target: '_blank',
    },
    minWidth: '100px',
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
    minWidth: '100px',
  },
  {
    title: 'Crystal System',
    selector: 'symmetry.crystal_system',
  },
  {
    title: 'Is Stable',
    selector: 'is_stable',
    formatType: ColumnFormat.BOOLEAN,
  },
  {
    title: 'Volume',
    selector: 'volume',
    formatType: ColumnFormat.FIXED_DECIMAL,
    formatOptions: {
      decimals: 2,
    },
  },
  {
    title: 'Density',
    selector: 'density',
    formatType: ColumnFormat.FIXED_DECIMAL,
    formatOptions: {
      decimals: 2,
    },
  },
];

const meta = {
  title: 'Data Display/DataTable',
  component: DataTable,
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    disableRichColumnHeaders: true,
    data: records,
    columns,
  },
};

export const WithPagination: Story = {
  args: {
    ...Basic.args,
    pagination: true,
    data: Array.from({ length: 15 }, (_, index) => ({
      ...records[index % records.length],
      material_id: `mp-${1000 + index}`,
    })),
  },
};

export const WithExpandedPagination: Story = {
  args: {
    ...WithPagination.args,
    paginationIsExpanded: true,
  },
};

export const WithHeader: Story = {
  args: {
    ...WithPagination.args,
    hasHeader: true,
    resultLabel: 'material',
  },
};

export const WithoutColumnDefinitions: Story = {
  args: {
    disableRichColumnHeaders: true,
    data: records,
    pagination: true,
  },
};

export const WithSelectableRows: Story = {
  args: {
    ...WithPagination.args,
    selectableRows: true,
  },
};

export const WithSingleSelectableRows: Story = {
  args: {
    ...WithPagination.args,
    hasHeader: true,
    selectableRows: true,
    singleSelectableRows: true,
  },
};
