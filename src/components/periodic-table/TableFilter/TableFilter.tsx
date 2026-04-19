import { useMemo, useState } from 'react';
import { TABLE_V2 } from '../periodic-table-data/table-v2';
import {
  type PeriodicSelectionActions,
  useOptionalPeriodicSelectionContext,
} from '../SelectableTable/PeriodicSelectionContext';
import { categoryToClassName } from '../SelectableTable/selection-state';
import { getPeriodicTableFilterValue } from '../SelectableTable/view-model';
import {
  FILTER_BY_CATEGORY,
  FILTER_VALUE_MAPPER,
  FILTERS,
  type TableFilterOption,
} from './filter-definitions';
import './TableFilter.less';

const ALL_FILTER: TableFilterOption = {
  name: 'All',
  subGroups: [],
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
        ? categoryToClassName(element.category, element.symbol)
        : getPeriodicTableFilterValue(element, key);

    if (elementValue !== value) {
      accumulator[element.symbol] = true;
    }

    return accumulator;
  }, {});

export function TableFilter() {
  const periodicContext = useOptionalPeriodicSelectionContext();
  const actions = periodicContext?.actions ?? noopActions;
  const [filter, setFilter] = useState<{
    topFilter: TableFilterOption;
    lowerFilter: TableFilterOption;
  }>({
    topFilter: ALL_FILTER,
    lowerFilter: ALL_FILTER,
  });

  const lowerFilters = useMemo(
    () => FILTER_BY_CATEGORY[String(filter.topFilter.name)] ?? [],
    [filter.topFilter.name]
  );

  const handleTopFilterSelect = (nextTopFilter: TableFilterOption) => {
    setFilter({
      topFilter: nextTopFilter,
      lowerFilter: ALL_FILTER,
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

    const mappedValue = FILTER_VALUE_MAPPER[String(nextLowerFilter.name)];
    const filterValue = mappedValue ?? nextLowerFilter.name;
    actions.setHiddenElements(performFilter(key, filterValue));
  };

  return (
    <div className="mat-table-filter">
      <div className="left-side">Filters</div>
      <div className="right-side">
        <div className="filter-selector">
          {FILTERS.categories.map((filterGroup, index) => (
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
                option.name === filter.lowerFilter.name || filter.lowerFilter.name === 'All'
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
