import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Drawer } from './Drawer';
import { DrawerContextProvider } from './DrawerContextProvider';
import { DrawerTrigger } from './DrawerTrigger';

describe('Drawer', () => {
  it('opens and closes the targeted drawer', async () => {
    render(
      <DrawerContextProvider>
        <DrawerTrigger forDrawerId="drawer-1">
          <button type="button">Drawer 1</button>
        </DrawerTrigger>
        <Drawer id="drawer-1">
          <div>Drawer Content</div>
        </Drawer>
      </DrawerContextProvider>
    );

    expect(document.body.querySelector('.mpc-drawer')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Drawer 1' }));
    const drawer = document.body.querySelector('.mpc-drawer');
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
    expect(['closed', 'opening', 'open']).toContain(drawer?.getAttribute('data-phase'));

    await waitFor(() => {
      expect(['opening', 'open']).toContain(drawer?.getAttribute('data-phase'));
    });

    fireEvent.click(screen.getByLabelText('close'));
    await waitFor(() => {
      expect(drawer).toHaveAttribute('data-phase', 'closing');
    });
  });

  it('supports alternate drawer positions', () => {
    render(
      <DrawerContextProvider>
        <DrawerTrigger forDrawerId="drawer-bottom">
          <button type="button">Bottom Drawer</button>
        </DrawerTrigger>
        <Drawer id="drawer-bottom" position="bottom">
          <div>Bottom Content</div>
        </Drawer>
      </DrawerContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Bottom Drawer' }));
    expect(document.body.querySelector('.mpc-drawer')).toHaveAttribute('data-position', 'bottom');
  });

  it('applies a custom duration through the drawer style variable', () => {
    render(
      <DrawerContextProvider>
        <DrawerTrigger forDrawerId="drawer-fast">
          <button type="button">Fast Drawer</button>
        </DrawerTrigger>
        <Drawer id="drawer-fast" duration={650}>
          <div>Fast Content</div>
        </Drawer>
      </DrawerContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Fast Drawer' }));
    expect(document.body.querySelector('.mpc-drawer')).toHaveStyle('--mpc-drawer-duration: 650ms');
  });

  it('keeps the new drawer opening while the previous drawer is closing', async () => {
    render(
      <DrawerContextProvider>
        <DrawerTrigger forDrawerId="drawer-1">
          <button type="button">Drawer 1</button>
        </DrawerTrigger>
        <DrawerTrigger forDrawerId="drawer-2">
          <button type="button">Drawer 2</button>
        </DrawerTrigger>
        <Drawer id="drawer-1">
          <div>First Drawer</div>
        </Drawer>
        <Drawer id="drawer-2">
          <div>Second Drawer</div>
        </Drawer>
      </DrawerContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Drawer 1' }));
    await waitFor(() => {
      const firstDrawer = Array.from(document.body.querySelectorAll('.mpc-drawer')).find((drawer) =>
        (drawer.textContent ?? '').includes('First Drawer')
      );
      expect(firstDrawer).toHaveAttribute('data-phase', 'open');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Drawer 2' }));

    await waitFor(() => {
      const drawers = Array.from(document.body.querySelectorAll('.mpc-drawer'));
      expect(drawers).toHaveLength(2);
      expect(drawers.some((drawer) => drawer.getAttribute('data-phase') === 'closing')).toBe(true);
      expect(
        drawers.some((drawer) => {
          const text = drawer.textContent ?? '';
          return text.includes('Second Drawer') && ['opening', 'open'].includes(drawer.getAttribute('data-phase') ?? '');
        })
      ).toBe(true);
    });
  });
});
