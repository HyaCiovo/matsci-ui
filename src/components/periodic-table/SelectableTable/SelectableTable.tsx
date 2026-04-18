import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { VALID_ELEMENTS } from '../../data-entry/MaterialsInput/utils';

export interface SelectableTableProps {
  className?: string;
  enabledElements?: string[];
  disabledElements?: string[];
  hiddenElements?: string[];
  maxElementSelectable: number;
  onStateChange?: (selected: string[]) => void;
  plugin?: JSX.Element;
  disabled?: boolean;
}

const toRecord = (values?: string[]) =>
  Object.fromEntries((values ?? []).map((value) => [value, true])) as Record<string, boolean>;

export function SelectableTable({
  className,
  enabledElements = [],
  disabledElements = [],
  hiddenElements = [],
  maxElementSelectable,
  onStateChange,
  plugin,
  disabled = false,
}: SelectableTableProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>(enabledElements);

  useEffect(() => {
    setSelectedElements(enabledElements);
  }, [enabledElements]);

  const hiddenRecord = useMemo(() => toRecord(hiddenElements), [hiddenElements]);
  const externalDisabledRecord = useMemo(() => toRecord(disabledElements), [disabledElements]);

  return (
    <div className={classNames('mpc-selectable-table', className)}>
      {plugin}
      <div className="materials-input-elements-grid">
        {VALID_ELEMENTS.filter((element) => !hiddenRecord[element]).map((element) => {
          const enabled = selectedElements.includes(element);
          const isAtLimit =
            selectedElements.filter((item) => item !== '*').length >= maxElementSelectable;
          const isDisabled = disabled || externalDisabledRecord[element] || (!enabled && isAtLimit);

          return (
            <button
              key={element}
              type="button"
              className={classNames('mat-element', {
                enabled,
                disabled: isDisabled,
              })}
              onClick={() => {
                if (isDisabled) {
                  return;
                }
                const nextSelectedElements = selectedElements.includes(element)
                  ? selectedElements.filter((candidate) => candidate !== element)
                  : [...selectedElements, element];
                setSelectedElements(nextSelectedElements);
                onStateChange?.(nextSelectedElements);
              }}
            >
              {element}
            </button>
          );
        })}
      </div>
    </div>
  );
}
