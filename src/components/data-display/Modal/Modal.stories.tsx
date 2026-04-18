import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, ModalContextProvider, ModalTrigger } from './index';

const meta = {
  title: 'Data Display/Modal',
  component: ModalContextProvider,
} satisfies Meta<typeof ModalContextProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <ModalContextProvider {...args}>
      <ModalTrigger>
        <button className="button">Open Modal</button>
      </ModalTrigger>
      <Modal>
        <div className="panel">
          <div className="panel-heading">Panel</div>
          <div className="panel-block p-5">content</div>
        </div>
      </Modal>
    </ModalContextProvider>
  ),
};

export const WithForcedAction: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);

    return (
      <ModalContextProvider {...args} active={active}>
        <ModalTrigger>
          <button className="button">Open Modal with Forced Action</button>
        </ModalTrigger>
        <Modal>
          <div className="panel">
            <div className="panel-heading">Panel</div>
            <div className="p-5">
              <div>
                <strong>Refresh page to close.</strong>
              </div>
              <div>You can also close it with an explicit action inside the modal.</div>
            </div>
            <button className="button m-5" onClick={() => setActive(false)}>
              Save
            </button>
          </div>
        </Modal>
      </ModalContextProvider>
    );
  },
  args: {
    forceAction: true,
  },
};
