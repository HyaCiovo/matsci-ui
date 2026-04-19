import { render, screen } from '@testing-library/react';
import { BibjsonCard } from './BibjsonCard';

describe('BibjsonCard', () => {
  it('renders a BibCard from a bibjson entry', () => {
    render(
      <BibjsonCard
        bibjsonEntry={{
          title: 'A Study',
          author: ['Author, A'],
          year: 2020,
          journal: 'Test Journal',
          doi: '10.1234/example',
        }}
      />
    );

    expect(screen.getByTestId('bib-card')).toBeInTheDocument();
    expect(screen.getByText('A Study')).toBeInTheDocument();
  });
});

