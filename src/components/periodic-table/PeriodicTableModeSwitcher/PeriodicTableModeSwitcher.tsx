import clsx from 'clsx';
import { FaAsterisk } from 'react-icons/fa';
import { Markdown } from '../../data-display/Markdown';
import { Tooltip } from '../../data-display/Tooltip';
import { PeriodicTableFormulaButtons } from '../PeriodicTableFormulaButtons';
import { PeriodicTableSelectionMode } from '../../data-entry/MaterialsInput/utils';
import { mergeTexts } from '../../../text/mergeTexts';
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
  texts?: Partial<PeriodicTableModeSwitcherTexts>;
  onSwitch: (mode: PeriodicTableSelectionMode) => void;
  onFormulaButtonClick: (value: string) => void;
}

export const PERIODIC_TABLE_MODE_LABELS: Record<PeriodicTableSelectionMode, string> = {
  [PeriodicTableSelectionMode.CHEMICAL_SYSTEM]: 'Only Elements',
  [PeriodicTableSelectionMode.ELEMENTS]: 'At Least Elements',
  [PeriodicTableSelectionMode.FORMULA]: 'Formula',
};

export interface PeriodicTableModeSwitcherTexts {
  modeLabels: Record<PeriodicTableSelectionMode, string>;
  wildcardTitle: string;
  wildcardTooltip: string;
}

const DEFAULT_TEXTS: PeriodicTableModeSwitcherTexts = {
  modeLabels: PERIODIC_TABLE_MODE_LABELS,
  wildcardTitle: 'Wildcard element',
  wildcardTooltip: 'Wildcard element',
};

export const PeriodicTableModeSwitcher = ({
  allowedModes = [
    PeriodicTableSelectionMode.FORMULA,
    PeriodicTableSelectionMode.ELEMENTS,
    PeriodicTableSelectionMode.CHEMICAL_SYSTEM,
  ],
  modeLabels,
  wildcardTitle,
  wildcardTooltip,
  texts,
  ...props
}: Props) => {
  const resolvedTexts = mergeTexts(DEFAULT_TEXTS, texts);
  const resolvedModeLabels = { ...resolvedTexts.modeLabels, ...(modeLabels ?? {}) };
  const resolvedWildcardTitle = wildcardTitle ?? resolvedTexts.wildcardTitle;
  const resolvedWildcardTooltip = wildcardTooltip ?? texts?.wildcardTooltip ?? resolvedWildcardTitle;
  return (
    <>
      <div data-testid="ms-pt-mode-switcher" className="ms-pt-mode-switcher ms-first-span">
        <div className="ms-dropdown-container">
          <div className="ms-tabs-nav ms-is-small ms-is-toggle ms-is-toggle-rounded ms-is-centered">
            <ul>
              {allowedModes.map((mode) => (
                <li key={mode} className={clsx({ 'ms-is-active': mode === props.mode })}>
                  <a onClick={() => props.onSwitch(mode)}>
                    <span>{resolvedModeLabels[mode]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="ms-second-span ms-pt-mode-content">
        {props.mode === PeriodicTableSelectionMode.FORMULA ? (
          <PeriodicTableFormulaButtons
            onClick={props.onFormulaButtonClick}
            hideWildcardButton={props.hideWildcardButton}
            wildcardTitle={resolvedWildcardTitle}
            wildcardTooltip={resolvedWildcardTooltip}
          />
        ) : null}

        {props.mode === PeriodicTableSelectionMode.CHEMICAL_SYSTEM ? (
          <>
            <div className="ms-pt-spacer" />
            {!props.hideWildcardButton ? (
              <Tooltip
                place="bottom"
                trigger={
                  <button
                    type="button"
                    className="ms-pt-wildcard-button ms-mat-element ms-has-tooltip-bottom"
                    onClick={() => props.onFormulaButtonClick('-*')}
                    title={resolvedWildcardTitle}
                  >
                    <span className="ms-mat-symbol">
                      <FaAsterisk />
                    </span>
                  </button>
                }
              >
                {resolvedWildcardTooltip}
              </Tooltip>
            ) : null}
            <div className="ms-pt-description">
              {props.chemicalSystemSelectHelpText ? (
                <Markdown>{props.chemicalSystemSelectHelpText}</Markdown>
              ) : null}
            </div>
          </>
        ) : null}

        {props.mode === PeriodicTableSelectionMode.ELEMENTS ? (
          <div className="ms-pt-description">
            {props.elementsSelectHelpText ? <Markdown>{props.elementsSelectHelpText}</Markdown> : null}
          </div>
        ) : null}
      </div>
    </>
  );
};
