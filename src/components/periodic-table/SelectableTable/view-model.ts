import { VALID_ELEMENTS } from '../../data-entry/MaterialsInput/utils';
import { TABLE_V2, type MatElement } from '../periodic-table-data/table-v2';
import { DEFAULT_DISABLED_ELEMENTS } from './selection-state';

export interface PositionedElement {
  symbol: string;
  xpos: number;
  ypos: number;
  detail: MatElement | null;
}

export interface SelectableTableElementViewModel extends PositionedElement {
  enabled: boolean;
  disabled: boolean;
  defaultDisabled: boolean;
}

export const createElementMap = (elements: MatElement[] = TABLE_V2) =>
  Object.fromEntries(elements.map((element) => [element.symbol, element])) as Record<string, MatElement>;

export const getPositionedElements = (elementMap: Record<string, MatElement>): PositionedElement[] =>
  VALID_ELEMENTS.map((symbol, index) => {
    const detail = elementMap[symbol] ?? null;
    return {
      symbol,
      xpos: detail?.xpos ?? ((index % 18) + 1),
      ypos: detail?.ypos ?? (Math.floor(index / 18) + 1),
      detail,
    };
  }).sort((left, right) => {
    if (left.ypos !== right.ypos) {
      return left.ypos - right.ypos;
    }
    if (left.xpos !== right.xpos) {
      return left.xpos - right.xpos;
    }
    return left.symbol.localeCompare(right.symbol);
  });

export const DEFAULT_ELEMENT_MAP = createElementMap();
export const DEFAULT_POSITIONED_ELEMENTS = getPositionedElements(DEFAULT_ELEMENT_MAP);

export const getSelectableTableElementViewModels = ({
  positionedElements,
  enabledRecord,
  effectiveDisabledRecord,
  hiddenRecord,
  disabled = false,
}: {
  positionedElements: PositionedElement[];
  enabledRecord: Record<string, boolean>;
  effectiveDisabledRecord: Record<string, boolean>;
  hiddenRecord: Record<string, boolean>;
  disabled?: boolean;
}): SelectableTableElementViewModel[] =>
  positionedElements
    .filter(({ symbol }) => !hiddenRecord[symbol])
    .map((positionedElement) => {
      const defaultDisabled = !!DEFAULT_DISABLED_ELEMENTS[positionedElement.symbol];
      return {
        ...positionedElement,
        enabled: !!enabledRecord[positionedElement.symbol],
        defaultDisabled,
        disabled: disabled || !!effectiveDisabledRecord[positionedElement.symbol] || defaultDisabled,
      };
    });

export const getDetailedElementDetail = (
  symbol: string | null,
  elementMap: Record<string, MatElement> = DEFAULT_ELEMENT_MAP
) => (symbol ? elementMap[symbol] ?? null : null);

export const getPeriodicTableFilterValue = (element: MatElement, key: string) => {
  if (key === 'group') {
    return element.xpos;
  }

  return element[key as keyof MatElement];
};
