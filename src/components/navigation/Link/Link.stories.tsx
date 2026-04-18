import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta = {
  title: 'Navigation/Link',
  component: Link,
  args: {
    href: '/materials/mp-149',
    children: 'Open material details',
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const PreserveQuery: Story = {
  args: {
    preserveQuery: true,
    href: '/search',
    children: 'Preserve query params',
  },
};
