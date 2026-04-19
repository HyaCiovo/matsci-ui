import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    currentApp: 'mat-explore',
    layout: 'vertical',
    onAppSelected: () => undefined,
    width: 96,
  },
};

export const Horizontal: Story = {
  args: {
    currentApp: 'phase-diagram',
    layout: 'horizontal',
    onAppSelected: () => undefined,
    height: 96,
  },
};
