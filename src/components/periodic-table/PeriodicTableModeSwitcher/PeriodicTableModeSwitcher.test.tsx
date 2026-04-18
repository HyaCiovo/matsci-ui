import { fireEvent, render, screen } from '@testing-library/react';
import { PeriodicTableModeSwitcher } from './PeriodicTableModeSwitcher';
import { PeriodicTableSelectionMode } from '../../data-entry/MaterialsInput/utils';

describe('PeriodicTableModeSwitcher', () => {
  it('switches modes and renders formula buttons in formula mode', () => {
    const onSwitch = vi.fn();
    const onFormulaButtonClick = vi.fn();

    render(
      <PeriodicTableModeSwitcher
        mode={PeriodicTableSelectionMode.FORMULA}
        onSwitch={onSwitch}
        onFormulaButtonClick={onFormulaButtonClick}
      />
    );

    expect(screen.getByRole('button', { name: '(' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'At Least Elements' }));
    expect(onSwitch).toHaveBeenCalledWith(PeriodicTableSelectionMode.ELEMENTS);

    fireEvent.click(screen.getByRole('button', { name: '(' }));
    expect(onFormulaButtonClick).toHaveBeenCalledWith('(');
  });
});
