import { VALID_ELEMENTS } from '../../data-entry/MaterialsInput/utils';
import { LEGACY_CLASS_MAP } from '../periodic-table-data/legacyClassMap';
import type { MatElement } from '../periodic-table-data/table-v2';
import {
  TableSelectionStyle,
  type SelectableTableLastAction,
  type SelectableTableStateChange,
} from './types';

export interface SelectableTableStoreState {
  enabledElements: Record<string, boolean>;
  disabledElements: Record<string, boolean>;
  hiddenElements: Record<string, boolean>;
  detailedElement: string | null;
  forwardOuterChange: boolean;
  lastAction?: SelectableTableLastAction;
}

export const toRecord = (values?: string[]) =>
  Object.fromEntries((values ?? []).map((value) => [value, true])) as Record<string, boolean>;

export const toArray = (values: Record<string, boolean>) => Object.keys(values).filter((key) => values[key]);

export const DEFAULT_DISABLED_ELEMENTS: Record<string, boolean> = {
  Po: true,
  Rn: true,
  Ra: true,
  At: true,
  Fr: true,
  Rf: true,
  Db: true,
  Sg: true,
  Bh: true,
  Hs: true,
  Mt: true,
  Ds: true,
  Rg: true,
  Cn: true,
  Nh: true,
  Fl: true,
  Mc: true,
  Lv: true,
  Ts: true,
  Og: true,
  'La-Lu': true,
  'Ac-Lr': true,
  Am: true,
  Cm: true,
  Bk: true,
  Cf: true,
  Es: true,
  Fm: true,
  Md: true,
  No: true,
  Lr: true,
};

export const categoryToClassName = (category?: string, symbol?: string) => {
  if (symbol && LEGACY_CLASS_MAP[symbol]) {
    return LEGACY_CLASS_MAP[symbol];
  }

  if (symbol === 'La-Lu') {
    return 'element-lanthanoid-transitional-metal';
  }
  if (symbol === 'Ac-Lr') {
    return 'element-actinoid-transitional-metal';
  }
  switch (category) {
    case 'alkali metal':
      return 'element-alkali-metal';
    case 'alkaline earth metal':
      return 'element-alkali-earth-metal';
    case 'transition metal':
      return 'element-transition-metal';
    case 'lanthanide':
      return 'element-lanthoid';
    case 'actinide':
      return 'element-actinoid';
    case 'metalloid':
      return 'element-metalloid';
    case 'halogen':
      return 'element-halogen';
    case 'noble gas':
      return 'element-noble-gas';
    case 'post-transition metal':
    case 'polyatomic nonmetal':
    case 'diatomic nonmetal':
    case 'nonmetal':
      return 'element-non-metal';
    default:
      return 'element-metal';
  }
};

export const getClampedDisabledElements = (
  enabledRecord: Record<string, boolean>,
  disabledRecord: Record<string, boolean>,
  maxElementSelectable: number,
  selectionStyle: TableSelectionStyle
) => {
  if (selectionStyle === TableSelectionStyle.ENABLE_DISABLE) {
    return disabledRecord;
  }

  if (Object.keys(enabledRecord).length >= maxElementSelectable) {
    const nextDisabled = Object.fromEntries(VALID_ELEMENTS.map((element) => [element, true])) as Record<
      string,
      boolean
    >;
    Object.keys(enabledRecord).forEach((element) => {
      delete nextDisabled[element];
    });
    Object.keys(disabledRecord).forEach((element) => {
      nextDisabled[element] = true;
    });
    return nextDisabled;
  }

  return disabledRecord;
};

export const createSelectableTableStoreState = ({
  enabledElements = [],
  disabledElements = [],
  hiddenElements = [],
  detailedElement = null,
  forwardOuterChange = true,
}: {
  enabledElements?: string[];
  disabledElements?: string[];
  hiddenElements?: string[];
  detailedElement?: string | null;
  forwardOuterChange?: boolean;
}): SelectableTableStoreState => ({
  enabledElements: toRecord(enabledElements),
  disabledElements: toRecord(disabledElements),
  hiddenElements: toRecord(hiddenElements),
  detailedElement,
  forwardOuterChange,
});

export const getElementDetail = (symbol: string | null, elementMap: Record<string, MatElement>) =>
  symbol ? elementMap[symbol] ?? null : null;

export const getSelectableTableStateChange = ({
  enabledRecord,
  effectiveDisabledRecord,
  hiddenRecord,
  detailedElementSymbol,
  forwardOuterChange,
  lastAction,
}: {
  enabledRecord: Record<string, boolean>;
  effectiveDisabledRecord: Record<string, boolean>;
  hiddenRecord: Record<string, boolean>;
  detailedElementSymbol: string | null;
  forwardOuterChange: boolean;
  lastAction?: SelectableTableLastAction;
}): SelectableTableStateChange => ({
  enabledElements: toArray(enabledRecord),
  disabledElements: toArray(effectiveDisabledRecord),
  hiddenElements: toArray(hiddenRecord),
  detailedElement: detailedElementSymbol,
  forwardOuterChange,
  lastAction,
});
