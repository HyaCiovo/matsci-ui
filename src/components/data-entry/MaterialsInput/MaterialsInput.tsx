import clsx from 'clsx';
import {
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeTexts } from '../../../text/mergeTexts';
import {
  PeriodicTableModeSwitcher,
  type PeriodicTableModeSwitcherTexts,
} from '../../periodic-table/PeriodicTableModeSwitcher';
import {
  SelectableTable,
  TableLayout,
  type SelectableTableSelectionChange,
  type SelectableTableTexts,
} from '../../periodic-table/SelectableTable';
import { type InputHelpItem } from './InputHelp';
import { MaterialsInputBox } from './MaterialsInputBox/MaterialsInputBox';
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
  texts?: Partial<MaterialsInputTexts>;
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

let __matsciIdCounter = 0;
const useStableId = (prefix: string) => {
  const idRef = useRef<string>();
  if (!idRef.current) {
    __matsciIdCounter += 1;
    idRef.current = `${prefix}-${__matsciIdCounter}`;
  }
  return idRef.current;
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

const getConvertedValueForInputType = (
  newSelection: MaterialsInputType,
  currentInputType: MaterialsInputType,
  currentInputValue: string
) => {
  const { elements, elementsPlusWildcards } = getSelectionTokens(currentInputType, currentInputValue);

  if (newSelection === MaterialsInputType.CHEMICAL_SYSTEM) {
    if (elementsPlusWildcards.length > 1) {
      return arrayToDelimitedString(elementsPlusWildcards, /-/);
    }
    return currentInputValue;
  }

  if (newSelection === MaterialsInputType.ELEMENTS) {
    if (elements.length > 1) {
      return arrayToDelimitedString(elements, /,/);
    }
    return currentInputValue;
  }

  if (newSelection === MaterialsInputType.FORMULA && currentInputType !== MaterialsInputType.FORMULA) {
    if (elements.length > 1) {
      return elements.join('');
    }
    return currentInputValue;
  }

  if (
    newSelection === MaterialsInputType.MOLECULE_FORMULA &&
    currentInputType !== MaterialsInputType.MOLECULE_FORMULA &&
    elements.length > 1
  ) {
    return arrayToDelimitedString(elements, /\s/);
  }

  return currentInputValue;
};

export interface MaterialsInputTexts {
  showExamplesTooltipText: string;
  hideExamplesTooltipText: string;
  showPeriodicTableTooltipText: string;
  hidePeriodicTableTooltipText: string;
  selectableTable?: Partial<SelectableTableTexts>;
  periodicTableModeSwitcher?: Partial<PeriodicTableModeSwitcherTexts>;
}

const DEFAULT_TEXTS: MaterialsInputTexts = {
  showExamplesTooltipText: 'Show examples',
  hideExamplesTooltipText: 'Hide examples',
  showPeriodicTableTooltipText: 'Show Periodic Table',
  hidePeriodicTableTooltipText: 'Hide Periodic Table',
};

export const MaterialsInput = ({
  value = '',
  errorMessage,
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
    errorMessage: errorMessage ?? 'Invalid input value',
    allowedInputTypes,
    onChange,
    maxElementSelectable,
    submitButtonText,
    periodicTableMode,
    debounce,
    ...otherProps,
  };
  const resolvedTexts = mergeTexts(DEFAULT_TEXTS, props.texts);

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
  const baseId = props.id ?? useStableId('materials-input');
  const errorTooltipId = `${baseId}-error-tooltip`;
  const helpTooltipId = `${baseId}-help-tooltip`;
  const periodicToggleTooltipId = `${baseId}-periodic-toggle-tooltip`;
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

  const syncInputState = useCallback(
    (nextValue: string, nextType: MaterialsInputType = inputType) => {
      setError(null);
      setInputValue(nextValue);
      setSelectedElements(normalizeElementsFromValue(nextType, nextValue));
      setPreviousValidValue(nextValue);
      setMaxElementsReached(isMaxSelectionValue(nextType, nextValue, props.maxElementSelectable));
    },
    [inputType, props.maxElementSelectable]
  );

  const applyValidatedValue = useCallback(
    (nextValue: string) => {
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
        // Keep showing what the user typed (e.g. partial mp-id like "mp-"),
        // but mark as invalid until it becomes a valid value.
        setInputValue(nextValue);
        setError(props.errorMessage);
        return false;
      }

      if (detectedType) {
        setInputType(detectedType);
        props.onInputTypeChange?.(detectedType);
        const nextSelectionMode = materialsInputTypes[detectedType]?.selectionMode;
        if (nextSelectionMode) {
          setSelectionMode(nextSelectionMode);
        }
      }

      syncInputState(nextValue, resolvedType);
      setMaxElementsReached(reachedMax);
      return true;
    },
    [
      inputType,
      maxElementsReached,
      previousValidValue,
      props.allowedInputTypes,
      props.errorMessage,
      props.maxElementSelectable,
      props.onInputTypeChange,
      syncInputState,
    ]
  );

  const lastReportedValue = useRef(props.value);

  const reportChange = useCallback((valueToReport: string) => {
    lastReportedValue.current = valueToReport;
    callbackPropsRef.current.onChange(valueToReport);
    callbackPropsRef.current.onPropsChange?.(callbackPropsRef.current);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    if (!nextValue) {
      setError(null);
      setErrorTipStayActive(false);
      setInputValue('');
      setPreviousValidValue('');
      setMaxElementsReached(false);
      setSelectedElements([]);
      setShowAutocomplete(false);
      setShowInputHelp(Boolean(props.helpItems));
      return;
    }

    applyValidatedValue(nextValue);
  };

  const handleInputFocus = () => {
    setErrorTipStayActive(false);
    setIsFocused(true);
    if (periodicTableMode === PeriodicTableMode.FOCUS) {
      setShowPeriodicTable(true);
    }
  };

  const handleInputBlur = (_event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (!panelInteractionRef.current && periodicTableMode === PeriodicTableMode.FOCUS) {
      setShowPeriodicTable(false);
    } else if (panelInteractionRef.current && periodicTableMode === PeriodicTableMode.FOCUS) {
      window.setTimeout(() => {
        inputRef.current?.focus();
      });
    }
    panelInteractionRef.current = false;
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' && periodicTableMode === PeriodicTableMode.FOCUS) {
      setShowPeriodicTable(false);
    }
  };

  const convertSelectionToInputType = (
    selectedValue: string | undefined,
    lookupKey: string,
    currentInputType: MaterialsInputType,
    currentInputValue: string
  ) => {
    const newSelection = getMaterialsInputTypeByMappedValue(lookupKey, selectedValue);
    if (!newSelection) {
      return;
    }

    setInputType(newSelection);
    props.onInputTypeChange?.(newSelection);

    const nextValue = getConvertedValueForInputType(newSelection, currentInputType, currentInputValue);
    syncInputState(nextValue, newSelection);
  };

  const handleFormulaButtonClick = (valueToAppend: string) => {
    const nextValue =
      selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM
        ? inputValue
          ? `${inputValue}${valueToAppend}`
          : valueToAppend.replace(/^-/, '')
        : `${inputValue}${valueToAppend}`;

    syncInputState(nextValue, inputType);
  };

  const handleTableStateChange = useCallback(
    (nextState: SelectableTableSelectionChange | string[]) => {
      const nextElements = Array.isArray(nextState) ? nextState : nextState.enabledElements;
      const wildcards = inputValue.match(/\*/g) ?? [];
      const elementsForRender =
        selectionMode === PeriodicTableSelectionMode.ELEMENTS ||
        selectionMode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM
          ? wildcards.length > 0
            ? [...nextElements, ...wildcards]
            : nextElements
          : nextElements;
      const nextValue = renderPeriodicTableValue(selectionMode, elementsForRender);

      setSelectedElements((current) => (areElementListsEqual(current, nextElements) ? current : nextElements));
      setInputValue((current) => (current === nextValue ? current : nextValue));
      setPreviousValidValue(nextValue);
      setMaxElementsReached(isMaxSelectionValue(inputType, nextValue, props.maxElementSelectable));
      setError(null);
    },
    [inputType, inputValue, props.maxElementSelectable, selectionMode]
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

  const callbackPropsRef = useRef(callbackProps);
  useEffect(() => {
    callbackPropsRef.current = callbackProps;
  }, [callbackProps]);

  useEffect(() => {
    window.clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (!error && inputValue !== lastReportedValue.current) {
        reportChange(inputValue);
      }
    }, callbackProps.debounce);

    return () => window.clearTimeout(debounceTimeoutRef.current);
  }, [callbackProps.debounce, error, inputValue, reportChange]);

  useEffect(() => {
    callbackPropsRef.current.setProps?.({
      ...callbackPropsRef.current,
      submitButtonClicks,
    });
  }, [submitButtonClicks]);

  useEffect(() => {
    if (props.value !== lastReportedValue.current) {
      setInputValue(props.value);
      setPreviousValidValue(props.value);
      setMaxElementsReached(isMaxSelectionValue(props.type, props.value, props.maxElementSelectable));
      lastReportedValue.current = props.value;
    }
  }, [props.maxElementSelectable, props.type, props.value]);

  useEffect(() => {
    const previousInputType = inputType;
    setInputType(props.type);

    const nextSelectionMode = materialsInputTypes[props.type]?.selectionMode;
    if (hasPeriodicTable && nextSelectionMode) {
      setSelectionMode(nextSelectionMode);
    }

    if (inputValue && previousInputType !== props.type) {
      const nextValue = getConvertedValueForInputType(props.type, previousInputType, inputValue);
      if (nextValue !== inputValue) {
        syncInputState(nextValue, props.type);
      }
    }
  }, [hasPeriodicTable, props.type]);

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
    <div id={props.id} className={clsx('mpc-materials-input', props.className)}>
      {props.showSubmitButton ? (
        <form data-testid="materials-input-form" onSubmit={(event) => handleSubmit(event)}>
          <MaterialsInputBox
            label={props.label}
            showTypeDropdown={showTypeDropdown}
            dropdownOnlyElementsOrChemSys={dropdownOnlyElementsOrChemSys}
            typeDropdownValue={typeDropdownValue}
            typeDropdownOptions={typeDropdownOptions}
            onTypeChange={(value) =>
              convertSelectionToInputType(
                value,
                dropdownOnlyElementsOrChemSys ? 'elementsOnlyDropdownValue' : 'dropdownValue',
                inputType,
                inputValue
              )
            }
            inputRef={inputRef}
            inputValue={inputValue}
            inputType={inputType}
            inputClassName={props.inputClassName}
            placeholder={props.placeholder}
            onInputChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            autocompleteFormulaUrl={props.autocompleteFormulaUrl}
            autocompleteApiKey={props.autocompleteApiKey}
            showAutocomplete={showAutocomplete}
            onAutocompleteChange={(nextValue) => {
              inputRef.current?.blur();
              applyValidatedValue(nextValue);
            }}
            onAutocompleteSubmit={props.onSubmit}
            setError={setError}
            helpItems={props.helpItems}
            showInputHelp={showInputHelp}
            onHelpChange={(nextValue) => {
              applyValidatedValue(nextValue);
              setShowInputHelp(false);
            }}
            onHelpToggle={() => setShowInputHelp((current) => !current)}
            helpTooltipId={helpTooltipId}
            showExamplesTooltipText={resolvedTexts.showExamplesTooltipText}
            hideExamplesTooltipText={resolvedTexts.hideExamplesTooltipText}
            error={error}
            errorTipStayActive={errorTipStayActive}
            onErrorMouseOver={() => setErrorTipStayActive(false)}
            errorTooltipId={errorTooltipId}
            periodicTableMode={periodicTableMode}
            hasPeriodicTable={hasPeriodicTable}
            showPeriodicTable={showPeriodicTable}
            onPeriodicToggle={() => setShowPeriodicTable((current) => !current)}
            periodicToggleTooltipId={periodicToggleTooltipId}
            showPeriodicTableTooltipText={resolvedTexts.showPeriodicTableTooltipText}
            hidePeriodicTableTooltipText={resolvedTexts.hidePeriodicTableTooltipText}
            showSubmitButton={props.showSubmitButton}
            loading={props.loading}
            submitButtonText={props.submitButtonText}
            disableSubmitButton={disableSubmitButton}
          />
        </form>
      ) : (
        <MaterialsInputBox
          inputRef={inputRef}
          inputValue={inputValue}
          inputType={inputType}
          typeDropdownOptions={[]}
          onTypeChange={() => undefined}
          inputClassName={props.inputClassName}
          placeholder={props.placeholder}
          onInputChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autocompleteFormulaUrl={props.autocompleteFormulaUrl}
          autocompleteApiKey={props.autocompleteApiKey}
          showAutocomplete={showAutocomplete}
          helpItems={props.helpItems}
          showInputHelp={showInputHelp}
          onHelpChange={(nextValue) => {
            applyValidatedValue(nextValue);
            setShowInputHelp(false);
          }}
          onHelpToggle={() => setShowInputHelp((current) => !current)}
          error={error}
          errorTipStayActive={errorTipStayActive}
          onErrorMouseOver={() => setErrorTipStayActive(false)}
          onAutocompleteChange={(nextValue) => {
            inputRef.current?.blur();
            applyValidatedValue(nextValue);
          }}
          setError={setError}
          helpTooltipId={helpTooltipId}
          showExamplesTooltipText={resolvedTexts.showExamplesTooltipText}
          hideExamplesTooltipText={resolvedTexts.hideExamplesTooltipText}
          errorTooltipId={errorTooltipId}
          periodicTableMode={periodicTableMode}
          hasPeriodicTable={hasPeriodicTable}
          showPeriodicTable={showPeriodicTable}
          onPeriodicToggle={() => undefined}
          periodicToggleTooltipId={periodicToggleTooltipId}
          showPeriodicTableTooltipText={resolvedTexts.showPeriodicTableTooltipText}
          hidePeriodicTableTooltipText={resolvedTexts.hidePeriodicTableTooltipText}
          showSubmitButton={false}
          submitButtonText={props.submitButtonText}
          disableSubmitButton={disableSubmitButton}
        />
      )}

      {hasPeriodicTable ? (
        <div
          data-testid="materials-input-periodic-table"
          className={clsx('materials-input-elements-panel', {
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
            texts={resolvedTexts.selectableTable}
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
                  texts={resolvedTexts.periodicTableModeSwitcher}
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
