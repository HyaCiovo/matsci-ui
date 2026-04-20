import { Select, type SelectOption } from '../Select';

export interface ThreeStateBooleanSelectProps {
  options: SelectOption[];
  value?: boolean | null;
  className?: string;
  onChange?: (value: boolean | null) => void;
  setProps?: (value: { value: boolean | null }) => void;
}

export const ThreeStateBooleanSelect = ({
  options,
  value = null,
  className,
  onChange,
  setProps,
}: ThreeStateBooleanSelectProps) => {
  const threeOptions: SelectOption[] = [...options, { label: 'Any', value: '' }];

  return (
    <Select
      className={className}
      options={threeOptions}
      value={value === null || value === undefined ? '' : value}
      placeholder="Any"
      onChange={(option) => {
        if (!option || option.value === '') {
          onChange?.(null);
          setProps?.({ value: null });
        } else {
          const nextValue = option.value === true || option.value === 'true';
          onChange?.(nextValue);
          setProps?.({ value: nextValue });
        }
      }}
    />
  );
};
