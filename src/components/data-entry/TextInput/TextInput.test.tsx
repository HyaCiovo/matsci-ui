import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('does not emit onChange during the initial render', () => {
    const onChange = vi.fn();
    render(<TextInput value="oxide" onChange={onChange} />);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('reports changes through onChange', async () => {
    const onChange = vi.fn();
    render(<TextInput value="oxide" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nitride' } });

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith('nitride');
    });
  });

  it('does not re-emit the same value when only the callback identity changes', async () => {
    const firstOnChange = vi.fn();
    const { rerender } = render(<TextInput value="oxide" onChange={firstOnChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nitride' } });

    await waitFor(() => {
      expect(firstOnChange).toHaveBeenCalledTimes(1);
      expect(firstOnChange).toHaveBeenLastCalledWith('nitride');
    });

    const secondOnChange = vi.fn();
    rerender(<TextInput value="nitride" onChange={secondOnChange} />);

    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(secondOnChange).not.toHaveBeenCalled();
  });
});
