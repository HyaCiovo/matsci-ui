import { fireEvent, render, screen } from '@testing-library/react';
import { PeriodicContext } from '../SelectableTable/PeriodicSelectionContext';
import { SelectableTable } from '../SelectableTable/SelectableTable';
import { TableFilter } from './TableFilter';

describe('TableFilter', () => {
  it('renders with All selected by default and no subfilters', () => {
    const { container } = render(<TableFilter />);

    expect(container.querySelector('.mat-table-filter')).toBeInTheDocument();
    expect(screen.getByText('All')).toHaveClass('selected');
    expect(container.querySelectorAll('.sub-filter-selector .current-filter-selector')).toHaveLength(0);
  });

  it('shows subfilters when a top-level filter is selected', () => {
    const { container } = render(<TableFilter />);

    fireEvent.click(screen.getByText('Metals'));

    expect(screen.getByText('Metals')).toHaveClass('selected');
    expect(container.querySelectorAll('.sub-filter-selector .current-filter-selector')).toHaveLength(7);
    expect(container.querySelectorAll('.sub-filter-selector .current-filter-selector.selected')).toHaveLength(7);
  });

  it('updates the shared periodic table hidden state through PeriodicContext', () => {
    render(
      <PeriodicContext>
        <TableFilter />
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByText('Phase'));
    fireEvent.click(screen.getByText('Gases'));

    expect(screen.getByTestId('periodic-element-H')).toBeInTheDocument();
    expect(screen.queryByTestId('periodic-element-Fe')).not.toBeInTheDocument();
  });

  it('clears the previous hidden state when switching top-level filter groups', () => {
    render(
      <PeriodicContext>
        <TableFilter />
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByText('Phase'));
    fireEvent.click(screen.getByText('Gases'));
    expect(screen.queryByTestId('periodic-element-Fe')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Metals'));

    expect(screen.getByTestId('periodic-element-Fe')).toBeInTheDocument();
    expect(screen.getByText('Metals')).toHaveClass('selected');
    expect(screen.getByText('Transition Metals')).toBeInTheDocument();
  });
});
