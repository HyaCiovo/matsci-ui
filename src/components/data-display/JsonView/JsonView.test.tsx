import { render, screen } from '@testing-library/react';
import { JsonView } from './JsonView';

describe('JsonView', () => {
  it('renders nested json content', () => {
    render(<JsonView src={{ a: { b: { c: '12' } } }} />);

    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();
    expect(screen.getByText('"12"')).toBeInTheDocument();
  });
});
