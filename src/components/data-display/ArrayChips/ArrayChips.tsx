import { FaDownload } from 'react-icons/fa';
import { validateFormula } from '../../data-entry/MaterialsInput/utils';
import { Formula } from '../Formula';
import { Tooltip } from '../Tooltip';

export interface ArrayChipsProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  chips: any[];
  chipTooltips?: string[];
  chipLinks?: string[];
  chipLinksTarget?: string;
  chipType?: 'normal' | 'publications' | 'dynamic-publications';
  showDownloadIcon?: boolean;
}

export const ArrayChips = ({
  id,
  className,
  chips,
  chipTooltips,
  chipLinks,
  chipLinksTarget = '_blank',
  chipType = 'normal',
  showDownloadIcon = false,
}: ArrayChipsProps) => {
  return (
    <span data-testid="array-chips" id={id} className={`tags ${className ?? ''}`.trim()}>
      {chips.map((item, index) => {
        const chipContent =
          typeof item === 'string' && validateFormula(item) ? <Formula>{item}</Formula> : String(item);
        const href = chipLinks?.[index];
        const tooltipContent = chipTooltips?.[index];
        const target = chipType === 'publications' ? '_blank' : chipLinksTarget;

        if (href) {
          return (
            <Tooltip
              key={`array-chip-${index}-${item}`}
              disable={!tooltipContent}
              trigger={
                <a
                  className="ms-tag"
                  href={href}
                  target={target}
                  rel={target === '_blank' ? 'noreferrer' : undefined}
                  onClick={(event) => event.stopPropagation()}
                >
                  {showDownloadIcon ? <FaDownload className="ms-mr-1" /> : null}
                  {chipContent}
                </a>
              }
            >
              {tooltipContent}
            </Tooltip>
          );
        }

        return (
          <Tooltip
            key={`array-chip-${index}-${item}`}
            disable={!tooltipContent}
            trigger={
              <span className="ms-tag">
                {showDownloadIcon ? <FaDownload className="ms-mr-1" /> : null}
                {chipContent}
              </span>
            }
          >
            {tooltipContent}
          </Tooltip>
        );
      })}
    </span>
  );
};
