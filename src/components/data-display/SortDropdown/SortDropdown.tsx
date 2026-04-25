import clsx from 'clsx';
import { useEffect } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { formatTemplate, mergeTexts } from '../../../utils/text';
import { Dropdown } from '../../navigation/Dropdown';

export interface DropdownItem {
  label: string;
  value: string;
}

export interface SortDropdownProps {
  id?: string;
  className?: string;
  sortValues: any[];
  setSortValues?: (value: any) => any;
  sortOptions: DropdownItem[];
  sortField?: string;
  setSortField: (value: any) => any;
  sortAscending?: boolean;
  setSortAscending: (value: any) => any;
  sortFn?: (field: string, asc: boolean) => any;
  texts?: Partial<SortDropdownTexts>;
}

export interface SortDropdownTexts {
  ariaLabelSortedAscending: string;
  ariaLabelSortedDescending: string;
  sortLabelTemplate: string;
}

const DEFAULT_TEXTS: SortDropdownTexts = {
  ariaLabelSortedAscending: 'Sorted in ascending order',
  ariaLabelSortedDescending: 'Sorted in descending order',
  sortLabelTemplate: 'Sort: {label}',
};

const defaultSort = (field: string, asc: boolean) => (a: any, b: any) => {
  const valueA = a?.[field];
  const valueB = b?.[field];
  if (valueA === valueB) {
    return 0;
  }
  if (valueA === undefined || valueA === null) {
    return 1;
  }
  if (valueB === undefined || valueB === null) {
    return -1;
  }
  const comparison = String(valueA).localeCompare(String(valueB), undefined, { numeric: true, sensitivity: 'base' });
  return asc ? comparison : -comparison;
};

export const SortDropdown = ({
  id,
  className,
  sortValues,
  setSortValues,
  sortOptions,
  sortField,
  setSortField,
  sortAscending = false,
  setSortAscending,
  sortFn = defaultSort,
  texts: textsProp,
}: SortDropdownProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const resolvedSortField = sortField ?? sortOptions[0]?.value ?? '';
  const selectedOption = sortOptions.find((option) => option.value === resolvedSortField);

  useEffect(() => {
    if (!setSortValues) {
      return;
    }

    const sortedValues = [...sortValues].sort(sortFn(resolvedSortField, sortAscending));
    setSortValues(sortedValues);
  }, [resolvedSortField, setSortValues, sortAscending, sortFn, sortValues]);

  return (
    <div id={id} data-testid="ms-sort-dropdown" className={clsx('ms-sort-dropdown ms-field ms-has-addons', className)}>
      <div className="ms-control">
        <button
          type="button"
          data-testid="sort-button"
          className="ms-sort-button ms-button"
          onClick={() => setSortAscending(!sortAscending)}
          aria-label={sortAscending ? texts.ariaLabelSortedAscending : texts.ariaLabelSortedDescending}
        >
          <FaSort className="ms-bib-filter-sort-icon-bg" />
          {sortAscending ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div className="ms-control">
        <Dropdown
          className="ms-is-right"
          triggerClassName="ms-button"
          triggerLabel={formatTemplate(texts.sortLabelTemplate, {
            label: selectedOption?.label ?? resolvedSortField,
          })}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx('ms-dropdown-item', { 'ms-is-active': option.value === resolvedSortField })}
              onClick={() => setSortField(option.value)}
            >
              {option.label}
            </button>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};
