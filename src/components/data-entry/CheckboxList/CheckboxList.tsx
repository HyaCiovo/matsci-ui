import { Checkbox } from '../Checkbox';

export interface CheckboxOption {
  label: string;
  value: string | number;
}

export interface CheckboxListProps {
  options: CheckboxOption[];
  values?: Array<string | number>;
  value?: Array<string | number>;
  onChange?: (values: Array<string | number>) => void;
}

export const CheckboxList = ({ options, values, value, onChange }: CheckboxListProps) => {
  const resolvedValues = value ?? values ?? [];
  return (
    <div className="ms-checkbox-list">
      {options.map((option, index) => {
        const checked = resolvedValues.includes(option.value);
        return (
          <div key={String(option.value) || String(index)}>
            <label className="ms-checkbox">
              <Checkbox
                checked={checked}
                onCheckedChange={(nextChecked) => {
                  const nextValues =
                    nextChecked === true
                      ? [...resolvedValues, option.value]
                      : resolvedValues.filter((item) => item !== option.value);
                  onChange?.(nextValues);
                }}
              />
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
};
