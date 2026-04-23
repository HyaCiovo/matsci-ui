import type { Meta, StoryObj } from '@storybook/react';
import { BibjsonCard } from '../../components/publications/BibjsonCard';
import { BibjsonCardProps } from '../../components/publications/BibjsonCard/BibjsonCard';

const meta = {
  component: BibjsonCard,
  title: 'Publications/BibjsonCard'
} satisfies Meta<typeof BibjsonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    className: 'ms-box',
    bibjsonEntry: {
      journal: 'Physical Review Letters',
      year: '2010',
      doi: '10.1103/PhysRevLett.105.196403',
      author: ['Chan, M. K Y', 'Ceder, G.'],
      title: 'Efficient Band Gap Prediction for Solids'
    }
  }
};
