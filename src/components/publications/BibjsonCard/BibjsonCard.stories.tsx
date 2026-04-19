import type { Meta, StoryObj } from '@storybook/react';
import { BibjsonCard } from './BibjsonCard';

const meta = {
  title: 'Publications/BibjsonCard',
  component: BibjsonCard,
} satisfies Meta<typeof BibjsonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    bibjsonEntry: {
      title: 'A Study',
      author: ['Lovelace, Ada'],
      year: 1843,
      journal: 'Test Journal',
      doi: '10.1234/example',
    },
  },
};

