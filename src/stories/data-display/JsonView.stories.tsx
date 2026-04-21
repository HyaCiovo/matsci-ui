import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { JsonView } from '../../components/data-display/JsonView';
import type { JsonViewProps } from '../../components/data-display/JsonView/JsonView';

export default {
  component: JsonView,
  title: 'Data-Display/JsonView'
};

const Template: StoryFn<React.PropsWithChildren<JsonViewProps>> = (args) => <JsonView {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  src: { a: { b: { c: { d: '12' } } } }
};
