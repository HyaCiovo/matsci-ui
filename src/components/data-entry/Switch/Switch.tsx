import classNames from 'classnames';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
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
    <div id={id} className={classNames('mpc-switch', className)}>
      <button
        type="button"
        className="mpc-switch-button"
        aria-pressed={value}
        aria-label={nextLabel}
        onClick={handleClick}
      >
        {value ? <FaToggleOn className="mpc-switch-icon" /> : <FaToggleOff className="mpc-switch-icon" />}
      </button>
      {hasLabel ? <span className="mpc-switch-label">{nextLabel}</span> : null}
    </div>
  );
};
