import { Select, type SelectOption } from '../Select';

export interface ThreeStateBooleanSelectProps {
  options: SelectOption[];
  value?: boolean | null;
  onChange?: (value: boolean | null) => void;
}

export const ThreeStateBooleanSelect = ({
  options,
  value = null,
  onChange,
}: ThreeStateBooleanSelectProps) => {
  const threeOptions: SelectOption[] = [...options, { label: 'Any', value: '' }];

  return (
    <Select
      options={threeOptions}
      value={value === null || value === undefined ? '' : value}
      placeholder="Any"
      onChange={(option) => {
        if (!option || option.value === '') {
          onChange?.(null);
        } else {
          onChange?.(option.value === true || option.value === 'true');
        }
      }}
    />
  );
};
