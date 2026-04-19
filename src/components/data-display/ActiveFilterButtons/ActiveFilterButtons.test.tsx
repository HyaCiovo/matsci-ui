import { fireEvent, render, screen } from '@testing-library/react';
import { ActiveFilterButtons } from './ActiveFilterButtons';

describe('ActiveFilterButtons', () => {
  it('renders formula and range values and calls back with params', () => {
    const onClick = vi.fn();

    render(
      <ActiveFilterButtons
        filters={[
          {
            name: 'Formula',
            value: 'Fe2O3',
            params: ['formula'],
          },
          {
            name: 'Band Gap',
            value: [1000, 5000],
            defaultValue: [0, 5000],
            params: ['band_gap_min', 'band_gap_max'],
          },
        ]}
        onClick={onClick}
      />
    );

    expect(screen.getByTestId('active-filter-buttons')).toBeInTheDocument();
    expect(screen.getByTestId('formula')).toHaveTextContent('Fe2O3');
    expect(screen.getByText('Band Gap: 1,000 or more')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(onClick).toHaveBeenCalledWith(['band_gap_min', 'band_gap_max']);
  });
});
