import clsx from 'clsx';
import type { ReactNode } from 'react';

export interface ButtonBarProps {
  id?: string;
  className?: string;
  setProps?: (value: any) => any;
  children?: ReactNode;
}

export const ButtonBar = ({ id, className, children }: ButtonBarProps) => {
  return (
    <div id={id} className={clsx('ms-button-bar', className)}>
      {children}
    </div>
  );
};
