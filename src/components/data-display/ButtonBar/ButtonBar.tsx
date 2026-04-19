import clsx from 'clsx';
import type { ReactNode } from 'react';
import './ButtonBar.css';

export interface ButtonBarProps {
  id?: string;
  className?: string;
  setProps?: (value: any) => any;
  children?: ReactNode;
}

export const ButtonBar = ({ id, className, children }: ButtonBarProps) => {
  return (
    <div id={id} className={clsx('mpc-button-bar', className)}>
      {children}
    </div>
  );
};
