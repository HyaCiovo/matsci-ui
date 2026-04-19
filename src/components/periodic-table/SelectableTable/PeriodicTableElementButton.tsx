import classNames from 'classnames';
import type { MatElement } from '../periodic-table-data/table-v2';
import { categoryToClassName } from './selection-state';
import type { SelectableTableLastAction } from './types';

interface PeriodicTableElementButtonProps {
  element: string;
  xpos: number;
  ypos: number;
  detail: MatElement | null;
  enabled: boolean;
  disabled: boolean;
  defaultDisabled: boolean;
  lastAction?: SelectableTableLastAction;
  onToggle: (element: string) => void;
  onHoverDetail: (element: string | null) => void;
}

export function PeriodicTableElementButton({
  element,
  xpos,
  ypos,
  detail,
  enabled,
  disabled,
  defaultDisabled,
  lastAction,
  onToggle,
  onHoverDetail,
}: PeriodicTableElementButtonProps) {
  return (
    <button
      type="button"
      data-testid={`periodic-element-${element}`}
      style={{
        gridColumn: `${xpos}`,
        gridRow: `${ypos}`,
      }}
      className={classNames('mat-element', {
        enabled,
        disabled,
        'default-disabled': defaultDisabled,
        [categoryToClassName(detail?.category, element)]: true,
        'mat-group': !!detail?.hasGroup,
      })}
      onClick={() => {
        if (disabled) {
          return;
        }
        onToggle(element);
      }}
      onMouseEnter={() => {
        onHoverDetail(detail?.symbol ?? null);
      }}
      onMouseLeave={() => {
        onHoverDetail(null);
      }}
      onFocus={() => {
        onHoverDetail(detail?.symbol ?? null);
      }}
      onBlur={() => {
        onHoverDetail(null);
      }}
      data-last-action={lastAction?.element === element ? lastAction.type : undefined}
      title={defaultDisabled ? 'Unavailable in current table' : undefined}
    >
      {detail ? (
        <>
          <span className="mat-number">{detail.number}</span>
          <span className="mat-symbol">{detail.symbol}</span>
        </>
      ) : (
        <span className="mat-symbol">{element}</span>
      )}
    </button>
  );
}
