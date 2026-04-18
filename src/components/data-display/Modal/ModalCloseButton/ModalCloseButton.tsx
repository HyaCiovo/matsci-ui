export interface ModalCloseButtonProps {
  onClick?: () => void;
}

export const ModalCloseButton = ({ onClick }: ModalCloseButtonProps) => {
  return (
    <button
      type="button"
      className="delete mpc-modal-close-button"
      aria-label="Close modal"
      onClick={onClick}
    />
  );
};
