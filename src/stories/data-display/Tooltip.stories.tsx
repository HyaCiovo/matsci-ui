import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '../../components/data-display/Tooltip';

const meta = {
  component: Tooltip,
  title: 'Data-Display/Tooltip'
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tooltip
      id="Tooltip 1"
      delayShow={0}
      trigger={
        <button className="ms-button" type="button">
          Tooltip Trigger
        </button>
      }
    >
      This is a tooltip
    </Tooltip>
  )
};