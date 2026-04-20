import clsx from 'clsx';
import { type CSSProperties } from 'react';
import './Switch.css';

export interface SwitchProps {
  id?: string;
  setProps?: (value: { value: boolean }) => void;
  className?: string;
  value?: boolean;
  hasLabel?: boolean;
  truthyLabel?: string;
  falsyLabel?: string;
  iconColor?: string;
  truthyColor?: string;
  falsyColor?: string;
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
  iconColor,
  truthyColor,
  falsyColor,
  onChange,
}: SwitchProps) => {
  const nextLabel = value ? truthyLabel : falsyLabel;
  const currentIconColor = value ? truthyColor ?? iconColor ?? '#3273dc' : falsyColor ?? iconColor ?? '#b5b5b5';
  const style = {
    '--mpc-switch-icon-color': currentIconColor,
  } as CSSProperties;

  const handleClick = () => {
    const nextValue = !value;
    onChange?.(nextValue);
    setProps?.({ value: nextValue });
  };

  return (
    <div id={id} className={clsx('mpc-switch', className)} style={style}>
      <button
        type="button"
        className="mpc-switch-button"
        aria-pressed={value}
        aria-label={nextLabel}
        onClick={handleClick}
      >
        <span className={clsx('mpc-switch-visual', { 'is-active': value })} aria-hidden="true">
          <span className="mpc-switch-thumb" />
        </span>
      </button>
      {hasLabel ? <span className="mpc-switch-label">{nextLabel}</span> : null}
    </div>
  );
};
