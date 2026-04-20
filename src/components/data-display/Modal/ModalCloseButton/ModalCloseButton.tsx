import clsx from 'clsx';
import './ModalCloseButton.css';

export interface ModalCloseButtonProps {
  id?: string;
  className?: string;
  onClick?: () => void;
}

export const ModalCloseButton = ({ id, className, onClick }: ModalCloseButtonProps) => {
  return (
    <button
      id={id}
      type="button"
      className={clsx('mpc-modal-close modal-close', className)}
      aria-label="close"
      onClick={onClick}
    />
  );
};
