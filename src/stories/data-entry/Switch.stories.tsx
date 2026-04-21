import React, { useState } from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { Switch } from '../../components/data-entry/Switch';
import { SwitchProps } from '../../components/data-entry/Switch/Switch';

export default {
  component: Switch,
  title: 'Data-Entry/Switch'
};

export const Basic: StoryFn<React.PropsWithChildren<SwitchProps>> = (args) => {
  const [state, setState] = useState({ value: false });
  return <Switch value={state.value} setProps={setState} />;
};

export const WithLabel: StoryFn<React.PropsWithChildren<SwitchProps>> = (args) => {
  const [state, setState] = useState({ value: false });
  return <Switch value={state.value} setProps={setState} hasLabel={true} />;
};

export const WithCustomLabel: StoryFn<React.PropsWithChildren<SwitchProps>> = (args) => {
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
};
