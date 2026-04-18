import type { Meta, StoryObj } from '@storybook/react';
import { DualRangeSlider } from './DualRangeSlider';

const meta = {
  title: 'Data Entry/DualRangeSlider',
  component: DualRangeSlider,
} satisfies Meta<typeof DualRangeSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    domain: [0, 10],
    valueMin: 2,
    valueMax: 8,
    step: 0.5,
  },
};
