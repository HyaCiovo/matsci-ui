import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../../components/data-entry/Input';

const meta = {
  title: 'Data Entry/Input',
  component: Input,
  args: {
    placeholder: 'Type here…',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    type: 'text',
    defaultValue: 'hello',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    defaultValue: 'mp-149',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    defaultValue: 42,
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    defaultValue: 'disabled',
    disabled: true,
  },
};

