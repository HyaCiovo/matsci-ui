import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GlobalSearchBar } from './GlobalSearchBar';

vi.mock('../MaterialsInput', () => ({
  MaterialsInputType: {
    ELEMENTS: 'elements',
    CHEMICAL_SYSTEM: 'chemical_system',
    FORMULA: 'formula',
    MPID: 'material_ids',
  },
  PeriodicTableMode: {
    TOGGLE: 'toggle',
  },
  MaterialsInput: ({ onChange, onInputTypeChange, onSubmit }: any) => (
    <div>
      <input
        data-testid="materials-input-search-input"
        onChange={(event) => {
          onChange?.(event.target.value);
          onInputTypeChange?.('chemical_system');
        }}
      />
      <button
        type="button"
        data-testid="materials-input-submit-button"
        onClick={(event) => onSubmit?.(event, 'Fe-Co')}
      >
        Search
      </button>
    </div>
  ),
}));

describe('GlobalSearchBar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('navigates with the detected search input type in the query string', async () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent');

    render(<GlobalSearchBar redirectRoute="/materials" />);

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'Fe-Co' },
    });
    fireEvent.click(screen.getByTestId('materials-input-submit-button'));

    await waitFor(() => {
      expect(pushState).toHaveBeenCalledWith({}, '', '/materials?chemical_system=Fe-Co');
      expect(dispatchEvent).toHaveBeenCalled();
    });
  });
});
