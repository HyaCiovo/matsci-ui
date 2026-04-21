import { fireEvent, render, screen } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('clears the input value from the inline clear button', () => {
    render(<TextInput value="oxide" onChange={() => undefined} />);

    expect(screen.getByDisplayValue('oxide')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Clear input'));

    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});
