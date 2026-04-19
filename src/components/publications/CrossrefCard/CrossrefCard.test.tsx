import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { CrossrefCard } from './CrossrefCard';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

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
    const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: { title: ['Fetched'], DOI: '10.1234/example' } },
    });

    render(<CrossrefCard identifier="10.1234/example" />);

    await waitFor(() => {
      expect(screen.getByText('Fetched')).toBeInTheDocument();
    });
  });
});

