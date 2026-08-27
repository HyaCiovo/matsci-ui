import type { Meta, StoryObj } from '@storybook/react';
import {
  SelectableTable,
  SelectableTableProps,
} from '../../components/periodic-table/SelectableTable';
import { PeriodicContext } from '../../components/periodic-table/SelectableTable/PeriodicSelectionContext';
import { TableLayout } from '../../components/periodic-table/SelectableTable/types';

const meta = {
  component: SelectableTable,
  title: 'Data-Entry/PeriodicTable'
} satisfies Meta<typeof SelectableTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    maxElementSelectable: 5
  },
  render: () => (
    <PeriodicContext>
      <SelectableTable
        forceTableLayout={TableLayout.MINI}
        className="ms-max-750"
        maxElementSelectable={5}
      />
    </PeriodicContext>
  )
};

export const WithReferenceAxes: Story = {
  args: {
    maxElementSelectable: 5,
    showAxes: true,
  },
  render: (args) => (
    <PeriodicContext>
      <SelectableTable
        {...args}
        forceTableLayout={TableLayout.FULL}
        className="ms-max-750"
      />
    </PeriodicContext>
  )
};
