import type { Meta, StoryObj } from '@storybook/react';
import { RangeSlider } from '../../components/data-entry/RangeSlider';

const meta = {
  component: RangeSlider,
  title: 'Data-Entry/RangeSlider'
} satisfies Meta<typeof RangeSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    domain: [0, 100],
    step: 1,
    value: 10
  }
};

export const WithoutDebounce: Story = {
  args: {
    ...Basic.args,
    debounce: 0
  }
};

export const WithTicksOnLimitsOnly: Story = {
  args: {
    ...Basic.args,
    ticks: 2
  }
};

export const WithLogScale: Story = {
  args: {
    ...Basic.args,
    domain: [-2, 3],
    value: -1,
    step: 0.01,
    isLogScale: true
  }
};