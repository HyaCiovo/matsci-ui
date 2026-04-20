import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortDropdown } from './SortDropdown';

describe('SortDropdown', () => {
  it('changes sort field and direction', async () => {
    const user = userEvent.setup();
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

    await user.click(screen.getByRole('button', { name: /Sort: Material ID/i }));
    await user.click(await screen.findByText('Formula'));

    expect(setSortField).toHaveBeenCalledWith('formula_pretty');

    await user.click(screen.getByTestId('sort-button'));
    expect(setSortAscending).toHaveBeenCalledWith(true);
  });
});
