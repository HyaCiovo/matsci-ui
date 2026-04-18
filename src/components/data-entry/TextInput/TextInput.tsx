import { useEffect, useState } from 'react';
import { useDebounce } from '../../../utils/hooks';

export interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
  type?: string;
}

export const TextInput = ({
  value = '',
  onChange,
  placeholder,
  debounceTime = 0,
  type = 'text',
}: TextInputProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const debouncedValue = useDebounce(internalValue, debounceTime);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    onChange?.(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <input
      className="input"
      type={type}
      value={internalValue}
      placeholder={placeholder}
      onChange={(event) => setInternalValue(event.target.value)}
    />
  );
};
