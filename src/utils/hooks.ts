import { useEffect, useRef, useState } from 'react';

export const usePrevious = <T,>(value: T) => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const useDebounce = <T,>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(handler);
    };
  }, [delay, value]);

  return debouncedValue;
};
