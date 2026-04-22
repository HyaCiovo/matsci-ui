import type { Meta, StoryObj } from '@storybook/react';
import { BibFilter } from '../../components/publications/BibFilter';
import { BibFilterProps } from '../../components/publications/BibFilter/BibFilter';
import mpPapers from '../constants/mp-papers.json';

const meta = {
  component: BibFilter,
  title: 'Publications/BibFilter'
} satisfies Meta<typeof BibFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromDOI: Story = {
  args: {
    bibEntries: mpPapers.slice(1, 10),
    resultClassName: 'box',
    preventOpenAccessFetch: true
  }
};