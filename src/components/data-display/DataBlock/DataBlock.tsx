import clsx from 'clsx';
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
    <div id={id} className={clsx('mpc-data-block box', className)}>
      <div className="mpc-data-block-header">
        {topColumns.map((column) => renderColumn(column))}
        {iconClassName ? (
          <span className="mpc-data-block-icon-container">
            <Tooltip
              disable={!iconTooltip}
              trigger={
                <span data-testid="data-block-icon" className="mpc-data-block-icon">
                  <i className={iconClassName} />
                </span>
              }
            >
              {iconTooltip}
            </Tooltip>
          </span>
        ) : null}
      </div>

      {bottomColumns.length > 0 ? (
        <div className="mpc-data-block-expandable">
          <div
            data-testid="data-block-bottom-section"
            className={clsx('mpc-data-block-body', {
              'is-expanded': isExpanded,
              'is-collapsed': !isExpanded,
            })}
          >
            {!isExpanded ? <div className="mpc-data-block-fade" /> : null}
            {bottomColumns.map((column) => renderColumn(column))}
          </div>
          <p className="mpc-data-block-trigger">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setIsExpanded((current) => !current);
              }}
            >
              {isExpanded ? 'See less' : 'See more'}
            </a>
            <span
              className="mpc-data-block-caret"
              role="button"
              tabIndex={0}
              aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
              onClick={() => setIsExpanded((current) => !current)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setIsExpanded((current) => !current);
                }
              }}
            >
              {isExpanded ? <FaCaretUp /> : <FaCaretDown />}
            </span>
          </p>
        </div>
      ) : null}

      {footer || children ? <div className="mpc-data-block-footer">{footer || children}</div> : null}
    </div>
  );
};
