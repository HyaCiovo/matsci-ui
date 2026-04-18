import type { Meta, StoryObj } from '@storybook/react';
import { ThreeStateBooleanSelect } from './ThreeStateBooleanSelect';

const meta = {
  title: 'Data Entry/ThreeStateBooleanSelect',
  component: ThreeStateBooleanSelect,
} satisfies Meta<typeof ThreeStateBooleanSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    value: true,
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
};
