import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from './Markdown';

const meta = {
  title: 'Data Display/Markdown',
  component: Markdown,
  args: {
    children: `# Markdown\n\nA paragraph with **bold** text.\n\n| Col A | Col B |\n| --- | --- |\n| 1 | 2 |\n\n$E = mc^2$`,
  },
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const NoDedent: Story = {
  args: {
    dedent: false,
    children: '# Already formatted\n\n- one\n- two',
  },
};
