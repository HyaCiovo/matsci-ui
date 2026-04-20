import clsx from 'clsx';
import type { FocusEvent, FormEvent, KeyboardEvent, MouseEvent, MutableRefObject, ReactNode } from 'react';
import { FaAngleDown, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../../data-display/Tooltip';
import { FormulaAutocomplete } from '../FormulaAutocomplete';
import { InputHelp, type InputHelpItem } from '../InputHelp';
import type { MaterialsInputType } from '../utils';
import type { PeriodicTableMode } from '../MaterialsInput';

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
  error?: string | null;
  errorTipStayActive?: boolean;
  onErrorMouseOver: () => void;
  errorTooltipId: string;
  periodicTableMode: PeriodicTableMode;
  hasPeriodicTable: boolean;
  showPeriodicTable: boolean;
  onPeriodicToggle: () => void;
  periodicToggleTooltipId: string;
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
  error,
  errorTipStayActive,
  onErrorMouseOver,
  errorTooltipId,
  periodicTableMode,
  hasPeriodicTable,
  showPeriodicTable,
  onPeriodicToggle,
  periodicToggleTooltipId,
  showSubmitButton,
  loading,
  submitButtonText,
  disableSubmitButton,
}: MaterialsInputBoxProps) => {
  const inputControl = (
    <div className="control is-expanded">
      <input
        ref={inputRef}
        data-testid="materials-input-search-input"
        className={clsx('input', inputClassName)}
        type="search"
        autoComplete="off"
        value={inputValue}
        placeholder={placeholder}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />

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
      <div className="field has-addons">
        {inputControl}
      </div>
    );
  }

  return (
    <div className="field has-addons">
      {label ? (
        <div className="control">
          <button type="button" className="button is-static">
            {label}
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
                onChange={(event) => onTypeChange(event.target.value)}
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

      {inputControl}

      {helpItems ? (
        <div className="control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-help-button"
                type="button"
                className={clsx('button input-help-button', {
                  'has-text-grey-light': !showInputHelp,
                  'has-text-link': showInputHelp,
                })}
                onClick={onHelpToggle}
              >
                <FaQuestionCircle />
              </button>
            }
          >
            {showInputHelp ? 'Hide examples' : 'Show examples'}
          </Tooltip>
        </div>
      ) : null}

      {error ? (
        <div className="control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-error"
                type="button"
                className={clsx('mpc-materials-input-error button', {
                  'has-tooltip-active': errorTipStayActive,
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
        <div className="control">
          <Tooltip
            place="bottom"
            trigger={
              <button
                data-testid="materials-input-toggle-button"
                type="button"
                className="button has-oversized-icon is-size-2"
                onClick={onPeriodicToggle}
              >
                <i
                  className={clsx('icon-fontastic-periodic-table-squares', {
                    'is-active': showPeriodicTable,
                  })}
                />
              </button>
            }
          >
            {showPeriodicTable ? 'Hide Periodic Table' : 'Show Periodic Table'}
          </Tooltip>
        </div>
      ) : null}

      <div className="control">
        <button
          data-testid="materials-input-submit-button"
          className={clsx('button is-primary', {
            'is-loading': loading,
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
