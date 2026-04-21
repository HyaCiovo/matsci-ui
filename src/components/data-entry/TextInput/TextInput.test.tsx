import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('reports changes through onChange', async () => {
    const onChange = vi.fn();
    render(<TextInput value="oxide" onChange={onChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nitride' } });

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith('nitride');
    });
  });
});
