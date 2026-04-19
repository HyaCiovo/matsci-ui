import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export interface CheckboxOption {
  label: string;
  value: string | number;
}

export interface CheckboxListProps {
  options: CheckboxOption[];
  value?: Array<string | number>;
  onChange?: (values: Array<string | number>) => void;
}

export const CheckboxList = ({ options, value = [], onChange }: CheckboxListProps) => {
  return (
    <div className="mpc-checkbox-list">
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label key={String(option.value)} className="checkbox is-block mb-2">
            <Checkbox.Root
              className="mr-2"
              checked={checked}
              onCheckedChange={(nextChecked) => {
                const nextValues = nextChecked
                  ? [...value, option.value]
                  : value.filter((item) => item !== option.value);
                onChange?.(nextValues);
              }}
            >
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox.Root>
            {option.label}
          </label>
        );
      })}
    </div>
  );
};
