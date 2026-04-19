import { fireEvent, render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('shows subapps when hovering a main app', () => {
    render(<Sidebar currentApp="" layout="vertical" onAppSelected={() => undefined} />);

    fireEvent.mouseEnter(screen.getByTestId('sidebar-app-explore'));

    expect(screen.getByTestId('sidebar-popover')).toBeInTheDocument();
    expect(screen.getByText('Materials Explorer')).toBeInTheDocument();
    expect(screen.getByText('Battery Explorer')).toBeInTheDocument();
  });

  it('calls onAppSelected when a subapp is clicked', () => {
    const handleSelect = vi.fn();

    render(<Sidebar currentApp="" layout="vertical" onAppSelected={handleSelect} />);

    fireEvent.mouseEnter(screen.getByTestId('sidebar-app-explore'));
    fireEvent.click(screen.getByRole('button', { name: /Materials Explorer/i }));

    expect(handleSelect).toHaveBeenCalledWith('mat-explore');
  });

  it('shows the selected subapp label on its parent app', () => {
    render(<Sidebar currentApp="mat-explore" layout="vertical" onAppSelected={() => undefined} />);

    expect(screen.getByText('Materials Explorer')).toBeInTheDocument();
  });
});
