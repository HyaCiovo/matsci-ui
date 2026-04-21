import { fireEvent, render, screen } from '@testing-library/react';
import { MaterialsInputBox } from './MaterialsInputBox';
import { MaterialsInputType } from '../utils';
import { PeriodicTableMode } from '../MaterialsInput';

describe('MaterialsInputBox', () => {
  it('renders the integrated controls and delegates interactions', () => {
    const onTypeChange = vi.fn();
    const onInputChange = vi.fn();
    const onHelpToggle = vi.fn();
    const onPeriodicToggle = vi.fn();

    render(
      <MaterialsInputBox
        label="Search"
        showTypeDropdown
        typeDropdownValue="Only"
        typeDropdownOptions={['Only', 'At Least']}
        onTypeChange={onTypeChange}
        inputRef={{ current: null }}
        inputValue="Li-Fe"
        inputType={MaterialsInputType.CHEMICAL_SYSTEM}
        onInputChange={onInputChange}
        onFocus={() => undefined}
        onBlur={() => undefined}
        onKeyDown={() => undefined}
        onAutocompleteChange={() => undefined}
        setError={() => undefined}
        helpItems={[{ label: 'Examples' }]}
        showInputHelp={false}
        onHelpChange={() => undefined}
        onHelpToggle={onHelpToggle}
        helpTooltipId="help-tooltip"
        onErrorMouseOver={() => undefined}
        errorTooltipId="error-tooltip"
        periodicTableMode={PeriodicTableMode.TOGGLE}
        hasPeriodicTable
        showPeriodicTable={false}
        onPeriodicToggle={onPeriodicToggle}
        periodicToggleTooltipId="periodic-tooltip"
        showSubmitButton
        submitButtonText="Search"
        disableSubmitButton={false}
      />
    );

    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Li-Fe');

    fireEvent.click(screen.getByRole('button', { name: 'Only' }));
    fireEvent.click(screen.getByRole('button', { name: 'At Least' }));
    expect(onTypeChange).toHaveBeenCalledWith('At Least');

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Li-Fe-Co' },
    });
    expect(onInputChange).toHaveBeenCalled();

    expect(screen.queryByTestId('materials-input-clear')).toBeNull();

    fireEvent.click(screen.getByTestId('materials-input-help-button'));
    expect(onHelpToggle).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('materials-input-toggle-button'));
    expect(onPeriodicToggle).toHaveBeenCalled();

    expect(screen.getByTestId('materials-input-submit-button')).toHaveTextContent('Search');
  });
});
