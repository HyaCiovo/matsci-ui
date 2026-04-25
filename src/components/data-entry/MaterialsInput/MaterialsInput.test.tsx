import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

    fireEvent.click(screen.getByRole('button', { name: 'At least' }));
    fireEvent.click(screen.getByRole('button', { name: 'Only' }));

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

  it('keeps focus-mode periodic table open and refocuses input when clicking inside the table', async () => {
    render(
      <MaterialsInput
        value=""
        type={MaterialsInputType.ELEMENTS}
        allowedInputTypes={[MaterialsInputType.ELEMENTS]}
        showSubmitButton
        periodicTableMode={PeriodicTableMode.FOCUS}
      />
    );

    const input = screen.getByTestId('materials-input-search-input');
    fireEvent.focus(input);

    const periodicTable = screen.getByTestId('materials-input-periodic-table');
    const lithiumButton = screen.getByTestId('periodic-element-Li');
    expect(periodicTable).toHaveAttribute('aria-hidden', 'false');

    fireEvent.mouseDown(periodicTable);
    fireEvent.blur(input, { relatedTarget: lithiumButton });
    fireEvent.click(lithiumButton);

    expect(periodicTable).toHaveAttribute('aria-hidden', 'false');
    expect(input).toHaveValue('Li');

    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('uses help examples to populate the input with validated values', () => {
    render(
      <MaterialsInput
        value=""
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        helpItems={[
          { label: 'Examples' },
          { label: null, examples: ['Li-Fe'] },
        ]}
        showSubmitButton
      />
    );

    const input = screen.getByTestId('materials-input-search-input');
    fireEvent.focus(input);
    fireEvent.mouseDown(screen.getByText('Li-Fe'));

    expect(input).toHaveValue('Li-Fe');
  });

  it('keeps help and clear controls in filter mode without submit button', () => {
    render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        helpItems={[{ label: 'Examples' }, { label: null, examples: ['Li-Fe'] }]}
        showSubmitButton={false}
      />
    );

    expect(screen.getByTestId('materials-input-help-button')).toBeInTheDocument();
    expect(screen.queryByTestId('materials-input-clear')).toBeNull();

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: '' },
    });

    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('');
  });

  it('submits the latest input immediately even when debounce is enabled', async () => {
    const handleChange = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <MaterialsInput
        value=""
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        showSubmitButton
        debounce={300}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Li-Fe' },
    });

    expect(handleChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('materials-input-submit-button'));
    expect(handleSubmit).toHaveBeenCalledWith(expect.anything(), 'Li-Fe');
    expect(handleChange).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('Li-Fe');
    });
  });

  it('syncs selection mode formatting when the controlled input type changes', () => {
    const { rerender } = render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM, MaterialsInputType.ELEMENTS]}
        showTypeDropdown
        showSubmitButton
      />
    );

    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Li-Fe');

    rerender(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.ELEMENTS}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM, MaterialsInputType.ELEMENTS]}
        showTypeDropdown
        showSubmitButton
      />
    );

    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Li,Fe');
  });

  it('converts values when periodic table mode switching changes the effective input type', () => {
    const handleInputTypeChange = vi.fn();

    render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[
          MaterialsInputType.CHEMICAL_SYSTEM,
          MaterialsInputType.ELEMENTS,
          MaterialsInputType.FORMULA,
        ]}
        periodicTableMode={PeriodicTableMode.TOGGLE}
        onInputTypeChange={handleInputTypeChange}
        showSubmitButton
      />
    );

    fireEvent.click(screen.getByText('Formula').closest('a')!);
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('LiFe');
    expect(handleInputTypeChange).toHaveBeenCalledWith(MaterialsInputType.FORMULA);

    fireEvent.click(screen.getByText('Only Elements').closest('a')!);
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Li-Fe');
    expect(handleInputTypeChange).toHaveBeenCalledWith(MaterialsInputType.CHEMICAL_SYSTEM);
  });

  it('passes a custom periodic table toggle icon through the public API', () => {
    render(
      <MaterialsInput
        value="Li-Fe"
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        periodicTableToggleIcon={<span data-testid="custom-periodic-icon">PT</span>}
        showSubmitButton
        periodicTableMode={PeriodicTableMode.TOGGLE}
      />
    );

    expect(screen.getByTestId('custom-periodic-icon')).toBeInTheDocument();
  });

  it('keeps the selection stable when clicking an element after reaching the max selection limit', () => {
    render(
      <MaterialsInput
        value=""
        type={MaterialsInputType.ELEMENTS}
        allowedInputTypes={[MaterialsInputType.ELEMENTS]}
        showSubmitButton
        maxElementSelectable={5}
      />
    );

    const getElementsValue = () => screen.getByTestId('materials-input-search-input').getAttribute('value');

    fireEvent.click(screen.getByTestId('periodic-element-Li'));
    fireEvent.click(screen.getByTestId('periodic-element-Fe'));
    fireEvent.click(screen.getByTestId('periodic-element-Co'));
    fireEvent.click(screen.getByTestId('periodic-element-Ni'));
    fireEvent.click(screen.getByTestId('periodic-element-Cu'));

    expect(getElementsValue()).toBe('Li,Fe,Co,Ni,Cu');

    fireEvent.click(screen.getByTestId('periodic-element-He'));

    expect(getElementsValue()).toBe('Li,Fe,Co,Ni,Cu');
  });
});
