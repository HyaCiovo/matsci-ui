import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PeriodicContext, usePeriodicSelectionContext } from './PeriodicSelectionContext';
import { SelectableTable } from './SelectableTable';
import { TableSelectionStyle } from './types';
import { TableFilter } from '../TableFilter/TableFilter';

const SetEnabledElementsButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button type="button" onClick={() => actions.setEnabledElements({ Li: true, Fe: true })}>
      Set enabled elements
    </button>
  );
};

const ToggleDisabledElementButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button type="button" onClick={() => actions.toggleDisabledElement('He')}>
      Toggle disabled He
    </button>
  );
};

const AddEnabledElementButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button type="button" onClick={() => actions.addEnabledElement('Fe')}>
      Add enabled Fe
    </button>
  );
};

const RemoveEnabledElementButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button type="button" onClick={() => actions.removeEnabledElement('Li')}>
      Remove enabled Li
    </button>
  );
};

const ClearSelectionButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button
      type="button"
      onClick={() => {
        actions.setForwardChange(false);
        actions.clear();
      }}
    >
      Clear selection
    </button>
  );
};

const DisableForwardChangeButton = () => {
  const { actions } = usePeriodicSelectionContext();
  return (
    <button type="button" onClick={() => actions.setForwardChange(false)}>
      Disable forward change
    </button>
  );
};

