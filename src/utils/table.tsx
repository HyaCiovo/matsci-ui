import clsx from 'clsx';
import { Download, Mail } from 'lucide-react';
import { pointGroups } from '../constants/pointGroups';
import { spaceGroups } from '../constants/spaceGroups';
import { ArrayChips } from '../components/data-display/ArrayChips';
import { Formula } from '../components/data-display/Formula';
import { Tooltip } from '../components/data-display/Tooltip';
import { PublicationButton } from '../components/publications/PublicationButton';
import { Link } from '../components/navigation/Link';
import { Column, ColumnFormat } from '../components/data-display/SearchUI/types';

const emptyCellPlaceholder = '-';

const joinUrl = (base: string, rest: string) => {
  if (base.startsWith('http://') || base.startsWith('https://')) {
    const normalizedBase = base.endsWith('/') ? base : `${base}/`;
    const normalizedRest = String(rest).replace(/^\/+/, '');
    return new URL(normalizedRest, normalizedBase).href;
  }

  const normalizedBase = base.replace(/\/+$/, '');
  const normalizedRest = String(rest).replace(/^\/+/, '');
  return `${normalizedBase}/${normalizedRest}`;
};

const formatPointGroup = (pointGroup: string) => {
  if (pointGroup && typeof pointGroup === 'string') {
    const firstCharacter = pointGroup.substring(0, 1);
    const subCharacters = pointGroup.substring(1).replace('*', '\u221E');
    return (
      <span>
        <span>{firstCharacter}</span>
        <sub>{subCharacters}</sub>
      </span>
    );
  }

  return <span></span>;
};

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
    case ColumnFormat.BOOLEAN_CLASS: {
      const truthyClass = options.truthyClass ?? '';
      const falsyClass = options.falsyClass ?? '';
      const truthyValue = options.truthyValue;
      const cleanValue = truthyValue !== undefined ? rawValue === truthyValue : rawValue;
      const tooltipId = column.cellTooltip ? `${column.selector}-${row?._index ?? row?.material_id ?? 'cell'}` : undefined;

      return (
        <span className="boolean-cell-wrapper" data-for={tooltipId} data-tip={column.cellTooltip}>
          <i className={clsx({ [truthyClass]: cleanValue, [falsyClass]: !cleanValue })}></i>
          {tooltipId && column.cellTooltip ? <Tooltip id={tooltipId}>{column.cellTooltip}</Tooltip> : null}
        </span>
      );
    }
    case ColumnFormat.SPACEGROUP_SYMBOL: {
      const spaceGroup = spaceGroups.find((candidate) => candidate.symbol === rawValue);
      return spaceGroup ? spaceGroup.symbol_unicode : rawValue;
    }
    case ColumnFormat.POINTGROUP:
      return pointGroups.includes(String(rawValue)) ? formatPointGroup(String(rawValue)) : formatPointGroup(String(rawValue ?? ''));
    case ColumnFormat.LINK: {
      const linkValue = rawValue;
      if (!linkValue || linkValue === emptyCellPlaceholder) {
        return emptyCellPlaceholder;
      }

      const href = options.baseUrl ? joinUrl(String(options.baseUrl), String(linkValue)) : linkValue;
      const linkLabel = options.linkLabelKey ? row?.[options.linkLabelKey] : linkValue;
      const isFormulaLabel = options.linkLabelIsFormula || options.linkLabelisFormula;
      const content = isFormulaLabel ? <Formula>{String(linkLabel)}</Formula> : String(linkLabel);

      return (
        <Link href={String(href)} target={options.target} preserveQuery={options.preserveQuery}>
          {content}
        </Link>
      );
    }
    case ColumnFormat.ARRAY: {
      if (!Array.isArray(rawValue)) {
        return rawValue ?? emptyCellPlaceholder;
      }

      return (
        <ArrayChips
          chips={rawValue}
          chipLinks={options.arrayLinksKey ? row?.[options.arrayLinksKey] : undefined}
          chipTooltips={options.arrayTooltipsKey ? row?.[options.arrayTooltipsKey] : undefined}
          chipLinksTarget={options.arrayLinksTarget}
          showDownloadIcon={options.showDownloadIcon}
        />
      );
    }
    case ColumnFormat.TAG: {
      const isLink = options.isLink === true;
      const letterNumber =
        options.firstLetterBackwards && typeof rawValue === 'string'
          ? rawValue.length - options.firstLetterBackwards
          : undefined;
      const displayValue =
        options.isShortLink && typeof rawValue === 'string' && letterNumber !== undefined
          ? rawValue.substring(letterNumber)
          : rawValue;

      if (isLink) {
        const href = options.tagLinksBase && rawValue ? `${options.tagLinksBase}${rawValue}` : rawValue;
        return (
          <Link className="tag" href={String(href)} target={options.target}>
            {String(displayValue ?? emptyCellPlaceholder)}
          </Link>
        );
      }

      return <span className="tag">{String(rawValue ?? emptyCellPlaceholder)}</span>;
    }
    case ColumnFormat.EMAIL: {
      const firstAuthor =
        typeof rawValue === 'string' ? (rawValue.includes(',') ? rawValue.split(',')[0] : rawValue) : '';
      const emailValue =
        options.emailAddressKey && typeof row?.[options.emailAddressKey] === 'string'
          ? row[options.emailAddressKey]
          : '';
      const emailAddressPart = typeof emailValue === 'string' ? (emailValue.split(':')[1] ?? '') : '';
      const href =
        emailAddressPart !== ''
          ? `mailto:${emailAddressPart},contribs@materialsproject.org`
          : 'mailto:contribs@materialsproject.org';

      return (
        <a className="tag" href={href} onClick={(event) => event.stopPropagation()}>
          <Mail className="mr-1" />
          {firstAuthor}
        </a>
      );
    }
    case ColumnFormat.DICT: {
      if (rawValue == null || typeof rawValue !== 'object') {
        return emptyCellPlaceholder;
      }

      const dictValue =
        options.dictionaryKey && rawValue[options.dictionaryKey] !== undefined
          ? rawValue[options.dictionaryKey]
          : Object.values(rawValue)[0];

      if (!options.decimals) {
        return dictValue;
      }

      const numberValue = parseFloat(String(dictValue));
      const converted = column.conversionFactor ? numberValue * column.conversionFactor : numberValue;
      const min = Math.pow(10, -options.decimals);

      if (converted === 0) {
        return 0;
      }

      if (options.abbreviateNearZero) {
        if (converted >= min) {
          return converted.toFixed(options.decimals);
        }
        if (converted < min) {
          return `< ${min.toString()}`;
        }
        return emptyCellPlaceholder;
      }

      return Number.isNaN(converted) ? emptyCellPlaceholder : converted.toFixed(options.decimals);
    }
    case ColumnFormat.CONTRIBS_FILES_DOWNLOAD: {
      if (!options.baseUrl || !Array.isArray(rawValue)) {
        return null;
      }

      return (
        <span>
          {rawValue.map((item: any) => (
            <span key={item.id ?? item.name}>
              <span className="tag">{item.name}</span>
              <a href={joinUrl(String(options.baseUrl), item.id)}>
                <Download className="mr-1" />
              </a>
            </span>
          ))}
        </span>
      );
    }
    case ColumnFormat.PUBLICATION: {
      if (Array.isArray(rawValue)) {
        return (
          <div>
            {rawValue.map((item: any) => (
              <PublicationButton
                key={item.doi}
                doi={item.doi}
                showTooltip={options.showTooltip ? options.showTooltip : false}
                compact={options.compact ? options.compact : false}
                target="_blank"
              />
            ))}
          </div>
        );
      }

      if (rawValue) {
        return (
          <PublicationButton
            doi={String(rawValue)}
            showTooltip={options.showTooltip ? options.showTooltip : false}
            compact={options.compact ? options.compact : false}
            target="_blank"
          />
        );
      }

      return null;
    }
    default:
      if (rawValue === undefined || rawValue === null || rawValue === '') {
        return emptyCellPlaceholder;
      }
      if (typeof rawValue === 'object' && rawValue?.$$typeof) {
        return rawValue;
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
