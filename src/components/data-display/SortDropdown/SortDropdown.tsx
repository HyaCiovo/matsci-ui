import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import '../../navigation/Dropdown/Dropdown.css';

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
  const [open, setOpen] = useState(false);
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
    <div id={id} data-testid="mpc-sort-dropdown" className={clsx('mpc-sort-dropdown field has-addons', className)}>
      <div className="control">
        <button
          type="button"
          data-testid="sort-button"
          className="mpc-sort-button button"
          onClick={() => setSortAscending(!sortAscending)}
          aria-label={sortAscending ? 'Sorted in ascending order' : 'Sorted in descending order'}
        >
                  <FaSort className="mpc-bib-filter-sort-icon-bg" />
          {sortAscending ? <FaSortUp /> : <FaSortDown />}
        </button>
      </div>
      <div className="control">
        <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
          <div className={clsx('dropdown is-right', { 'is-active': open })}>
            <div className="dropdown-trigger">
              <DropdownMenu.Trigger asChild>
                <button type="button" className="button">
                  <span>Sort: {selectedOption?.label ?? resolvedSortField}</span>
                  <span className="icon">
                    <FaAngleDown />
                  </span>
                </button>
              </DropdownMenu.Trigger>
            </div>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="mpc-dropdown-menu dropdown-menu"
                align="end"
                sideOffset={4}
                collisionPadding={8}
              >
                <div className="mpc-dropdown-content dropdown-content">
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.value}
                      className={clsx('dropdown-item', { 'is-active': option.value === resolvedSortField })}
                      onSelect={() => setSortField(option.value)}
                    >
                      {option.label}
                    </DropdownMenu.Item>
                  ))}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </div>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
