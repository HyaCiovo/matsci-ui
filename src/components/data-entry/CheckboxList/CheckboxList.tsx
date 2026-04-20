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
            <input
              className="mr-2"
              type="checkbox"
              checked={checked}
              onChange={(event) => {
                const nextValues = event.target.checked
                  ? [...value, option.value]
                  : value.filter((item) => item !== option.value);
                onChange?.(nextValues);
              }}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
};
