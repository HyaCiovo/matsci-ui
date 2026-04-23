import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Scrollspy } from '../../components/navigation/Scrollspy';

const meta = {
  component: Scrollspy,
  title: 'Navigation/Scrollspy'
} satisfies Meta<typeof Scrollspy>;

export default meta;
type Story = StoryObj<typeof meta>;

const MENU_GROUPS = [
  {
    label: 'Table of Contents',
    items: [
      {
        label: 'Crystal Structure',
        targetId: 'one'
      },
      {
        label: 'Properties',
        targetId: 'two',
        items: [
          {
            label: 'Prop One',
            targetId: 'three'
          }
        ]
      }
    ]
  }
];

export const Basic: Story = {
  args: {
    menuGroups: MENU_GROUPS,
    activeClassName: 'is-active'
  },
  render: () => (
    <div className="ms-sidebar-story">
      <Scrollspy
        menuGroups={MENU_GROUPS}
        menuClassName="ms-menu"
        menuItemContainerClassName="ms-menu-list"
        activeClassName="ms-is-active"
      />
      <div className="ms-content">
        <div id="one">
          <h1>Crystal Structure</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
        <div id="two">
          <h1>Properties</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
        <div id="three">
          <h1>Prop One</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores
            praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam
            voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?
          </p>
        </div>
      </div>
    </div>
  )
};
