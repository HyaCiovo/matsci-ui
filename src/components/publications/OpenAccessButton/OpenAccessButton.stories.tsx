import type { Meta, StoryObj } from '@storybook/react';
import { OpenAccessButton } from './OpenAccessButton';

const meta = {
  title: 'Publications/OpenAccessButton',
  component: OpenAccessButton,
} satisfies Meta<typeof OpenAccessButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDoi: Story = {
  args: {
    doi: '10.48550/arXiv.1706.03762',
  },
};

export const Compact: Story = {
  args: {
    doi: '10.48550/arXiv.1706.03762',
    compact: true,
  },
};

