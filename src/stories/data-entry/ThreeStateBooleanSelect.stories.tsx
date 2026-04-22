import type { Meta, StoryObj } from '@storybook/react';
import { ThreeStateBooleanSelect } from '../../components/data-entry/ThreeStateBooleanSelect';
import { ThreeStateBooleanSelectProps } from '../../components/data-entry/ThreeStateBooleanSelect/ThreeStateBooleanSelect';

const meta = {
  component: ThreeStateBooleanSelect,
  title: 'Data-Entry/ThreeStateBooleanSelect'
} satisfies Meta<typeof ThreeStateBooleanSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: true,
    options: [
      {
        label: 'Yes',
        value: true
      },
      {
        label: 'No',
        value: false
      }
    ]
  }
};