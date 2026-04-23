import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../../components/navigation/Dropdown';
import { DropdownProps } from '../../components/navigation/Dropdown/Dropdown';

const meta = {
  component: Dropdown,
  title: 'Navigation/Dropdown'
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    items: ['One', 'Two', 'Three'],
    triggerLabel: 'Items'
  }
};

export const ChildrenAsItems: Story = {
  render: () => (
    <Dropdown triggerLabel="Buttons">
      <div className="ms-button ms-is-primary ms-mb-1">One</div>
      <div className="ms-button ms-is-warning ms-mb-1">Two</div>
      <div className="ms-button ms-is-danger">Three</div>
    </Dropdown>
  )
};

export const IsUp: Story = {
  args: {
    ...Basic.args,
    isUp: true,
    className: 'mt-10'
  }
};

export const IsArrowless: Story = {
  args: {
    ...Basic.args,
    isArrowless: true
  }
};

export const StaysOpenOnSelection: Story = {
  args: {
    ...Basic.args,
    closeOnSelection: false
  }
};