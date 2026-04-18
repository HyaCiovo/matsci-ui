import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select } from './Select';

const meta = {
  title: 'Data Entry/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    isClearable: true,
    value: 'NM',
    options: [
      { label: 'Ferromagnetic', value: 'FM' },
      { label: 'Non-magnetic', value: 'NM' },
      { label: 'Ferrimagnetic', value: 'FiM' },
      { label: 'Antiferromagnetic', value: 'AFM' },
    ],
  },
};

export const Controlled: Story = {
  args: {
    options: [],
  },
  render: () => {
    const [value, setValue] = useState<number | null>(1);
    return (
      <Select
        value={value}
        setProps={({ value: nextValue }) => setValue(nextValue as number | null)}
        options={[
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
          { label: 'Three', value: 3 },
        ]}
      />
    );
  },
};
