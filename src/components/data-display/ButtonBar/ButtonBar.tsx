import classNames from 'classnames';
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
    <div id={id} className={classNames('mpc-button-bar', className)}>
      {children}
    </div>
  );
};
