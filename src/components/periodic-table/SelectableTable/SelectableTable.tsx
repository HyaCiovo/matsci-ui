import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { VALID_ELEMENTS } from '../../data-entry/MaterialsInput/utils';
import { TABLE_V2, type MatElement } from '../periodic-table-data/table-v2';
import './SelectableTable.css';

export enum TableSelectionStyle {
  ENABLE_DISABLE = 'enableDisable',
  SELECT = 'select',
  MULTI_INPUTS_SELECT = 'mis',
}

export enum TableLayout {
  FULL = 'full',
  MINI = 'mini',
}

export interface SelectableTableLastAction {
  type: 'select' | 'deselect';
  element: string;
}

export interface SelectableTableStateChange {
  enabledElements: string[];
  disabledElements: string[];
  hiddenElements: string[];
  lastAction?: SelectableTableLastAction;
}

export interface SelectableTableProps {
  className?: string;
  enabledElements?: string[];
  disabledElements?: string[];
  hiddenElements?: string[];
  maxElementSelectable: number;
  onStateChange?: (selected: string[]) => void;
  onTableStateChange?: (state: SelectableTableStateChange) => void;
  plugin?: JSX.Element;
  disabled?: boolean;
  forwardOuterChange?: boolean;
  selectionStyle?: TableSelectionStyle;
  forceTableLayout?: TableLayout;
  children?: React.ReactNode;
}

const toRecord = (values?: string[]) =>
  Object.fromEntries((values ?? []).map((value) => [value, true])) as Record<string, boolean>;

const toArray = (values: Record<string, boolean>) => Object.keys(values).filter((key) => values[key]);

const DEFAULT_DISABLED_ELEMENTS: Record<string, boolean> = {
  Po: true,
  Rn: true,
  Ra: true,
  At: true,
  Fr: true,
  Rf: true,
  Db: true,
  Sg: true,
  Bh: true,
  Hs: true,
  Mt: true,
  Ds: true,
  Rg: true,
  Cn: true,
  Nh: true,
  Fl: true,
  Mc: true,
  Lv: true,
  Ts: true,
  Og: true,
  'La-Lu': true,
  'Ac-Lr': true,
  Am: true,
  Cm: true,
  Bk: true,
  Cf: true,
  Es: true,
  Fm: true,
  Md: true,
  No: true,
  Lr: true,
};

const getClampedDisabledElements = (
  enabledRecord: Record<string, boolean>,
  disabledRecord: Record<string, boolean>,
  maxElementSelectable: number,
  selectionStyle: TableSelectionStyle
) => {
  if (selectionStyle !== TableSelectionStyle.SELECT) {
    return disabledRecord;
  }

  if (Object.keys(enabledRecord).length >= maxElementSelectable) {
    const nextDisabled = Object.fromEntries(VALID_ELEMENTS.map((element) => [element, true])) as Record<
      string,
      boolean
    >;
    Object.keys(enabledRecord).forEach((element) => {
      delete nextDisabled[element];
    });
    Object.keys(disabledRecord).forEach((element) => {
      nextDisabled[element] = true;
    });
    return nextDisabled;
  }

  return disabledRecord;
};

