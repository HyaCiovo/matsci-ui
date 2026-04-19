import { fireEvent, render, screen } from '@testing-library/react';
import { NavbarDropdown } from './NavbarDropdown';

describe('NavbarDropdown', () => {
  it('opens on hover by default', () => {
    render(
      <NavbarDropdown items={[{ label: 'Docs', href: '/docs' }]}>
        More
      </NavbarDropdown>
    );

    fireEvent.mouseEnter(screen.getByTestId('navbar-dropdown'));
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('toggles on click when active-on-click is enabled', () => {
    render(
      <NavbarDropdown isActiveOnClick items={[{ label: 'About', href: '/about' }]}>
        Menu
      </NavbarDropdown>
    );

    fireEvent.click(screen.getByTestId('navbar-dropdown'));
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
