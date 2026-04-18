import classNames from 'classnames';
import { FaAsterisk } from 'react-icons/fa';
import { Markdown } from '../../data-display/Markdown';
import { Tooltip } from '../../data-display/Tooltip';
import { PeriodicTableFormulaButtons } from '../PeriodicTableFormulaButtons';
import { PeriodicTableSelectionMode } from '../../data-entry/MaterialsInput/utils';
import './PeriodicTableModeSwitcher.css';

interface Props {
  mode: PeriodicTableSelectionMode;
  allowedModes?: PeriodicTableSelectionMode[];
  hideWildcardButton?: boolean;
  chemicalSystemSelectHelpText?: string;
  elementsSelectHelpText?: string;
  onSwitch: (mode: PeriodicTableSelectionMode) => void;
  onFormulaButtonClick: (value: string) => void;
}

export const PERIODIC_TABLE_MODE_LABELS: Record<PeriodicTableSelectionMode, string> = {
  [PeriodicTableSelectionMode.CHEMICAL_SYSTEM]: 'Only Elements',
  [PeriodicTableSelectionMode.ELEMENTS]: 'At Least Elements',
  [PeriodicTableSelectionMode.FORMULA]: 'Formula',
};

export const PeriodicTableModeSwitcher = ({
  allowedModes = [
    PeriodicTableSelectionMode.FORMULA,
    PeriodicTableSelectionMode.ELEMENTS,
    PeriodicTableSelectionMode.CHEMICAL_SYSTEM,
  ],
  ...props
}: Props) => {
  return (
    <>
      <div data-testid="mpc-pt-mode-switcher" className="mpc-pt-mode-switcher first-span">
        <div className="dropdown-container">
          <div className="tabs is-small is-toggle is-toggle-rounded is-centered">
            <ul>
              {allowedModes.map((mode) => (
                <li key={mode} className={classNames({ 'is-active': mode === props.mode })}>
                  <button type="button" onClick={() => props.onSwitch(mode)}>
                    <span>{PERIODIC_TABLE_MODE_LABELS[mode]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="second-span mpc-pt-mode-content">
        {props.mode === PeriodicTableSelectionMode.FORMULA ? (
          <PeriodicTableFormulaButtons
            onClick={props.onFormulaButtonClick}
            hideWildcardButton={props.hideWildcardButton}
          />
        ) : null}

        {props.mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM ? (
          <>
            <div className="pt-spacer" />
            {!props.hideWildcardButton ? (
              <>
                <button
                  type="button"
                  className="pt-wildcard-button mat-element has-tooltip-bottom"
                  onClick={() => props.onFormulaButtonClick('-*')}
                  title="Wildcard element"
                  data-tip
                  data-for="element-wildcard-button"
                >
                  <span className="mat-symbol">
                    <FaAsterisk />
                  </span>
                </button>
                <Tooltip id="element-wildcard-button" place="bottom">
                  Wildcard element
                </Tooltip>
              </>
            ) : null}
            <div className="pt-description">
              {props.chemicalSystemSelectHelpText ? (
                <Markdown>{props.chemicalSystemSelectHelpText}</Markdown>
              ) : null}
            </div>
          </>
        ) : null}

        {props.mode === PeriodicTableSelectionMode.ELEMENTS ? (
          <div className="pt-description">
            {props.elementsSelectHelpText ? <Markdown>{props.elementsSelectHelpText}</Markdown> : null}
          </div>
        ) : null}
      </div>
    </>
  );
};
