import React, { useState } from 'react';
import type { StoryFn } from '@storybook/react';
import { Select } from '../../components/data-entry/Select';
import { SelectProps } from '../../components/data-entry/Select/Select';

export default {
  component: Select,
  title: 'Data-Entry/Select'
};

const Template: StoryFn<React.PropsWithChildren<SelectProps>> = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  isClearable: true,
  value: 'NM',
  options: [
    {
      label: 'Ferromagnetic',
      value: 'FM'
    },
    {
      label: 'Non-magnetic',
      value: 'NM'
    },
    {
      label: 'Ferrimagnetic',
      value: 'FiM'
    },
    {
      label: 'Antiferromagnetic',
      value: 'AFM'
    },
    {
      label: 'Unknown',
      value: 'Unknown'
    }
  ]
};

export const Controlled: StoryFn<React.PropsWithChildren<SelectProps>> = (args) => {
  const [state, setState] = useState<{ value: number | null }>({ value: 1 });
  return (
    <Select
      value={state.value}
      setProps={(next) => setState({ value: typeof next.value === 'number' ? next.value : null })}
      options={[
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
        { label: 'Three', value: 3 }
      ]}
    />
  );
};
