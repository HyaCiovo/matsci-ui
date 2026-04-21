import clsx from 'clsx';
import { memo } from 'react';
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
  hidden: boolean;
  interactionDisabled: boolean;
  defaultDisabled: boolean;
  unavailableTitle?: string;
  lastAction?: SelectableTableLastAction;
  onToggle: (element: string) => void;
  onHoverDetail: (element: string | null) => void;
}

function PeriodicTableElementButtonImpl({
  element,
  xpos,
  ypos,
  detail,
  enabled,
  disabled,
  hidden,
  interactionDisabled,
  defaultDisabled,
  unavailableTitle = 'Unavailable in current table',
  lastAction,
  onToggle,
  onHoverDetail,
}: PeriodicTableElementButtonProps) {
  if (hidden) {
    return (
      <div
        className={clsx('mat-element', 'hidden', {
          [categoryToClassName(detail?.category ?? detail?.category_2, element)]: true,
          'mat-group': !!detail?.hasGroup,
        })}
        style={{
          gridColumn: xpos,
          gridRow: ypos,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      data-testid={`periodic-element-${element}`}
      style={{
        gridColumn: `${xpos}`,
        gridRow: `${ypos}`,
      }}
      className={clsx('mat-element', {
        enabled,
        disabled,
        'default-disabled': defaultDisabled,
        [categoryToClassName(detail?.category ?? detail?.category_2, element)]: true,
        'mat-group': !!detail?.hasGroup,
      })}
      onClick={() => {
        if (!interactionDisabled) {
          onToggle(element);
        }
      }}
      onMouseEnter={() => {
        onHoverDetail(detail?.symbol ?? null);
      }}
      onFocus={() => {
        onHoverDetail(detail?.symbol ?? null);
      }}
      data-last-action={lastAction?.element === element ? lastAction.type : undefined}
      aria-disabled={disabled}
      title={defaultDisabled ? unavailableTitle : undefined}
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

export const PeriodicTableElementButton = memo(PeriodicTableElementButtonImpl);
