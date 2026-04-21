import clsx from 'clsx';
import type { FocusEvent, FormEvent, KeyboardEvent, MouseEvent, MutableRefObject } from 'react';
import { FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { Tooltip } from '../../../data-display/Tooltip';
import { FormulaAutocomplete } from '../FormulaAutocomplete';
import { InputHelp, type InputHelpItem } from '../InputHelp';
import type { MaterialsInputType } from '../utils';
import type { PeriodicTableMode } from '../MaterialsInput';
import { Dropdown } from '../../../navigation/Dropdown';
import { Input } from '../../Input';

const PeriodicTableIcon = ({ active }: { active: boolean }) => (
  <svg
    viewBox="0 0 208 118"
    aria-hidden="true"
    className={clsx('mpc-materials-input-toggle-icon', { 'is-active': active })}
  >
    <g fill="currentColor">
      <rect x="10" y="10" width="9" height="9" />
      <rect x="190" y="10" width="8" height="9" />
      <rect x="10" y="22" width="9" height="8" />
      <rect x="21" y="22" width="8" height="8" />
      <rect x="137" y="22" width="9" height="8" />
      <rect x="147" y="22" width="9" height="8" />
      <rect x="158" y="22" width="9" height="8" />
      <rect x="169" y="22" width="8" height="8" />
      <rect x="179" y="22" width="9" height="8" />
      <rect x="10" y="33" width="9" height="9" />
      <rect x="21" y="33" width="8" height="9" />
      <rect x="137" y="33" width="9" height="9" />
      <rect x="147" y="33" width="9" height="9" />
      <rect x="158" y="33" width="9" height="9" />
      <rect x="169" y="33" width="8" height="9" />
      <rect x="179" y="33" width="9" height="9" />
      <rect x="190" y="33" width="8" height="9" />
      <rect x="10" y="45" width="9" height="8" />
      <rect x="21" y="45" width="8" height="8" />
      <rect x="31" y="45" width="9" height="8" />
      <rect x="42" y="45" width="8" height="8" />
      <rect x="52" y="45" width="9" height="8" />
      <rect x="63" y="45" width="9" height="8" />
      <rect x="73" y="45" width="9" height="8" />
      <rect x="84" y="45" width="9" height="8" />
      <rect x="95" y="45" width="8" height="8" />
      <rect x="105" y="45" width="9" height="8" />
      <rect x="116" y="45" width="8" height="8" />
      <rect x="126" y="45" width="9" height="8" />
      <rect x="137" y="45" width="9" height="8" />
      <rect x="147" y="45" width="9" height="8" />
      <rect x="158" y="45" width="9" height="8" />
      <rect x="169" y="45" width="8" height="8" />
      <rect x="179" y="45" width="9" height="8" />
      <rect x="190" y="45" width="8" height="8" />
      <rect x="10" y="56" width="9" height="9" />
      <rect x="21" y="56" width="8" height="9" />
      <rect x="31" y="56" width="9" height="9" />
      <rect x="42" y="56" width="8" height="9" />
      <rect x="52" y="56" width="9" height="9" />
      <rect x="63" y="56" width="9" height="9" />
      <rect x="73" y="56" width="9" height="9" />
      <rect x="84" y="56" width="9" height="9" />
      <rect x="95" y="56" width="8" height="9" />
      <rect x="105" y="56" width="9" height="9" />
      <rect x="116" y="56" width="8" height="9" />
      <rect x="126" y="56" width="9" height="9" />
      <rect x="137" y="56" width="9" height="9" />
      <rect x="147" y="56" width="9" height="9" />
      <rect x="158" y="56" width="9" height="9" />
      <rect x="169" y="56" width="8" height="9" />
      <rect x="179" y="56" width="9" height="9" />
      <rect x="190" y="56" width="8" height="9" />
      <rect x="10" y="68" width="9" height="9" />
      <rect x="21" y="68" width="8" height="9" />
      <rect x="31" y="68" width="9" height="9" />
      <rect x="42" y="68" width="8" height="9" />
      <rect x="52" y="68" width="9" height="9" />
      <rect x="63" y="68" width="9" height="9" />
      <rect x="73" y="68" width="9" height="9" />
      <rect x="84" y="68" width="9" height="9" />
      <rect x="95" y="68" width="8" height="9" />
      <rect x="105" y="68" width="9" height="9" />
      <rect x="116" y="68" width="8" height="9" />
      <rect x="126" y="68" width="9" height="9" />
      <rect x="137" y="68" width="9" height="9" />
      <rect x="147" y="68" width="9" height="9" />
      <rect x="158" y="68" width="9" height="9" />
      <rect x="169" y="68" width="8" height="9" />
      <rect x="179" y="68" width="9" height="9" />
      <rect x="190" y="68" width="8" height="9" />
      <rect x="10" y="79" width="9" height="9" />
      <rect x="21" y="79" width="8" height="9" />
      <rect x="31" y="79" width="9" height="9" />
      <rect x="42" y="79" width="8" height="9" />
      <rect x="52" y="79" width="9" height="9" />
      <rect x="63" y="79" width="9" height="9" />
      <rect x="73" y="79" width="9" height="9" />
      <rect x="84" y="79" width="9" height="9" />
      <rect x="95" y="79" width="8" height="9" />
      <rect x="105" y="79" width="9" height="9" />
      <rect x="116" y="79" width="8" height="9" />
      <rect x="126" y="79" width="9" height="9" />
      <rect x="137" y="79" width="9" height="9" />
      <rect x="147" y="79" width="9" height="9" />
      <rect x="158" y="79" width="9" height="9" />
      <rect x="169" y="79" width="8" height="9" />
      <rect x="179" y="79" width="9" height="9" />
      <rect x="190" y="79" width="8" height="9" />
      <rect x="42" y="96" width="8" height="9" />
      <rect x="52" y="96" width="9" height="9" />
      <rect x="63" y="96" width="9" height="9" />
      <rect x="73" y="96" width="9" height="9" />
      <rect x="84" y="96" width="9" height="9" />
      <rect x="95" y="96" width="8" height="9" />
      <rect x="105" y="96" width="9" height="9" />
      <rect x="116" y="96" width="8" height="9" />
      <rect x="126" y="96" width="9" height="9" />
      <rect x="137" y="96" width="9" height="9" />
      <rect x="147" y="96" width="9" height="9" />
      <rect x="158" y="96" width="9" height="9" />
      <rect x="169" y="96" width="8" height="9" />
      <rect x="179" y="96" width="9" height="9" />
      <rect x="190" y="96" width="8" height="9" />
      <rect x="42" y="108" width="8" height="9" />
      <rect x="52" y="108" width="9" height="9" />
      <rect x="63" y="108" width="9" height="9" />
      <rect x="73" y="108" width="9" height="9" />
      <rect x="84" y="108" width="9" height="9" />
      <rect x="95" y="108" width="8" height="9" />
      <rect x="105" y="108" width="9" height="9" />
      <rect x="116" y="108" width="8" height="9" />
      <rect x="126" y="108" width="9" height="9" />
      <rect x="137" y="108" width="9" height="9" />
      <rect x="147" y="108" width="9" height="9" />
      <rect x="158" y="108" width="9" height="9" />
      <rect x="169" y="108" width="8" height="9" />
      <rect x="179" y="108" width="9" height="9" />
      <rect x="190" y="108" width="8" height="9" />
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
      <div className="mpc-materials-input-control">
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
        <div className="control" data-testid="mpc-chemsys-dropdown">
          <Dropdown triggerLabel={typeDropdownValue} triggerClassName="button">
            {typeDropdownOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={clsx('dropdown-item', { 'is-active': option === typeDropdownValue })}
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
