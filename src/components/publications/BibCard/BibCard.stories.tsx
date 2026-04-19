import type { Meta, StoryObj } from '@storybook/react';
import { BibCard } from './BibCard';

const meta = {
  title: 'Publications/BibCard',
  component: BibCard,
} satisfies Meta<typeof BibCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'A Study on Something',
    author: [{ given: 'Ada', family: 'Lovelace' }],
    journal: 'Test Journal',
    year: 1843,
    doi: '10.1234/example',
  },
};

