import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Scrollspy } from '../../components/navigation/Scrollspy';

const meta = {
  component: Scrollspy,
  title: 'Navigation/Scrollspy'
} satisfies Meta<typeof Scrollspy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="sidebar-story">
      <Scrollspy
        menuGroups={[
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
        ]}
        menuClassName="menu"
        menuItemContainerClassName="menu-list"
        activeClassName="is-active"
      />
      <div className="content">
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