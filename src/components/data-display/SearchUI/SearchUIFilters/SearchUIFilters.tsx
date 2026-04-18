import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretRight, FaRegTimesCircle } from 'react-icons/fa';
import { CheckboxList } from '../../../data-entry/CheckboxList';
import { DualRangeSlider } from '../../../data-entry/DualRangeSlider';
import { FilterField } from '../../../data-entry/FilterField';
import { MaterialsInput } from '../../../data-entry/MaterialsInput';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';
import { Select } from '../../../data-entry/Select';
import { TextInput } from '../../../data-entry/TextInput';
import { ThreeStateBooleanSelect } from '../../../data-entry/ThreeStateBooleanSelect';
import { Tooltip } from '../../Tooltip';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { type ActiveFilter, type Filter, type FilterGroup, FilterType } from '../types';

interface SearchUIFiltersProps {
  className?: string;
}

const getActiveFilterByName = (name: string, activeFilters: ActiveFilter[]) => {
  return activeFilters.find((filter) => filter.name === name);
};

const getActiveFilterCount = (group: FilterGroup, activeFilters: ActiveFilter[]) => {
  const activeIds = activeFilters.map((filter) => filter.name);
  return group.filters.filter((filter) => !filter.hidden && activeIds.includes(filter.name)).length;
};

const getGroupsByName = (groups: FilterGroup[], activeFilters: ActiveFilter[]) => {
  return Object.fromEntries(
    groups.map((group) => [
      group.name,
      {
        ...group,
        expanded: group.expanded === true || group.alwaysExpanded === true,
        activeFilterCount: getActiveFilterCount(group, activeFilters),
      },
    ])
  );
};

const renderUnits = (units?: string) => (units ? <span className="is-size-7 has-text-weight-normal"> ({units})</span> : null);

