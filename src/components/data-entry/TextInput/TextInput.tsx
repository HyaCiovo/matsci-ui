import { useEffect, useRef, useState } from 'react';
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
  const onChangeRef = useRef(onChange);
  const hasMountedRef = useRef(false);
  const lastReportedValueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (Object.is(lastReportedValueRef.current, debouncedInputValue)) {
      return;
    }

    lastReportedValueRef.current = debouncedInputValue;
    onChangeRef.current(debouncedInputValue);
  }, [debouncedInputValue]);

  useEffect(() => {
    setInputValue(value);
    lastReportedValueRef.current = value;
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
