import type { Meta, StoryObj } from '@storybook/react';
import { CrossrefCard } from '../../components/publications/CrossrefCard';
import { CrossrefCardProps } from '../../components/publications/CrossrefCard/CrossrefCard';

const meta = {
  component: CrossrefCard,
  title: 'Publications/CrossrefCard'
} satisfies Meta<typeof CrossrefCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PreFetched: Story = {
  args: {
    className: 'ms-box',
    crossrefEntry: {
      DOI: '10.1093/mnras/stu869',
      title: ['Do cement nanoparticles exist in space?'],
      author: [
        {
          given: 'G.',
          family: 'Bilalbegovi\u0107',
          sequence: 'first',
          affiliation: []
        },
        {
          given: 'A.',
          family: 'Maksimovi\u0107',
          sequence: 'additional',
          affiliation: []
        },
        {
          given: 'V.',
          family: 'Moha\u010dek-Gro\u0161ev',
          sequence: 'additional',
          affiliation: []
        }
      ],
      created: {
        'date-parts': [[2014, 6, 12]],
        'date-time': '2014-06-12T04:25:57Z',
        timestamp: 1402547157000
      },
      publisher: 'Oxford University Press (OUP)',
      'container-title': ['Monthly Notices of the Royal Astronomical Society'],
      openAccessUrl: 'https://academic.oup.com/mnras/article-pdf/442/2/1319/5699785/stu869.pdf'
    }
  }
};

export const FromDOI: Story = {
  args: {
    className: 'ms-box',
    identifier: '10.1093/mnras/stu869'
  }
};
