import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    labels: ['One', 'Two'],
    children: undefined,
  },
  render: (args) => (
    <Tabs {...args}>
      <div>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum excepturi dolor eveniet
        doloremque vero autem eaque magni.
      </div>
      <div>
        Unde laudantium voluptates eaque sequi, earum dolorum optio quos consequuntur. Numquam alias
        consequuntur quis.
      </div>
    </Tabs>
  ),
};
