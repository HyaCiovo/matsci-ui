import * as RadixSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import { Check, ChevronDown, X } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  label: string;
  value: string | number | boolean | null;
  customAbbreviation?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | boolean | null;
  placeholder?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
  onChange?: (option: SelectOption | null) => void;
  setProps?: (value: { value: SelectOption['value'] | null }) => void;
}

const CLEAR_OPTION_VALUE = '__radix_clear_option__';

const getInternalOptionValue = (option: SelectOption) =>
  option.value === null || option.value === '' ? CLEAR_OPTION_VALUE : String(option.value);

export const Select = ({
  options,
  value,
  placeholder = 'Select...',
  disabled,
  isClearable,
  className,
  onChange,
  setProps,
}: SelectProps) => {
  const selectedOption = options.find((option) => option.value === value) ?? null;
  const internalValue = selectedOption ? getInternalOptionValue(selectedOption) : '';

  return (
    <div className={clsx('mpc-select', className)}>
      <div className="mpc-select-shell">
        <RadixSelect.Root
          value={internalValue}
          disabled={disabled}
          onValueChange={(nextValue) => {
            const option =
              options.find((item) => getInternalOptionValue(item) === nextValue) ?? null;
            const nextOption = option?.value === null || option?.value === '' ? null : option;
            onChange?.(nextOption);
            setProps?.({ value: nextOption?.value ?? null });
          }}
        >
          <RadixSelect.Trigger className="mpc-select-trigger" aria-label={placeholder}>
            <RadixSelect.Value placeholder={placeholder}>
              {selectedOption?.customAbbreviation ?? selectedOption?.label}
            </RadixSelect.Value>
            <RadixSelect.Icon>
              <ChevronDown />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content position="popper" className="mpc-select-content">
              <RadixSelect.Viewport className="mpc-select-viewport">
                {options.map((option) => (
                  <RadixSelect.Item
                    key={getInternalOptionValue(option)}
                    className="mpc-select-item"
                    value={getInternalOptionValue(option)}
                  >
                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator style={{ marginLeft: 'auto' }}>
                      <Check />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        {isClearable && selectedOption ? (
          <button
            type="button"
            className="mpc-select-clear"
            aria-label="Clear selection"
            onClick={() => {
              onChange?.(null);
              setProps?.({ value: null });
            }}
          >
            <X />
          </button>
        ) : null}
      </div>
    </div>
  );
};
