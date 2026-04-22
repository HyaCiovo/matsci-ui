import { pointGroups } from '../../../constants/pointGroups';
import { spaceGroups } from '../../../constants/spaceGroups';
import { MaterialsInputType } from '../../data-entry/MaterialsInput';
import type { ActiveFilter, Filter, FilterGroup } from './types';
import { FilterType } from './types';

export const isNotEmpty = (value: any) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== undefined && value !== null && value !== '';
};

export const spaceGroupNumberOptions = () =>
  spaceGroups.map((group) => ({
    value: group.int_number,
    label: group.int_number,
  }));

export const spaceGroupSymbolOptions = () =>
  spaceGroups.map((group) => ({
    value: group.symbol,
    label: group.symbol_unicode,
  }));

export const crystalSystemOptions = () =>
  [...new Set(spaceGroups.map((group) => group.crystal_system))].map((value) => ({
    value: value.toLowerCase(),
    label: value,
  }));

export const formatPointGroup = (label: string) => label;

export const pointGroupOptions = () =>
  pointGroups.map((group) => ({
    value: group,
    label: formatPointGroup(group),
    customAbbreviation: group,
  }));

export const initFilterGroups = (filterGroups: FilterGroup[]): FilterGroup[] => {
  return filterGroups.map((group) => ({
    ...group,
    filters: group.filters.map((filter) => {
      switch (filter.type) {
        case FilterType.SELECT_SPACEGROUP_SYMBOL:
          return { ...filter, props: { ...filter.props, options: spaceGroupSymbolOptions() } };
        case FilterType.SELECT_SPACEGROUP_NUMBER:
          return { ...filter, props: { ...filter.props, options: spaceGroupNumberOptions() } };
        case FilterType.SELECT_CRYSTAL_SYSTEM:
          return { ...filter, props: { ...filter.props, options: crystalSystemOptions() } };
        case FilterType.SELECT_POINTGROUP:
          return { ...filter, props: { ...filter.props, options: pointGroupOptions() } };
        default:
          return { ...filter };
      }
    }),
  }));
};

const getFormattedSelectValue = (filter: Filter, rawValue: any) => {
  if (!isNotEmpty(rawValue)) {
    return undefined;
  }
  const selectedOption = filter.props?.options?.find((option: any) => option.value === rawValue);
  return selectedOption ? selectedOption.label : rawValue;
};

export const getActiveFilters = (filterGroups: FilterGroup[], query: Record<string, any>): ActiveFilter[] => {
  const activeFilters: ActiveFilter[] = [];

  filterGroups.forEach((group) => {
    group.filters.forEach((filter) => {
      const baseFilter = {
        name: filter.name,
        params: filter.params,
        value: isNotEmpty(query[filter.params[0]]) ? query[filter.params[0]] : filter.props?.defaultValue,
        isSearchBarField: filter.isSearchBarField,
      };

      switch (filter.type) {
        case FilterType.SLIDER: {
          const minValue = query[filter.params[0]];
          const maxValue = query[filter.params[1]];
          const domain = filter.props?.domain ?? [];
          const hasActiveMin = isNotEmpty(minValue) && minValue > domain[0];
          const hasActiveMax = isNotEmpty(maxValue) && maxValue < domain[1];
          if (hasActiveMin || hasActiveMax) {
            activeFilters.push({
              ...baseFilter,
              value: [minValue, maxValue],
            });
          }
          break;
        }
        case FilterType.MATERIALS_INPUT: {
          if (isNotEmpty(baseFilter.value)) {
            let parsedValue = baseFilter.value;
            if (
              filter.props?.type === MaterialsInputType.CHEMICAL_SYSTEM ||
              (filter.props?.type === MaterialsInputType.FORMULA && String(parsedValue).includes('-'))
            ) {
              parsedValue = String(parsedValue).replace(/-$/, '');
            }
            activeFilters.push({ ...baseFilter, value: parsedValue });
          }
          break;
        }
        case FilterType.SELECT_SPACEGROUP_SYMBOL: {
          if (isNotEmpty(baseFilter.value)) {
            const spaceGroup = spaceGroups.find((group) => group.symbol === baseFilter.value);
            activeFilters.push({
              ...baseFilter,
              value: spaceGroup ? spaceGroup.symbol_unicode : baseFilter.value,
            });
          }
          break;
        }
        case FilterType.SELECT:
        case FilterType.SELECT_SPACEGROUP_NUMBER:
        case FilterType.SELECT_CRYSTAL_SYSTEM:
        case FilterType.SELECT_POINTGROUP:
        case FilterType.THREE_STATE_BOOLEAN_SELECT: {
          const displayValue = getFormattedSelectValue(filter, baseFilter.value);
          if (isNotEmpty(displayValue)) {
            activeFilters.push({ ...baseFilter, value: displayValue });
          }
          break;
        }
        case FilterType.CHECKBOX_LIST: {
          if (isNotEmpty(baseFilter.value)) {
            const displayValue = (baseFilter.value as any[]).map((value) => {
              const option = filter.props?.options?.find((candidate: any) => candidate.value === value);
              return option?.label ?? value;
            });
            activeFilters.push({ ...baseFilter, value: displayValue });
          }
          break;
        }
        default:
          if (isNotEmpty(baseFilter.value)) {
            activeFilters.push(baseFilter);
          }
      }
    });
  });

  return activeFilters;
};

