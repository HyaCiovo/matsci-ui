import { fireEvent, render, screen } from '@testing-library/react';
import { BibFilter } from './BibFilter';

describe('BibFilter', () => {
  it('filters bibjson entries by search tokens', () => {
    render(
      <BibFilter
        format="bibjson"
        bibEntries={[
          { title: 'A Study', author: ['Author, A'], year: 2020, doi: '10.1/a' },
          { title: 'Another Paper', author: ['Other, B'], year: 2021, doi: '10.1/b' },
        ]}
      />
    );

    fireEvent.change(screen.getByRole('searchbox', { name: 'publication search' }), {
      target: { value: 'Another' },
    });

    expect(screen.getByText('Another Paper')).toBeInTheDocument();
    expect(screen.queryByText('A Study')).not.toBeInTheDocument();
  });
});

