import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { formatTemplate, mergeTexts } from '../../../utils/text';

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
        <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
          <div className={clsx('ms-dropdown ms-is-right', { 'ms-is-active': open })}>
            <div className="ms-dropdown-trigger">
              <DropdownMenu.Trigger asChild>
                <button type="button" className="ms-button">
                  <span>
                    {formatTemplate(texts.sortLabelTemplate, {
                      label: selectedOption?.label ?? resolvedSortField,
                    })}
                  </span>
                  <span className="ms-icon">
                    <FaAngleDown />
                  </span>
                </button>
              </DropdownMenu.Trigger>
            </div>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="ms-dropdown-menu"
                align="end"
                sideOffset={4}
                collisionPadding={8}
              >
                <div className="ms-dropdown-content">
                  {sortOptions.map((option) => (
                    <DropdownMenu.Item
                      key={option.value}
                      className={clsx('ms-dropdown-item', { 'ms-is-active': option.value === resolvedSortField })}
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
