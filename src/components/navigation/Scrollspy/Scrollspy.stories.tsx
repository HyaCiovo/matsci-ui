import type { Meta, StoryObj } from '@storybook/react';
import { Scrollspy } from './Scrollspy';

const meta = {
  title: 'Navigation/Scrollspy',
  component: Scrollspy,
} satisfies Meta<typeof Scrollspy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    activeClassName: 'is-active',
    menuGroups: [
      {
        label: 'Overview',
        items: [
          { label: 'Introduction', targetId: 'introduction' },
          {
            label: 'Details',
            targetId: 'details',
            items: [
              { label: 'Structure', targetId: 'structure' },
              { label: 'Properties', targetId: 'properties' },
            ],
          },
        ],
      },
    ],
  },
};
