import classNames from 'classnames';
import {
  useCallback,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FaAngleDown, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';
import { PeriodicTableModeSwitcher } from '../../periodic-table/PeriodicTableModeSwitcher';
import { SelectableTable, TableLayout } from '../../periodic-table/SelectableTable';
import { FormulaAutocomplete } from './FormulaAutocomplete';
import { InputHelp, type InputHelpItem } from './InputHelp';
import {
  arrayToDelimitedString,
  capitalize,
  detectAndValidateInputType,
  getAllowedSelectionModes,
  getMaterialsInputTypeByMappedValue,
  materialsInputTypes,
  MaterialsInputType,
  PeriodicTableSelectionMode,
  pluralize,
  validateInputLength,
  VALID_ELEMENTS,
} from './utils';
import './MaterialsInput.css';

export enum PeriodicTableMode {
  TOGGLE = 'toggle',
  FOCUS = 'focus',
  NONE = 'none',
}

export interface MaterialsInputSharedProps {
  value?: string;
  type?: MaterialsInputType;
  allowedInputTypes?: MaterialsInputType[];
  placeholder?: string;
  errorMessage?: string;
  inputClassName?: string;
  autocompleteFormulaUrl?: string;
  autocompleteApiKey?: string;
  helpItems?: InputHelpItem[];
  maxElementSelectable?: number;
  onChange?: (value: string) => any;
  onInputTypeChange?: (type: MaterialsInputType) => any;
  onSubmit?: (event: FormEvent | MouseEvent, value?: string, filterProps?: any) => any;
}

export interface MaterialsInputProps extends MaterialsInputSharedProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  debounce?: number;
  periodicTableMode?: PeriodicTableMode;
  hidePeriodicTable?: boolean;
  showTypeDropdown?: boolean;
  showSubmitButton?: boolean;
  submitButtonClicks?: number;
  submitButtonText?: string;
  label?: string;
  hideWildcardButton?: boolean;
  chemicalSystemSelectHelpText?: string;
  elementsSelectHelpText?: string;
  loading?: boolean;
  onPropsChange?: (propsObject: any) => void;
}

const normalizeElementsFromValue = (type: MaterialsInputType | null, value: string): string[] => {
  if (!value) {
    return [];
  }

  if (
    type === MaterialsInputType.CHEMICAL_SYSTEM ||
    type === MaterialsInputType.ELEMENTS ||
    type === MaterialsInputType.FORMULA ||
    type === MaterialsInputType.MOLECULE_FORMULA
  ) {
    const parsedValue = materialsInputTypes[type]?.validate(value);
    return Array.isArray(parsedValue) ? parsedValue : [];
  }

  return [];
};

const renderPeriodicTableValue = (mode: PeriodicTableSelectionMode, elements: string[]) => {
  if (mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM) {
    return arrayToDelimitedString(elements, /-/);
  }
  if (mode === PeriodicTableSelectionMode.FORMULA) {
    return elements.join('');
  }
  return arrayToDelimitedString(elements, /,/);
};

const isMaxSelectionValue = (
  type: MaterialsInputType | null,
  value: string,
  maxElementSelectable: number
) => {
  if (!type || !value) {
    return false;
  }

  const parsedValue = materialsInputTypes[type]?.validate(value);
  return Array.isArray(parsedValue) && parsedValue.length === maxElementSelectable;
};

const getSelectionTokens = (type: MaterialsInputType, value: string) => {
  const parsedValue = materialsInputTypes[type]?.validate(value);
  const elements = Array.isArray(parsedValue) ? parsedValue : [];
  const wildcards = value.match(/\*/g) ?? [];
  return {
    elements,
    elementsPlusWildcards: wildcards.length > 0 ? [...elements, ...wildcards] : elements,
  };
};

const areElementListsEqual = (left: string[], right: string[]) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

