import { fireEvent, render, screen, within } from '@testing-library/react';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  const brandItem = { label: 'MP', href: '/' };
  const items = [
    { label: 'Docs', href: '/docs' },
    { label: 'More', items: [{ label: 'About', href: '/about' }] },
  ];

  it('renders brand and desktop items', () => {
    render(<Navbar brandItem={brandItem} items={items} />);

    const desktopMenu = document.querySelector('.navbar-menu');
    expect(desktopMenu).toBeTruthy();
    expect(screen.getAllByRole('link', { name: 'MP' })).toHaveLength(2);
    expect(within(desktopMenu as HTMLElement).getByRole('link', { name: 'Docs' })).toBeInTheDocument();
  });

  it('opens and closes the mobile menu', () => {
    render(<Navbar brandItem={brandItem} items={items} />);

    fireEvent.click(screen.getByTestId('navbar-burger-open'));
    expect(screen.getByTestId('navbar-mobile')).toHaveClass('is-active');

    fireEvent.click(screen.getByTestId('navbar-burger-close'));
    expect(screen.getByTestId('navbar-mobile')).not.toHaveClass('is-active');
  });

  it('expands grouped mobile items', () => {
    render(<Navbar brandItem={brandItem} items={items} />);

    fireEvent.click(screen.getByTestId('navbar-burger-open'));
    fireEvent.click(screen.getAllByText('More')[1].closest('a')!);

    const mobileMenu = screen.getByTestId('navbar-mobile');
    expect(within(mobileMenu).getByText('About')).toBeInTheDocument();
  });
});
