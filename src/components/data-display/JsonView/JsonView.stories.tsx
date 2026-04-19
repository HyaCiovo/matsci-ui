import type { Meta, StoryObj } from '@storybook/react';
import { JsonView } from './JsonView';

const meta = {
  title: 'Data Display/JsonView',
  component: JsonView,
} satisfies Meta<typeof JsonView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    src: { a: { b: { c: { d: '12' } } } },
  },
};
