import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  asChild?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ asChild, className, ...props }, ref) => {
  const Comp: any = asChild ? Slot : 'input';
  return <Comp ref={ref} className={clsx('ms-input', className)} {...props} />;
});

Input.displayName = 'Input';
