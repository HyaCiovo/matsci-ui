import axios from 'axios';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MaterialsInput, MaterialsInputType, PeriodicTableMode } from './MaterialsInput';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('<MaterialsInput />', () => {
  test('multi-type input with periodic selector, submit button, help and autocomplete', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [{ formula_pretty: 'GaN' }, { formula_pretty: 'Ga2N2' }],
      },
    } as any);

    render(
      <MaterialsInput
        type={MaterialsInputType.ELEMENTS}
        allowedInputTypes={[MaterialsInputType.ELEMENTS, MaterialsInputType.FORMULA]}
        periodicTableMode={PeriodicTableMode.TOGGLE}
        showSubmitButton
        showTypeDropdown
        helpItems={[{ label: 'Search Help' }]}
        autocompleteFormulaUrl="https://example.org/autocomplete"
        autocompleteApiKey="key"
      />
    );

    expect(screen.getByTestId('materials-input-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-form')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-help-button')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-periodic-table')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('materials-input-submit-button')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Ga,N' },
    });
    expect(screen.getByRole('button', { name: 'Ga' })).toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'N' })).toHaveClass('enabled');

    expect(screen.getByTestId('materials-input-toggle-button').firstChild).toHaveClass('is-active');
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(screen.getByTestId('materials-input-toggle-button'));
    expect(screen.getByTestId('materials-input-toggle-button').firstChild).not.toHaveClass('is-active');
    expect(screen.getByTestId('materials-input-periodic-table')).toHaveAttribute('aria-hidden', 'true');

    await userEvent.clear(screen.getByTestId('materials-input-search-input'));
    fireEvent.click(screen.getByTestId('materials-input-toggle-button'));
    expect(screen.getByRole('button', { name: 'Ga' })).not.toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'N' })).not.toHaveClass('enabled');

    fireEvent.click(screen.getByRole('button', { name: 'Fe' }));
    fireEvent.click(screen.getByRole('button', { name: 'Co' }));
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Fe,Co');
    fireEvent.click(screen.getByRole('button', { name: 'Fe' }));
    fireEvent.click(screen.getByRole('button', { name: 'Co' }));
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('');

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'GaN' },
    });
    expect(screen.getByRole('button', { name: 'Ga' })).toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'N' })).toHaveClass('enabled');
    expect(screen.getByRole('combobox', { name: 'Input type' })).toHaveValue('Formula');

    screen.getByTestId('materials-input-search-input').focus();
    await waitFor(() => {
      expect(screen.getByTestId('materials-input-autocomplete-menu')).not.toHaveClass('is-hidden');
      expect(screen.getByTestId('materials-input-autocomplete-menu-items').childNodes.length).toBeGreaterThan(1);
    });
  });

  test('chemical system input with maximum elements limit', () => {
    render(
      <MaterialsInput
        type={MaterialsInputType.CHEMICAL_SYSTEM}
        allowedInputTypes={[MaterialsInputType.CHEMICAL_SYSTEM]}
        periodicTableMode={PeriodicTableMode.TOGGLE}
        maxElementSelectable={4}
        showSubmitButton
      />
    );

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Fe-Co-Ni-Cu' },
    });
    expect(screen.getByRole('button', { name: 'Fe' })).toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'Co' })).toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'Ni' })).toHaveClass('enabled');
    expect(screen.getByRole('button', { name: 'Cu' })).toHaveClass('enabled');

    expect(screen.getByRole('button', { name: 'H' })).toHaveClass('disabled');

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Fe-Co-Ni-Cu-Al' },
    });
    expect(screen.getByTestId('materials-input-search-input')).toHaveValue('Fe-Co-Ni-Cu');

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Fe-Co-Ni' },
    });
    expect(screen.getByRole('button', { name: 'H' })).not.toHaveClass('disabled');
  });
});
