import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

describe('Select', () => {
  it('renders selected option and clears it', async () => {
    const user = userEvent.setup();
    const setProps = vi.fn();

    render(
      <Select
        value="NM"
        setProps={setProps}
        isClearable
        options={[
          { label: 'Ferromagnetic', value: 'FM' },
          { label: 'Non-magnetic', value: 'NM' },
        ]}
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Non-magnetic');
    await user.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(setProps).toHaveBeenCalledWith({ value: null });
  });
});