export function SelectableTable({
  className,
  enabledElements = [],
  disabledElements = [],
  hiddenElements = [],
  maxElementSelectable,
  onStateChange,
  onTableStateChange,
  plugin,
  disabled = false,
  forwardOuterChange = true,
  selectionStyle = TableSelectionStyle.SELECT,
  forceTableLayout = TableLayout.FULL,
  children,
}: SelectableTableProps) {
  const [enabledRecord, setEnabledRecord] = useState<Record<string, boolean>>(toRecord(enabledElements));
  const [disabledRecord, setDisabledRecord] = useState<Record<string, boolean>>(toRecord(disabledElements));
  const [hiddenRecord, setHiddenRecord] = useState<Record<string, boolean>>(toRecord(hiddenElements));
  const [lastAction, setLastAction] = useState<SelectableTableLastAction | undefined>();
  const [detailedElement, setDetailedElement] = useState<MatElement | null>(null);

  useEffect(() => {
    setEnabledRecord(toRecord(enabledElements));
  }, [enabledElements]);

  useEffect(() => {
    setDisabledRecord(toRecord(disabledElements));
  }, [disabledElements]);

  useEffect(() => {
    setHiddenRecord(toRecord(hiddenElements));
  }, [hiddenElements]);

  const effectiveDisabledRecord = useMemo(
    () => getClampedDisabledElements(enabledRecord, disabledRecord, maxElementSelectable, selectionStyle),
    [disabledRecord, enabledRecord, maxElementSelectable, selectionStyle]
  );
  const elementMap = useMemo(
    () => Object.fromEntries(TABLE_V2.map((element) => [element.symbol, element])) as Record<string, MatElement>,
    []
  );

  const emitStateChange = (
    nextEnabledRecord: Record<string, boolean>,
    nextDisabledRecord: Record<string, boolean>,
    nextLastAction?: SelectableTableLastAction
  ) => {
    if (forwardOuterChange) {
      onStateChange?.(toArray(nextEnabledRecord));
    }

    onTableStateChange?.({
      enabledElements: toArray(nextEnabledRecord),
      disabledElements: toArray(nextDisabledRecord),
      hiddenElements: toArray(hiddenRecord),
      lastAction: nextLastAction,
    });
  };

  return (
    <div
      className={classNames('mpc-selectable-table', className, {
        'mpc-selectable-table-mini': forceTableLayout === TableLayout.MINI,
      })}
      data-table-layout={forceTableLayout}
    >
      {(plugin || detailedElement) && (
        <div className="mpc-selectable-table-spacer">
          <div className="mpc-selectable-table-plugin">{plugin}</div>
          <div
            className={classNames('mpc-selectable-table-detail', {
              'is-empty': !detailedElement,
            })}
          >
            {detailedElement ? (
              <>
                <div className="mpc-selectable-table-detail-header">
                  <span className="mpc-selectable-table-detail-symbol">{detailedElement.symbol}</span>
                  <span className="mpc-selectable-table-detail-name">{detailedElement.name}</span>
                </div>
                <div className="mpc-selectable-table-detail-meta">
                  <span>No. {detailedElement.number}</span>
                  <span>{detailedElement.phase}</span>
                  <span>{detailedElement.category}</span>
                  <span>{detailedElement.atomic_mass.toFixed(3)}</span>
                </div>
                <div className="mpc-selectable-table-detail-summary">
                  {detailedElement.summary}
                </div>
              </>
            ) : (
              <span>Hover an element to inspect details</span>
            )}
          </div>
        </div>
      )}
      <div className="materials-input-elements-grid">
        {VALID_ELEMENTS.filter((element) => !hiddenRecord[element]).map((element) => {
          const enabled = !!enabledRecord[element];
          const isDefaultDisabled = !!DEFAULT_DISABLED_ELEMENTS[element];
          const isDisabled = disabled || !!effectiveDisabledRecord[element] || isDefaultDisabled;

          return (
            <button
              key={element}
              type="button"
              data-testid={`periodic-element-${element}`}
              className={classNames('mat-element', {
                enabled,
                disabled: isDisabled,
                'default-disabled': isDefaultDisabled,
              })}
              onClick={() => {
                if (isDisabled) {
                  return;
                }

                if (selectionStyle === TableSelectionStyle.ENABLE_DISABLE) {
                  const nextDisabledRecord = { ...disabledRecord };
                  if (nextDisabledRecord[element]) {
                    delete nextDisabledRecord[element];
                  } else {
                    nextDisabledRecord[element] = true;
                  }
                  setDisabledRecord(nextDisabledRecord);
                  emitStateChange(enabledRecord, nextDisabledRecord);
                  return;
                }

                const nextEnabledRecord = { ...enabledRecord };
                const nextLastAction: SelectableTableLastAction = enabled
                  ? { type: 'deselect', element }
                  : { type: 'select', element };

                if (enabled) {
                  delete nextEnabledRecord[element];
                } else if (selectionStyle === TableSelectionStyle.MULTI_INPUTS_SELECT) {
                  Object.keys(nextEnabledRecord).forEach((selectedElement) => {
                    delete nextEnabledRecord[selectedElement];
                  });
                  nextEnabledRecord[element] = true;
                } else {
                  nextEnabledRecord[element] = true;
                }

                const nextDisabledRecord = getClampedDisabledElements(
                  nextEnabledRecord,
                  disabledRecord,
                  maxElementSelectable,
                  selectionStyle
                );
                setEnabledRecord(nextEnabledRecord);
                setLastAction(nextLastAction);
                emitStateChange(nextEnabledRecord, nextDisabledRecord, nextLastAction);
              }}
              onMouseEnter={() => {
                setDetailedElement(elementMap[element] ?? null);
              }}
              onMouseLeave={() => {
                setDetailedElement(null);
              }}
              onFocus={() => {
                setDetailedElement(elementMap[element] ?? null);
              }}
              onBlur={() => {
                setDetailedElement(null);
              }}
              data-last-action={lastAction?.element === element ? lastAction.type : undefined}
              title={isDefaultDisabled ? 'Unavailable in current table' : undefined}
            >
              {element}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
