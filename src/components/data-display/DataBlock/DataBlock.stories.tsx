import type { Meta, StoryObj } from '@storybook/react';
import { ColumnFormat, type Column } from '../SearchUI/types';
import { DataBlock } from './DataBlock';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      baseUrl: 'https://next-gen.materialsproject.org/materials',
      target: '_blank',
    },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
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
    title: 'Description',
    selector: 'description',
    isBottom: true,
  },
];

const meta = {
  title: 'Data Display/DataBlock',
  component: DataBlock,
} satisfies Meta<typeof DataBlock>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    data: {
      material_id: 'mp-19395',
      formula_pretty: 'MnO2',
      volume: 143.9321176,
      description: 'Ab-initio electronic transport database for inorganic materials',
    },
    columns,
  },
};

export const WithFooter: Story = {
  args: {
    ...Basic.args,
    footer: 'Footer content',
    iconClassName: 'square',
    iconTooltip: 'Square',
  },
};
