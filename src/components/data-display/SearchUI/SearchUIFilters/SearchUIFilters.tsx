import clsx from 'clsx';
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
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '../../../navigation/Accordion';
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

const getGroupMetaByName = (groups: FilterGroup[], activeFilters: ActiveFilter[]) => {
  return Object.fromEntries(
    groups.map((group) => [
      group.name,
      {
        ...group,
        activeFilterCount: getActiveFilterCount(group, activeFilters),
      },
    ])
  );
};

const getAlwaysExpandedGroups = (groups: FilterGroup[]) =>
  groups.filter((group) => group.alwaysExpanded).map((group) => group.name);

const getInitialOpenGroupNames = (groups: FilterGroup[]) => {
  const alwaysExpanded = getAlwaysExpandedGroups(groups);
  const firstExpandedGroup = groups.find((group) => !group.alwaysExpanded && group.expanded)?.name;
  return firstExpandedGroup ? [...alwaysExpanded, firstExpandedGroup] : alwaysExpanded;
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
    debounce,
  } = useSearchUIContext();
  const [openGroupNames, setOpenGroupNames] = useState(() => getInitialOpenGroupNames(filterGroups));
  const groupMetaByName = useMemo(
    () => getGroupMetaByName(filterGroups, activeFilters),
    [activeFilters, filterGroups]
  );
  const alwaysExpandedGroups = useMemo(() => getAlwaysExpandedGroups(filterGroups), [filterGroups]);

  useEffect(() => {
    setOpenGroupNames((current) => {
      const availableGroupNames = new Set(filterGroups.map((group) => group.name));
      const currentOpen = current.filter((name) => availableGroupNames.has(name));
      const currentCollapsible = currentOpen.filter((name) => !alwaysExpandedGroups.includes(name));

      if (currentCollapsible.length > 0) {
        return [...alwaysExpandedGroups, currentCollapsible[0]];
      }

      const firstExpandedGroup = filterGroups.find((group) => !group.alwaysExpanded && group.expanded)?.name;
      return firstExpandedGroup ? [...alwaysExpandedGroups, firstExpandedGroup] : alwaysExpandedGroups;
    });
  }, [alwaysExpandedGroups, filterGroups]);

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
            debounceTime={filter.props?.debounce ?? debounce}
            onChange={(value) => void setFilterValue(value, queryParam)}
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
            onChange={(value) => void setFilterValue(value, queryParam)}
          />
        );
      case FilterType.SLIDER:
        return (
          <DualRangeSlider
            domain={filter.props?.domain ?? [0, 100]}
            step={filter.props?.step ?? 1}
            valueMin={query[filter.params[0]] ?? filter.props?.domain?.[0] ?? 0}
            valueMax={query[filter.params[1]] ?? filter.props?.domain?.[1] ?? 100}
            onChange={(min, max) => void setFilterValues([min, max], filter.params)}
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
            onChange={(option) => void setFilterValue(option ? option.value : null, queryParam)}
          />
        );
      case FilterType.THREE_STATE_BOOLEAN_SELECT:
        return (
          <ThreeStateBooleanSelect
            options={filter.props?.options ?? []}
            value={queryValue ?? null}
            onChange={(value) => void setFilterValue(value, queryParam)}
          />
        );
      case FilterType.CHECKBOX_LIST: {
        const values = Array.isArray(queryValue) ? queryValue : [];
        return (
          <CheckboxList
            options={filter.props?.options ?? []}
            value={values}
            onChange={(nextValues) => void setFilterValue(nextValues, queryParam)}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderedGroups = useMemo(() => filterGroups, [filterGroups]);
  const openGroupNameSet = useMemo(() => new Set(openGroupNames), [openGroupNames]);

  return (
    <div className={clsx('panel', className)}>
      <div className="panel-heading">
        <div className="level is-mobile">
          <span>Filters</span>
          <button data-testid="search-ui-reset-button" className="button" onClick={() => void resetFilters()}>
            Reset
          </button>
        </div>
      </div>
      <div data-testid="panel-block-container" className="panel-block-container">
        <Accordion
          type="multiple"
          value={openGroupNames}
          onValueChange={(nextValues) => {
            const nextCollapsible = nextValues.filter((name) => !alwaysExpandedGroups.includes(name));
            const previousCollapsible = openGroupNames.filter((name) => !alwaysExpandedGroups.includes(name));
            const newlyOpened = nextCollapsible.find((name) => !previousCollapsible.includes(name));
            const nextOpenCollapsible = newlyOpened ?? nextCollapsible[nextCollapsible.length - 1];
            setOpenGroupNames(nextOpenCollapsible ? [...alwaysExpandedGroups, nextOpenCollapsible] : alwaysExpandedGroups);
          }}
          className="mpc-search-ui-filter-accordion"
        >
          {renderedGroups.map((group, index) => {
            const groupState = groupMetaByName[group.name];
          if (!groupState) {
            return null;
          }

          const isExpanded = openGroupNameSet.has(group.name);

          return (
            <AccordionItem
              key={group.name}
              value={group.name}
              className={clsx('panel-block', { 'is-active': isExpanded })}
            >
              <div className="control">
                <AccordionHeader className="panel-block-title">
                  <AccordionTrigger
                    className="button is-fullwidth"
                    disabled={group.alwaysExpanded}
                    aria-expanded={isExpanded}
                    aria-controls={`filter-group-${index}`}
                    id={`filter-group-button-${index}`}
                  >
                    <span className="mr-4">
                      {group.alwaysExpanded ? null : isExpanded ? <FaCaretDown className="filter-group-caret" /> : <FaCaretRight className="filter-group-caret" />}
                    </span>
                    <span className={clsx('is-size-5', { 'has-opacity-70': !isExpanded })}>
                      {group.name}
                      {groupState.activeFilterCount > 0 ? (
                        <span className="tag is-link is-rounded ml-2">{groupState.activeFilterCount} active</span>
                      ) : null}
                    </span>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent
                  id={`filter-group-${index}`}
                  role="region"
                  aria-labelledby={`filter-group-button-${index}`}
                  className={clsx('panel-block-children', { 'is-hidden': !isExpanded })}
                >
                  {isExpanded ? (
                    <div aria-hidden={!isExpanded}>
                      {group.filters.map((filter) =>
                        filter.hidden ? null : (
                          <FilterField
                            key={filter.name}
                            id={filter.name.replace(/\s+/g, '-')}
                            label={filter.name}
                            units={filter.units}
                            tooltip={filter.tooltip}
                            active={!!getActiveFilterByName(filter.name, activeFilters)}
                            resetFilter={() => void resetFilter(filter)}
                          >
                            {renderFilter(filter)}
                          </FilterField>
                        )
                      )}
                    </div>
                  ) : null}
                </AccordionContent>
              </div>
            </AccordionItem>
          );
          })}
        </Accordion>
      </div>
    </div>
  );
};
