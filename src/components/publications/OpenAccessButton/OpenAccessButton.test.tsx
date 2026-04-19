import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { OpenAccessButton } from './OpenAccessButton';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

describe('OpenAccessButton', () => {
  it('renders nothing when neither doi nor url is provided', () => {
    const { container } = render(<OpenAccessButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a link when url is provided', () => {
    render(<OpenAccessButton url="https://example.com/file.pdf" />);
    expect(screen.getByTestId('open-access-button')).toHaveAttribute('href', 'https://example.com/file.pdf');
  });

  it('fetches an open access url when only doi is provided', async () => {
    const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };
    mockedAxios.get.mockResolvedValueOnce({ data: { url: 'https://example.com/file.pdf' } });

    render(<OpenAccessButton doi="10.1234/example" />);

    await waitFor(() => {
      expect(screen.getByTestId('open-access-button')).toHaveAttribute('href', 'https://example.com/file.pdf');
    });
  });
});

