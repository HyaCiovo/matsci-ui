import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalContextProvider, ModalTrigger } from '../../components/data-display/Modal';

const meta = {
  component: ModalContextProvider,
  title: 'Data-Display/Modal'
} satisfies Meta<typeof ModalContextProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <ModalContextProvider>
      <ModalTrigger>
        <button className="ms-button">Open Modal</button>
      </ModalTrigger>
      <Modal>
        <div className="ms-panel">
          <div className="ms-panel-heading">Panel</div>
          <div className="ms-panel-block ms-p-5">content</div>
        </div>
      </Modal>
    </ModalContextProvider>
  )
};

export const WithForcedAction: Story = {
  render: () => {
    const [active, setActive] = useState(false);
    return (
      <ModalContextProvider forceAction={true} active={active}>
        <ModalTrigger>
          <button className="ms-button">Open Modal with Forced Action</button>
        </ModalTrigger>
        <Modal>
          <div className="ms-panel">
            <div className="ms-panel-heading">Panel</div>
            <div className="ms-p-5">
              <div>
                <strong>Refresh page to close.</strong>
              </div>
              <div>
                In a normal react context, you can set the active prop to a state variable and modify
                that state from a button inside the modal.
              </div>
            </div>
            <button className="ms-button ms-m-5" onClick={() => setActive(false)}>
              Save
            </button>
          </div>
        </Modal>
      </ModalContextProvider>
    );
  }
};
