import { fireEvent, render, screen } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders the falsy label when the switch is off', () => {
    render(<Switch value={false} hasLabel falsyLabel="Disabled" />);
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('calls onChange and setProps with the toggled value', () => {
    const onChange = vi.fn();
    const setProps = vi.fn();
    render(<Switch value={false} onChange={onChange} setProps={setProps} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(setProps).toHaveBeenCalledWith({ value: true });
  });

  it('uses the truthy label and aria-pressed state when enabled', () => {
    render(<Switch value hasLabel truthyLabel="Enabled" />);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });
});
