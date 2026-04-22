import type { Meta, StoryObj } from '@storybook/react';
import { DualRangeSlider } from '../../components/data-entry/DualRangeSlider';

const meta = {
  component: DualRangeSlider,
  title: 'Data-Entry/DualRangeSlider'
} satisfies Meta<typeof DualRangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    domain: [0, 100],
    step: 1,
    value: [10, 50]
  }
};

export const WithoutDebounce: Story = {
  args: {
    ...Basic.args,
    debounce: 0
  }
};

export const WithMoreTicks: Story = {
  args: {
    ...Basic.args,
    step: 10
  }
};