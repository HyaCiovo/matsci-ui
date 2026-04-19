import type { Meta, StoryObj } from '@storybook/react';
import { CrossrefCard } from './CrossrefCard';

const meta = {
  title: 'Publications/CrossrefCard',
  component: CrossrefCard,
} satisfies Meta<typeof CrossrefCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithEntry: Story = {
  args: {
    crossrefEntry: {
      title: ['A Study'],
      author: [{ given: 'Ada', family: 'Lovelace' }],
      created: { 'date-parts': [[1843]] },
      'container-title': ['Test Journal'],
      DOI: '10.1234/example',
    },
  },
};

