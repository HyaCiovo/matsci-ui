import { FaTimes } from 'react-icons/fa';
import { Formula } from '../Formula';
import { validateFormula } from '../../data-entry/MaterialsInput/utils';
import { formatPointGroup } from '../SearchUI/utils';
import type { ActiveFilter } from '../SearchUI/types';

const numberFormatter = new Intl.NumberFormat('en-US');

interface ActiveFilterButtonsProps {
  className?: string;
  filters: ActiveFilter[];
  onClick: (params: string[]) => any;
}

const renderFilterValue = (filter: ActiveFilter) => {
  if (
    filter.defaultValue &&
    Array.isArray(filter.value) &&
    filter.value.length === 2 &&
    !Number.isNaN(Number(filter.value[0]))
  ) {
    const displayMin = numberFormatter.format(Number(filter.value[0]));
    const displayMax = numberFormatter.format(Number(filter.value[1]));
    if (filter.defaultValue[0] !== 0 && filter.value[0] === filter.defaultValue[0]) {
      return `${displayMax} or less`;
    }
    if (filter.value[1] === filter.defaultValue[1]) {
      return `${displayMin} or more`;
    }
    return `${displayMin} to ${displayMax}`;
  }

  if (Array.isArray(filter.value)) {
    return filter.value.join(', ');
  }

  if (filter.name === 'Point Group') {
    return formatPointGroup(String(filter.value));
  }

  if (filter.value !== undefined && filter.value !== null && validateFormula(String(filter.value))) {
    return <Formula>{String(filter.value)}</Formula>;
  }

  return String(filter.value);
};

export const ActiveFilterButtons = ({ filters, onClick }: ActiveFilterButtonsProps) => {
  return (
    <div data-testid="active-filter-buttons" className="ms-active-filter-buttons">
      {filters.map((filter, index) => (
        <div key={`${filter.name}-${index}`} className="ms-active-filter-button">
          <button type="button" className="ms-button ms-is-small ms-is-rounded" onClick={() => onClick(filter.params)}>
            <FaTimes />
            <span className="ms-ml-1">
              {filter.name}: {renderFilterValue(filter)}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};
