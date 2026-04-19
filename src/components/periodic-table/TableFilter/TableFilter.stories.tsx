import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PeriodicContext } from '../SelectableTable/PeriodicSelectionContext';
import { SelectableTable } from '../SelectableTable/SelectableTable';
import { TableLayout } from '../SelectableTable/types';
import { TableFilter } from './TableFilter';

const meta = {
  title: 'Periodic Table/TableFilter',
  component: TableFilter,
} satisfies Meta<typeof TableFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

function TableFilterStory() {
  const [selectedElements, setSelectedElements] = useState<string[]>(['Li', 'Fe']);

  return (
    <PeriodicContext enabledElements={selectedElements}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <TableFilter />
        <div>
          <strong>Selected elements:</strong> {selectedElements.join(', ') || 'none'}
        </div>
        <SelectableTable
          className="box"
          enabledElements={selectedElements}
          maxElementSelectable={5}
          forceTableLayout={TableLayout.MINI}
          onStateChange={(nextState) => setSelectedElements(nextState.enabledElements)}
        />
      </div>
    </PeriodicContext>
  );
}

export const Basic: Story = {
  render: () => <TableFilterStory />,
};
