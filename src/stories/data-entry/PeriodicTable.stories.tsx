import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import {
  SelectableTable,
  SelectableTableProps,
} from '../../components/periodic-table/SelectableTable';
import { PeriodicContext } from '../../components/periodic-table/SelectableTable/PeriodicSelectionContext';
import { TableLayout } from '../../components/periodic-table/SelectableTable/types';

export default {
  component: SelectableTable,
  title: 'Data-Entry/PeriodicTable'
};

const Template: StoryFn<React.PropsWithChildren<SelectableTableProps>> = (args) => (
  <PeriodicContext>
    <SelectableTable {...args} />
  </PeriodicContext>
);

export const Basic = Template.bind({});
Basic.args = {
  forceTableLayout: TableLayout.MINI,
  className: 'max-750'
};
