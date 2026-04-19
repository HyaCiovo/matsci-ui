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
  detailedElement: string | null;
  forwardOuterChange: boolean;
  lastAction?: SelectableTableLastAction;
}
