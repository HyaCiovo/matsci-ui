import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NotificationDropdown } from './NotificationDropdown';

describe('NotificationDropdown', () => {
  const items = [
    {
      id: 'n1',
      label: 'Maintenance notice',
      header: 'Maintenance',
      content: 'The service will be unavailable for **30 minutes**.',
    },
    {
      id: 'n2',
      label: 'New feature',
      header: 'Feature update',
      content: 'A new dashboard is now available.',
    },
  ];

  it('shows a bell badge when unread notifications exist', () => {
    render(<NotificationDropdown items={items} notifyLevel="message" hasUnread />);

    expect(document.querySelector('.notification-badge')).toBeTruthy();
  });

  it('marks a message as read when it is opened', async () => {
    render(<NotificationDropdown items={items} notifyLevel="message" hasUnread />);

    fireEvent.click(screen.getByTestId('notification-dropdown'));
    fireEvent.click(screen.getByText('Maintenance notice'));

    await waitFor(() => {
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
    });

    expect(document.querySelectorAll('.notification-dot')).toHaveLength(1);
  });

  it('renders a more link when provided', () => {
    render(<NotificationDropdown items={items} link="https://materialsproject.org" />);

    fireEvent.click(screen.getByTestId('notification-dropdown'));
    expect(screen.getByRole('link', { name: 'More' })).toHaveAttribute(
      'href',
      'https://materialsproject.org'
    );
  });
});
