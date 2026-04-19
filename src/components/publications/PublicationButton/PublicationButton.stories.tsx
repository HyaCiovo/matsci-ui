import type { Meta, StoryObj } from '@storybook/react';
import { PublicationButton } from './PublicationButton';

const meta = {
  title: 'Publications/PublicationButton',
  component: PublicationButton,
} satisfies Meta<typeof PublicationButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    doi: '10.48550/arXiv.1706.03762',
  },
};

export const CompactWithTooltip: Story = {
  args: {
    doi: '10.48550/arXiv.1706.03762',
    compact: true,
    showTooltip: true,
  },
};

