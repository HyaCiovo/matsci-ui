import { fireEvent, render, screen } from '@testing-library/react';
import { PeriodicContext } from './PeriodicSelectionContext';
import { SelectableTable } from './SelectableTable';

describe('SelectableTable compatibility', () => {
  it('consumes initial enabled elements from PeriodicContext', () => {
    render(
      <PeriodicContext enabledElements={['Li']}>
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    expect(screen.getByTestId('periodic-element-Li')).toHaveClass('enabled');
  });

  it('shares selection state across tables inside the same PeriodicContext', () => {
    const handleStateChange = vi.fn();

    render(
      <PeriodicContext>
        <SelectableTable maxElementSelectable={5} onStateChange={handleStateChange} />
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    const firstTableHeButton = screen.getAllByTestId('periodic-element-He')[0];
    const secondTableHeButton = screen.getAllByTestId('periodic-element-He')[1];

    fireEvent.click(firstTableHeButton);

    expect(handleStateChange).toHaveBeenLastCalledWith(['He']);
    expect(firstTableHeButton).toHaveClass('enabled');
    expect(secondTableHeButton).toHaveClass('enabled');
  });
});
