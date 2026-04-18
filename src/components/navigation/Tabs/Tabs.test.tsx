import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('renders the active tab content and updates tabIndex through setProps', async () => {
    const setProps = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs labels={['One', 'Two']} setProps={setProps}>
        <div>First panel</div>
        <div>Second panel</div>
      </Tabs>
    );

    expect(screen.getByText('First panel')).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Two' }));

    await waitFor(() => {
      expect(setProps).toHaveBeenLastCalledWith({ tabIndex: 1 });
      expect(screen.getByText('Second panel')).toBeVisible();
    });
  });

  it('respects external tabIndex updates', () => {
    const { rerender } = render(
      <Tabs labels={['One', 'Two']} tabIndex={0}>
        <div>First panel</div>
        <div>Second panel</div>
      </Tabs>
    );

    rerender(
      <Tabs labels={['One', 'Two']} tabIndex={1}>
        <div>First panel</div>
        <div>Second panel</div>
      </Tabs>
    );

    expect(screen.getByText('Second panel')).toBeVisible();
  });
});
