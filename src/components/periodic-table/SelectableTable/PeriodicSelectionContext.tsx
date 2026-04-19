import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createSelectableTableStoreState,
  DEFAULT_DISABLED_ELEMENTS,
  getClampedDisabledElements,
  toArray,
  toRecord,
} from './selection-state';
import {
  TableSelectionStyle,
  type SelectableTableLastAction,
  type SelectableTableStateChange,
} from './types';

type SelectionInput = string[] | Record<string, boolean>;

interface PeriodicSelectionProviderProps {
  enabledElements?: SelectionInput;
  disabledElements?: SelectionInput;
  hiddenElements?: SelectionInput;
  detailedElement?: string | null;
  forwardOuterChange: boolean;
  maxElementSelectable: number;
  selectionStyle: TableSelectionStyle;
  children: ReactNode;
}

interface PeriodicContextProps {
  enabledElements?: SelectionInput;
  disabledElements?: SelectionInput;
  hiddenElements?: SelectionInput;
  detailedElement?: string | null;
  forwardOuterChange?: boolean;
  maxElementSelectable?: number;
  selectionStyle?: TableSelectionStyle;
  children: ReactNode;
}

export interface PeriodicSelectionActions {
  setForwardChange: (forwardChange: boolean) => void;
  setEnabledElements: (enabledElements: Record<string, boolean>) => void;
  setDisabledElements: (disabledElements: Record<string, boolean>) => void;
  setHiddenElements: (hiddenElements: Record<string, boolean>) => void;
  clear: () => void;
  setDetailedElement: (element: string | null) => void;
  addEnabledElement: (element: string) => void;
  addDisabledElement: (element: string) => void;
  removeEnabledElement: (element: string) => void;
  removeDisabledElement: (element: string) => void;
  toggleEnabledElement: (element: string) => void;
  toggleDisabledElement: (element: string) => void;
  setMaxSelectionLimit: (limit: number) => void;
}

interface PeriodicSelectionContextValue {
  enabledRecord: Record<string, boolean>;
  disabledRecord: Record<string, boolean>;
  hiddenRecord: Record<string, boolean>;
  effectiveDisabledRecord: Record<string, boolean>;
  detailedElementSymbol: string | null;
  forwardOuterChange: boolean;
  maxElementSelectable: number;
  lastAction?: SelectableTableLastAction;
  setDetailedElement: (element: string | null) => void;
  toggleElement: (element: string) => void;
  actions: PeriodicSelectionActions;
}

export const PeriodicSelectionContext = createContext<PeriodicSelectionContextValue | null>(null);

const normalizeSelectionInput = (values?: SelectionInput) => {
  if (!values) {
    return [];
  }

  if (Array.isArray(values)) {
    return values;
  }

  return Object.keys(values).filter((key) => values[key]);
};

