import type { Meta, StoryObj } from '@storybook/react';
import { DownloadButton } from './DownloadButton';

const meta = {
  title: 'Data Display/DownloadButton',
  component: DownloadButton,
  args: {
    children: 'Download JSON',
    data: { formula: 'Li4Ti5O12', id: 'mp-1' },
  },
} satisfies Meta<typeof DownloadButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Json: Story = {};

export const Csv: Story = {
  args: {
    children: 'Download CSV',
    filetype: 'csv',
    data: [
      { material_id: 'mp-1', formula: 'Li4Ti5O12' },
      { material_id: 'mp-2', formula: 'Fe2O3' },
    ],
  },
};
