import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    brandItem: {
      label: 'Materials Project',
      href: '/',
    },
    items: [
      { label: 'Docs', href: '/docs' },
      {
        label: 'Resources',
        items: [
          { label: 'API', href: '/api' },
          { label: 'Blog', href: 'https://materialsproject.org' },
        ],
      },
    ],
  },
};