describe('SelectableTable compatibility', () => {
  it('emits the current selection state once on mount to match the legacy callback contract', () => {
    const handleStateChange = vi.fn();

    render(<SelectableTable maxElementSelectable={5} onStateChange={handleStateChange} />);

    expect(handleStateChange).toHaveBeenCalledTimes(1);
    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: [],
      disabledElements: [],
    });
  });

  it('consumes initial enabled elements from PeriodicContext', () => {
    render(
      <PeriodicContext enabledElements={['Li']}>
        <SelectableTable maxElementSelectable={5} />
      </PeriodicContext>
    );

    expect(screen.getByTestId('periodic-element-Li')).toHaveClass('ms-enabled');
  });

  it('includes initial enabled and disabled state in the mount callback', () => {
    const handleStateChange = vi.fn();

    render(
      <PeriodicContext enabledElements={['Li']} disabledElements={['He']}>
        <SelectableTable maxElementSelectable={5} onStateChange={handleStateChange} />
      </PeriodicContext>
    );

    expect(handleStateChange).toHaveBeenCalledTimes(1);
    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: ['Li'],
      disabledElements: ['He'],
    });
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

    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: ['He'],
      disabledElements: [],
    });
    expect(firstTableHeButton).toHaveClass('ms-enabled');
    expect(secondTableHeButton).toHaveClass('ms-enabled');
  });

  it('emits table state changes with the legacy-compatible shape', () => {
    const handleTableStateChange = vi.fn();

    render(
      <PeriodicContext enabledElements={['Li']} hiddenElements={['He']}>
        <SelectableTable maxElementSelectable={5} onTableStateChange={handleTableStateChange} />
      </PeriodicContext>
    );

    expect(handleTableStateChange).toHaveBeenCalled();
    expect(handleTableStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabledElements: ['Li'],
        hiddenElements: ['He'],
        detailedElement: null,
        forwardOuterChange: true,
      })
    );
  });

  it('forwards external setEnabledElements updates through onStateChange', () => {
    const handleStateChange = vi.fn();

    render(
      <PeriodicContext>
        <SelectableTable maxElementSelectable={5} onStateChange={handleStateChange} />
        <SetEnabledElementsButton />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Set enabled elements' }));

    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: ['Li', 'Fe'],
      disabledElements: [],
    });
  });

  it('forwards disabled toggles in enable-disable mode', () => {
    const handleStateChange = vi.fn();

    render(
      <PeriodicContext selectionStyle={TableSelectionStyle.ENABLE_DISABLE}>
        <SelectableTable
          maxElementSelectable={5}
          selectionStyle={TableSelectionStyle.ENABLE_DISABLE}
          onStateChange={handleStateChange}
        />
        <ToggleDisabledElementButton />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle disabled He' }));

    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: [],
      disabledElements: ['He'],
    });
  });

  it('disables other elements when the max selection limit is reached in select mode', () => {
    render(<SelectableTable maxElementSelectable={1} />);

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    const heliumButton = screen.getByTestId('periodic-element-He');

    fireEvent.click(lithiumButton);

    expect(lithiumButton).toHaveClass('ms-enabled');
    expect(heliumButton).toHaveClass('ms-disabled');
  });

  it('replaces the previous selection when maxElementSelectable is 1 in select mode', () => {
    const handleStateChange = vi.fn();

    render(<SelectableTable maxElementSelectable={1} onStateChange={handleStateChange} />);

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    const heliumButton = screen.getByTestId('periodic-element-He');

    fireEvent.click(lithiumButton);
    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: ['Li'],
      disabledElements: [],
    });
    expect(heliumButton).toHaveClass('ms-disabled');

    fireEvent.click(heliumButton);
    expect(handleStateChange).toHaveBeenLastCalledWith({
      enabledElements: ['He'],
      disabledElements: [],
    });
    expect(lithiumButton).not.toHaveClass('ms-enabled');
    expect(heliumButton).toHaveClass('ms-enabled');
  });

  it('applies the same max-limit disabling behavior in multi-input-select mode', () => {
    render(
      <SelectableTable
        maxElementSelectable={1}
        selectionStyle={TableSelectionStyle.MULTI_INPUTS_SELECT}
      />
    );

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    const heliumButton = screen.getByTestId('periodic-element-He');

    fireEvent.click(lithiumButton);

    expect(lithiumButton).toHaveClass('ms-enabled');
    expect(heliumButton).toHaveClass('ms-disabled');
  });

  it('keeps only one enabled element at a time in multi-input-select mode', () => {
    render(
      <SelectableTable
        maxElementSelectable={5}
        selectionStyle={TableSelectionStyle.MULTI_INPUTS_SELECT}
      />
    );

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    const heliumButton = screen.getByTestId('periodic-element-He');

    fireEvent.click(lithiumButton);
    expect(lithiumButton).toHaveClass('ms-enabled');
    expect(lithiumButton).toHaveAttribute('data-last-action', 'select');

    fireEvent.click(heliumButton);
    expect(lithiumButton).not.toHaveClass('ms-enabled');
    expect(heliumButton).toHaveClass('ms-enabled');
    expect(heliumButton).toHaveAttribute('data-last-action', 'select');
  });

  it('marks deselection in lastAction data when toggling an enabled element off', () => {
    render(<SelectableTable maxElementSelectable={5} />);

    const lithiumButton = screen.getByTestId('periodic-element-Li');

    fireEvent.click(lithiumButton);
    expect(lithiumButton).toHaveAttribute('data-last-action', 'select');

    fireEvent.click(lithiumButton);
    expect(lithiumButton).toHaveAttribute('data-last-action', 'deselect');
  });

  it('clears lastAction after addEnabledElement to match the legacy action semantics', () => {
    render(
      <PeriodicContext enabledElements={['Li']}>
        <SelectableTable maxElementSelectable={5} />
        <AddEnabledElementButton />
      </PeriodicContext>
    );

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    fireEvent.click(lithiumButton);
    expect(lithiumButton).toHaveAttribute('data-last-action', 'deselect');

    fireEvent.click(screen.getByRole('button', { name: 'Add enabled Fe' }));
    expect(lithiumButton).not.toHaveAttribute('data-last-action');
    expect(screen.getByTestId('periodic-element-Fe')).not.toHaveAttribute('data-last-action');
  });

  it('clears lastAction after removeEnabledElement to avoid stale selection markers', () => {
    render(
      <PeriodicContext enabledElements={['Li']}>
        <SelectableTable maxElementSelectable={5} />
        <RemoveEnabledElementButton />
      </PeriodicContext>
    );

    const lithiumButton = screen.getByTestId('periodic-element-Li');
    fireEvent.click(lithiumButton);
    expect(lithiumButton).toHaveAttribute('data-last-action', 'deselect');

    fireEvent.click(screen.getByRole('button', { name: 'Remove enabled Li' }));
    expect(lithiumButton).not.toHaveAttribute('data-last-action');
  });

  it('resets forwardOuterChange to true when clear is triggered', () => {
    const handleTableStateChange = vi.fn();

    render(
      <PeriodicContext enabledElements={['Li']}>
        <SelectableTable maxElementSelectable={5} onTableStateChange={handleTableStateChange} />
        <ClearSelectionButton />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));

    expect(handleTableStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabledElements: [],
        disabledElements: [],
        hiddenElements: [],
        detailedElement: null,
        forwardOuterChange: true,
      })
    );
  });

  it('forces forwardOuterChange back to true on user toggles to match the legacy store', () => {
    const handleStateChange = vi.fn();
    const handleTableStateChange = vi.fn();

    render(
      <PeriodicContext>
        <SelectableTable
          maxElementSelectable={5}
          onStateChange={handleStateChange}
          onTableStateChange={handleTableStateChange}
        />
        <DisableForwardChangeButton />
      </PeriodicContext>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Disable forward change' }));
    fireEvent.click(screen.getByTestId('periodic-element-Li'));

    expect(handleStateChange).toHaveBeenLastCalledWith(['Li']);
    expect(handleTableStateChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        enabledElements: ['Li'],
        forwardOuterChange: true,
        lastAction: { type: 'select', element: 'Li' },
      })
    );
  });

  it('shows hovered element details through the spacer and callback', async () => {
    const handleDetailedElementChange = vi.fn();

    render(
      <SelectableTable
        maxElementSelectable={5}
        onDetailedElementChange={handleDetailedElementChange}
      />
    );

    fireEvent.mouseEnter(screen.getByTestId('periodic-element-He'));

    await waitFor(() => {
      expect(handleDetailedElementChange).toHaveBeenLastCalledWith(
        'He',
        expect.objectContaining({
          symbol: 'He',
          name: 'Helium',
          number: 2,
        })
      );
    });

    const detailPanel = document.querySelector('.ms-selectable-table-detail');
    expect(detailPanel).toBeTruthy();
    expect(detailPanel).toHaveTextContent('Helium');
    expect(detailPanel).toHaveTextContent('He');
    expect(detailPanel).toHaveTextContent('2');
  });

  it('clears hovered element details when the element becomes hidden by a filter', async () => {
    const handleDetailedElementChange = vi.fn();

    render(
      <PeriodicContext>
        <TableFilter />
        <SelectableTable
          maxElementSelectable={5}
          onDetailedElementChange={handleDetailedElementChange}
        />
      </PeriodicContext>
    );

    fireEvent.mouseEnter(screen.getByTestId('periodic-element-He'));

    await waitFor(() => {
      expect(handleDetailedElementChange).toHaveBeenLastCalledWith(
        'He',
        expect.objectContaining({ symbol: 'He' })
      );
    });

    fireEvent.click(screen.getByText('Phase'));
    fireEvent.click(screen.getByText('Solids'));

    await waitFor(() => {
      expect(handleDetailedElementChange).toHaveBeenLastCalledWith(null, null);
    });
  });
});
