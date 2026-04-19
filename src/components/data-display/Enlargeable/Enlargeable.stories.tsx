import type { Meta, StoryObj } from '@storybook/react';
import { Enlargeable } from './Enlargeable';

const meta = {
  title: 'Data Display/Enlargeable',
  component: Enlargeable,
} satisfies Meta<typeof Enlargeable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Enlargeable>
      <div className="box">Click the button to expand this content.</div>
    </Enlargeable>
  ),
};
