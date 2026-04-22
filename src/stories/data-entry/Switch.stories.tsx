import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../../components/data-entry/Switch';

const meta = {
  component: Switch,
  title: 'Data-Entry/Switch'
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [state, setState] = useState({ value: false });
    return <Switch value={state.value} setProps={setState} />;
  }
};

export const WithLabel: Story = {
  render: () => {
    const [state, setState] = useState({ value: false });
    return <Switch value={state.value} setProps={setState} hasLabel={true} />;
  }
};

export const WithCustomLabel: Story = {
  render: () => {
    const [state, setState] = useState({ value: false });
    return (
      <Switch
        value={state.value}
        setProps={setState}
        hasLabel={true}
        truthyLabel="Enabled"
        falsyLabel="Disabled"
      />
    );
  }
};