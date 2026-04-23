import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type MatElement } from '../periodic-table-data/table-v2';
import { getSelectableTableStateChange } from './selection-state';
import { mergeTexts } from '../../../text/mergeTexts';
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
  type SelectableTableLegacySelectionChange,
  type SelectableTableStateChange,
} from './types';
import {
  DEFAULT_POSITIONED_ELEMENTS,
  getDetailedElementDetail,
  getSelectableTableElementViewModels,
} from './view-model';
import './SelectableTable.less';

function SelectableTableDetailObserver({
  onDetailedElementChange,
}: Pick<SelectableTableProps, 'onDetailedElementChange'>) {
  const detailedElementSymbol = useDetailedElement();
  const detailedElement = useMemo(() => getDetailedElementDetail(detailedElementSymbol), [detailedElementSymbol]);

  useEffect(() => {
    onDetailedElementChange?.(detailedElementSymbol, detailedElement);
  }, [detailedElement, detailedElementSymbol, onDetailedElementChange]);

  return null;
}

function SelectableTableStateObserver({
  onTableStateChange,
}: Pick<SelectableTableProps, 'onTableStateChange'>) {
  const context = useOptionalPeriodicSelectionContext();
  const detailedElementSymbol = useDetailedElement();
  const tableStateChange = useMemo(
    () =>
      context
        ? getSelectableTableStateChange({
            enabledRecord: context.enabledRecord,
            effectiveDisabledRecord: context.effectiveDisabledRecord,
            hiddenRecord: context.hiddenRecord,
            detailedElementSymbol,
            forwardOuterChange: context.forwardOuterChange,
            lastAction: context.lastAction,
          })
        : null,
    [context, detailedElementSymbol]
  );

  useEffect(() => {
    if (!tableStateChange) {
      return;
    }

    onTableStateChange?.(tableStateChange);
  }, [onTableStateChange, tableStateChange]);

  return null;
}

function getLayoutClass(forceTableLayout: TableLayout) {
  if (forceTableLayout === TableLayout.MINI) {
    return 'ms-small';
  }
  if (forceTableLayout === TableLayout.COMPACT) {
    return 'ms-compact';
  }
  if (forceTableLayout === TableLayout.MAP) {
    return 'ms-map';
  }
  return 'ms-spaced';
}

export interface SelectableTableProps {
  className?: string;
  enabledElements?: string[];
  disabledElements?: string[];
  hiddenElements?: string[];
  maxElementSelectable: number;
  onStateChange?: (
    state: SelectableTableSelectionChange | SelectableTableLegacySelectionChange
  ) => void;
  onTableStateChange?: (state: SelectableTableStateChange) => void;
  plugin?: JSX.Element;
  disabled?: boolean;
  forwardOuterChange?: boolean;
  selectionStyle?: TableSelectionStyle;
  forceTableLayout?: TableLayout;
  detailedElement?: string | null;
  onDetailedElementChange?: (element: string | null, detail: MatElement | null) => void;
  children?: React.ReactNode;
  unavailableElementTitle?: string;
  texts?: Partial<SelectableTableTexts>;
}

export interface SelectableTableTexts {
  unavailableElementTitle: string;
}

const DEFAULT_TEXTS: SelectableTableTexts = {
  unavailableElementTitle: 'Unavailable in current table',
};

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
  unavailableElementTitle,
  texts,
}: Omit<
  SelectableTableProps,
  | 'enabledElements'
  | 'disabledElements'
  | 'hiddenElements'
  | 'detailedElement'
>) {
  const resolvedTexts = mergeTexts(DEFAULT_TEXTS, texts);
  const resolvedUnavailableElementTitle = unavailableElementTitle ?? resolvedTexts.unavailableElementTitle;
  const context = useOptionalPeriodicSelectionContext();
  const forwardOuterChangeRef = useRef(context?.forwardOuterChange ?? true);
  useEffect(() => {
    if (!context) {
      return;
    }
    if (context.forwardOuterChange === false) {
      forwardOuterChangeRef.current = false;
    }
  }, [context?.forwardOuterChange]);
  const handleElementsChange = useCallback(
    (state: { enabledElements: string[]; disabledElements: string[] }) => {
      const wasForward = forwardOuterChangeRef.current;
      const isForward = context?.forwardOuterChange ?? true;
      forwardOuterChangeRef.current = isForward;

      if (!wasForward && isForward && context?.changeOrigin === 'action') {
        onStateChange?.(state.enabledElements);
        return;
      }

      onStateChange?.({
        enabledElements: state.enabledElements,
        disabledElements: state.disabledElements,
      });
    },
    [context?.changeOrigin, context?.forwardOuterChange, onStateChange]
  );
  const {
    enabledElements: enabledRecord,
    disabledElements: effectiveDisabledRecord,
    hiddenElements: hiddenRecord,
    lastAction,
    actions,
  } = useElements(maxElementSelectable, onStateChange ? handleElementsChange : undefined);
  const elementViewModels = useMemo(
    () =>
      getSelectableTableElementViewModels({
        positionedElements: DEFAULT_POSITIONED_ELEMENTS,
        enabledRecord,
        effectiveDisabledRecord,
        explicitDisabledRecord: context?.disabledRecord ?? {},
        hiddenRecord,
        disabled,
      }),
    [context?.disabledRecord, disabled, effectiveDisabledRecord, enabledRecord, hiddenRecord]
  );
  const layoutClass = getLayoutClass(forceTableLayout);

  useEffect(() => {
    actions.setForwardChange(forwardOuterChange);
  }, [actions, forwardOuterChange]);

  return (
    <div
      className={clsx('ms-selectable-table', className, {
        'ms-selectable-table-mini': forceTableLayout === TableLayout.MINI,
      })}
      data-table-layout={forceTableLayout}
    >
      <SelectableTableDetailObserver onDetailedElementChange={onDetailedElementChange} />
      <SelectableTableStateObserver onTableStateChange={onTableStateChange} />
      <div
        className={clsx('ms-table-container', layoutClass)}
        onMouseLeave={() => {
          actions.setDetailedElement(null);
        }}
      >
        <PeriodicTableSpacer plugin={plugin} disabled={disabled} />
        {elementViewModels.map(
          ({
            symbol: element,
            xpos,
            ypos,
            detail,
            enabled,
            hidden,
            disabled: elementDisabled,
            interactionDisabled,
            defaultDisabled,
          }) => (
          <PeriodicTableElementButton
            key={element}
            element={element}
            xpos={xpos}
            ypos={ypos}
            detail={detail}
            enabled={enabled}
            disabled={elementDisabled}
            hidden={hidden}
            interactionDisabled={interactionDisabled}
            defaultDisabled={defaultDisabled}
            unavailableTitle={resolvedUnavailableElementTitle}
            lastAction={lastAction}
            onToggle={actions.toggleEnabledElement}
            onHoverDetail={actions.setDetailedElement}
          />
          )
        )}
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
  unavailableElementTitle,
  texts,
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
      unavailableElementTitle={unavailableElementTitle}
      texts={texts}
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
