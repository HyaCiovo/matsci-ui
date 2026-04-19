import type { Meta, StoryObj } from '@storybook/react';
import { ArrayChips } from './ArrayChips';

const meta = {
  title: 'Data Display/ArrayChips',
  component: ArrayChips,
} satisfies Meta<typeof ArrayChips>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    id: 'array-chips-story',
    chips: ['LiFePO4', 'mp-149', 'DOI'],
    chipLinks: ['/materials?formula=LiFePO4', 'https://next-gen.materialsproject.org/materials/mp-149', 'https://doi.org/10.1000/example'],
    chipTooltips: ['Formula query', 'Material link', 'DOI link'],
  },
};
