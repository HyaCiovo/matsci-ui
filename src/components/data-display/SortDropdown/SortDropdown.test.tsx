import { fireEvent, render, screen } from '@testing-library/react';
import { SortDropdown } from './SortDropdown';

describe('SortDropdown', () => {
  it('changes sort field and direction', () => {
    const setSortField = vi.fn();
    const setSortAscending = vi.fn();

    render(
      <SortDropdown
        sortValues={[{ material_id: 'mp-149' }]}
        sortOptions={[
          { label: 'Material ID', value: 'material_id' },
          { label: 'Formula', value: 'formula_pretty' },
        ]}
        sortField="material_id"
        setSortField={setSortField}
        sortAscending={false}
        setSortAscending={setSortAscending}
      />
    );

    fireEvent.change(screen.getByTestId('sort-field-select'), {
      target: { value: 'formula_pretty' },
    });
    expect(setSortField).toHaveBeenCalledWith('formula_pretty');

    fireEvent.click(screen.getByTestId('sort-button'));
    expect(setSortAscending).toHaveBeenCalledWith(true);
  });
});