export function PeriodicSelectionProvider({
  enabledElements = [],
  disabledElements = [],
  hiddenElements = [],
  detailedElement,
  forwardOuterChange,
  maxElementSelectable,
  selectionStyle,
  children,
}: PeriodicSelectionProviderProps) {
  const initialState = useMemo(
    () =>
      createSelectableTableStoreState({
        enabledElements: normalizeSelectionInput(enabledElements),
        disabledElements: normalizeSelectionInput(disabledElements),
        hiddenElements: normalizeSelectionInput(hiddenElements),
        detailedElement: detailedElement ?? null,
        forwardOuterChange,
      }),
    []
  );
  const [enabledRecord, setEnabledRecord] = useState<Record<string, boolean>>(initialState.enabledElements);
  const [disabledRecord, setDisabledRecord] = useState<Record<string, boolean>>(initialState.disabledElements);
  const [hiddenRecord, setHiddenRecord] = useState<Record<string, boolean>>(initialState.hiddenElements);
  const [lastAction, setLastAction] = useState<SelectableTableLastAction | undefined>();
  const [detailedElementSymbol, setDetailedElementSymbol] = useState<string | null>(initialState.detailedElement);
  const [forwardOuterChangeState, setForwardOuterChangeState] = useState(forwardOuterChange);
  const [maxSelectionLimit, setMaxSelectionLimit] = useState(maxElementSelectable);

  useEffect(() => {
    setEnabledRecord(toRecord(normalizeSelectionInput(enabledElements)));
  }, [enabledElements]);

  useEffect(() => {
    setDisabledRecord(toRecord(normalizeSelectionInput(disabledElements)));
  }, [disabledElements]);

  useEffect(() => {
    setHiddenRecord(toRecord(normalizeSelectionInput(hiddenElements)));
  }, [hiddenElements]);

  useEffect(() => {
    if (detailedElement !== undefined) {
      setDetailedElementSymbol(detailedElement);
    }
  }, [detailedElement]);

  useEffect(() => {
    setForwardOuterChangeState(forwardOuterChange);
  }, [forwardOuterChange]);

  useEffect(() => {
    setMaxSelectionLimit(maxElementSelectable);
  }, [maxElementSelectable]);

  const effectiveDisabledRecord = useMemo(
    () => getClampedDisabledElements(enabledRecord, disabledRecord, maxSelectionLimit, selectionStyle),
    [disabledRecord, enabledRecord, maxSelectionLimit, selectionStyle]
  );

  useEffect(() => {
    if (!detailedElementSymbol) {
      return;
    }
    const isHidden = !!hiddenRecord[detailedElementSymbol];
    const isUnavailable =
      !!effectiveDisabledRecord[detailedElementSymbol] || !!DEFAULT_DISABLED_ELEMENTS[detailedElementSymbol];
    if (isHidden || isUnavailable) {
      setDetailedElementSymbol(null);
    }
  }, [detailedElementSymbol, effectiveDisabledRecord, hiddenRecord]);

  const setDetailedElement = useCallback((element: string | null) => {
    setDetailedElementSymbol(element);
  }, []);

  const toggleElement = useCallback(
    (element: string) => {
      if (selectionStyle === TableSelectionStyle.ENABLE_DISABLE) {
        setDisabledRecord((current) => {
          const nextDisabledRecord = { ...current };
          if (nextDisabledRecord[element]) {
            delete nextDisabledRecord[element];
          } else {
            nextDisabledRecord[element] = true;
          }
          return nextDisabledRecord;
        });
        return;
      }

      setEnabledRecord((current) => {
        const enabled = !!current[element];
        const nextEnabledRecord = { ...current };
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

        setLastAction(nextLastAction);
        return nextEnabledRecord;
      });
    },
    [selectionStyle]
  );

  const actions = useMemo<PeriodicSelectionActions>(
    () => ({
      setForwardChange: (forwardChange) => {
        setForwardOuterChangeState(forwardChange);
      },
      setEnabledElements: (nextEnabledElements) => {
        setLastAction(undefined);
        setEnabledRecord({ ...nextEnabledElements });
      },
      setDisabledElements: (nextDisabledElements) => {
        setDisabledRecord({ ...nextDisabledElements });
      },
      setHiddenElements: (nextHiddenElements) => {
        setHiddenRecord({ ...nextHiddenElements });
      },
      clear: () => {
        setEnabledRecord({});
        setDisabledRecord({});
        setHiddenRecord({});
        setDetailedElementSymbol(null);
        setLastAction(undefined);
      },
      setDetailedElement,
      addEnabledElement: (element) => {
        setEnabledRecord((current) => ({ ...current, [element]: true }));
      },
      addDisabledElement: (element) => {
        setDisabledRecord((current) => ({ ...current, [element]: true }));
      },
      removeEnabledElement: (element) => {
        setEnabledRecord((current) => {
          const next = { ...current };
          delete next[element];
          return next;
        });
      },
      removeDisabledElement: (element) => {
        setDisabledRecord((current) => {
          const next = { ...current };
          delete next[element];
          return next;
        });
      },
      toggleEnabledElement: toggleElement,
      toggleDisabledElement: (element) => {
        setDisabledRecord((current) => {
          const next = { ...current };
          if (next[element]) {
            delete next[element];
          } else {
            next[element] = true;
          }
          return next;
        });
      },
      setMaxSelectionLimit: (limit) => {
        setMaxSelectionLimit(limit);
      },
    }),
    [setDetailedElement, toggleElement]
  );

  const value = useMemo<PeriodicSelectionContextValue>(
    () => ({
      enabledRecord,
      disabledRecord,
      hiddenRecord,
      effectiveDisabledRecord,
      detailedElementSymbol,
      forwardOuterChange: forwardOuterChangeState,
      maxElementSelectable: maxSelectionLimit,
      lastAction,
      setDetailedElement,
      toggleElement,
      actions,
    }),
    [
      actions,
      detailedElementSymbol,
      disabledRecord,
      effectiveDisabledRecord,
      enabledRecord,
      forwardOuterChangeState,
      hiddenRecord,
      lastAction,
      maxSelectionLimit,
      setDetailedElement,
      toggleElement,
    ]
  );

  return <PeriodicSelectionContext.Provider value={value}>{children}</PeriodicSelectionContext.Provider>;
}

export function PeriodicContext({
  enabledElements = [],
  disabledElements = [],
  hiddenElements = [],
  detailedElement = null,
  forwardOuterChange = true,
  maxElementSelectable = 5,
  selectionStyle = TableSelectionStyle.SELECT,
  children,
}: PeriodicContextProps) {
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
      {children}
    </PeriodicSelectionProvider>
  );
}

export function useOptionalPeriodicSelectionContext() {
  return useContext(PeriodicSelectionContext);
}

export function usePeriodicSelectionContext() {
  const context = useOptionalPeriodicSelectionContext();
  if (!context) {
    throw new Error('usePeriodicSelectionContext must be used within PeriodicSelectionProvider');
  }
  return context;
}

export function useElements(_maxElementSelection: number = 10, onStateChange?: (state: {
  enabledElements: string[];
  disabledElements: string[];
}) => void) {
  const context = usePeriodicSelectionContext();
  const {
    enabledRecord,
    effectiveDisabledRecord,
    hiddenRecord,
    lastAction,
    actions,
    forwardOuterChange,
  } = context;

  useEffect(() => {
    actions.setMaxSelectionLimit(_maxElementSelection);
  }, [_maxElementSelection, actions]);

  useEffect(() => {
    if (!onStateChange || !forwardOuterChange || !lastAction) {
      return;
    }
    onStateChange({
      enabledElements: toArray(enabledRecord),
      disabledElements: toArray(effectiveDisabledRecord),
    });
  }, [effectiveDisabledRecord, enabledRecord, forwardOuterChange, lastAction, onStateChange]);

  return {
    enabledElements: enabledRecord,
    disabledElements: effectiveDisabledRecord,
    hiddenElements: hiddenRecord,
    lastAction,
    actions,
  };
}

export function useDetailedElement() {
  return usePeriodicSelectionContext().detailedElementSymbol;
}
