import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Data Display/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof Tooltip>) => (
  <>
    <button className="button" data-tip data-for={args.id}>
      Tooltip Trigger
    </button>
    <Tooltip {...args} />
  </>
);

export const Basic: Story = {
  render: Template,
  args: {
    id: 'tooltip-1',
    children: 'This is a solid tooltip',
  },
};

export const Floating: Story = {
  render: Template,
  args: {
    id: 'tooltip-2',
    effect: 'float',
    delayShow: 0,
    children: 'This is a floating tooltip',
  },
};
