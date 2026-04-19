// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { ReactGraphComponent } from './ReactGraphComponent';

const meta = {
  title: 'Crystal Toolkit/ReactGraphComponent',
  component: ReactGraphComponent,
} satisfies Meta<typeof ReactGraphComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    graph: {
      nodes: [
        { id: 1, label: 'Node A' },
        { id: 2, label: 'Node B' },
      ],
      edges: [{ from: 1, to: 2 }],
    },
    options: {
      height: '320px',
      physics: { stabilization: true },
    },
  },
};
