import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { BibFilter } from '../../components/publications/BibFilter';
import { BibFilterProps } from '../../components/publications/BibFilter/BibFilter';
import mpPapers from '../constants/mp-papers.json';

export default {
  component: BibFilter,
  title: 'Publications/BibFilter'
};

const Template: StoryFn<React.PropsWithChildren<BibFilterProps>> = (args) => <BibFilter {...args} />;

export const FromDOI = Template.bind({});
FromDOI.args = {
  bibEntries: mpPapers.slice(1, 10),
  resultClassName: 'box',
  preventOpenAccessFetch: true
};
