import classNames from 'classnames';
import { type ReactNode, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Tooltip } from '../Tooltip';
import type { Column } from '../SearchUI/types';
import { formatColumnValue, getColumnsFromKeys } from '../../../utils/table';
import './DataBlock.css';

export interface DataBlockProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: Record<string, any>;
  columns?: Column[];
  expanded?: boolean;
  footer?: ReactNode;
  iconClassName?: string;
  iconTooltip?: string;
  disableRichColumnHeaders?: boolean;
  children?: ReactNode;
}

const getResolvedColumns = (data: Record<string, any>, columns?: Column[]) => columns ?? getColumnsFromKeys(data);

export const DataBlock = ({
  id,
  className,
  data,
  columns,
  expanded = false,
  footer,
  iconClassName,
  iconTooltip,
  children,
}: DataBlockProps) => {
  const resolvedColumns = useMemo(() => getResolvedColumns(data, columns), [columns, data]);
  const [isExpanded, setIsExpanded] = useState(expanded);

  const topColumns = resolvedColumns.filter((column) => !column.hidden && !column.isBottom);
  const bottomColumns = resolvedColumns.filter((column) => !column.hidden && column.isBottom);

  const renderColumn = (column: Column) => (
    <div
      key={column.selector}
      className="mpc-data-block-item"
      style={{
        width: column.width || 'auto',
        minWidth: column.minWidth || 'auto',
        maxWidth: column.maxWidth || 'auto',
      }}
    >
      <div className="heading">{column.title}</div>
      <div className="value">{formatColumnValue(column, data)}</div>
    </div>
  );

  return (
    <div id={id} className={classNames('mpc-data-block box', className)}>
      <div className="mpc-data-block-header">
        {topColumns.map((column) => renderColumn(column))}
        {iconClassName ? (
          <span className="mpc-data-block-icon-container">
            <span data-testid="data-block-icon" className="mpc-data-block-icon" data-tooltip-id={iconTooltip}>
              <i className={iconClassName} />
            </span>
          </span>
        ) : null}
        {iconTooltip ? <Tooltip id={iconTooltip}>{iconTooltip}</Tooltip> : null}
      </div>

      {bottomColumns.length > 0 ? (
        <div className="mpc-data-block-expandable">
          {isExpanded ? <div className="mpc-data-block-body">{bottomColumns.map((column) => renderColumn(column))}</div> : null}
          <p className="mpc-data-block-trigger">
            <button type="button" onClick={() => setIsExpanded((current) => !current)}>
              {isExpanded ? 'See less' : 'See more'}
            </button>
            <button type="button" aria-label={isExpanded ? 'Collapse section' : 'Expand section'} onClick={() => setIsExpanded((current) => !current)}>
              {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </p>
        </div>
      ) : null}

      {footer || children ? <div className="mpc-data-block-footer">{footer || children}</div> : null}
    </div>
  );
};
