import { useMemo, useState } from 'react';
import { TABLE_V2 } from '../periodic-table-data/table-v2';
import {
  type PeriodicSelectionActions,
  useOptionalPeriodicSelectionActions,
} from '../SelectableTable/PeriodicSelectionContext';
import { categoryToClassName } from '../SelectableTable/selection-state';
import { getPeriodicTableFilterValue } from '../SelectableTable/view-model';
import {
  FILTERS,
  FILTER_VALUE_MAPPER,
  type TableFilterOption,
} from './filter-definitions';
import './TableFilter.less';

export interface TableFilterTexts {
  title: string;
}

export interface TableFilterProps {
  texts?: Partial<TableFilterTexts>;
  filters?: TableFilterOption[][];
  valueMapper?: Record<string, string>;
}

const DEFAULT_TEXTS: TableFilterTexts = {
  title: 'Filters',
};

const noopActions: PeriodicSelectionActions = {
  setForwardChange: () => {},
  setEnabledElements: () => {},
  setDisabledElements: () => {},
  setHiddenElements: () => {},
  clear: () => {},
  setDetailedElement: () => {},
  addEnabledElement: () => {},
  addDisabledElement: () => {},
  removeEnabledElement: () => {},
  removeDisabledElement: () => {},
  toggleEnabledElement: () => {},
  toggleDisabledElement: () => {},
  setMaxSelectionLimit: () => {},
};

const performFilter = (key: NonNullable<TableFilterOption['key']>, value: string | number) =>
  TABLE_V2.reduce<Record<string, boolean>>((accumulator, element) => {
    const elementValue =
      key === 'category'
        ? categoryToClassName(element.category ?? element.category_2, element.symbol)
        : getPeriodicTableFilterValue(element, key);

    if (elementValue !== value) {
      accumulator[element.symbol] = true;
    }

    return accumulator;
  }, {});

export function TableFilter({ texts: textsProp, filters: filtersProp, valueMapper }: TableFilterProps) {
  const texts = { ...DEFAULT_TEXTS, ...(textsProp ?? {}) };
  const actions = useOptionalPeriodicSelectionActions() ?? noopActions;
  const filters = filtersProp ?? FILTERS.categories;
  const resolvedValueMapper = valueMapper ?? FILTER_VALUE_MAPPER;
  const allFilter = filters[0]?.[0] ?? { name: 'All', subGroups: [] };
  const filterByCategory = useMemo(() => {
    return filters.reduce<Record<string, TableFilterOption[]>>((accumulator, group) => {
      group.forEach((filter) => {
        accumulator[String(filter.name)] = filter.subGroups;
      });
      return accumulator;
    }, {});
  }, [filters]);
  const [filter, setFilter] = useState<{
    topFilter: TableFilterOption;
    lowerFilter: TableFilterOption;
  }>({
    topFilter: allFilter,
    lowerFilter: allFilter,
  });

  const lowerFilters = useMemo(
    () => filterByCategory[String(filter.topFilter.name)] ?? [],
    [filter.topFilter.name, filterByCategory]
  );

  const handleTopFilterSelect = (nextTopFilter: TableFilterOption) => {
    setFilter({
      topFilter: nextTopFilter,
      lowerFilter: allFilter,
    });

    // Switching top-level groups should clear any previous sub-filter hiding.
    actions.setHiddenElements({});
  };

  const handleLowerFilterSelect = (nextLowerFilter: TableFilterOption) => {
    setFilter((current) => ({
      ...current,
      lowerFilter: nextLowerFilter,
    }));

    const key = filter.topFilter.key;
    if (!key) {
      actions.setHiddenElements({});
      return;
    }

    const mappedValue = resolvedValueMapper[String(nextLowerFilter.name)];
    const filterValue = mappedValue ?? nextLowerFilter.name;
    actions.setHiddenElements(performFilter(key, filterValue));
  };

  return (
    <div className="mat-table-filter">
      <div className="left-side">{texts.title}</div>
      <div className="right-side">
        <div className="filter-selector">
          {filters.map((filterGroup, index) => (
            <div key={`group-${index}`} className="filter-group">
              {filterGroup.map((option) => (
                <div
                  key={String(option.name)}
                  onClick={() => handleTopFilterSelect(option)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleTopFilterSelect(option);
                    }
                  }}
                  className={`current-filter-selector ${
                    option.name === filter.topFilter.name ? 'selected' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  {option.name}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="sub-filter-selector">
          {lowerFilters.map((option) => (
            <div
              key={String(option.name)}
              onClick={() => handleLowerFilterSelect(option)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleLowerFilterSelect(option);
                }
              }}
              className={`current-filter-selector ${
                option.name === filter.lowerFilter.name || filter.lowerFilter.name === allFilter.name
                  ? 'selected'
                  : ''
              }`}
              role="button"
              tabIndex={0}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
