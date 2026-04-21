import { FaAsterisk } from 'react-icons/fa';
import { Tooltip } from '../../data-display/Tooltip';

interface Props {
  onClick: (value: string) => void;
  hideWildcardButton?: boolean;
  wildcardTitle?: string;
  wildcardTooltip?: string;
}

export const PeriodicTableFormulaButtons = ({
  onClick,
  hideWildcardButton,
  wildcardTitle = 'Wildcard element',
  wildcardTooltip = wildcardTitle,
}: Props) => {
  const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '(', ')'];

  return (
    <>
      <div className="pt-spacer" />
      {!hideWildcardButton ? (
        <Tooltip
          place="bottom"
          trigger={
            <button
              type="button"
              className="pt-wildcard-button mat-element has-tooltip-bottom"
              onClick={() => onClick('*')}
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
      {values.map((value) => (
        <button key={value} type="button" className="mat-element" onClick={() => onClick(value)}>
          <span className="mat-symbol">{value}</span>
        </button>
      ))}
    </>
  );
};
