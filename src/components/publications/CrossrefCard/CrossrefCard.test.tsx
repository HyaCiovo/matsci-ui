import { render, screen, waitFor } from '@testing-library/react';
import { CrossrefCard } from './CrossrefCard';

describe('CrossrefCard', () => {
  it('renders a BibCard when a crossref entry is provided', () => {
    render(
      <CrossrefCard
        crossrefEntry={{
          title: ['A Study'],
          author: [{ given: 'A', family: 'Author' }],
          created: { 'date-parts': [[2020]] },
          'container-title': ['Test Journal'],
          DOI: '10.1234/example',
        }}
      />
    );

    expect(screen.getByTestId('bib-card')).toBeInTheDocument();
    expect(screen.getByText('A Study')).toBeInTheDocument();
  });

  it('fetches a crossref entry when identifier is provided', async () => {
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ message: { title: ['Fetched'], DOI: '10.1234/example' } }),
    });

    render(<CrossrefCard identifier="10.1234/example" />);

    await waitFor(() => {
      expect(screen.getByText('Fetched')).toBeInTheDocument();
    });
  });
});
