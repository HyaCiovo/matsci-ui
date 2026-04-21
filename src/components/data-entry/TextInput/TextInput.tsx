import { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './TextInput.css';

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
  const lastReportedValue = useRef(value);
  const debounceTimeoutRef = useRef<number>();

  useEffect(() => {
    if (value !== lastReportedValue.current) {
      setInternalValue(value);
      lastReportedValue.current = value;
    }
  }, [value]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const reportChange = (newValue: string) => {
    lastReportedValue.current = newValue;
    onChangeRef.current?.(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    window.clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      reportChange(newValue);
    }, debounceTime);
  };

  const handleClear = () => {
    setInternalValue('');
    window.clearTimeout(debounceTimeoutRef.current);
    reportChange('');
  };

  useEffect(() => {
    return () => window.clearTimeout(debounceTimeoutRef.current);
  }, []);

  return (
    <div className="mpc-text-input">
      <input
        className="input"
        type={type}
        value={internalValue}
        placeholder={placeholder}
        onChange={handleChange}
      />
      {internalValue ? (
        <button
          type="button"
          className="mpc-text-input-clear"
          aria-label="Clear input"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClear}
        >
          <FaTimes />
        </button>
      ) : null}
    </div>
  );
};
