export enum TableSelectionStyle {
  ENABLE_DISABLE = 'enableDisable',
  SELECT = 'select',
  MULTI_INPUTS_SELECT = 'mis',
}

export enum TableLayout {
  FULL = 'full',
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'mini',
  MAP = 'map',
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

export interface SelectableTableSelectionChange {
  enabledElements: string[];
  disabledElements: string[];
}

export type SelectableTableLegacySelectionChange = string[];
