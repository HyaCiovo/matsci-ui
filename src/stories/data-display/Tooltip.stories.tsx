import React from 'react';
import type { StoryFn } from '@storybook/react';
import { Tooltip } from '../../components/data-display/Tooltip';
import { TooltipProps } from '../../components/data-display/Tooltip/Tooltip';

export default {
  component: Tooltip,
  title: 'Data-Display/Tooltip'
};

const Template: StoryFn<React.PropsWithChildren<TooltipProps>> = (args) => (
  <Tooltip
    {...args}
    trigger={
      <button className="button" type="button">
        Tooltip Trigger
      </button>
    }
  />
);

export const Basic = Template.bind({});
Basic.args = {
  id: 'Tooltip 1',
  delayShow: 0,
  children: 'This is a tooltip'
};
