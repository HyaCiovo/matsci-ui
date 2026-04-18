import type { Meta, StoryObj } from '@storybook/react';
import { Formula } from './Formula';

const meta = {
  title: 'Data Display/Formula',
  component: Formula,
  args: {
    children: 'Li4Ti5O12',
  },
} satisfies Meta<typeof Formula>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Decimal: Story = {
  args: {
    children: 'Y0.95VO4',
  },
};
