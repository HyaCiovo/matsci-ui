import type { Meta, StoryObj } from '@storybook/react';
import { Link } from '../../components/navigation/Link';
import { LinkProps } from '../../components/navigation/Link/Link';

const meta = {
  component: Link,
  title: 'Navigation/Link'
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: 'Link to page',
    href: '/page'
  }
};

export const PreserveQueryParameters: Story = {
  args: {
    children: 'Link that preserves existing query parameters',
    href: '/page',
    preserveQuery: true
  }
};