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
  const cancelButton = props.active ? (
    <span className="ms-filter-cancel-icon-wrap">
      <FaRegTimesCircle className="ms-filter-cancel-button" />
    </span>
  ) : null;
  const innerLabel = (
    <>
      {props.label}
      {props.units ? <span className="ms-units"> ({props.units})</span> : null}
      {cancelButton}
    </>
  );
  const trigger = props.active && props.resetFilter ? (
    <a
      onClick={() => {
        props.resetFilter?.(props.id);
      }}
    >
      <span className={clsx({ 'ms-tooltip-label': props.tooltip })}>{innerLabel}</span>
    </a>
  ) : (
    <span className={clsx({ 'ms-tooltip-label': props.tooltip })}>{innerLabel}</span>
  );
  const labelNode = props.tooltip ? <Tooltip trigger={trigger}>{props.tooltip}</Tooltip> : trigger;

  return (
    <div id={props.id} className={clsx('ms-filter-field', props.className)}>
      {props.label ? (
        <div className="ms-filter-label" style={props.styleLabel}>
          {labelNode}
          {dois.map((doi) => (
            <span key={doi} className="ms-tag ms-ml-2">
              {doi}
            </span>
          ))}
        </div>
      ) : null}
      {props.children}
    </div>
  );
};
