import type { Meta, StoryObj } from '@storybook/react';
import ReactGraphComponent, { type ReactGraphComponentProps } from '../../components/crystal-toolkit/graph.component';
import { DEFAULT_OPTIONS, GRAPH } from '../constants';

const meta = {
  component: ReactGraphComponent,
  title: 'Crystal Toolkit/ReactGraphComponent',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ReactGraphComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const STORY_CONTAINER_STYLE = {
  width: 'min(1100px, 100%)',
  height: '720px',
  padding: '24px',
  margin: '0 auto',
  boxSizing: 'border-box' as const
};

export const Basic: Story = {
  args: {
    graph: GRAPH,
    options: DEFAULT_OPTIONS
  },
  render: (args: ReactGraphComponentProps) => (
    <div style={STORY_CONTAINER_STYLE}>
      <ReactGraphComponent {...args} />
    </div>
  )
};
