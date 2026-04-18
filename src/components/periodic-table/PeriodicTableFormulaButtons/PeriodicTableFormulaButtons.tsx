import { FaAsterisk } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';

interface Props {
  onClick: (value: string) => void;
  hideWildcardButton?: boolean;
}

export const PeriodicTableFormulaButtons = ({ onClick, hideWildcardButton }: Props) => {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')'];

  return (
    <>
      <div className="pt-spacer" />
      {!hideWildcardButton ? (
        <>
          <button
            type="button"
            className="pt-wildcard-button mat-element has-tooltip-bottom"
            onClick={() => onClick('*')}
            data-tip
            data-for="formula-wildcard-button"
          >
            <span className="mat-symbol">
              <FaAsterisk />
            </span>
          </button>
          <Tooltip id="formula-wildcard-button" place="bottom">
            Wildcard element
          </Tooltip>
        </>
      ) : null}
      {values.map((value) => (
        <button key={value} type="button" className="mat-element" onClick={() => onClick(value)}>
          <span className="mat-symbol">{value}</span>
        </button>
      ))}
    </>
  );
};
