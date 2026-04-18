import classNames from 'classnames';
import { type ReactNode } from 'react';
import { useModalContext } from './ModalContextProvider';

export interface ModalTriggerProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  children?: ReactNode;
}

export const ModalTrigger = ({ id, className, children }: ModalTriggerProps) => {
  const { active, setActive } = useModalContext();

  return (
    <span
      id={id}
      className={classNames('mpc-modal-trigger', className)}
      onClick={() => setActive(!active)}
    >
      {children}
    </span>
  );
};
