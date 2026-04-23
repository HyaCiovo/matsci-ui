import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  forwardOuterChange: boolean;
  maxElementSelectable: number;
  lastAction?: SelectableTableLastAction;
  changeOrigin: 'props' | 'action' | null;
  actions: PeriodicSelectionActions;
}

interface PeriodicSelectionDetailContextValue {
  detailedElementSymbol: string | null;
  setDetailedElement: (element: string | null) => void;
}

export const PeriodicSelectionContext = createContext<PeriodicSelectionContextValue | null>(null);
export const PeriodicSelectionActionsContext = createContext<PeriodicSelectionActions | null>(null);
export const PeriodicSelectionDetailContext = createContext<PeriodicSelectionDetailContextValue | null>(null);

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
  const [changeOrigin, setChangeOrigin] = useState<'props' | 'action' | null>(null);

  useEffect(() => {
    setChangeOrigin('props');
    setEnabledRecord(toRecord(normalizeSelectionInput(enabledElements)));
  }, [enabledElements]);

  useEffect(() => {
    setChangeOrigin('props');
    setDisabledRecord(toRecord(normalizeSelectionInput(disabledElements)));
  }, [disabledElements]);

  useEffect(() => {
    setChangeOrigin('props');
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
    if (isHidden) {
      setDetailedElementSymbol(null);
    }
  }, [detailedElementSymbol, hiddenRecord]);

  const setDetailedElement = useCallback((element: string | null) => {
    setDetailedElementSymbol(element);
  }, []);

  const toggleElement = useCallback(
    (element: string) => {
      if (DEFAULT_DISABLED_ELEMENTS[element]) {
        return;
      }

      if (selectionStyle === TableSelectionStyle.ENABLE_DISABLE) {
        setChangeOrigin('action');
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

      setChangeOrigin('action');
      setForwardOuterChangeState(true);
      setEnabledRecord((current) => {
        const enabled = !!current[element];
        const explicitlyDisabled = !!disabledRecord[element];
        const atSelectionLimit = Object.keys(current).length >= maxSelectionLimit;

        if (explicitlyDisabled) {
          return current;
        }

        const nextEnabledRecord = { ...current };
        const nextLastAction: SelectableTableLastAction = enabled
          ? { type: 'deselect', element }
          : { type: 'select', element };

        if (enabled) {
          delete nextEnabledRecord[element];
        } else if (selectionStyle === TableSelectionStyle.SELECT && maxSelectionLimit > 1 && atSelectionLimit) {
          return current;
        } else if (selectionStyle === TableSelectionStyle.SELECT && maxSelectionLimit === 1 && atSelectionLimit) {
          Object.keys(nextEnabledRecord).forEach((selectedElement) => {
            delete nextEnabledRecord[selectedElement];
          });
          nextEnabledRecord[element] = true;
        } else if (selectionStyle === TableSelectionStyle.MULTI_INPUTS_SELECT) {
          // Legacy store exposed slot bookkeeping hooks, but no real consumer wired them.
          // Keep the effective user-facing behavior: one active element at a time.
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
    [disabledRecord, maxSelectionLimit, selectionStyle]
  );

  const actions = useMemo<PeriodicSelectionActions>(
    () => ({
      setForwardChange: (forwardChange) => {
        setForwardOuterChangeState(forwardChange);
      },
      setEnabledElements: (nextEnabledElements) => {
        setChangeOrigin('action');
        setLastAction(undefined);
        setEnabledRecord((current) => {
          const next = { ...nextEnabledElements };
          return next;
        });
      },
      setDisabledElements: (nextDisabledElements) => {
        setChangeOrigin('action');
        setDisabledRecord({ ...nextDisabledElements });
      },
      setHiddenElements: (nextHiddenElements) => {
        setChangeOrigin('action');
        setHiddenRecord({ ...nextHiddenElements });
      },
      clear: () => {
        setChangeOrigin('action');
        setEnabledRecord({});
        setDisabledRecord({});
        setHiddenRecord({});
        setDetailedElementSymbol(null);
        setForwardOuterChangeState(true);
        setLastAction(undefined);
      },
      setDetailedElement,
      addEnabledElement: (element) => {
        setChangeOrigin('action');
        setLastAction(undefined);
        setEnabledRecord((current) => ({ ...current, [element]: true }));
      },
      addDisabledElement: (element) => {
        setChangeOrigin('action');
        setDisabledRecord((current) => ({ ...current, [element]: true }));
      },
      removeEnabledElement: (element) => {
        setChangeOrigin('action');
        setLastAction(undefined);
        setEnabledRecord((current) => {
          const next = { ...current };
          delete next[element];
          return next;
        });
      },
      removeDisabledElement: (element) => {
        setChangeOrigin('action');
        setDisabledRecord((current) => {
          const next = { ...current };
          delete next[element];
          return next;
        });
      },
      toggleEnabledElement: toggleElement,
      toggleDisabledElement: (element) => {
        setChangeOrigin('action');
        setForwardOuterChangeState(selectionStyle === TableSelectionStyle.ENABLE_DISABLE);
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
      forwardOuterChange: forwardOuterChangeState,
      maxElementSelectable: maxSelectionLimit,
      lastAction,
      changeOrigin,
      actions,
    }),
    [
      actions,
      disabledRecord,
      effectiveDisabledRecord,
      enabledRecord,
      changeOrigin,
      forwardOuterChangeState,
      hiddenRecord,
      lastAction,
      maxSelectionLimit,
    ]
  );

  const detailValue = useMemo<PeriodicSelectionDetailContextValue>(
    () => ({
      detailedElementSymbol,
      setDetailedElement,
    }),
    [detailedElementSymbol, setDetailedElement]
  );

  return (
    <PeriodicSelectionActionsContext.Provider value={actions}>
      <PeriodicSelectionContext.Provider value={value}>
        <PeriodicSelectionDetailContext.Provider value={detailValue}>{children}</PeriodicSelectionDetailContext.Provider>
      </PeriodicSelectionContext.Provider>
    </PeriodicSelectionActionsContext.Provider>
  );
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

export function usePeriodicSelectionActions() {
  const actions = useContext(PeriodicSelectionActionsContext);
  if (!actions) {
    throw new Error('usePeriodicSelectionActions must be used within PeriodicSelectionProvider');
  }
  return actions;
}

export function useOptionalPeriodicSelectionActions() {
  return useContext(PeriodicSelectionActionsContext);
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
    disabledRecord,
    effectiveDisabledRecord,
    hiddenRecord,
    lastAction,
    actions,
    forwardOuterChange,
    changeOrigin,
  } = context;
  const hasInitializedCallbackRef = useRef(false);

  useEffect(() => {
    actions.setMaxSelectionLimit(_maxElementSelection);
  }, [_maxElementSelection, actions]);

  useEffect(() => {
    if (!onStateChange) {
      return;
    }

    if (!hasInitializedCallbackRef.current) {
      hasInitializedCallbackRef.current = true;
      onStateChange({
        enabledElements: toArray(enabledRecord),
        disabledElements: toArray(disabledRecord),
      });
      return;
    }

    if (!forwardOuterChange || changeOrigin !== 'action') {
      return;
    }

    onStateChange({
      enabledElements: toArray(enabledRecord),
      disabledElements: toArray(disabledRecord),
    });
  }, [changeOrigin, disabledRecord, enabledRecord, forwardOuterChange, onStateChange]);

  return {
    enabledElements: enabledRecord,
    disabledElements: effectiveDisabledRecord,
    hiddenElements: hiddenRecord,
    lastAction,
    actions,
  };
}

export function useDetailedElement() {
  const context = useContext(PeriodicSelectionDetailContext);
  if (!context) {
    throw new Error('useDetailedElement must be used within PeriodicSelectionProvider');
  }
  return context.detailedElementSymbol;
}
