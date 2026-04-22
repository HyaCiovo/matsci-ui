import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from '../../components/data-display/Markdown';

const meta = {
  component: Markdown,
  title: 'Data-Display/Markdown'
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    className: 'content',
    children: `
    ## Markdown Heading 2
    Markdown content
  `
  }
};

export const CodeBlock: Story = {
  args: {
    children: `
    ~~~python
    from mp_api.matproj import MPRester
    with MPRester(api_key="your_api_key_here") as mpr:
      materials_docs = mpr.materials.search(nsites=[2, 4])
  `
  }
};