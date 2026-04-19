import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PeriodicContext } from './PeriodicSelectionContext';
import { SelectableTable, type SelectableTableProps } from './SelectableTable';
import { TableLayout } from './types';

const meta = {
  title: 'Periodic Table/SelectableTable',
  component: SelectableTable,
} satisfies Meta<typeof SelectableTable>;

export default meta;

type Story = StoryObj<typeof meta>;

function SelectableTableStory(args: SelectableTableProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>(args.enabledElements ?? []);
  const [disabledElements, setDisabledElements] = useState<string[]>(args.disabledElements ?? []);

  return (
    <PeriodicContext enabledElements={selectedElements} disabledElements={disabledElements}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <strong>Selected elements:</strong> {selectedElements.join(', ') || 'none'}
        </div>
        <SelectableTable
          {...args}
          enabledElements={selectedElements}
          disabledElements={disabledElements}
          onStateChange={(nextState) => {
            setSelectedElements(nextState.enabledElements);
            setDisabledElements(nextState.disabledElements);
            args.onStateChange?.(nextState);
          }}
        />
      </div>
    </PeriodicContext>
  );
}

export const Basic: Story = {
  args: {
    maxElementSelectable: 5,
    forceTableLayout: TableLayout.MINI,
  },
  render: (args) => <SelectableTableStory {...args} />,
};

export const WithPreselectedElements: Story = {
  args: {
    maxElementSelectable: 5,
    forceTableLayout: TableLayout.MINI,
    enabledElements: ['Li', 'Fe'],
  },
  render: (args) => <SelectableTableStory {...args} />,
};
