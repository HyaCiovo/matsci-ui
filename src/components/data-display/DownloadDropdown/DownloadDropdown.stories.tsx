import type { Meta, StoryObj } from '@storybook/react';
import { DownloadDropdown } from './DownloadDropdown';

const meta = {
  title: 'Data Display/DownloadDropdown',
  component: DownloadDropdown,
} satisfies Meta<typeof DownloadDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    data: [
      { material_id: 'mp-149', formula_pretty: 'Si' },
      { material_id: 'mp-13', formula_pretty: 'Fe2O3' },
    ],
    filename: 'materials',
    children: 'Download',
  },
};
