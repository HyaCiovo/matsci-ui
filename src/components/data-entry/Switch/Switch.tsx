import clsx from 'clsx';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import './Switch.css';

export interface SwitchProps {
  id?: string;
  setProps?: (value: { value: boolean }) => void;
  className?: string;
  value?: boolean;
  hasLabel?: boolean;
  truthyLabel?: string;
  falsyLabel?: string;
  onChange?: (value: boolean) => void;
}

export const Switch = ({
  id,
  setProps,
  className,
  value = false,
  hasLabel = false,
  truthyLabel = 'On',
  falsyLabel = 'Off',
  onChange,
}: SwitchProps) => {
  const nextLabel = value ? truthyLabel : falsyLabel;

  const handleClick = () => {
    const nextValue = !value;
    onChange?.(nextValue);
    setProps?.({ value: nextValue });
  };

  return (
    <div id={id} className={clsx('mpc-switch', className)}>
      <button
        type="button"
        className="mpc-switch-button"
        aria-pressed={value}
        aria-label={nextLabel}
        onClick={handleClick}
      >
        {value ? <ToggleRight className="mpc-switch-icon" /> : <ToggleLeft className="mpc-switch-icon" />}
      </button>
      {hasLabel ? <span className="mpc-switch-label">{nextLabel}</span> : null}
    </div>
  );
};
