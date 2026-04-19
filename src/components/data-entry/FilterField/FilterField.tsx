import clsx from 'clsx';
import { type CSSProperties, type PropsWithChildren } from 'react';
import { CircleX } from 'lucide-react';
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
  const tooltipId = props.id ? `filter_${props.id}` : undefined;

  const innerLabel = (
    <span
      className={clsx({
        'tooltip-label': props.tooltip,
      })}
      data-tooltip-id={tooltipId}
    >
      {props.label}
      {props.units ? <span className="mpc-units"> ({props.units})</span> : null}
      {props.active ? <CircleX className="ml-2 filter-cancel-button" /> : null}
      {props.tooltip && tooltipId ? <Tooltip id={tooltipId}>{props.tooltip}</Tooltip> : null}
    </span>
  );

  return (
    <div id={props.id} className={clsx('mpc-filter-field', props.className)}>
      {props.label ? (
        <div className="mpc-filter-label" style={props.styleLabel}>
          {props.active && props.resetFilter ? (
            <button type="button" className="button is-text p-0" onClick={() => props.resetFilter?.(props.id)}>
              {innerLabel}
            </button>
          ) : (
            innerLabel
          )}
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
