import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type MatElement } from '../periodic-table-data/table-v2';
import { getSelectableTableStateChange } from './selection-state';
import { mergeTexts } from '../../../utils/text';
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

const PERIODIC_TABLE_GROUP_NUMBERS = Array.from({ length: 18 }, (_, index) => index + 1);
const PERIODIC_TABLE_PERIOD_NUMBERS = Array.from({ length: 7 }, (_, index) => index + 1);

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
  /**
   * Renders periodic-table reference axes. `true` enables both axes; use an
   * object when only the group (top) or period (left) axis is needed.
   */
  showAxes?: boolean | SelectableTableAxes;
}

export interface SelectableTableAxes {
  top?: boolean;
  left?: boolean;
}

export interface SelectableTableTexts {
  unavailableElementTitle: string;
}

const DEFAULT_TEXTS: SelectableTableTexts = {
  unavailableElementTitle: 'Unavailable in current table',
};

function resolveAxisVisibility(showAxes: SelectableTableProps['showAxes']) {
  if (showAxes === true) {
    return { top: true, left: true };
  }

  if (!showAxes) {
    return { top: false, left: false };
  }

  return { top: showAxes.top === true, left: showAxes.left === true };
}

function PeriodicTableAxis({ position }: { position: 'top' | 'left' }) {
  const values = position === 'top' ? PERIODIC_TABLE_GROUP_NUMBERS : PERIODIC_TABLE_PERIOD_NUMBERS;
  const totalSlots = position === 'left' ? 10 : values.length;

  return (
    <div
      aria-hidden="true"
      className={`ms-periodic-table-axis ms-periodic-table-axis--${position}`}
      data-slot="periodic-table-axis"
      data-testid={`periodic-table-axis-${position}`}
    >
      {Array.from({ length: totalSlots }, (_, index) => (
        <span className="ms-periodic-table-axis__tick" key={index}>
          {values[index] ?? ''}
        </span>
      ))}
    </div>
  );
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
  unavailableElementTitle,
  texts,
  showAxes,
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
  const axes = resolveAxisVisibility(showAxes);

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
        className={clsx('ms-selectable-table__frame', {
          'ms-selectable-table__frame--with-top-axis': axes.top,
          'ms-selectable-table__frame--with-left-axis': axes.left,
        })}
        data-slot="periodic-table-frame"
      >
        {axes.top ? <PeriodicTableAxis position="top" /> : null}
        {axes.left ? <PeriodicTableAxis position="left" /> : null}
        <div
          className={clsx('ms-table-container', layoutClass)}
          data-slot="periodic-grid"
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
  showAxes,
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
      showAxes={showAxes}
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

export interface PeriodicTableProps extends Omit<SelectableTableProps, 'maxElementSelectable'> {
  maxElementSelectable?: number;
}

export function PeriodicTable({ maxElementSelectable = 20, ...props }: PeriodicTableProps) {
  return <SelectableTable {...props} maxElementSelectable={maxElementSelectable} />;
}
