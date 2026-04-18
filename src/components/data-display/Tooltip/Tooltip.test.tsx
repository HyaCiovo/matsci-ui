import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows tooltip content when the trigger is hovered', async () => {
    render(
      <>
        <button data-for="tooltip-1">Trigger</button>
        <Tooltip id="tooltip-1" delayShow={0}>
          Hello tooltip
        </Tooltip>
      </>
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Hello tooltip');
    });
  });
});
