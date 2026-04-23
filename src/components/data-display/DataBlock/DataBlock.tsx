import clsx from 'clsx';
import { type ReactNode, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Tooltip } from '../Tooltip';
import type { Column } from '../SearchUI/types';
import { formatColumnValue, getColumnsFromKeys } from '../../../utils/table';

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
      className="ms-data-block-item"
      style={{
        width: column.width || 'auto',
        minWidth: column.minWidth || 'auto',
        maxWidth: column.maxWidth || 'auto',
      }}
    >
      <div className="ms-heading">{column.title}</div>
      <div className="ms-value">{formatColumnValue(column, data)}</div>
    </div>
  );

  return (
    <div id={id} className={clsx('ms-data-block ms-box', className)}>
      <div className="ms-data-block-header">
        {topColumns.map((column) => renderColumn(column))}
        {iconClassName ? (
          <span className="ms-data-block-icon-container">
            <Tooltip
              disable={!iconTooltip}
              trigger={
                <span data-testid="data-block-icon" className="ms-data-block-icon">
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
        <div className="ms-data-block-expandable">
          <div
            data-testid="data-block-bottom-section"
            className={clsx('ms-data-block-body', {
              'ms-is-expanded': isExpanded,
              'ms-is-collapsed': !isExpanded,
            })}
          >
            {!isExpanded ? <div className="ms-data-block-fade" /> : null}
            {bottomColumns.map((column) => renderColumn(column))}
          </div>
          <p className="ms-data-block-trigger">
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
              className="ms-data-block-caret"
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

      {footer || children ? <div className="ms-data-block-footer">{footer || children}</div> : null}
    </div>
  );
};
