import type { Meta, StoryObj } from '@storybook/react';
import { BibCard } from '../../components/publications/BibCard';
import { BibCardProps } from '../../components/publications/BibCard/BibCard';

const meta = {
  component: BibCard,
  title: 'Publications/BibCard'
} satisfies Meta<typeof BibCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    className: 'box',
    title:
      'Orientation-Dependent Properties of Epitaxially Strained Perovskite Oxide Thin Films: Insights from First-Principles Calculations',
    author: ['Angsten, Thomas', 'Martin, Lane W.', 'Asta, Mark'],
    journal: 'Physical Review B',
    doi: '10.1103/PhysRevB.95.174110',
    year: '2017'
  }
};