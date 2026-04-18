import { fireEvent, render, screen } from '@testing-library/react';
import { PeriodicTableFormulaButtons } from './PeriodicTableFormulaButtons';

describe('PeriodicTableFormulaButtons', () => {
  it('emits clicked formula helper values', () => {
    const onClick = vi.fn();

    render(<PeriodicTableFormulaButtons onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '(' }));
    fireEvent.click(screen.getByTitle('Wildcard element'));

    expect(onClick).toHaveBeenNthCalledWith(1, '1');
    expect(onClick).toHaveBeenNthCalledWith(2, '(');
    expect(onClick).toHaveBeenNthCalledWith(3, '*');
  });
});
