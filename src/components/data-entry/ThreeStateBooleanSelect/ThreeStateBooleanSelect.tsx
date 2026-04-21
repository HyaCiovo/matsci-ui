import { Select, type SelectOption } from '../Select';

export interface ThreeStateBooleanSelectProps {
  options: SelectOption[];
  value?: boolean | null;
  className?: string;
  onChange?: (value: boolean | null) => void;
  setProps?: (value: { value: boolean | null }) => void;
  anyLabel?: string;
  anyPlaceholder?: string;
}

export const ThreeStateBooleanSelect = ({
  options,
  value = null,
  className,
  onChange,
  setProps,
  anyLabel = 'Any',
  anyPlaceholder = anyLabel,
}: ThreeStateBooleanSelectProps) => {
  const threeOptions: SelectOption[] = [...options, { label: anyLabel, value: '' }];

  return (
    <Select
      className={className}
      options={threeOptions}
      value={value === null || value === undefined ? '' : value}
      placeholder={anyPlaceholder}
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
