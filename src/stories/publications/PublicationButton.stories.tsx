import type { Meta, StoryObj } from '@storybook/react';
import { PublicationButton } from '../../components/publications/PublicationButton';
import { PublicationButtonProps } from '../../components/publications/PublicationButton/PublicationButton';

const meta = {
  component: PublicationButton,
  title: 'Publications/PublicationButton'
} satisfies Meta<typeof PublicationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromDOI: Story = {
  args: {
    doi: '10.1093/mnras/stu869'
  }
};

export const FromURL: Story = {
  args: {
    url: 'https://academic.oup.com/mnras/article/442/2/1319/980862'
  }
};

export const FromURLWithCustomLabel: Story = {
  args: {
    url: 'https://academic.oup.com/mnras/article/442/2/1319/980862',
    children: 'Cement Reference'
  }
};

export const Compact: Story = {
  args: {
    doi: '10.1093/mnras/stu869',
    compact: true
  }
};

export const WithBibTooltip: Story = {
  args: {
    doi: '10.1093/mnras/stu869',
    showTooltip: true
  }
};