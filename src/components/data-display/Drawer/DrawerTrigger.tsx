import clsx from 'clsx';
import { type ReactNode } from 'react';
import { useDrawerContext } from './DrawerContextProvider';

export interface DrawerTriggerProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  forDrawerId: string;
  children?: ReactNode;
}

export const DrawerTrigger = ({ id, className, forDrawerId, children }: DrawerTriggerProps) => {
  const { activeDrawer, setActiveDrawer } = useDrawerContext();

  return (
    <span
      id={id}
      className={clsx('mpc-drawer-trigger', className)}
      onClick={() => setActiveDrawer(activeDrawer === forDrawerId ? null : forDrawerId)}
    >
      {children}
    </span>
  );
};
