import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('opens and renders items when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Dropdown triggerLabel="Items" items={['One', 'Two']} />);

    await user.click(screen.getByRole('button', { name: /Items/i }));
    expect(await screen.findByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('stays open on selection when closeOnSelection is false', async () => {
    const user = userEvent.setup();
    render(<Dropdown triggerLabel="Items" items={['One', 'Two']} closeOnSelection={false} />);

    await user.click(screen.getByRole('button', { name: /Items/i }));
    const item = await screen.findByText('One');
    await user.click(item);

    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('keeps the menu on the top side when isUp is enabled', async () => {
    const user = userEvent.setup();
    const { container } = render(<Dropdown triggerLabel="Items" items={['One', 'Two']} isUp />);

    await user.click(screen.getByRole('button', { name: /Items/i }));

    expect(container.querySelector('.ms-dropdown')).toHaveClass('ms-is-up');
    expect(container.querySelector('.ms-dropdown-menu')).toBeInTheDocument();
    expect(await screen.findByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });
});
