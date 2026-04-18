import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items: ['One', 'Two', 'Three'],
    triggerLabel: 'Items',
  },
};

export const ChildrenAsItems: Story = {
  render: () => (
    <Dropdown triggerLabel="Buttons">
      <div className="button is-primary mb-1">One</div>
      <div className="button is-warning mb-1">Two</div>
      <div className="button is-danger">Three</div>
    </Dropdown>
  ),
};

export const IsUp: Story = {
  args: {
    ...Basic.args,
    isUp: true,
    className: 'mt-10',
  },
};

export const IsArrowless: Story = {
  args: {
    ...Basic.args,
    isArrowless: true,
  },
};

export const StaysOpenOnSelection: Story = {
  args: {
    ...Basic.args,
    closeOnSelection: false,
  },
};
