import { render, screen } from '@testing-library/react';
import { BibCard } from './BibCard';

describe('BibCard', () => {
  it('renders title and author string', () => {
    render(
      <BibCard
        title="A Study"
        author={[{ given: 'A', family: 'Author' }]}
        doi="10.1234/example"
        journal="Test Journal"
        year={2020}
      />
    );

    expect(screen.getByTestId('bib-card-title')).toHaveTextContent('A Study');
    expect(screen.getByTestId('bib-card-authors')).toHaveTextContent('A Author');
    expect(screen.getByTestId('publication-button')).toBeInTheDocument();
    expect(screen.getByTestId('bibtex-button')).toBeInTheDocument();
  });
});

