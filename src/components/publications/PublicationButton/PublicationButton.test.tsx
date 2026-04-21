import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PublicationButton } from './PublicationButton';

describe('PublicationButton', () => {
  it('renders a doi link when doi is provided', () => {
    render(<PublicationButton doi="10.1234/example">Publication</PublicationButton>);
    expect(screen.getByTestId('publication-button')).toHaveAttribute('href', 'https://doi.org/10.1234/example');
  });

  it('fetches a journal/year label when children are not provided', async () => {
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        message: {
          'container-title': ['Test Journal'],
          created: { 'date-parts': [[2020]] },
          URL: 'https://doi.org/10.1234/example',
        },
      }),
    });
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => 'Test Journal (2020). http://example.com',
    });

    render(<PublicationButton doi="10.1234/example" showTooltip />);

    await waitFor(() => {
      expect(screen.getByText('Test Journal, 2020')).toBeInTheDocument();
    });
  });

  it('does not fetch crossref metadata when children are provided', async () => {
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => 'Test citation.',
    });

    render(
      <PublicationButton doi="10.1234/example" showTooltip>
        Custom label
      </PublicationButton>
    );

    fireEvent.mouseEnter(screen.getByTestId('publication-button'));
    await waitFor(() => {
      expect(screen.getByText('Custom label')).toBeInTheDocument();
    });
  });
});