export const MaterialsInput = ({
  value = '',
  errorMessage = 'Invalid input value',
  type = MaterialsInputType.ELEMENTS,
  allowedInputTypes = [type],
  onChange = (nextValue) => nextValue,
  maxElementSelectable = 20,
  submitButtonText = 'Search',
  periodicTableMode = PeriodicTableMode.TOGGLE,
  debounce = 0,
  ...otherProps
}: MaterialsInputProps) => {
  const props = {
    value,
    type,
    errorMessage,
    allowedInputTypes,
    onChange,
    maxElementSelectable,
    submitButtonText,
    periodicTableMode,
    debounce,
    ...otherProps,
  };

  const [inputValue, setInputValue] = useState(props.value);
  const [inputType, setInputType] = useState<MaterialsInputType>(props.type);
  const [error, setError] = useState<string | null>(null);
  const [errorTipStayActive, setErrorTipStayActive] = useState(false);
  const [showInputHelp, setShowInputHelp] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [submitButtonClicks, setSubmitButtonClicks] = useState(props.submitButtonClicks ?? 0);
  const [isFocused, setIsFocused] = useState(false);
  const [previousValidValue, setPreviousValidValue] = useState(props.value);
  const [maxElementsReached, setMaxElementsReached] = useState(() =>
    isMaxSelectionValue(props.type, props.value, props.maxElementSelectable)
  );
  const [showPeriodicTable, setShowPeriodicTable] = useState(
    periodicTableMode === PeriodicTableMode.TOGGLE && !props.hidePeriodicTable
  );
  const [selectionMode, setSelectionMode] = useState<PeriodicTableSelectionMode>(
    materialsInputTypes[inputType]?.selectionMode ?? PeriodicTableSelectionMode.ELEMENTS
  );
  const [selectedElements, setSelectedElements] = useState<string[]>(() =>
    normalizeElementsFromValue(type, value)
  );
  const panelInteractionRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const errorTooltipId = useId();
  const helpTooltipId = useId();
  const periodicToggleTooltipId = useId();
  const debounceTimeoutRef = useRef<number>();

  const hasPeriodicTable = periodicTableMode !== PeriodicTableMode.NONE && !props.hidePeriodicTable;
  const hasDynamicInputType = props.allowedInputTypes.length > 1;
  const showTypeDropdown = props.showTypeDropdown && hasDynamicInputType;

  const dropdownOnlyElementsOrChemSys =
    showTypeDropdown &&
    props.allowedInputTypes.length === 2 &&
    props.allowedInputTypes.every((candidate) =>
      [MaterialsInputType.ELEMENTS, MaterialsInputType.CHEMICAL_SYSTEM].includes(candidate)
    );

  const typeDropdownOptions = showTypeDropdown
    ? dropdownOnlyElementsOrChemSys
      ? [
          materialsInputTypes[MaterialsInputType.CHEMICAL_SYSTEM]?.elementsOnlyDropdownValue,
          materialsInputTypes[MaterialsInputType.ELEMENTS]?.elementsOnlyDropdownValue,
        ].filter(Boolean)
      : props.allowedInputTypes.map((candidate) => materialsInputTypes[candidate]?.dropdownValue)
    : [];

  const typeDropdownValue = dropdownOnlyElementsOrChemSys
    ? materialsInputTypes[inputType]?.elementsOnlyDropdownValue
    : materialsInputTypes[inputType]?.dropdownValue;

  const allowedSelectionModes = useMemo(
    () => getAllowedSelectionModes(props.allowedInputTypes as MaterialsInputType[]),
    [props.allowedInputTypes]
  );
  const callbackProps = useMemo(
    () => ({
      ...props,
      value: inputValue,
      type: inputType,
    }),
    [
      inputType,
      inputValue,
      props.allowedInputTypes,
      props.autocompleteApiKey,
      props.autocompleteFormulaUrl,
      props.className,
      props.chemicalSystemSelectHelpText,
      props.debounce,
      props.elementsSelectHelpText,
      props.errorMessage,
      props.helpItems,
      props.hidePeriodicTable,
      props.hideWildcardButton,
      props.id,
      props.inputClassName,
      props.label,
      props.loading,
      props.maxElementSelectable,
      props.onChange,
      props.onInputTypeChange,
      props.onPropsChange,
      props.onSubmit,
      props.periodicTableMode,
      props.placeholder,
      props.setProps,
      props.showSubmitButton,
      props.showTypeDropdown,
      props.submitButtonClicks,
      props.submitButtonText,
      props.type,
      props.value,
    ]
  );

  const applyValidatedValue = (nextValue: string) => {
    const [detectedType, parsedValue] = detectAndValidateInputType(nextValue, props.allowedInputTypes);
    const resolvedType = detectedType ?? inputType;
    const validLength = validateInputLength(parsedValue, resolvedType, props.maxElementSelectable);
    const isValid = Boolean((parsedValue && validLength) || !nextValue);
    const reachedMax = Array.isArray(parsedValue) && parsedValue.length === props.maxElementSelectable;

    if (!validLength || (maxElementsReached && !isValid)) {
      setError(null);
      setInputValue(previousValidValue);
      return false;
    }

    if (nextValue && (!parsedValue || !validLength)) {
      setError(props.errorMessage);
      return false;
    }

    setError(null);
    setInputValue(nextValue);

    if (detectedType) {
      setInputType(detectedType);
      props.onInputTypeChange?.(detectedType);
      const nextSelectionMode = materialsInputTypes[detectedType]?.selectionMode;
      if (nextSelectionMode) {
        setSelectionMode(nextSelectionMode);
      }
    }

    setSelectedElements(normalizeElementsFromValue(resolvedType, nextValue));
    setPreviousValidValue(nextValue);
    setMaxElementsReached(reachedMax);
    return true;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (!nextValue) {
      setError(null);
      setInputValue('');
      setPreviousValidValue('');
      setMaxElementsReached(false);
      setSelectedElements([]);
      return;
    }

    applyValidatedValue(nextValue);
  };

  const convertSelectionToInputType = (
    selectedValue: string | undefined,
    lookupKey: string,
    currentInputType: MaterialsInputType,
    currentInputValue: string
  ) => {
    const { elements, elementsPlusWildcards } = getSelectionTokens(currentInputType, currentInputValue);
    const newSelection = getMaterialsInputTypeByMappedValue(lookupKey, selectedValue);
    if (!newSelection) {
      return;
    }

    setInputType(newSelection);
    props.onInputTypeChange?.(newSelection);

    let nextValue = currentInputValue;
    if (newSelection === MaterialsInputType.CHEMICAL_SYSTEM) {
      if (elementsPlusWildcards.length > 1) {
        nextValue = arrayToDelimitedString(elementsPlusWildcards, /-/);
      }
    } else if (newSelection === MaterialsInputType.ELEMENTS) {
      if (elements.length > 1) {
        nextValue = arrayToDelimitedString(elements, /,/);
      }
    } else if (newSelection === MaterialsInputType.FORMULA && currentInputType !== MaterialsInputType.FORMULA) {
      if (elements.length > 1) {
        nextValue = elements.join('');
      }
    } else if (
      newSelection === MaterialsInputType.MOLECULE_FORMULA &&
      currentInputType !== MaterialsInputType.MOLECULE_FORMULA &&
      elements.length > 1
    ) {
      nextValue = arrayToDelimitedString(elements, /\s/);
    }

    setError(null);
    setInputValue(nextValue);
    setSelectedElements(normalizeElementsFromValue(newSelection, nextValue));
    setPreviousValidValue(nextValue);
    setMaxElementsReached(isMaxSelectionValue(newSelection, nextValue, props.maxElementSelectable));
  };

  const handleFormulaButtonClick = (valueToAppend: string) => {
    const nextValue =
      selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM
        ? inputValue
          ? `${inputValue}${valueToAppend}`
          : valueToAppend.replace(/^-/, '')
        : `${inputValue}${valueToAppend}`;

    setInputValue(nextValue);
    setSelectedElements(normalizeElementsFromValue(inputType, nextValue));
  };

  const handleTableStateChange = useCallback(
    (nextElements: string[]) => {
      const nextValue = renderPeriodicTableValue(selectionMode, nextElements);

      setSelectedElements((current) => (areElementListsEqual(current, nextElements) ? current : nextElements));
      setError(null);
      setInputValue((current) => (current === nextValue ? current : nextValue));
    },
    [selectionMode]
  );

  const getNextInputTypeForSelectionMode = (mode: PeriodicTableSelectionMode) => {
    if (mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM) {
      return MaterialsInputType.CHEMICAL_SYSTEM;
    }
    if (mode === PeriodicTableSelectionMode.FORMULA) {
      return MaterialsInputType.FORMULA;
    }
    return MaterialsInputType.ELEMENTS;
  };

  const handleSubmit = (event: FormEvent | MouseEvent, submittedValue?: string) => {
    event.preventDefault();
    event.stopPropagation();

    if (error) {
      setErrorTipStayActive(true);
      return;
    }

    setShowPeriodicTable(false);
    setShowAutocomplete(false);
    setShowInputHelp(false);
    if (props.setProps) {
      setSubmitButtonClicks((current) => current + 1);
    }
    props.onSubmit?.(event, submittedValue ?? inputValue);
  };

  useEffect(() => {
    window.clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (!error) {
        callbackProps.onChange(inputValue);
        callbackProps.onPropsChange?.(callbackProps);
      }
    }, callbackProps.debounce);

    return () => window.clearTimeout(debounceTimeoutRef.current);
  }, [callbackProps, error, inputValue]);

  useEffect(() => {
    callbackProps.setProps?.({
      ...callbackProps,
      submitButtonClicks,
    });
  }, [callbackProps, submitButtonClicks]);

  useEffect(() => {
    setInputValue(props.value);
    setPreviousValidValue(props.value);
    setMaxElementsReached(isMaxSelectionValue(props.type, props.value, props.maxElementSelectable));
  }, [props.maxElementSelectable, props.type, props.value]);

  useEffect(() => {
    setInputType(props.type);
  }, [props.type]);

  useEffect(() => {
    const nextSelectedElements = normalizeElementsFromValue(inputType, inputValue);
    setSelectedElements((current) =>
      current.join('|') === nextSelectedElements.join('|') ? current : nextSelectedElements
    );
  }, [inputType, inputValue]);

  useEffect(() => {
    if (
      inputType === MaterialsInputType.FORMULA &&
      inputValue &&
      props.autocompleteFormulaUrl &&
      isFocused
    ) {
      setShowAutocomplete(true);
      setShowInputHelp(false);
    } else if (isFocused && !inputValue && props.helpItems) {
      setShowInputHelp(true);
      setShowAutocomplete(false);
    } else {
      setShowAutocomplete(false);
      if (!isFocused) {
        setShowInputHelp(false);
      }
    }
  }, [inputType, inputValue, isFocused, props.autocompleteFormulaUrl, props.helpItems]);

  const disableSubmitButton = !!props.loading || !!error || !inputValue;

  return (
    <div id={props.id} className={classNames('mpc-materials-input', props.className)}>
      {props.showSubmitButton ? (
        <form data-testid="materials-input-form" onSubmit={(event) => handleSubmit(event)}>
          <div className="field has-addons">
            {props.label ? (
              <div className="control">
                <button type="button" className="button is-static">
                  {props.label}
                </button>
              </div>
            ) : null}

            {showTypeDropdown ? (
              <div className="control dropdown is-active" data-testid="mpc-chemsys-dropdown">
                <div className="dropdown-trigger">
                  <label className="button">
                    <span>{typeDropdownValue}</span>
                    <span className="icon">
                      <FaAngleDown />
                    </span>
                    <select
                      aria-label="Input type"
                      style={{ position: 'absolute', inset: 0, opacity: 0 }}
                      value={typeDropdownValue}
                      onChange={(event) =>
                        convertSelectionToInputType(
                          event.target.value,
                          dropdownOnlyElementsOrChemSys ? 'elementsOnlyDropdownValue' : 'dropdownValue',
                          inputType,
                          inputValue
                        )
                      }
                    >
                      {typeDropdownOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ) : null}

            <div className="control is-expanded">
              <input
                ref={inputRef}
                data-testid="materials-input-search-input"
                className={classNames('input', props.inputClassName)}
                type="search"
                autoComplete="off"
                value={inputValue}
                placeholder={props.placeholder}
                onChange={handleInputChange}
                onFocus={() => {
                  setErrorTipStayActive(false);
                  setIsFocused(true);
                  if (periodicTableMode === PeriodicTableMode.FOCUS) {
                    setShowPeriodicTable(true);
                  }
                }}
                onBlur={(event: FocusEvent<HTMLInputElement>) => {
                  setIsFocused(false);
                  if (!panelInteractionRef.current && periodicTableMode === PeriodicTableMode.FOCUS) {
                    setShowPeriodicTable(false);
                  }
                  panelInteractionRef.current = false;
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Tab' && periodicTableMode === PeriodicTableMode.FOCUS) {
                    setShowPeriodicTable(false);
                  }
                }}
              />

              {props.autocompleteFormulaUrl ? (
                <FormulaAutocomplete
                  value={inputValue}
                  inputType={inputType}
                  apiEndpoint={props.autocompleteFormulaUrl}
                  apiKey={props.autocompleteApiKey}
                  show={showAutocomplete}
                  onChange={(nextValue) => {
                    applyValidatedValue(nextValue);
                  }}
                  onSubmit={props.onSubmit}
                  setError={setError}
                />
              ) : null}

              {props.helpItems ? (
                <InputHelp
                  items={props.helpItems}
                  show={showInputHelp}
                  onChange={(nextValue) => {
                    setInputValue(nextValue);
                    setShowInputHelp(false);
                  }}
                />
              ) : null}
            </div>

            {props.helpItems ? (
              <div className="control">
                <button
                  data-testid="materials-input-help-button"
                  type="button"
                  className={classNames('button input-help-button', {
                    'has-text-grey-light': !showInputHelp,
                    'has-text-link': showInputHelp,
                  })}
                  onClick={() => setShowInputHelp((current) => !current)}
                  data-for={helpTooltipId}
                >
                  <FaQuestionCircle />
                  <Tooltip id={helpTooltipId} place="bottom">
                    {showInputHelp ? 'Hide examples' : 'Show examples'}
                  </Tooltip>
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="control">
                <button
                  data-testid="materials-input-error"
                  type="button"
                  className={classNames('mpc-materials-input-error button', {
                    'has-tooltip-active': errorTipStayActive,
                  })}
                  onMouseOver={() => setErrorTipStayActive(false)}
                  data-for={errorTooltipId}
                >
                  <FaExclamationTriangle />
                  <Tooltip id={errorTooltipId} place="bottom">
                    {error}
                  </Tooltip>
                </button>
              </div>
            ) : null}

            {periodicTableMode === PeriodicTableMode.TOGGLE && hasPeriodicTable ? (
              <div className="control">
                <button
                  data-testid="materials-input-toggle-button"
                  type="button"
                  className="button has-oversized-icon is-size-2"
                  onClick={() => setShowPeriodicTable((current) => !current)}
                  data-for={periodicToggleTooltipId}
                >
                  <i
                    className={classNames('icon-fontastic-periodic-table-squares', {
                      'is-active': showPeriodicTable,
                    })}
                  />
                  <Tooltip id={periodicToggleTooltipId} place="bottom">
                    {showPeriodicTable ? 'Hide Periodic Table' : 'Show Periodic Table'}
                  </Tooltip>
                </button>
              </div>
            ) : null}

            <div className="control">
              <button
                data-testid="materials-input-submit-button"
                className={classNames('button is-primary', {
                  'is-loading': props.loading,
                })}
                type="submit"
                disabled={disableSubmitButton}
              >
                {props.submitButtonText}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              ref={inputRef}
              data-testid="materials-input-search-input"
              className={classNames('input', props.inputClassName)}
              type="search"
              autoComplete="off"
              value={inputValue}
              placeholder={props.placeholder}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {hasPeriodicTable ? (
        <div
          data-testid="materials-input-periodic-table"
          className={classNames('materials-input-elements-panel', {
            'is-hidden': !showPeriodicTable,
            'mt-3': showPeriodicTable,
          })}
          aria-hidden={!showPeriodicTable}
          onMouseDown={() => {
            panelInteractionRef.current = true;
          }}
        >
          <SelectableTable
            className="box"
            disabled={!showPeriodicTable}
            enabledElements={selectedElements}
            maxElementSelectable={
              selectionMode === PeriodicTableSelectionMode.ELEMENTS ? 5 : props.maxElementSelectable
            }
            forceTableLayout={TableLayout.MINI}
            hiddenElements={[]}
            onStateChange={handleTableStateChange}
            plugin={
              allowedSelectionModes.length > 0 ? (
                <PeriodicTableModeSwitcher
                  mode={selectionMode}
                  allowedModes={allowedSelectionModes}
                  hideWildcardButton={props.hideWildcardButton}
                  chemicalSystemSelectHelpText={props.chemicalSystemSelectHelpText}
                  elementsSelectHelpText={props.elementsSelectHelpText}
                  onSwitch={(mode) => {
                    setSelectionMode(mode);
                    const nextInputType = getNextInputTypeForSelectionMode(mode);
                    convertSelectionToInputType(
                      materialsInputTypes[nextInputType]?.selectionMode,
                      'selectionMode',
                      inputType,
                      inputValue
                    );
                  }}
                  onFormulaButtonClick={handleFormulaButtonClick}
                />
              ) : undefined
            }
          />

          {selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM && props.chemicalSystemSelectHelpText ? (
            <p className="help mt-3">{props.chemicalSystemSelectHelpText}</p>
          ) : null}
          {selectionMode === PeriodicTableSelectionMode.ELEMENTS && props.elementsSelectHelpText ? (
            <p className="help mt-3">{props.elementsSelectHelpText}</p>
          ) : null}
          {selectedElements.length > 0 ? (
            <p className="help mt-3">
              {selectedElements.length} {capitalize(pluralize('element'))} selected
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export { MaterialsInputType };
export type { InputHelpItem };
