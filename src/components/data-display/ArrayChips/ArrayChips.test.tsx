import { render, screen } from '@testing-library/react';
import { ArrayChips } from './ArrayChips';

describe('ArrayChips', () => {
  it('renders formula chips and linked chips', () => {
    render(
      <ArrayChips
        id="chips"
        chips={['LiFePO4', 'mp-149']}
        chipLinks={['/materials?formula=LiFePO4', 'https://example.com/mp-149']}
      />
    );

    expect(screen.getByTestId('array-chips')).toBeInTheDocument();
    expect(screen.getByTestId('formula')).toHaveTextContent('LiFePO4');
    expect(screen.getByRole('link', { name: 'mp-149' })).toHaveAttribute('href', 'https://example.com/mp-149');
  });
});
