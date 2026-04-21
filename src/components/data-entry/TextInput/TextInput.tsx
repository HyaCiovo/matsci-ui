import { useEffect, useState } from 'react';
import { useDebounce } from '../../../utils/hooks';
import { Input } from '../Input';

export interface TextInputProps {
  value?: any;
  onChange?: (value: any) => void;
  placeholder?: string;
  debounce?: number;
  debounceTime?: number;
  type?: string;
}

export const TextInput = ({
  value,
  onChange = () => undefined,
  placeholder,
  debounce,
  debounceTime,
  type = 'text',
}: TextInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const delay = debounceTime ?? debounce;
  const debouncedInputValue = delay ? useDebounce(inputValue, delay) : inputValue;

  useEffect(() => {
    onChange(debouncedInputValue);
  }, [debouncedInputValue, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Input
      type={type}
      value={inputValue || ''}
      placeholder={placeholder}
      onChange={(event) => setInputValue(event.target.value)}
    />
  );
};
