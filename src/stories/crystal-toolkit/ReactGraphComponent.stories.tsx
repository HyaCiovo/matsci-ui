import React from 'react';
import type { StoryFn } from '@storybook/react';
import ReactGraphComponent, {
  ReactGraphComponentProps,
} from '../../components/crystal-toolkit/ReactGraphComponent/ReactGraphComponent';
import { DEFAULT_OPTIONS, GRAPH } from '../constants';

export default {
  component: ReactGraphComponent,
  title: 'Crystal Toolkit/ReactGraphComponent'
};

const Template: StoryFn<React.PropsWithChildren<ReactGraphComponentProps>> = (args) => (
  <ReactGraphComponent {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  graph: GRAPH,
  options: DEFAULT_OPTIONS
};
