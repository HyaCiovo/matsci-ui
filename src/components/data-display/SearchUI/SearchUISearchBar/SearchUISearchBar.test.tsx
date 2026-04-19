import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { SearchUISearchBar } from './SearchUISearchBar';

vi.mock('../../../data-entry/MaterialsInput/MaterialsInput', () => ({
  MaterialsInputType: {
    CHEMICAL_SYSTEM: 'chemical_system',
    ELEMENTS: 'elements',
    FORMULA: 'formula',
    MPID: 'mpid',
  },
  PeriodicTableMode: {
    TOGGLE: 'toggle',
  },
  MaterialsInput: ({
    value,
    type,
    onInputTypeChange,
    onSubmit,
  }: {
    value?: string;
    type?: string;
    onInputTypeChange?: (value: 'formula') => void;
    onSubmit?: (event: { preventDefault: () => void }, value: string) => void;
  }) => (
    <div>
      <div data-testid="materials-input-type">{type}</div>
      <div data-testid="materials-input-value">{value}</div>
      <button type="button" onClick={() => onInputTypeChange?.('formula')}>
        choose-formula
      </button>
      <button
        type="button"
        onClick={() =>
          onSubmit?.(
            {
              preventDefault: () => {},
            },
            'Fe2O3'
          )
        }
      >
        submit-formula
      </button>
    </div>
  ),
}));

const QueryProbe = () => {
  const { query } = useSearchUIContext();
  return <pre data-testid="query-probe">{JSON.stringify(query)}</pre>;
};

describe('SearchUISearchBar', () => {
  it('infers the current input type and value from existing query params', async () => {
    window.history.replaceState({}, '', '/?material_ids=mp-149');

    render(
      <SearchUIContainer searchOnMount={false}>
        <SearchUISearchBar
          allowedInputTypesMap={{
            elements: { field: 'elements' },
            formula: { field: 'formula' },
            mpid: { field: 'material_ids' },
          }}
        />
      </SearchUIContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('materials-input-type')).toHaveTextContent('mpid');
      expect(screen.getByTestId('materials-input-value')).toHaveTextContent('mp-149');
    });
  });

  it('clears stale search fields when submitting a different input type', async () => {
    window.history.replaceState({}, '', '/?elements=Li%2CFe&material_ids=mp-149');

    render(
      <SearchUIContainer apiEndpoint="https://example.com/materials" searchOnMount={false}>
        <SearchUISearchBar
          allowedInputTypesMap={{
            elements: { field: 'elements' },
            formula: { field: 'formula' },
            mpid: { field: 'material_ids' },
          }}
        />
        <QueryProbe />
      </SearchUIContainer>
    );

    fireEvent.click(screen.getByText('choose-formula'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"formula"');
    });

    fireEvent.click(screen.getByText('submit-formula'));

    await waitFor(() => {
      const queryText = screen.getByTestId('query-probe').textContent ?? '';
      expect(queryText).toContain('"formula":"Fe2O3"');
      expect(queryText).not.toContain('"elements"');
      expect(queryText).not.toContain('"material_ids"');
      expect(queryText).not.toContain('"_inputType"');
    });
  });
});
