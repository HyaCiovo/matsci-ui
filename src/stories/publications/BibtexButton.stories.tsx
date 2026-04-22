import type { Meta, StoryObj } from '@storybook/react';
import { BibtexButton } from '../../components/publications/BibtexButton';
import { BibtexButtonProps } from '../../components/publications/BibtexButton/BibtexButton';

const meta = {
  component: BibtexButton,
  title: 'Publications/BibtexButton'
} satisfies Meta<typeof BibtexButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromDOI: Story = {
  args: {
    doi: '10.1093/mnras/stu869'
  }
};

export const FromURL: Story = {
  args: {
    url: 'https://scholar.googleusercontent.com/scholar.bib?q=info:sFyRnty5OLkJ:scholar.google.com/&output=citation&scisdr=CgXjl-2dEOzYpl5H9_8:AAGBfm0AAAAAYaVC7_8zAye0dAJzjnMn2xWVo4mBsAEr&scisig=AAGBfm0AAAAAYaVC7zbsW0VPNhM6Ztnin1RWNz6UG0j2&scisf=4&ct=citation&cd=-1&hl=en'
  }
};