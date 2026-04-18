import classNames from 'classnames';
import {
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
import { SelectableTable } from '../../periodic-table/SelectableTable';
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

  if (type === MaterialsInputType.CHEMICAL_SYSTEM) {
    return value.split('-').filter(Boolean);
  }
  if (type === MaterialsInputType.ELEMENTS) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  if (type === MaterialsInputType.FORMULA) {
    return value.match(/A[cglmrstu]|B[aehikr]?|C[adeflmnorsu]?|D[bsy]|E[rsu]|F[elmr]?|G[ade]|H[efgos]?|I[nr]?|Kr?|L[airuv]|M[dgnot]|N[abdeiop]?|Os?|P[abdmortu]?|R[abefghnu]|S[bcegimnr]?|T[abcehilm]|U(u[opst])?|V|W|Xe|Yb?|Z[nr]|La\-Lu?|Ac\-Lr?/g) ?? [];
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

  const applyValidatedValue = (nextValue: string) => {
    const [detectedType, parsedValue] = detectAndValidateInputType(nextValue, props.allowedInputTypes);
    const resolvedType = detectedType ?? inputType;
    const validLength = validateInputLength(parsedValue, resolvedType, props.maxElementSelectable);

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
    return true;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (!nextValue) {
      setError(null);
      setInputValue('');
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
    const elements = normalizeElementsFromValue(currentInputType, currentInputValue);
    const newSelection = getMaterialsInputTypeByMappedValue(lookupKey, selectedValue);
    if (!newSelection) {
      return;
    }

    setInputType(newSelection);
    props.onInputTypeChange?.(newSelection);

    if (newSelection === MaterialsInputType.CHEMICAL_SYSTEM) {
      setInputValue(arrayToDelimitedString(elements, /-/));
    } else if (newSelection === MaterialsInputType.ELEMENTS) {
      setInputValue(arrayToDelimitedString(elements, /,/));
    } else if (newSelection === MaterialsInputType.FORMULA) {
      setInputValue(elements.join(''));
    } else if (newSelection === MaterialsInputType.MOLECULE_FORMULA) {
      setInputValue(arrayToDelimitedString(elements, /\s/));
    }
  };

  const toggleElement = (element: string) => {
    const enabled = selectedElements.includes(element);
    let nextElements = enabled
      ? selectedElements.filter((candidate) => candidate !== element)
      : [...selectedElements, element];

    if (!enabled && nextElements.length > props.maxElementSelectable) {
      return;
    }

    setSelectedElements(nextElements);
    setError(null);
    setInputValue(renderPeriodicTableValue(selectionMode, nextElements));
  };

  const appendWildcard = () => {
    if (selectionMode === PeriodicTableSelectionMode.FORMULA) {
      setInputValue((current) => `${current}*`);
      return;
    }

    const nextElements = [...selectedElements, '*'];
    setInputValue(renderPeriodicTableValue(selectionMode, nextElements));
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
        props.onChange(inputValue);
        props.onPropsChange?.({ ...props, value: inputValue, type: inputType });
      }
    }, props.debounce);

    return () => window.clearTimeout(debounceTimeoutRef.current);
  }, [error, inputType, inputValue, props]);

  useEffect(() => {
    props.setProps?.({
      ...props,
      value: inputValue,
      type: inputType,
      submitButtonClicks,
    });
  }, [inputType, inputValue, props, submitButtonClicks]);

  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setInputType(props.type);
  }, [props.type]);

  useEffect(() => {
    setSelectedElements(normalizeElementsFromValue(inputType, inputValue));
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
            enabledElements={selectedElements}
            maxElementSelectable={props.maxElementSelectable}
            onStateChange={(nextElements) => {
              setSelectedElements(nextElements);
              setError(null);
              setInputValue(renderPeriodicTableValue(selectionMode, nextElements));
            }}
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
