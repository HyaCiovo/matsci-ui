import React, { useState } from 'react';
import type { StoryFn } from '@storybook/react';
import { Modal, ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';
import { ModalContextProviderProps } from '../../components/data-display/Modal/ModalContextProvider';
import { DrawerContextProvider } from '../../components/data-display/Drawer/DrawerContextProvider';
import { DrawerTrigger } from '../../components/data-display/Drawer/DrawerTrigger';
import { Drawer, type DrawerProps } from '../../components/data-display/Drawer';

export default {
  component: Drawer,
  title: 'Data-Display/Drawer'
};

export const Basic: StoryFn<React.PropsWithChildren<DrawerProps>> = (args) => {
  const { id: _id, children: _children, ...drawerArgs } = args;

  return (
    <DrawerContextProvider>
      <DrawerTrigger forDrawerId="drawer-1">
        <button className="button">Drawer 1</button>
      </DrawerTrigger>
      <Drawer id="drawer-1" {...drawerArgs}>
        <h2>Drawer Content</h2>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
      </Drawer>
    </DrawerContextProvider>
  );
};

Basic.args = {
  position: 'right',
  duration: 500
};

export const WithTwoDifferentDrawers: StoryFn<React.PropsWithChildren<ModalContextProviderProps>> = (
  args
) => {
  return (
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
  );
};

export const BottomDrawer: StoryFn<React.PropsWithChildren<ModalContextProviderProps>> = () => (
  <DrawerContextProvider>
    <DrawerTrigger forDrawerId="drawer-bottom">
      <button className="button">Bottom Drawer</button>
    </DrawerTrigger>
    <Drawer id="drawer-bottom" position="bottom">
      <h2>Bottom Drawer</h2>
      <p>Slides in from the bottom.</p>
    </Drawer>
  </DrawerContextProvider>
);