const getFilterForParam = (paramName: string, filterGroups: FilterGroup[]) => {
  let matchingFilter: Filter | undefined;
  filterGroups.forEach((group) => {
    group.filters.forEach((filter) => {
      if (filter.params.includes(paramName)) {
        matchingFilter = filter;
      }
    });
  });
  return matchingFilter;
};

export const preprocessQueryParams = (
  query: Record<string, any>,
  filterGroups: FilterGroup[],
  defaultQuery: Record<string, any>,
  sortParamKey = Object.keys(defaultQuery).find((key) => Array.isArray(defaultQuery[key])) ?? '_sort_fields'
) => {
  const processedQuery: Record<string, any> = {};

  Object.keys(query).forEach((paramName) => {
    const filter = getFilterForParam(paramName, filterGroups);
    if (filter) {
      let paramValue = isNotEmpty(query[paramName]) ? query[paramName] : filter.props?.defaultValue;

      switch (filter.type) {
        case FilterType.MATERIALS_INPUT:
          processedQuery[paramName] = paramValue;
          break;
        case FilterType.SLIDER: {
          const domain = filter.props?.domain ?? [];
          const isAtDomainLimit = paramValue === domain[0] || paramValue === domain[1];
          if (!isAtDomainLimit) {
            processedQuery[paramName] = paramValue;
          }
          break;
        }
        default:
          if (filter.makeLowerCase && typeof paramValue === 'string') {
            paramValue = paramValue.toLowerCase();
          }
          processedQuery[paramName] = paramValue;
      }
    } else if (paramName === sortParamKey && query[sortParamKey]) {
      const processedSortFields = [...query[sortParamKey]];
      if (defaultQuery[sortParamKey] && defaultQuery[sortParamKey].length === 2) {
        processedSortFields.push(defaultQuery[sortParamKey][1]);
      }
      processedQuery[sortParamKey] = processedSortFields;
    } else {
      processedQuery[paramName] = query[paramName];
    }
  });

  Object.keys(defaultQuery).forEach((defaultParam) => {
    if (query[defaultParam] === undefined) {
      if (
        defaultParam === sortParamKey &&
        defaultQuery[sortParamKey]?.[1] &&
        (defaultQuery[sortParamKey]?.[0] === null || defaultQuery[sortParamKey]?.[0] === undefined)
      ) {
        processedQuery[defaultParam] = [defaultQuery[defaultParam][1]];
      } else {
        processedQuery[defaultParam] = defaultQuery[defaultParam];
      }
    }
  });

  return processedQuery;
};

const decodeValue = (rawValue: string, filter?: Filter, defaultValue?: any) => {
  if (filter?.type === FilterType.CHECKBOX_LIST) {
    return rawValue.split(',').filter(Boolean);
  }
  if (filter?.type === FilterType.THREE_STATE_BOOLEAN_SELECT) {
    if (rawValue === 'true') return true;
    if (rawValue === 'false') return false;
    return null;
  }
  if (filter?.type === FilterType.SLIDER || typeof defaultValue === 'number') {
    return Number(rawValue);
  }
  if (Array.isArray(defaultValue)) {
    return rawValue.split(',').filter(Boolean);
  }
  return rawValue;
};

const encodeValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
};

export const parseSearchQuery = (
  search: string,
  filterGroups: FilterGroup[],
  defaultQuery: Record<string, any>
) => {
  const params = new URLSearchParams(search);
  const parsed: Record<string, any> = { ...defaultQuery };

  params.forEach((rawValue, key) => {
    const filter = getFilterForParam(key, filterGroups);
    if (!filter && defaultQuery[key] === undefined && key !== '_inputType') {
      return;
    }
    parsed[key] = decodeValue(rawValue, filter, defaultQuery[key]);
  });

  return parsed;
};

export const serializeSearchQuery = (
  query: Record<string, any>,
  defaultQuery: Record<string, any>,
  existingSearch: string = ''
) => {
  const params = new URLSearchParams(existingSearch);

  const allKnownKeys = new Set([...Object.keys(query), ...Object.keys(defaultQuery)]);
  allKnownKeys.forEach((key) => params.delete(key));

  Object.keys(query).forEach((key) => {
    const value = query[key];
    const defaultValue = defaultQuery[key];

    if (!isNotEmpty(value)) {
      return;
    }

    if (JSON.stringify(value) === JSON.stringify(defaultValue)) {
      return;
    }

    params.set(key, encodeValue(value));
  });

  const value = params.toString();
  return value ? `?${value}` : '';
};
