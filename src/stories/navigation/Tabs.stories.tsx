import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../../components/navigation/Tabs';
import { TabsProps } from '../../components/navigation/Tabs/Tabs';

const meta = {
  component: Tabs,
  title: 'Navigation/Tabs'
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    labels: ['One', 'Two'],
    children: (
      <>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum excepturi dolor eveniet
          doloremque vero autem eaque magni. Quo quis maiores illo cum! Quasi cum fugit animi quis
          praesentium saepe veritatis.
        </div>
        <div>
          Unde laudantium voluptates eaque sequi, earum dolorum optio quos consequuntur. Numquam alias
          consequuntur quis, eveniet aut praesentium ratione rerum laborum ea labore!
        </div>
      </>
    )
  }
};