import clsx from 'clsx';
import { useMemo } from 'react';
import { TABLE_V2 } from '../periodic-table-data/table-v2';
import { categoryToClassName, getElementDetail } from './selection-state';
import { useDetailedElement } from './PeriodicSelectionContext';

interface PeriodicTableSpacerProps {
  plugin?: JSX.Element;
  disabled?: boolean;
}

export function PeriodicTableSpacer({ plugin, disabled = false }: PeriodicTableSpacerProps) {
  const detailedElementSymbol = useDetailedElement();
  const elementMap = useMemo(
    () => Object.fromEntries(TABLE_V2.map((element) => [element.symbol, element])),
    []
  );
  const detailedElement = getElementDetail(detailedElementSymbol, elementMap);

  return (
    <>
      {disabled || !plugin ? <div className="ms-first-span" /> : plugin}
      <div className="ms-element-description ms-selectable-table-detail">
        {detailedElement ? (
          <div
            className={clsx(
              'ms-mat-element ms-detailed',
              categoryToClassName(detailedElement.category ?? detailedElement.category_2, detailedElement.symbol),
              {
                'ms-mat-group': detailedElement.hasGroup,
              }
            )}
          >
            <div className="ms-main-panel">
              <div className="ms-mat-number">{detailedElement.number}</div>
              <div className="ms-mat-symbol">{detailedElement.symbol}</div>
              <div className="ms-mat-name">{detailedElement.name}</div>
            </div>
            <div className="ms-mat-side-panel">
              <div className="ms-mat-weight">{detailedElement.atomic_mass.toFixed(3)}</div>
              {detailedElement.shells && !detailedElement.hasGroup ? (
                <div className="ms-mat-shells">{detailedElement.shells.join(' ')}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className="ms-separator-span" />
      <div className="ms-first-lower-span" />
      <div className="ms-second-lower-span" />
    </>
  );
}
