import { fireEvent, render, screen } from '@testing-library/react';
import { Modal } from './Modal';
import { ModalContextProvider } from './ModalContextProvider';
import { ModalTrigger } from './ModalTrigger';

describe('Modal', () => {
  it('opens from the trigger and closes from the close button', () => {
    render(
      <ModalContextProvider>
        <ModalTrigger>
          <button type="button">Open Modal</button>
        </ModalTrigger>
        <Modal>
          <div>Modal content</div>
        </Modal>
      </ModalContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open Modal' }));
    expect(screen.getByText('Modal content')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('close'));
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('does not render a close button when forceAction is enabled', () => {
    render(
      <ModalContextProvider active forceAction>
        <Modal>
          <div>Forced action modal</div>
        </Modal>
      </ModalContextProvider>
    );

    expect(screen.getByText('Forced action modal')).toBeInTheDocument();
    expect(screen.queryByLabelText('close')).not.toBeInTheDocument();
  });
});
