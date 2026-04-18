import type { Meta, StoryObj } from '@storybook/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataHeader } from './SearchUIDataHeader';
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
