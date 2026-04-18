import { Formula } from '../components/data-display/Formula';
import { Link } from '../components/navigation/Link';
import { Column, ColumnFormat } from '../components/data-display/SearchUI/types';

const emptyCellPlaceholder = '-';

export const getRowValueFromSelectorString = (selector: string, row: any) => {
  try {
    return selector.split('.').reduce((value, key) => value?.[key], row);
  } catch {
    return emptyCellPlaceholder;
  }
};

export const getColumnsFromKeys = (data?: object): Column[] => {
  if (!data) {
    return [];
  }

  return Object.keys(data).map((key) => ({
    title: key,
    selector: key,
  }));
};

export const formatColumnValue = (column: Column, row: any) => {
  const rawValue = getRowValueFromSelectorString(column.selector, row);
  const options = column.formatOptions ?? {};

  switch (column.formatType) {
    case ColumnFormat.FIXED_DECIMAL: {
      const decimals = options.decimals ?? 2;
      const numberValue = parseFloat(String(rawValue));
      if (Number.isNaN(numberValue)) {
        return emptyCellPlaceholder;
      }

      const converted = column.conversionFactor ? numberValue * column.conversionFactor : numberValue;
      return converted.toFixed(decimals);
    }
    case ColumnFormat.SIGNIFICANT_FIGURES: {
      const sigFigs = options.sigFigs ?? 5;
      const numberValue = parseFloat(String(rawValue));
      if (Number.isNaN(numberValue)) {
        return emptyCellPlaceholder;
      }

      const converted = column.conversionFactor ? numberValue * column.conversionFactor : numberValue;
      return converted.toPrecision(sigFigs);
    }
    case ColumnFormat.FORMULA:
      return <Formula>{String(rawValue ?? '')}</Formula>;
    case ColumnFormat.BOOLEAN: {
      const truthyLabel = options.truthyLabel ?? 'true';
      const falsyLabel = options.falsyLabel ?? 'false';
      return rawValue ? truthyLabel : falsyLabel;
    }
    case ColumnFormat.LINK: {
      const linkValue = rawValue;
      if (!linkValue || linkValue === emptyCellPlaceholder) {
        return emptyCellPlaceholder;
      }

      const href = options.baseUrl ? `${String(options.baseUrl).replace(/\/$/, '')}/${linkValue}` : linkValue;
      const linkLabel = options.linkLabelKey ? row?.[options.linkLabelKey] : linkValue;
      const content = options.linkLabelIsFormula ? <Formula>{String(linkLabel)}</Formula> : String(linkLabel);

      return (
        <Link href={String(href)} target={options.target} preserveQuery={options.preserveQuery}>
          {content}
        </Link>
      );
    }
    default:
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        return emptyCellPlaceholder;
      }
      return typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
  }
};

export const matchesConditionalStyle = (row: any, condition: { selector: string; value: any; condition: string }) => {
  const rowValue = getRowValueFromSelectorString(condition.selector, row);

  switch (condition.condition) {
    case 'gt':
      return rowValue > condition.value;
    case 'lt':
      return rowValue < condition.value;
    default:
      return rowValue === condition.value;
  }
};
