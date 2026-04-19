import { render, screen } from '@testing-library/react';
import { BibtexButton } from './BibtexButton';

describe('BibtexButton', () => {
  it('renders a doi2bib link when doi is provided', () => {
    render(<BibtexButton doi="10.1234/example" />);
    expect(screen.getByTestId('bibtex-button')).toHaveAttribute(
      'href',
      'https://www.doi2bib.org/bib/10.1234/example'
    );
  });

  it('prefers an explicit url when provided', () => {
    render(<BibtexButton doi="10.1234/example" url="https://example.com/bibtex" />);
    expect(screen.getByTestId('bibtex-button')).toHaveAttribute('href', 'https://example.com/bibtex');
  });

  it('renders nothing when neither doi nor url is provided', () => {
    const { container } = render(<BibtexButton />);
    expect(container).toBeEmptyDOMElement();
  });
});

