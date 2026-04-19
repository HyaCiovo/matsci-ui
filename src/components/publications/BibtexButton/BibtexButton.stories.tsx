import type { Meta, StoryObj } from '@storybook/react';
import { BibtexButton } from './BibtexButton';

const meta = {
  title: 'Publications/BibtexButton',
  component: BibtexButton,
} satisfies Meta<typeof BibtexButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDoi: Story = {
  args: {
    doi: '10.48550/arXiv.1706.03762',
  },
};

export const WithUrl: Story = {
  args: {
    url: 'https://www.doi2bib.org/bib/10.48550/arXiv.1706.03762',
  },
};

