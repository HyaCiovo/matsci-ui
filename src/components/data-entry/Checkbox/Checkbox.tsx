import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { FaCheck, FaMinus } from 'react-icons/fa';
import './Checkbox.css';

export type CheckboxCheckedState = CheckboxPrimitive.CheckedState;

export type CheckboxProps = Omit<CheckboxPrimitive.CheckboxProps, 'checked' | 'defaultChecked' | 'onCheckedChange'> & {
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Root ref={ref} className={clsx('mpc-checkbox-root', className)} {...props}>
        <CheckboxPrimitive.Indicator className="mpc-checkbox-indicator">
          <FaCheck aria-hidden="true" className="mpc-checkbox-icon is-check" />
          <FaMinus aria-hidden="true" className="mpc-checkbox-icon is-indeterminate" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);

Checkbox.displayName = 'Checkbox';
