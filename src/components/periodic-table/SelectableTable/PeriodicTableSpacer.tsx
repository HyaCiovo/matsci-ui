import classNames from 'classnames';
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

  if (!plugin && !detailedElement) {
    return null;
  }

  return (
    <div className="mpc-selectable-table-spacer">
      {disabled || !plugin ? (
        <>
          <div className="first-span mpc-selectable-table-placeholder" />
          <div className="second-span mpc-selectable-table-placeholder" />
        </>
      ) : (
        plugin
      )}
      <div
        className={classNames('element-description mpc-selectable-table-detail', {
          'is-empty': !detailedElement,
        })}
      >
        {detailedElement ? (
          <>
            <div className="mpc-selectable-table-detail-header">
              <div
                className={classNames(
                  'mpc-selectable-table-detail-tile',
                  categoryToClassName(detailedElement.category, detailedElement.symbol)
                )}
              >
                <span className="mpc-selectable-table-detail-number">{detailedElement.number}</span>
                <span className="mpc-selectable-table-detail-symbol">{detailedElement.symbol}</span>
                <span className="mpc-selectable-table-detail-name">{detailedElement.name}</span>
                {!detailedElement.hasGroup ? (
                  <span className="mpc-selectable-table-detail-weight">{detailedElement.atomic_mass}</span>
                ) : null}
              </div>
              {detailedElement.shells && !detailedElement.hasGroup ? (
                <div className="mpc-selectable-table-detail-shells">
                  {detailedElement.shells.map((shell, index) => (
                    <span key={`${detailedElement.symbol}-${index}`}>{shell}</span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mpc-selectable-table-detail-meta">
              <span>No. {detailedElement.number}</span>
              <span>{detailedElement.phase}</span>
              <span>{detailedElement.category}</span>
              <span>{detailedElement.atomic_mass.toFixed(3)}</span>
            </div>
            <div className="mpc-selectable-table-detail-summary">{detailedElement.summary}</div>
          </>
        ) : (
          <span>Hover an element to inspect details</span>
        )}
      </div>
      <div className="separator-span mpc-selectable-table-separator" />
      <div className="first-lower-span mpc-selectable-table-lower-block" />
      <div className="second-lower-span mpc-selectable-table-lower-block" />
    </div>
  );
}
