import { fireEvent, render, screen, within } from '@testing-library/react';
import { PeriodicContext } from '../SelectableTable/PeriodicSelectionContext';
import { SelectableTable } from '../SelectableTable/SelectableTable';
import { TableFilter } from './TableFilter';

describe('TableFilter', () => {
  it('renders with All selected by default and no subfilters', () => {
    const { container } = render(<TableFilter />);

    expect(container.querySelector('.ms-mat-table-filter')).toBeInTheDocument();
    expect(screen.getByText('All')).toHaveClass('ms-selected');
    expect(container.querySelectorAll('.ms-sub-filter-selector .ms-current-filter-selector')).toHaveLength(0);
  });

  it('shows subfilters when a top-level filter is selected', () => {
    const { container } = render(<TableFilter />);

    fireEvent.click(screen.getByText('Metals'));

    expect(screen.getByText('Metals')).toHaveClass('ms-selected');
    expect(container.querySelectorAll('.ms-sub-filter-selector .ms-current-filter-selector')).toHaveLength(7);
    expect(container.querySelectorAll('.ms-sub-filter-selector .ms-current-filter-selector.ms-selected')).toHaveLength(7);
  });

  it('keeps only the clicked subfilter selected after choosing a subfilter', () => {
    const { container } = render(<TableFilter />);

    fireEvent.click(screen.getByText('Metals'));
    fireEvent.click(screen.getByText('Transition Metals'));

    const selectedSubfilters = container.querySelectorAll(
      '.ms-sub-filter-selector .ms-current-filter-selector.ms-selected'
    );

    expect(selectedSubfilters).toHaveLength(1);
    expect(screen.getByText('Transition Metals')).toHaveClass('ms-selected');
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
    expect(screen.getByText('Metals')).toHaveClass('ms-selected');
    expect(screen.getByText('Transition Metals')).toBeInTheDocument();
  });

  it('filters by group without relying on the category mapper path', () => {
    const { container } = render(
      <PeriodicContext>
        <TableFilter />
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByText('Groups'));
    const subFilterSelector = container.querySelector('.ms-sub-filter-selector');
    expect(subFilterSelector).toBeTruthy();
    fireEvent.click(within(subFilterSelector as HTMLElement).getByText('1'));

    expect(screen.getByTestId('periodic-element-H')).toBeInTheDocument();
    expect(screen.getByTestId('periodic-element-Li')).toBeInTheDocument();
    expect(screen.queryByTestId('periodic-element-He')).not.toBeInTheDocument();
    expect(screen.queryByTestId('periodic-element-Fe')).not.toBeInTheDocument();
  });
});
