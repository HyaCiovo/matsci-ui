import type { Meta, StoryObj } from '@storybook/react';
import { Formula } from '../../components/data-display/Formula';

const meta = {
  component: Formula,
  title: 'Data-Display/Formula'
} satisfies Meta<typeof Formula>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'MnO2'
  }
};

export const WithDecimals: Story = {
  args: {
    children: 'Ba0.98La0.02SnO3'
  }
};

export const WithVariableRanges: Story = {
  args: {
    children: 'Ba1-xEuxSi2O2N2'
  }
};