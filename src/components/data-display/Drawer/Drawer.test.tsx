import { fireEvent, render, screen } from '@testing-library/react';
import { Drawer } from './Drawer';
import { DrawerContextProvider } from './DrawerContextProvider';
import { DrawerTrigger } from './DrawerTrigger';

describe('Drawer', () => {
  it('opens and closes the targeted drawer', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Drawer 1' }));
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
  });
});
