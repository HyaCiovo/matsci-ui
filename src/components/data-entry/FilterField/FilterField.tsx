import clsx from 'clsx';
import { type CSSProperties, type PropsWithChildren } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import './FilterField.css';

export interface FilterFieldProps extends PropsWithChildren {
  id?: string;
  className?: string;
  label?: string;
  tooltip?: string;
  units?: string;
  dois?: string[];
  active?: boolean;
  resetFilter?: (id: any) => any;
  styleLabel?: CSSProperties;
}

export const FilterField = ({ dois = [], ...props }: FilterFieldProps) => {
  const innerLabel = (
    <Tooltip
      disable={!props.tooltip}
      trigger={
        <span
          className={clsx({
            'tooltip-label': props.tooltip,
            'is-active': props.active,
          })}
        >
          {props.label}
          {props.units ? <span className="mpc-units"> ({props.units})</span> : null}
        </span>
      }
    >
      {props.tooltip}
    </Tooltip>
  );

  return (
    <div id={props.id} className={clsx('mpc-filter-field', props.className)}>
      {props.label ? (
        <div className="mpc-filter-label" style={props.styleLabel}>
          <span className={clsx('mpc-filter-label-row', { 'is-active': props.active })}>{innerLabel}</span>
          {props.active && props.resetFilter ? (
            <button
              type="button"
              className="mpc-filter-reset-button"
              aria-label={`Clear ${props.label ?? 'filter'}`}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent focus loss from input if any
                props.resetFilter?.(props.id);
              }}
            >
              <FaRegTimesCircle className="filter-cancel-button" />
            </button>
          ) : null}
          {dois.map((doi) => (
            <span key={doi} className="tag ml-2">
              {doi}
            </span>
          ))}
        </div>
      ) : null}
      {props.children}
    </div>
  );
};
