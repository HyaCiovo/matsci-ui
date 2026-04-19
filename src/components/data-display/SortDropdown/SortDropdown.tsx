import classNames from 'classnames';
import { useEffect } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

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
}

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
}: SortDropdownProps) => {
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
    <div id={id} data-testid="mpc-sort-dropdown" className={classNames('mpc-sort-dropdown field has-addons', className)}>
      <div className="control">
        <button
          type="button"
          data-testid="sort-button"
          className="button is-small"
          onClick={() => setSortAscending(!sortAscending)}
          aria-label={sortAscending ? 'Sorted in ascending order' : 'Sorted in descending order'}
        >
          <FaSort className="mr-1" />
          {sortAscending ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div className="control">
        <label className="is-size-7">
          <span className="mr-2">Sort: {selectedOption?.label ?? resolvedSortField}</span>
          <select
            data-testid="sort-field-select"
            className="select"
            value={resolvedSortField}
            onChange={(event) => setSortField(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