export const SearchUIFilters = ({ className }: SearchUIFiltersProps) => {
  const {
    filterGroups,
    activeFilters,
    query,
    setFilterValue,
    setFilterValues,
    removeFilters,
    resetFilters,
    autocompleteFormulaUrl,
    apiKey,
  } = useSearchUIContext();
  const [groupsByName, setGroupsByName] = useState(() => getGroupsByName(filterGroups, activeFilters));

  useEffect(() => {
    setGroupsByName(getGroupsByName(filterGroups, activeFilters));
  }, [activeFilters, filterGroups]);

  const toggleGroup = (groupName: string) => {
    setGroupsByName((current) => {
      const next = { ...current };
      Object.keys(next).forEach((name) => {
        if (next[name].alwaysExpanded) {
          next[name].expanded = true;
        } else if (name === groupName) {
          next[name].expanded = !next[name].expanded;
        } else {
          next[name].expanded = false;
        }
      });
      return next;
    });
  };

  const resetFilter = async (filter: Filter) => {
    const activeFilter = getActiveFilterByName(filter.name, activeFilters);
    if (activeFilter) {
      await removeFilters(activeFilter.params);
    }
  };

  const renderFilter = (filter: Filter) => {
    const queryParam = filter.params[0];
    const queryValue = query[queryParam];

    switch (filter.type) {
      case FilterType.TEXT_INPUT:
        return (
          <TextInput
            value={queryValue ?? ''}
            placeholder={filter.props?.placeholder}
            debounceTime={filter.props?.debounce ?? 0}
            onChange={(value) => void setFilterValue(value, queryParam, filter.overrides)}
          />
        );
      case FilterType.MATERIALS_INPUT:
        return (
          <MaterialsInput
            {...filter.props}
            value={queryValue ?? ''}
            showSubmitButton={false}
            hidePeriodicTable
            periodicTableMode={PeriodicTableMode.NONE}
            autocompleteFormulaUrl={autocompleteFormulaUrl}
            autocompleteApiKey={apiKey}
            onChange={(value) => void setFilterValue(value, queryParam, filter.overrides)}
          />
        );
      case FilterType.SLIDER:
        return (
          <DualRangeSlider
            domain={filter.props?.domain ?? [0, 100]}
            step={filter.props?.step ?? 1}
            valueMin={query[filter.params[0]] ?? filter.props?.domain?.[0] ?? 0}
            valueMax={query[filter.params[1]] ?? filter.props?.domain?.[1] ?? 100}
            onChange={(min, max) => void setFilterValues([min, max], filter.params, filter.overrides)}
          />
        );
      case FilterType.SELECT:
      case FilterType.SELECT_SPACEGROUP_SYMBOL:
      case FilterType.SELECT_SPACEGROUP_NUMBER:
      case FilterType.SELECT_CRYSTAL_SYSTEM:
      case FilterType.SELECT_POINTGROUP:
        return (
          <Select
            options={filter.props?.options ?? []}
            value={queryValue ?? ''}
            placeholder="Any"
            isClearable
            onChange={(option) => void setFilterValue(option?.value || null, queryParam, filter.overrides)}
          />
        );
      case FilterType.THREE_STATE_BOOLEAN_SELECT:
        return (
          <ThreeStateBooleanSelect
            options={filter.props?.options ?? []}
            value={queryValue ?? null}
            onChange={(value) => void setFilterValue(value, queryParam, filter.overrides)}
          />
        );
      case FilterType.CHECKBOX_LIST: {
        const values = Array.isArray(queryValue) ? queryValue : [];
        return (
          <CheckboxList
            options={filter.props?.options ?? []}
            value={values}
            onChange={(nextValues) => void setFilterValue(nextValues, queryParam, filter.overrides)}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderedGroups = useMemo(() => filterGroups, [filterGroups]);

  return (
    <div className={classNames('panel', className)}>
      <div className="panel-heading">
        <div className="level is-mobile">
          <span>Filters</span>
          <button data-testid="search-ui-reset-button" className="button" onClick={() => void resetFilters()}>
            Reset
          </button>
        </div>
      </div>
      <div data-testid="panel-block-container" className="panel-block-container">
        {renderedGroups.map((group, index) => {
          const groupState = groupsByName[group.name];
          if (!groupState) {
            return null;
          }

          return (
            <div
              key={group.name}
              className={classNames('panel-block', { 'is-active': groupState.expanded })}
            >
              <div className="control">
                <h3 className="panel-block-title">
                  <button
                    className="button is-fullwidth"
                    aria-expanded={groupState.expanded}
                    aria-controls={`filter-group-${index}`}
                    id={`filter-group-button-${index}`}
                    type="button"
                    onMouseDown={() => toggleGroup(group.name)}
                  >
                    <span className="mr-4">
                      {groupState.alwaysExpanded ? null : groupState.expanded ? <FaCaretDown /> : <FaCaretRight />}
                    </span>
                    <span className={classNames('is-size-5', { 'has-opacity-70': !groupState.expanded })}>
                      {group.name}
                      {groupState.activeFilterCount > 0 ? (
                        <span className="tag is-link is-rounded ml-2">{groupState.activeFilterCount} active</span>
                      ) : null}
                    </span>
                  </button>
                </h3>
                <div
                  id={`filter-group-${index}`}
                  className={classNames('panel-block-children', { 'is-hidden': !groupState.expanded })}
                >
                  <div aria-hidden={!groupState.expanded}>
                    {group.filters.map((filter) =>
                      filter.hidden ? null : (
                        <div className="mb-4" key={filter.name}>
                          <FilterField
                            id={filter.name.replace(/\s+/g, '-')}
                            label={filter.name}
                            units={filter.units}
                            tooltip={filter.tooltip}
                            active={!!getActiveFilterByName(filter.name, activeFilters)}
                            resetFilter={() => void resetFilter(filter)}
                          >
                            {renderFilter(filter)}
                          </FilterField>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
