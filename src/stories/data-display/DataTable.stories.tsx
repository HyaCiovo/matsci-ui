import type { Meta, StoryObj } from '@storybook/react';
import { Column } from '../../components/data-display/SearchUI/types';
import { DataTable } from '../../components/data-display/DataTable';
import materialsRecords from '../constants/materialsRecords.json';

const meta = {
  component: DataTable,
  title: 'Data-Display/DataTable'
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: 'LINK',
    formatOptions: {
      baseUrl: 'https://next-gen.materialsproject.org',
      target: '_blank'
    },
    minWidth: '100px'
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: 'FORMULA',
    minWidth: '100px'
  },
  {
    title: 'Crystal System',
    selector: 'symmetry.crystal_system'
  },
  {
    title: 'Is Stable',
    selector: 'is_stable',
    formatType: 'BOOLEAN'
  },
  {
    title: 'Volume',
    selector: 'volume',
    formatType: 'FIXED_DECIMAL',
    formatOptions: {
      decimals: 2
    }
  },
  {
    title: 'Density',
    selector: 'density',
    formatType: 'FIXED_DECIMAL',
    formatOptions: {
      decimals: 2
    }
  }
] as Column[];

export const Basic: Story = {
  args: {
    disableRichColumnHeaders: true,
    data: materialsRecords,
    columns: columns
  }
};

export const WithPagination: Story = {
  args: {
    ...Basic.args,
    columns: [...columns],
    pagination: true
  }
};

export const WithExpandedPagination: Story = {
  args: {
    ...WithPagination.args,
    columns: [...columns],
    paginationIsExpanded: true
  }
};

export const WithHeader: Story = {
  args: {
    ...WithPagination.args,
    columns: [...columns],
    hasHeader: true,
    resultLabel: 'material'
  }
};

export const WithoutColumnDefinitions: Story = {
  args: {
    disableRichColumnHeaders: true,
    data: materialsRecords,
    pagination: true
  },
  parameters: {
    docs: {
      description: {
        story: `
  You can generate a table without directly supplying column definitions.
  In this case, the columns will be inferred from the properties in the first object in the data array.
`
      }
    }
  }
};

export const WithSelectableRows: Story = {
  args: {
    ...WithPagination.args,
    columns: [...columns],
    selectableRows: true
  }
};

export const WithSingleSelectableRows: Story = {
  args: {
    ...WithPagination.args,
    columns: [...columns],
    hasHeader: true,
    selectableRows: true,
    singleSelectableRows: true
  }
};