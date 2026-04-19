import type { Meta, StoryObj } from '@storybook/react';
import { BibFilter } from './BibFilter';

const meta = {
  title: 'Publications/BibFilter',
  component: BibFilter,
} satisfies Meta<typeof BibFilter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Bibjson: Story = {
  args: {
    format: 'bibjson',
    bibEntries: [
      { title: 'A Study', author: ['Lovelace, Ada'], year: 1843, journal: 'Test', doi: '10.1/a' },
      { title: 'Another Paper', author: ['Turing, Alan'], year: 1936, journal: 'Test', doi: '10.1/b' },
    ],
  },
};

