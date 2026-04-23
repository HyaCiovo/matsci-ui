import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows tooltip content when the trigger is hovered', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        id="tooltip-1"
        delayShow={0}
        trigger={<button type="button">Trigger</button>}
      >
        Hello tooltip
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger' }));
    expect((await screen.findAllByText('Hello tooltip')).length).toBeGreaterThan(0);
    expect(document.querySelector('.ms-tooltip-arrow')).toBeInTheDocument();
  });

  it('flips placement when there is not enough viewport space', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        id="tooltip-flip"
        place="bottom"
        delayShow={0}
        trigger={<button type="button">Edge Trigger</button>}
      >
        Flip tooltip
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Edge Trigger' });
    const originalRect = trigger.getBoundingClientRect.bind(trigger);
    trigger.getBoundingClientRect = () =>
      ({
        x: 10,
        y: window.innerHeight - 4,
        top: window.innerHeight - 4,
        left: 10,
        right: 90,
        bottom: window.innerHeight,
        width: 80,
        height: 4,
        toJSON: () => '',
      }) as DOMRect;

    await user.hover(trigger);

    await screen.findAllByText('Flip tooltip');
    await waitFor(() => {
      expect(document.querySelector('.ms-tooltip')).toHaveAttribute('data-side', 'top');
    });

    trigger.getBoundingClientRect = originalRect;
  });

});
