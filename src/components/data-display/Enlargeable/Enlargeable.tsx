import clsx from 'clsx';
import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';
import './Enlargeable.css';

export interface EnlargeableProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  expanded?: boolean;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
  hideButton?: boolean;
  children?: ReactNode;
}

export const Enlargeable = ({
  id,
  className = '',
  expanded: controlledExpanded,
  setExpanded: controlledSetExpanded,
  hideButton = false,
  children,
}: EnlargeableProps) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;
  const setExpanded = controlledSetExpanded ?? setInternalExpanded;

  return (
    <div
      id={id}
      className={clsx('mpc-enlargeable', {
        'modal is-active': expanded,
        [className]: !expanded,
      })}
    >
      <div
        className={clsx({
          'modal-background': expanded,
        })}
        onClick={() => setExpanded(false)}
      />
      <div
        className={clsx({
          'modal-content is-large': expanded,
          [className]: expanded,
        })}
      >
        {!hideButton ? (
          <button className="button mpc-enlarge-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
};
