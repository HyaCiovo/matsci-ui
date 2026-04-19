import classNames from 'classnames';
import { FaArrowRight } from 'react-icons/fa';
import { DataBlock } from '../DataBlock';
import { Formula } from '../Formula';
import { Link } from '../../navigation/Link';
import { validateFormula } from '../../data-entry/MaterialsInput/utils';
import { ColumnFormat, type Column } from '../SearchUI/types';
import './SynthesisRecipeCard.css';

export interface SynthesisRecipeCardProps {
  id?: string;
  className?: string;
  data: any;
}

const isFormulaLike = (value: string) => Boolean(value) && /[A-Z][a-z]?\d*/.test(value.replace(/\s/g, ''));

const renderValues = (value: any): string | null => {
  if (value !== null && value !== undefined) {
    if (Array.isArray(value.values)) {
      return `${value.values.map((item: any) => `${item}`).join(', ')} ${value.units ?? ''}`.trim();
    }
    if (value.min_value !== null && value.max_value !== null) {
      return `between ${value.min_value} and ${value.max_value} ${value.units ?? ''}`.trim();
    }
    if (value.min_value !== null) {
      return `above ${value.min_value} ${value.units ?? ''}`.trim();
    }
    if (value.max_value !== null) {
      return `below ${value.max_value} ${value.units ?? ''}`.trim();
    }
  }
  return null;
};

const renderArray = (value: any) => (Array.isArray(value) && value.length > 0 ? value.join(', ') : null);

const getConditionsString = (conditions: any) => {
  const values: string[] = [];

  if (typeof conditions !== 'object' || !conditions) {
    return '';
  }

  (conditions.heating_temperature || [])
    .map((item: any) => renderValues(item))
    .map((item: string | null) => (item ? `at ${item}` : null))
    .filter(Boolean)
    .forEach((item: string) => values.push(item));

  (conditions.heating_time || [])
    .map((item: any) => renderValues(item))
    .map((item: string | null) => (item ? `for ${item}` : null))
    .filter(Boolean)
    .forEach((item: string) => values.push(item));

  const heatingAtmosphere = renderArray(conditions.heating_atmosphere);
  if (heatingAtmosphere) {
    values.push(`in ${heatingAtmosphere}`);
  }
  if (conditions.mixing_device) {
    values.push(`using ${conditions.mixing_device}`);
  }
  if (conditions.mixing_media) {
    values.push(`with ${conditions.mixing_media}`);
  }

  return values.join(', ');
};

const RenderParagraphOrHighlight = ({
  paragraphString,
  highlights,
  className,
}: {
  paragraphString?: string;
  highlights?: any[];
  className?: string;
}) => (
  <div className={classNames('mpc-synthesis-card-paragraph has-text-grey-dark', className)}>
    <p>
      "
      {highlights
        ? highlights.map((highlight, index) => (
            <span key={index}>
              {highlight.texts.map((text: any, textIndex: number) => (
                <span
                  key={textIndex}
                  className={classNames({
                    'mpc-synthesis-card-highlight-hit': text.type === 'hit',
                  })}
                >
                  {text.value}
                </span>
              ))}
            </span>
          ))
        : paragraphString}
      "
    </p>
  </div>
);

const formulaToMaterialLink = (formula: string, composition?: any[]) => {
  if (validateFormula(formula)) {
    return `/materials?formula=${formula}`;
  }

  const elements: string[] = [];
  composition?.forEach((item) => {
    Object.keys(item.elements || {}).forEach((element) => {
      if (!elements.includes(element)) {
        elements.push(element);
      }
    });
  });

  return `/materials?formula=${elements.join('-')}`;
};

const formatReactionString = (reactionString?: string) => {
  if (!reactionString) {
    return null;
  }

  const cleanedPrefix = reactionString.replace(/(^|[ ])(1(?=\s))/gi, '');
  const sections = cleanedPrefix.split(' ; ');
  const sides = sections[0]?.split(' == ').map((item) => item.split(' ')) ?? [[], []];
  const info = sections.slice(1).map((item) => item.split(' '));

  const renderToken = (token: string, index: number) =>
    isFormulaLike(token) ? <Formula key={index}>{token}</Formula> : <span key={index}> {token} </span>;

  return (
    <div>
      <div>
        {sides[0]?.map(renderToken)}
        <span>
          {' '}
          <FaArrowRight />{' '}
        </span>
        {sides[1]?.map(renderToken)}
      </div>
      <div className="is-size-7 is-italic">
        {info.map((section, sectionIndex) => (
          <span key={sectionIndex}>
            {section.map(renderToken)}
            {sectionIndex !== info.length - 1 ? <span> &#183; </span> : null}
          </span>
        ))}
      </div>
    </div>
  );
};

const getColumns = (): Column[] => [
  {
    title: 'Target Material',
    selector: 'targetFormulaLink',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      linkLabelKey: 'targetFormula',
      linkLabelisFormula: true,
      target: '',
    },
    isTop: true,
    minWidth: '250px',
    maxWidth: '250px',
  },
  {
    title: 'Precursor Materials',
    selector: 'precursorFormulas',
    formatType: ColumnFormat.ARRAY,
    formatOptions: {
      arrayLinksKey: 'precursorFormulaLinks',
      arrayLinksTarget: '',
    },
    isTop: true,
  },
  {
    title: 'Paragraph Excerpt',
    selector: 'paragraph',
    isBottom: true,
  },
  {
    title: 'Reaction Equation',
    selector: 'reactionString',
    isBottom: true,
  },
  {
    title: 'Synthesis Procedures',
    selector: 'synthesisProcedures',
    formatType: ColumnFormat.ARRAY,
    isBottom: true,
  },
  {
    title: 'Synthesis Type',
    selector: 'synthesisType',
    isBottom: true,
  },
];

export const SynthesisRecipeCard = ({ id, className, data }: SynthesisRecipeCardProps) => {
  const doiUrl = data?.doi?.startsWith('http') ? data.doi : `https://doi.org/${data?.doi}`;

  return (
    <DataBlock
      id={id}
      className={classNames('mpc-synthesis-card', className)}
      data={{
        targetFormula: data.target.material_formula,
        precursorFormulas: data.precursors_formula_s,
        targetFormulaLink: formulaToMaterialLink(data.target.material_formula, data.target.composition),
        precursorFormulaLinks: data.precursors.map((item: any) =>
          formulaToMaterialLink(item.material_formula, item.composition)
        ),
        synthesisType: data.synthesis_type,
        paragraph: (
          <RenderParagraphOrHighlight
            paragraphString={data.paragraph_string}
            highlights={data.highlights}
          />
        ),
        reactionString: formatReactionString(data.reaction_string),
        synthesisProcedures: data.operations.map((operation: any, index: number) => `${index + 1}. ${operation.token} ${getConditionsString(operation.conditions)}`),
      }}
      columns={getColumns()}
      footer={
        <div>
          <i>Extracted from</i>{' '}
          <Link href={doiUrl} target="_blank">
            {data.doi}
          </Link>
        </div>
      }
      iconClassName="icon-fontastic-synthesis"
      iconTooltip="Synthesis Recipe"
    />
  );
};
