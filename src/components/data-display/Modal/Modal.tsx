import * as Dialog from '@radix-ui/react-dialog';
import classNames from 'classnames';
import './Modal.css';
import { ModalCloseButton } from './ModalCloseButton/ModalCloseButton';
import { useModalContext } from './ModalContextProvider';

export interface ModalProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children?: React.ReactNode;
}

export const Modal = ({ id, className, children }: ModalProps) => {
  const { active, setActive, forceAction } = useModalContext();

  return (
    <Dialog.Root open={active} onOpenChange={(nextOpen) => (!forceAction ? setActive(nextOpen) : undefined)}>
      <Dialog.Portal>
        <div id={id} className={classNames('mpc-modal modal', className, { 'is-active': active })}>
          <Dialog.Overlay className="modal-background" />
          <Dialog.Content
            className="modal-content"
            onEscapeKeyDown={(event) => {
              if (forceAction) {
                event.preventDefault();
              }
            }}
            onPointerDownOutside={(event) => {
              if (forceAction) {
                event.preventDefault();
              }
            }}
          >
            {!forceAction ? <ModalCloseButton onClick={() => setActive(false)} /> : null}
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
