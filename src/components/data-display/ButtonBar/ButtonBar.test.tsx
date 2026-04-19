import { render, screen } from '@testing-library/react';
import { ButtonBar } from './ButtonBar';

describe('ButtonBar', () => {
  it('renders children in a vertical container', () => {
    render(
      <ButtonBar>
        <button type="button">One</button>
        <button type="button">Two</button>
      </ButtonBar>
    );

    expect(screen.getByRole('button', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Two' })).toBeInTheDocument();
  });
});
