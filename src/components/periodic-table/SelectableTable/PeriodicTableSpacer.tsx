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
      {disabled || !plugin ? <div className="first-span" /> : plugin}
      <div className="element-description mpc-selectable-table-detail">
        {detailedElement ? (
          <div
            className={clsx(
              'mat-element detailed',
              categoryToClassName(detailedElement.category ?? detailedElement.category_2, detailedElement.symbol),
              {
                'mat-group': detailedElement.hasGroup,
              }
            )}
          >
            <div className="main-panel">
              <div className="mat-number">{detailedElement.number}</div>
              <div className="mat-symbol">{detailedElement.symbol}</div>
              <div className="mat-name">{detailedElement.name}</div>
            </div>
            <div className="mat-side-panel">
              <div className="mat-weight">{detailedElement.atomic_mass.toFixed(3)}</div>
              {detailedElement.shells && !detailedElement.hasGroup ? (
                <div className="mat-shells">{detailedElement.shells.join(' ')}</div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className="separator-span" />
      <div className="first-lower-span" />
      <div className="second-lower-span" />
    </>
  );
}
