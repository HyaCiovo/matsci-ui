import type { Meta, StoryObj } from '@storybook/react';
import ReactGraphComponent, { type ReactGraphComponentProps } from '../../components/crystal-toolkit/graph.component';
import { DEFAULT_OPTIONS, GRAPH } from '../constants';

const meta = {
  component: ReactGraphComponent,
  title: 'Crystal Toolkit/ReactGraphComponent'
} satisfies Meta<typeof ReactGraphComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    graph: GRAPH,
    options: DEFAULT_OPTIONS
  }
};