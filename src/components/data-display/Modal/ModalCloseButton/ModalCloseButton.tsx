import clsx from 'clsx';
import './ModalCloseButton.css';

export interface ModalCloseButtonProps {
  id?: string;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export const ModalCloseButton = ({
  id,
  className,
  onClick,
  ariaLabel = 'close',
}: ModalCloseButtonProps) => {
  return (
    <button
      id={id}
      type="button"
      className={clsx('ms-modal-close', className)}
      aria-label={ariaLabel}
      onClick={onClick}
    />
  );
};
