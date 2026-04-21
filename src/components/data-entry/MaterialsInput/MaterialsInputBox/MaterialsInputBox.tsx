import clsx from 'clsx';
import type { FocusEvent, FormEvent, KeyboardEvent, MouseEvent, MutableRefObject } from 'react';
import { FaAngleDown, FaExclamationTriangle, FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { Tooltip } from '../../../data-display/Tooltip';
import { FormulaAutocomplete } from '../FormulaAutocomplete';
import { InputHelp, type InputHelpItem } from '../InputHelp';
import type { MaterialsInputType } from '../utils';
import type { PeriodicTableMode } from '../MaterialsInput';

const PeriodicTableIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 208 118"
    aria-hidden="true"
    className={clsx('mpc-materials-input-toggle-icon', { 'is-active': active })}
  >
    <g fill="currentColor">
      <rect x="10" y="10" width="9" height="9" />
      <rect x="190" y="10" width="8" height="9" />
      <rect x="10" y="21" width="9" height="8" />
      <rect x="21" y="21" width="8" height="8" />
      <rect x="137" y="21" width="9" height="8" />
      <rect x="147" y="21" width="9" height="8" />
      <rect x="158" y="21" width="9" height="8" />
      <rect x="169" y="21" width="8" height="8" />
      <rect x="179" y="21" width="9" height="8" />
      <rect x="10" y="31" width="9" height="9" />
      <rect x="21" y="31" width="8" height="9" />
      <rect x="137" y="31" width="9" height="9" />
      <rect x="147" y="31" width="9" height="9" />
      <rect x="158" y="31" width="9" height="9" />
      <rect x="169" y="31" width="8" height="9" />
      <rect x="179" y="31" width="9" height="9" />
      <rect x="190" y="31" width="8" height="9" />
      <rect x="10" y="42" width="9" height="8" />
      <rect x="21" y="42" width="8" height="8" />
      <rect x="31" y="42" width="9" height="8" />
      <rect x="42" y="42" width="8" height="8" />
      <rect x="52" y="42" width="9" height="8" />
      <rect x="63" y="42" width="9" height="8" />
      <rect x="73" y="42" width="9" height="8" />
      <rect x="84" y="42" width="9" height="8" />
      <rect x="95" y="42" width="8" height="8" />
      <rect x="105" y="42" width="9" height="8" />
      <rect x="116" y="42" width="8" height="8" />
      <rect x="126" y="42" width="9" height="8" />
      <rect x="137" y="42" width="9" height="8" />
      <rect x="147" y="42" width="9" height="8" />
      <rect x="158" y="42" width="9" height="8" />
      <rect x="169" y="42" width="8" height="8" />
      <rect x="179" y="42" width="9" height="8" />
      <rect x="190" y="42" width="8" height="8" />
      <rect x="10" y="52" width="9" height="9" />
      <rect x="21" y="52" width="8" height="9" />
      <rect x="31" y="52" width="9" height="9" />
      <rect x="42" y="52" width="8" height="9" />
      <rect x="52" y="52" width="9" height="9" />
      <rect x="63" y="52" width="9" height="9" />
      <rect x="73" y="52" width="9" height="9" />
      <rect x="84" y="52" width="9" height="9" />
      <rect x="95" y="52" width="8" height="9" />
      <rect x="105" y="52" width="9" height="9" />
      <rect x="116" y="52" width="8" height="9" />
      <rect x="126" y="52" width="9" height="9" />
      <rect x="137" y="52" width="9" height="9" />
      <rect x="147" y="52" width="9" height="9" />
      <rect x="158" y="52" width="9" height="9" />
      <rect x="169" y="52" width="8" height="9" />
      <rect x="179" y="52" width="9" height="9" />
      <rect x="190" y="52" width="8" height="9" />
      <rect x="10" y="63" width="9" height="9" />
      <rect x="21" y="63" width="8" height="9" />
      <rect x="31" y="63" width="9" height="9" />
      <rect x="42" y="63" width="8" height="9" />
      <rect x="52" y="63" width="9" height="9" />
      <rect x="63" y="63" width="9" height="9" />
      <rect x="73" y="63" width="9" height="9" />
      <rect x="84" y="63" width="9" height="9" />
      <rect x="95" y="63" width="8" height="9" />
      <rect x="105" y="63" width="9" height="9" />
      <rect x="116" y="63" width="8" height="9" />
      <rect x="126" y="63" width="9" height="9" />
      <rect x="137" y="63" width="9" height="9" />
      <rect x="147" y="63" width="9" height="9" />
      <rect x="158" y="63" width="9" height="9" />
      <rect x="169" y="63" width="8" height="9" />
      <rect x="179" y="63" width="9" height="9" />
      <rect x="190" y="63" width="8" height="9" />
      <rect x="10" y="73" width="9" height="9" />
      <rect x="21" y="73" width="8" height="9" />
      <rect x="31" y="73" width="9" height="9" />
      <rect x="42" y="73" width="8" height="9" />
      <rect x="52" y="73" width="9" height="9" />
      <rect x="63" y="73" width="9" height="9" />
      <rect x="73" y="73" width="9" height="9" />
      <rect x="84" y="73" width="9" height="9" />
      <rect x="95" y="73" width="8" height="9" />
      <rect x="105" y="73" width="9" height="9" />
      <rect x="116" y="73" width="8" height="9" />
      <rect x="126" y="73" width="9" height="9" />
      <rect x="137" y="73" width="9" height="9" />
      <rect x="147" y="73" width="9" height="9" />
      <rect x="158" y="73" width="9" height="9" />
      <rect x="169" y="73" width="8" height="9" />
      <rect x="179" y="73" width="9" height="9" />
      <rect x="190" y="73" width="8" height="9" />
      <rect x="42" y="89" width="8" height="9" />
      <rect x="52" y="89" width="9" height="9" />
      <rect x="63" y="89" width="9" height="9" />
      <rect x="73" y="89" width="9" height="9" />
      <rect x="84" y="89" width="9" height="9" />
      <rect x="95" y="89" width="8" height="9" />
      <rect x="105" y="89" width="9" height="9" />
      <rect x="116" y="89" width="8" height="9" />
      <rect x="126" y="89" width="9" height="9" />
      <rect x="137" y="89" width="9" height="9" />
      <rect x="147" y="89" width="9" height="9" />
      <rect x="158" y="89" width="9" height="9" />
      <rect x="169" y="89" width="8" height="9" />
      <rect x="179" y="89" width="9" height="9" />
      <rect x="190" y="89" width="8" height="9" />
      <rect x="42" y="100" width="8" height="9" />
      <rect x="52" y="100" width="9" height="9" />
      <rect x="63" y="100" width="9" height="9" />
      <rect x="73" y="100" width="9" height="9" />
      <rect x="84" y="100" width="9" height="9" />
      <rect x="95" y="100" width="8" height="9" />
      <rect x="105" y="100" width="9" height="9" />
      <rect x="116" y="100" width="8" height="9" />
      <rect x="126" y="100" width="9" height="9" />
      <rect x="137" y="100" width="9" height="9" />
      <rect x="147" y="100" width="9" height="9" />
      <rect x="158" y="100" width="9" height="9" />
      <rect x="169" y="100" width="8" height="9" />
      <rect x="179" y="100" width="9" height="9" />
      <rect x="190" y="100" width="8" height="9" />
    </g>
  </svg>
);

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
  onClearInput: () => void;
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
  onClearInput,
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
      <div className="mpc-materials-input-control">
        <input
          ref={inputRef}
          data-testid="materials-input-search-input"
          className={clsx('input', inputClassName, {
            'has-inline-actions': !!inputValue,
          })}
          type="search"
          autoComplete="off"
          value={inputValue}
          placeholder={placeholder}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        {inputValue ? (
          <button
            type="button"
            className="mpc-materials-input-clear"
            data-testid="materials-input-clear"
            aria-label="Clear input"
            onMouseDown={(event) => event.preventDefault()}
            onClick={onClearInput}
          >
            <FaTimes />
          </button>
        ) : null}
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
      <div className="field has-addons">
        {inputControl}
        
        {helpItems ? (
          <div className="control">
            <Tooltip
              place="bottom"
              trigger={
                <button
                  data-testid="materials-input-help-button"
                  type="button"
                  className={clsx('mpc-materials-input-addon button', {
                    'has-text-grey-light': !showInputHelp,
                    'has-text-link': showInputHelp,
                  })}
                  onMouseDown={(event) => event.preventDefault()}
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
                  className={clsx('mpc-materials-input-addon button is-static mpc-materials-input-error', {
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
                className="button has-oversized-icon is-size-2 mpc-materials-input-toggle-button"
                onClick={onPeriodicToggle}
              >
                <PeriodicTableIcon active={showPeriodicTable} />
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
