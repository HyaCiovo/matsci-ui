import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import './Drawer.css';
import { ModalCloseButton } from '../Modal/ModalCloseButton/ModalCloseButton';
import { useDrawerContext } from './DrawerContextProvider';

export interface DrawerProps {
  id: string;
  setProps?: (value: any) => any;
  className?: string;
  children?: React.ReactNode;
}

export const Drawer = ({ id, className, children }: DrawerProps) => {
  const { activeDrawer, setActiveDrawer } = useDrawerContext();
  const isActive = activeDrawer === id;

  return (
    <Dialog.Root open={isActive} onOpenChange={(open) => setActiveDrawer(open ? id : null)}>
      <Dialog.Portal>
        {isActive ? <Dialog.Overlay className="mpc-drawer-overlay" /> : null}
        <Dialog.Content className={clsx('mpc-drawer', className, { 'is-active': isActive })}>
          <ModalCloseButton onClick={() => setActiveDrawer(null)} />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
