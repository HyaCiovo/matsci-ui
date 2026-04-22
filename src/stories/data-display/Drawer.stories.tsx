import type { Meta, StoryObj } from '@storybook/react';
import { DrawerContextProvider } from '../../components/data-display/Drawer/DrawerContextProvider';
import { DrawerTrigger } from '../../components/data-display/Drawer/DrawerTrigger';
import { Drawer } from '../../components/data-display/Drawer';

const meta = {
  component: Drawer,
  title: 'Data-Display/Drawer'
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-1">
        <button className="button">Drawer 1</button>
      </DrawerTrigger>
      <Drawer id="drawer-1" position="right" duration={500}>
        <h2>Drawer Content</h2>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </Drawer>
    </DrawerContextProvider>
  )
};

export const WithTwoDifferentDrawers: Story = {
  render: () => (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-1">
        <button className="button mr-2">Drawer 1</button>
      </DrawerTrigger>
      <DrawerTrigger forDrawerId="drawer-2">
        <button className="button">Drawer 2</button>
      </DrawerTrigger>
      <Drawer id="drawer-1">
        <h2>Drawer Content</h2>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </Drawer>
      <Drawer id="drawer-2">
        <h2>Another Drawer</h2>
        <p>Here is its content.</p>
      </Drawer>
    </DrawerContextProvider>
  )
};

export const BottomDrawer: Story = {
  render: () => (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-bottom">
        <button className="button">Bottom Drawer</button>
      </DrawerTrigger>
      <Drawer id="drawer-bottom" position="bottom">
        <h2>Bottom Drawer</h2>
        <p>Slides in from the bottom.</p>
      </Drawer>
    </DrawerContextProvider>
  )
};