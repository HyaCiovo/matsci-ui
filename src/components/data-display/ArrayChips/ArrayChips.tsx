import { FaDownload } from 'react-icons/fa';
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

const isFormulaLike = (value: string) => /[A-Z][a-z]?\d*/.test(value.replace(/\s/g, ''));

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
        const tooltipId = `${id ?? 'array-chip'}-tooltip-${index}`;
        const chipContent = typeof item === 'string' && isFormulaLike(item) ? <Formula>{item}</Formula> : String(item);
        const href = chipLinks?.[index];
        const tooltipContent = chipTooltips?.[index];
        const target = chipType === 'publications' ? '_blank' : chipLinksTarget;

        const content = (
          <>
            {showDownloadIcon ? <FaDownload className="mr-1" /> : null}
            {chipContent}
            {tooltipContent ? <Tooltip id={tooltipId}>{tooltipContent}</Tooltip> : null}
          </>
        );

        if (href) {
          return (
            <a
              key={`array-chip-${index}-${item}`}
              className="tag"
              href={href}
              target={target}
              rel={target === '_blank' ? 'noreferrer' : undefined}
              onClick={(event) => event.stopPropagation()}
              data-tooltip-id={tooltipContent ? tooltipId : undefined}
            >
              {content}
            </a>
          );
        }

        return (
          <span
            key={`array-chip-${index}-${item}`}
            className="tag"
            data-tooltip-id={tooltipContent ? tooltipId : undefined}
          >
            {content}
          </span>
        );
      })}
    </span>
  );
};
