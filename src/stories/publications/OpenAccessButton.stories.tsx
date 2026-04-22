import type { Meta, StoryObj } from '@storybook/react';
import { OpenAccessButton } from '../../components/publications/OpenAccessButton';
import { OpenAccessButtonProps } from '../../components/publications/OpenAccessButton/OpenAccessButton';

const meta = {
  component: OpenAccessButton,
  title: 'Publications/OpenAccessButton'
} satisfies Meta<typeof OpenAccessButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromDOI: Story = {
  args: {
    doi: '10.1038/nphys4277'
  }
};

export const FromURL: Story = {
  args: {
    url: 'https://arxiv.org/pdf/1611.06860.pdf'
  }
};

export const Compact: Story = {
  args: {
    doi: '10.1038/nphys4277',
    compact: true
  }
};