import type { Meta, StoryObj } from '@storybook/react';
import { StandalonePeriodicComponent } from './StandalonePeriodicComponent';

const meta = {
  title: 'Periodic Table/StandalonePeriodicComponent',
  component: StandalonePeriodicComponent,
} satisfies Meta<typeof StandalonePeriodicComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    size: 64,
    element: 'Fe',
    disabled: false,
    enabled: true,
    hidden: false,
  },
};
