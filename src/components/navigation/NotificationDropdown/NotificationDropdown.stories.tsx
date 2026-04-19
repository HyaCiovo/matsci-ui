import type { Meta, StoryObj } from '@storybook/react';
import { NotificationDropdown } from './NotificationDropdown';

const meta = {
  title: 'Navigation/NotificationDropdown',
  component: NotificationDropdown,
} satisfies Meta<typeof NotificationDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    notifyLevel: 'message',
    hasUnread: true,
    link: 'https://materialsproject.org',
    items: [
      {
        id: 'n1',
        label: 'Maintenance notice',
        header: 'Maintenance',
        content: 'The service will be unavailable for **30 minutes**.',
      },
      {
        id: 'n2',
        label: 'New feature',
        header: 'Feature update',
        content: 'A new dashboard is now available.',
      },
    ],
  },
};
