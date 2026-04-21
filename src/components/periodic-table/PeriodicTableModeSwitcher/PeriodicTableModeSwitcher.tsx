import clsx from 'clsx';
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
  modeLabels?: Partial<Record<PeriodicTableSelectionMode, string>>;
  wildcardTitle?: string;
  wildcardTooltip?: string;
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
  modeLabels,
  wildcardTitle = 'Wildcard element',
  wildcardTooltip = wildcardTitle,
  ...props
}: Props) => {
  const resolvedModeLabels = { ...PERIODIC_TABLE_MODE_LABELS, ...(modeLabels ?? {}) };
  return (
    <>
      <div data-testid="mpc-pt-mode-switcher" className="mpc-pt-mode-switcher first-span">
        <div className="dropdown-container">
          <div className="tabs is-small is-toggle is-toggle-rounded is-centered">
            <ul>
              {allowedModes.map((mode) => (
                <li key={mode} className={clsx({ 'is-active': mode === props.mode })}>
                  <a onClick={() => props.onSwitch(mode)}>
                    <span>{resolvedModeLabels[mode]}</span>
                  </a>
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
              <Tooltip
                place="bottom"
                trigger={
                  <button
                    type="button"
                    className="pt-wildcard-button mat-element has-tooltip-bottom"
                    onClick={() => props.onFormulaButtonClick('-*')}
                    title={wildcardTitle}
                  >
                    <span className="mat-symbol">
                      <FaAsterisk />
                    </span>
                  </button>
                }
              >
                {wildcardTooltip}
              </Tooltip>
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
