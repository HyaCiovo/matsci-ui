import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { MatElement } from '../periodic-table-data/table-v2';
import { TABLE_V2 } from '../periodic-table-data/table-v2';
import { categoryToClassName } from '../SelectableTable/selection-state';

export enum DISPLAY_MODE {
  SIMPLE = 'ms-simple',
  DETAILED = 'ms-detailed',
}

export interface PeriodicElementProps {
  disabled: boolean;
  enabled: boolean;
  hidden: boolean;
  color?: string;
  element: MatElement | string;
  displayMode?: DISPLAY_MODE;
  onElementClicked?: (e: MatElement) => void;
  onElementMouseOver?: (e: MatElement) => void;
  onElementMouseLeave?: (e: MatElement) => void;
}

export interface StandalonePeriodicComponentProps extends PeriodicElementProps {
  size: number;
}

const TABLE_DICO_V2 = Object.fromEntries(TABLE_V2.map((el) => [el.symbol, el])) as Record<string, MatElement>;

export function StandalonePeriodicComponent({
  size,
  element,
  displayMode = DISPLAY_MODE.SIMPLE,
  hidden = false,
  enabled = false,
  disabled = false,
  color,
  onElementClicked = () => undefined,
  onElementMouseOver = () => undefined,
  onElementMouseLeave = () => undefined,
}: StandalonePeriodicComponentProps) {
  const detail = typeof element === 'string' ? TABLE_DICO_V2[element] : element;

  if (!detail) {
    return <div />;
  }

  const cl = {
    enabled: !hidden && enabled && !disabled,
    disabled: !hidden && disabled,
    hidden,
  };

  const style = {
    width: size,
    height: size,
  } satisfies CSSProperties;

  return (
    <div className="ms-element-wrapper" style={style}>
      <button
        type="button"
        className={clsx(
          'ms-mat-element',
          displayMode,
          categoryToClassName(detail.category ?? detail.category_2, detail.symbol),
          {
            'ms-enabled': cl.enabled,
            'ms-disabled': cl.disabled,
            'ms-hidden': cl.hidden,
            'ms-mat-group': !!detail.hasGroup,
          }
        )}
        onClick={() => (!detail.hasGroup ? onElementClicked(detail) : undefined)}
        onMouseOver={() => onElementMouseOver(detail)}
        onMouseLeave={() => onElementMouseLeave(detail)}
        onFocus={() => onElementMouseOver(detail)}
        onBlur={() => onElementMouseLeave(detail)}
        style={color ? { background: color } : undefined}
        disabled={cl.disabled || cl.hidden}
        aria-disabled={cl.disabled}
        aria-hidden={cl.hidden}
      >
        {displayMode === DISPLAY_MODE.SIMPLE ? (
          <>
            <span className="ms-mat-number">{detail.number}</span>
            <span className="ms-mat-symbol">{detail.symbol}</span>
          </>
        ) : (
          <>
            <div className="ms-main-panel">
              <div className="ms-mat-number">{detail.number}</div>
              <div className="ms-mat-symbol">{detail.symbol}</div>
              <div className="ms-mat-name">{detail.name}</div>
              {!detail.hasGroup ? <div className="ms-mat-weight">{detail.atomic_mass}</div> : null}
            </div>
            {detail.shells && !detail.hasGroup ? (
              <div className="ms-mat-side-panel">
                {detail.shells.map((shell, idx) => (
                  <div key={idx}>{shell}</div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </button>
    </div>
  );
}
