import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { Formula } from '../../../data-display/Formula';
import { MaterialsInputType, validateFormula } from '../utils';

interface FormulaSuggestion {
  formula_pretty: string;
}

interface Props {
  value: string;
  inputType?: MaterialsInputType | null;
  apiEndpoint: string;
  apiKey?: string;
  show?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (event: React.FormEvent | React.MouseEvent, value?: string) => void;
  setError?: (value: string | null) => void;
}

export const FormulaAutocomplete = ({
  value,
  inputType,
  apiEndpoint,
  apiKey,
  show,
  onChange,
  onSubmit,
  setError,
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formulaSuggestions, setFormulaSuggestions] = useState<FormulaSuggestion[]>([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const shouldFetch =
      inputType === MaterialsInputType.FORMULA &&
      value.length > 0 &&
      !!validateFormula(value) &&
      !value.includes('*');

    if (!shouldFetch) {
      setFormulaSuggestions([]);
      return;
    }

    requestIdRef.current += 1;
    const requestId = requestIdRef.current;
    const controller = new AbortController();
    const cleanValue = value.replace(/\(|\)/g, '');

    axios
      .get(apiEndpoint, {
        params: { formula: cleanValue },
        headers: apiKey ? { 'X-Api-Key': apiKey } : undefined,
        signal: controller.signal,
      })
      .then((result) => {
        if (requestId === requestIdRef.current) {
          setFormulaSuggestions(result.data?.data ?? []);
        }
      })
      .catch(() => {
        if (requestId === requestIdRef.current) {
          setFormulaSuggestions([]);
        }
      });

    return () => controller.abort();
  }, [apiEndpoint, apiKey, inputType, value]);

  useEffect(() => {
    setIsVisible(!!show && formulaSuggestions.length > 0);
  }, [formulaSuggestions.length, show]);

  return (
    <div
      data-testid="materials-input-autocomplete-menu"
      className={clsx('dropdown-menu', 'autocomplete', {
        'is-hidden': !isVisible,
      })}
      aria-hidden
    >
      <div data-testid="materials-input-autocomplete-menu-items" className="dropdown-content">
        <p className="autocomplete-label">Suggested formulas</p>
        {formulaSuggestions.map((suggestion, index) => (
          <a
            key={`${suggestion.formula_pretty}-${index}`}
            className="dropdown-item"
            onMouseDown={(event) => {
              setIsVisible(false);
              setError?.(null);
              onChange?.(suggestion.formula_pretty);
              onSubmit?.(event, suggestion.formula_pretty);
            }}
          >
            <Formula>{suggestion.formula_pretty}</Formula>
          </a>
        ))}
      </div>
    </div>
  );
};
