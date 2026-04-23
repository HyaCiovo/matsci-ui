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
import { formatTemplate } from '../../../../utils/text';
import { mergeTexts } from '../../../../utils/text';
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
  texts?: Partial<SearchUIFiltersTexts>;
}

export interface SearchUIFiltersTexts {
  title: string;
  reset: string;
  anyPlaceholder: string;
  activeCountTemplate: string;
}

const DEFAULT_TEXTS: SearchUIFiltersTexts = {
  title: 'Filters',
  reset: 'Reset',
  anyPlaceholder: 'Any',
  activeCountTemplate: '{count} active',
};

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

const renderUnits = (units?: string) => (units ? <span className="ms-is-size-7 ms-has-text-weight-normal"> ({units})</span> : null);

export const SearchUIFilters = ({ className, texts: textsProp }: SearchUIFiltersProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
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
            placeholder={texts.anyPlaceholder}
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
    <div className={clsx('ms-panel', className)}>
      <div className="ms-panel-heading">
        <div className="ms-level ms-is-mobile">
          <span>{texts.title}</span>
          <button data-testid="search-ui-reset-button" className="ms-button" onClick={() => void resetFilters()}>
            {texts.reset}
          </button>
        </div>
      </div>
      <div data-testid="panel-block-container" className="ms-panel-block-container">
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
          className="ms-search-ui-filter-accordion"
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
              className={clsx('ms-panel-block', { 'ms-is-active': isExpanded })}
            >
              <div className="ms-control">
                <AccordionHeader className="ms-panel-block-title">
                  <AccordionTrigger
                    className="ms-button ms-is-fullwidth"
                    disabled={group.alwaysExpanded}
                    aria-expanded={isExpanded}
                    aria-controls={`filter-group-${index}`}
                    id={`filter-group-button-${index}`}
                  >
                    <span className="ms-mr-4">
                      {group.alwaysExpanded ? null : isExpanded ? <FaCaretDown className="ms-filter-group-caret" /> : <FaCaretRight className="ms-filter-group-caret" />}
                    </span>
                    <span className={clsx('ms-is-size-5', { 'ms-has-opacity-70': !isExpanded })}>
                      {group.name}
                      {groupState.activeFilterCount > 0 ? (
                        <span className="ms-tag ms-is-link ms-is-rounded ms-ml-2">
                          {formatTemplate(texts.activeCountTemplate, { count: groupState.activeFilterCount })}
                        </span>
                      ) : null}
                    </span>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent
                  id={`filter-group-${index}`}
                  role="region"
                  aria-labelledby={`filter-group-button-${index}`}
                  className={clsx('ms-panel-block-children', { 'ms-is-hidden': !isExpanded })}
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
