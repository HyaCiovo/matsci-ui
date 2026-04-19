import type { Meta, StoryObj } from '@storybook/react';
import { DataCard } from './DataCard';

const meta = {
  title: 'Data Display/DataCard',
  component: DataCard,
} satisfies Meta<typeof DataCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    data: {
      title: 'LiFePO4',
      subtitle: 'Olive cathode',
      density: '3.6 g/cm3',
      crystal_system: 'Orthorhombic',
      band_gap: '3.8 eV',
      spacegroup: 'Pnma',
    },
    levelOneKey: 'title',
    levelTwoKey: 'subtitle',
    levelThreeKeys: [
      { key: 'density', label: 'Density' },
      { key: 'crystal_system', label: 'Crystal System' },
      { key: 'band_gap', label: 'Band Gap' },
      { key: 'spacegroup', label: 'Space Group' },
    ],
  },
};
