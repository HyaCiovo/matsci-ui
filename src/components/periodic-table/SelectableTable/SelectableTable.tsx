import clsx from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';
import { type MatElement } from '../periodic-table-data/table-v2';
import { getSelectableTableStateChange } from './selection-state';
import {
  useOptionalPeriodicSelectionContext,
  PeriodicSelectionProvider,
  useDetailedElement,
  useElements,
} from './PeriodicSelectionContext';
import { PeriodicTableElementButton } from './PeriodicTableElementButton';
import { PeriodicTableSpacer } from './PeriodicTableSpacer';
import {
  TableLayout,
  TableSelectionStyle,
  type SelectableTableSelectionChange,
  type SelectableTableStateChange,
} from './types';
import {
  DEFAULT_POSITIONED_ELEMENTS,
  getDetailedElementDetail,
  getSelectableTableElementViewModels,
} from './view-model';
import './SelectableTable.css';

export interface SelectableTableProps {
  className?: string;
  enabledElements?: string[];
  disabledElements?: string[];
  hiddenElements?: string[];
  maxElementSelectable: number;
  onStateChange?: (state: SelectableTableSelectionChange) => void;
  onTableStateChange?: (state: SelectableTableStateChange) => void;
  plugin?: JSX.Element;
  disabled?: boolean;
  forwardOuterChange?: boolean;
  selectionStyle?: TableSelectionStyle;
  forceTableLayout?: TableLayout;
  detailedElement?: string | null;
  onDetailedElementChange?: (element: string | null, detail: MatElement | null) => void;
  children?: React.ReactNode;
}

function SelectableTableView({
  className,
  maxElementSelectable,
  plugin,
  disabled = false,
  forceTableLayout = TableLayout.FULL,
  onDetailedElementChange,
  onStateChange,
  onTableStateChange,
  forwardOuterChange = true,
  children,
}: Omit<
  SelectableTableProps,
  | 'enabledElements'
  | 'disabledElements'
  | 'hiddenElements'
  | 'detailedElement'
>) {
  const context = useOptionalPeriodicSelectionContext();
  const handleElementsChange = useCallback(
    (state: { enabledElements: string[]; disabledElements: string[] }) => {
      onStateChange?.({
        enabledElements: state.enabledElements,
        disabledElements: state.disabledElements,
      });
    },
    [onStateChange]
  );
  const {
    enabledElements: enabledRecord,
    disabledElements: effectiveDisabledRecord,
    hiddenElements: hiddenRecord,
    lastAction,
    actions,
  } = useElements(maxElementSelectable, onStateChange ? handleElementsChange : undefined);
  const detailedElementSymbol = useDetailedElement();
  const elementViewModels = useMemo(
    () =>
      getSelectableTableElementViewModels({
        positionedElements: DEFAULT_POSITIONED_ELEMENTS,
        enabledRecord,
        effectiveDisabledRecord,
        hiddenRecord,
        disabled,
      }),
    [disabled, effectiveDisabledRecord, enabledRecord, hiddenRecord]
  );
  const detailedElement = useMemo(() => getDetailedElementDetail(detailedElementSymbol), [detailedElementSymbol]);
  const tableStateChange = useMemo(
    () =>
      context
        ? getSelectableTableStateChange({
            enabledRecord,
            effectiveDisabledRecord,
            hiddenRecord,
            detailedElementSymbol,
            forwardOuterChange: context.forwardOuterChange,
            lastAction,
          })
        : null,
    [context, detailedElementSymbol, effectiveDisabledRecord, enabledRecord, hiddenRecord, lastAction]
  );
  useEffect(() => {
    onDetailedElementChange?.(detailedElementSymbol, detailedElement);
  }, [detailedElement, detailedElementSymbol, onDetailedElementChange]);

  useEffect(() => {
    actions.setForwardChange(forwardOuterChange);
  }, [actions, forwardOuterChange]);

  useEffect(() => {
    if (!tableStateChange) {
      return;
    }

    onTableStateChange?.(tableStateChange);
  }, [onTableStateChange, tableStateChange]);

  return (
    <div
      className={clsx('mpc-selectable-table', className, {
        'mpc-selectable-table-mini': forceTableLayout === TableLayout.MINI,
      })}
      data-table-layout={forceTableLayout}
    >
      <PeriodicTableSpacer plugin={plugin} disabled={disabled} />
      <div className="materials-input-elements-grid">
        {elementViewModels.map(({ symbol: element, xpos, ypos, detail, enabled, disabled: elementDisabled, defaultDisabled }) => (
          <PeriodicTableElementButton
            key={element}
            element={element}
            xpos={xpos}
            ypos={ypos}
            detail={detail}
            enabled={enabled}
            disabled={elementDisabled}
            defaultDisabled={defaultDisabled}
            lastAction={lastAction}
            onToggle={actions.toggleEnabledElement}
            onHoverDetail={actions.setDetailedElement}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

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
  detailedElement,
  onDetailedElementChange,
  children,
}: SelectableTableProps) {
  const externalContext = useOptionalPeriodicSelectionContext();
  const tableView = (
    <SelectableTableView
      className={className}
      maxElementSelectable={maxElementSelectable}
      plugin={plugin}
      disabled={disabled}
      selectionStyle={selectionStyle}
      forceTableLayout={forceTableLayout}
      onStateChange={onStateChange}
      onTableStateChange={onTableStateChange}
      forwardOuterChange={forwardOuterChange}
      onDetailedElementChange={onDetailedElementChange}
    >
      {children}
    </SelectableTableView>
  );

  if (externalContext) {
    return tableView;
  }

  return (
    <PeriodicSelectionProvider
      enabledElements={enabledElements}
      disabledElements={disabledElements}
      hiddenElements={hiddenElements}
      detailedElement={detailedElement}
      forwardOuterChange={forwardOuterChange}
      maxElementSelectable={maxElementSelectable}
      selectionStyle={selectionStyle}
    >
      {tableView}
    </PeriodicSelectionProvider>
  );
}
