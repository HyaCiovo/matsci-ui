import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../../components/data-entry/Select';

const meta = {
  component: Select,
  title: 'Data-Entry/Select'
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
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
  }
};

export const Controlled: Story = {
  render: () => {
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
  }
};