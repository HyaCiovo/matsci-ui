import type { Meta, StoryObj } from '@storybook/react';
import { ButtonBar } from './ButtonBar';

const meta = {
  title: 'Data Display/ButtonBar',
  component: ButtonBar,
} satisfies Meta<typeof ButtonBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <ButtonBar>
      <button type="button" className="button">
        First
      </button>
      <button type="button" className="button">
        Second
      </button>
      <button type="button" className="button">
        Third
      </button>
    </ButtonBar>
  ),
};
