import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '../../components/navigation/Navbar';
import { NavbarProps } from '../../components/navigation/Navbar/Navbar';

const meta = {
  component: Navbar,
  title: 'Navigation/Navbar'
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    brandItem: {
      label: 'MP React',
      href: '/materials'
    },
    items: [
      {
        label: 'Materials',
        href: '/materials'
      },
      {
        label: 'Molecules',
        href: '/molecules'
      },
      {
        label: 'Batteries',
        href: '/batteries'
      },
      {
        label: 'Synthesis',
        href: '/synthesis'
      },
      {
        label: 'Catalysts',
        href: '/catalysts'
      },
      {
        label: 'More',
        isRight: true,
        items: [
          {
            label: 'Other Pages',
            isMenuLabel: true
          },
          {
            label: 'Publications',
            href: '/publications'
          },
          {
            label: 'Contributions',
            href: '/contribs'
          },
          {
            label: 'Crystal Structure',
            href: '/crystal'
          },
          {
            label: 'Sandbox',
            href: '/sandbox'
          }
        ]
      }
    ]
  }
};