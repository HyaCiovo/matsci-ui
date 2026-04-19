import { fireEvent, render, screen } from '@testing-library/react';
import { MaterialsInput, MaterialsInputType, PeriodicTableMode } from './MaterialsInput';

describe('MaterialsInput', () => {
  it('restores the last valid value when input exceeds the max element limit', () => {
    render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        maxElementSelectable={2}
      />
    );

    const input = screen.getByTestId('materials-input-search-input');
    fireEvent.change(input, { target: { value: 'Li-Fe-Co' } });

    expect(input).toHaveValue('Li-Fe');
  });

  it('preserves wildcard segments when converting back to chemical system mode', () => {
    render(
      <MaterialsInput
        value="Li,Fe,*,*"
        type={MaterialsInputType.ELEMENTS}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM, MaterialsInputType.ELEMENTS]}
        showTypeDropdown
        showSubmitButton
      />
    );

    fireEvent.change(screen.getByLabelText('Input type'), {
      target: { value: 'Only' },
    });

    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Li-Fe-*-*');
  });

  it('hides the periodic table after submit to match legacy behavior', () => {
    const handleSubmit = vi.fn();

    render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        showSubmitButton
        periodicTableMode={PeriodicTableMode.TOGGLE}
        onSubmit={handleSubmit}
      />
    );

    const periodicTable = screen.getByTestId('materials-input-periodic-table');
    expect(periodicTable).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(screen.getByTestId('materials-input-submit-button'));

    expect(handleSubmit).toHaveBeenCalled();
    expect(periodicTable).toHaveAttribute('aria-hidden', 'true');
  });
});
