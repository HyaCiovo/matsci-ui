import type { Meta, StoryObj } from '@storybook/react';
import { NavbarDropdown } from './NavbarDropdown';

const meta = {
  title: 'Navigation/NavbarDropdown',
  component: NavbarDropdown,
} satisfies Meta<typeof NavbarDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'API', href: '/api' },
    ],
    children: 'Resources',
  },
};
