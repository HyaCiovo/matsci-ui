import clsx from 'clsx';
import type { FocusEvent, FormEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';
import { FaExclamationTriangle, FaKeyboard, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../../data-display/Tooltip';
import { FormulaAutocomplete } from '../FormulaAutocomplete';
import { InputHelp, type InputHelpItem } from '../InputHelp';
import type { MaterialsInputType } from '../utils';
import type { PeriodicTableMode } from '../MaterialsInput';
import { Dropdown } from '../../../navigation/Dropdown';
import { Input } from '../../Input';

const DEFAULT_PERIODIC_TABLE_TOGGLE_ICON = <FaKeyboard aria-hidden="true" focusable="false" />;

interface MaterialsInputBoxProps {
  label?: string;
  showTypeDropdown?: boolean;
  dropdownOnlyElementsOrChemSys?: boolean;
  typeDropdownValue?: string;
  typeDropdownOptions: string[];
  onTypeChange: (value: string) => void;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  inputValue: string;
  inputType: MaterialsInputType;
  inputClassName?: string;
  placeholder?: string;
  periodicTableToggleIcon?: ReactNode;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  autocompleteFormulaUrl?: string;
  autocompleteApiKey?: string;
  showAutocomplete?: boolean;
  onAutocompleteChange: (value: string) => void;
  onAutocompleteSubmit?: (event: FormEvent | MouseEvent, value?: string, filterProps?: any) => void;
  setError: (value: string | null) => void;
  helpItems?: InputHelpItem[];
  showInputHelp?: boolean;
  onHelpChange: (value: string) => void;
  onHelpToggle: () => void;
  helpTooltipId: string;
  showExamplesTooltipText?: string;
  hideExamplesTooltipText?: string;
  error?: string | null;
  errorTipStayActive?: boolean;
  onErrorMouseOver: () => void;
  errorTooltipId: string;
  periodicTableMode: PeriodicTableMode;
  hasPeriodicTable: boolean;
  showPeriodicTable: boolean;
  onPeriodicToggle: () => void;
  periodicToggleTooltipId: string;
  showPeriodicTableTooltipText?: string;
  hidePeriodicTableTooltipText?: string;
  showSubmitButton?: boolean;
  loading?: boolean;
  submitButtonText: string;
  disableSubmitButton: boolean;
}

export const MaterialsInputBox = ({
  label,
  showTypeDropdown,
  typeDropdownValue,
  typeDropdownOptions,
  onTypeChange,
  inputRef,
  inputValue,
  inputType,
  inputClassName,
  placeholder,
  periodicTableToggleIcon,
  onInputChange,
  onFocus,
  onBlur,
  onKeyDown,
  autocompleteFormulaUrl,
  autocompleteApiKey,
  showAutocomplete,
  onAutocompleteChange,
  onAutocompleteSubmit,
  setError,
  helpItems,
  showInputHelp,
  onHelpChange,
  onHelpToggle,
  helpTooltipId,
  showExamplesTooltipText = 'Show examples',
  hideExamplesTooltipText = 'Hide examples',
  error,
  errorTipStayActive,
  onErrorMouseOver,
  errorTooltipId,
  periodicTableMode,
  hasPeriodicTable,
  showPeriodicTable,
  onPeriodicToggle,
  periodicToggleTooltipId,
  showPeriodicTableTooltipText = 'Show Periodic Table',
  hidePeriodicTableTooltipText = 'Hide Periodic Table',
  showSubmitButton,
  loading,
  submitButtonText,
  disableSubmitButton,
}: MaterialsInputBoxProps) => {
  const inputControl = (
    <div className="ms-control ms-is-expanded">
      <div className="ms-materials-input-control">
        <Input
          ref={inputRef}
          data-testid="materials-input-search-input"
          className={inputClassName}
          type="search"
          autoComplete="off"
          value={inputValue}
          placeholder={placeholder}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>

      {autocompleteFormulaUrl ? (
        <FormulaAutocomplete
          value={inputValue}
          inputType={inputType}
          apiEndpoint={autocompleteFormulaUrl}
          apiKey={autocompleteApiKey}
          show={showAutocomplete}
          onChange={onAutocompleteChange}
          onSubmit={onAutocompleteSubmit}
          setError={setError}
        />
      ) : null}

      {helpItems ? <InputHelp items={helpItems} show={showInputHelp} onChange={onHelpChange} /> : null}
    </div>
  );

  if (!showSubmitButton) {
    return (
      <div className="ms-field ms-has-addons">
        {inputControl}
        
        {helpItems ? (
          <div className="ms-control">
            <Tooltip
              place="bottom"
              trigger={
                <button
                  data-testid="materials-input-help-button"
                  type="button"
                  className={clsx('ms-materials-input-addon ms-button', {
                    'ms-has-text-grey-light': !showInputHelp,
                    'ms-has-text-link': showInputHelp,
                  })}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={onHelpToggle}
                >
                  <FaQuestionCircle />
                </button>
              }
            >
              {showInputHelp ? hideExamplesTooltipText : showExamplesTooltipText}
            </Tooltip>
          </div>
        ) : null}

        {error ? (
          <div className="ms-control">
            <Tooltip
              place="bottom"
              trigger={
                <button
                  data-testid="materials-input-error"
                  type="button"
                  className={clsx('ms-materials-input-addon ms-button ms-is-static ms-materials-input-error', {
                    'ms-has-tooltip-active': errorTipStayActive,
                  })}
                  onMouseOver={onErrorMouseOver}
                >
                  <FaExclamationTriangle />
                </button>
              }
            >
              {error}
            </Tooltip>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="ms-field ms-has-addons">
      {label ? (
        <div className="ms-control">
          <button type="button" className="ms-button ms-is-static">
            {label}
          </button>
        </div>
      ) : null}

      {showTypeDropdown ? (
        <div className="ms-control" data-testid="ms-chemsys-dropdown">
          <Dropdown triggerLabel={typeDropdownValue} triggerClassName="ms-button">
            {typeDropdownOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={clsx('ms-dropdown-item', { 'ms-is-active': option === typeDropdownValue })}
                onClick={() => onTypeChange(option)}
              >
                {option}
              </button>
            ))}
          </Dropdown>
        </div>
      ) : null}

      {inputControl}

      {helpItems ? (
        <div className="ms-control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-help-button"
                type="button"
                className={clsx('ms-button ms-input-help-button', {
                  'ms-has-text-grey-light': !showInputHelp,
                  'ms-has-text-link': showInputHelp,
                })}
                onClick={onHelpToggle}
              >
                <FaQuestionCircle />
              </button>
            }
          >
            {showInputHelp ? hideExamplesTooltipText : showExamplesTooltipText}
          </Tooltip>
        </div>
      ) : null}

      {error ? (
        <div className="ms-control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-error"
                type="button"
                className={clsx('ms-materials-input-error ms-button', {
                  'ms-has-tooltip-active': errorTipStayActive,
                })}
                onMouseOver={onErrorMouseOver}
              >
                <FaExclamationTriangle />
              </button>
            }
          >
            {error}
          </Tooltip>
        </div>
      ) : null}

      {periodicTableMode === 'toggle' && hasPeriodicTable ? (
        <div className="ms-control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-toggle-button"
                type="button"
                className={clsx(
                  'ms-button ms-has-oversized-icon ms-is-size-2 ms-materials-input-toggle-button',
                  {
                    'ms-is-active': showPeriodicTable,
                    'ms-is-inactive': !showPeriodicTable,
                  }
                )}
                onClick={onPeriodicToggle}
              >
                <span
                  className={clsx('ms-materials-input-toggle-icon', {
                    'ms-is-active': showPeriodicTable,
                  })}
                >
                  {periodicTableToggleIcon ?? DEFAULT_PERIODIC_TABLE_TOGGLE_ICON}
                </span>
              </button>
            }
          >
            {showPeriodicTable ? hidePeriodicTableTooltipText : showPeriodicTableTooltipText}
          </Tooltip>
        </div>
      ) : null}

      <div className="ms-control">
        <button
          data-testid="materials-input-submit-button"
          className={clsx('ms-button ms-is-primary', {
            'ms-is-loading': loading,
          })}
          type="submit"
          disabled={disableSubmitButton}
        >
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};
