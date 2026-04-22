import type { Meta, StoryObj } from '@storybook/react';
import { JsonView } from '../../components/data-display/JsonView';

const meta = {
  component: JsonView,
  title: 'Data-Display/JsonView'
} satisfies Meta<typeof JsonView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    src: { a: { b: { c: { d: '12' } } } }
  }
};