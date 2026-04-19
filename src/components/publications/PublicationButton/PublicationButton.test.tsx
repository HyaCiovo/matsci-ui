import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { PublicationButton } from './PublicationButton';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

describe('PublicationButton', () => {
  it('renders a doi link when doi is provided', () => {
    render(<PublicationButton doi="10.1234/example">Publication</PublicationButton>);
    expect(screen.getByTestId('publication-button')).toHaveAttribute('href', 'https://doi.org/10.1234/example');
  });

  it('fetches a journal/year label when children are not provided', async () => {
    const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        message: {
          'container-title': ['Test Journal'],
          created: { 'date-parts': [[2020]] },
          URL: 'https://doi.org/10.1234/example',
        },
      },
    });
    mockedAxios.get.mockResolvedValueOnce({ data: 'Test Journal (2020). http://example.com' });

    render(<PublicationButton doi="10.1234/example" showTooltip />);

    await waitFor(() => {
      expect(screen.getByText('Test Journal, 2020')).toBeInTheDocument();
    });
  });

  it('does not fetch crossref metadata when children are provided', async () => {
    const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
    mockedAxios.get.mockResolvedValueOnce({ data: 'Test citation.' });

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
