import clsx from 'clsx';
import { ELEMENTS_REGEX, ELEMENTS_SPLIT_REGEX } from '../../../utils/formula';

export interface FormulaProps {
  id?: string;
  className?: string;
  children: string;
}

const formulaItem = (value: string) => {
  if (!value.match(/[()*]/g) && !value.match(ELEMENTS_REGEX)) {
    return <sub>{value}</sub>;
  }

  return <span>{value}</span>;
};

export const Formula = ({ id, className, children }: FormulaProps) => {
  const splitFormula = children.match(ELEMENTS_SPLIT_REGEX) ?? [];

  return (
    <span data-testid="formula" id={id} className={clsx('mpc-formula', className)}>
      {splitFormula.map((part, index) => (
        <span key={`${part}-${index}`}>{formulaItem(part)}</span>
      ))}
    </span>
  );
};
