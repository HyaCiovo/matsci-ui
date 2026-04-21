import React, { useState } from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { ThreeStateBooleanSelect } from '../../components/data-entry/ThreeStateBooleanSelect';
import { ThreeStateBooleanSelectProps } from '../../components/data-entry/ThreeStateBooleanSelect/ThreeStateBooleanSelect';

export default {
  component: ThreeStateBooleanSelect,
  title: 'Data-Entry/ThreeStateBooleanSelect'
};

const Template: StoryFn<React.PropsWithChildren<ThreeStateBooleanSelectProps>> = (args) => (
  <ThreeStateBooleanSelect {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  value: true,
  options: [
    {
      label: 'Yes',
      value: true
    },
    {
      label: 'No',
      value: false
    }
  ]
};
