import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Data Entry/Switch',
  component: Switch,
  args: {
    hasLabel: true,
    truthyLabel: 'Enabled',
    falsyLabel: 'Disabled',
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState(false);
    return <Switch {...args} value={value} onChange={setValue} />;
  },
};
