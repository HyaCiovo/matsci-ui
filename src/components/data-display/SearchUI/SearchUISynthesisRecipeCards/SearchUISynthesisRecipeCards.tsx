import { useMemo } from 'react';
import { Paginator } from '../../Paginator';
import { SynthesisRecipeCard } from '../../SynthesisRecipeCard';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { formatTemplate } from '../../../../text/formatTemplate';
import { mergeTexts } from '../../../../text/mergeTexts';

export interface SearchUISynthesisRecipeCardsTexts {
  defaultCardTitle: string;
  pageSummaryTemplate: string;
  resultsPerPage: string;
}

export interface SearchUISynthesisRecipeCardsProps {
  texts?: Partial<SearchUISynthesisRecipeCardsTexts>;
}

const DEFAULT_TEXTS: SearchUISynthesisRecipeCardsTexts = {
  defaultCardTitle: 'Synthesis Result',
  pageSummaryTemplate: 'Page {page} of {totalPages}',
  resultsPerPage: 'Results per page',
};

const getCardSubtitle = (result: Record<string, any>) =>
  result.doi ?? result.material_id ?? result.authors?.join?.(', ') ?? result.journal ?? null;

export const SearchUISynthesisRecipeCards = ({ texts: textsProp }: SearchUISynthesisRecipeCardsProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const {
    defaultLimit,
    defaultSkip,
    limitKey,
    query,
    results,
    setPage,
    setResultsPerPage,
    skipKey,
    totalResults,
  } = useSearchUIContext();

  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);
  const currentPage = Math.floor(currentSkip / currentLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalResults / currentLimit));
  const visibleResults = useMemo(() => results.slice(0, currentLimit), [currentLimit, results]);
  const isSynthesisRecipe = (result: Record<string, any>) =>
    Boolean(result?.target?.material_formula && Array.isArray(result?.precursors) && Array.isArray(result?.operations));

  return (
    <div data-testid="mpc-synthesis-recipe-cards" className="mpc-synthesis-recipe-cards">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <div className="is-size-7">
          {formatTemplate(texts.pageSummaryTemplate, { page: currentPage, totalPages })}
        </div>
        <label className="is-size-7">
          <span className="mr-2">{texts.resultsPerPage}</span>
          <select
            data-testid="search-ui-synthesis-results-per-page"
            value={currentLimit}
            onChange={(event) => void setResultsPerPage(Number(event.target.value))}
          >
            {[10, 15, 30, 50, 75].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mpc-synthesis-recipe-cards-container" style={{ display: 'grid', gap: '1rem' }}>
        {visibleResults.map((result, index) => {
          if (isSynthesisRecipe(result)) {
            return <SynthesisRecipeCard key={`${result.doi ?? 'recipe'}-${index}`} data={result} />;
          }

          const title =
            result.title ?? result.formula_pretty ?? result.material_id ?? result.doi ?? texts.defaultCardTitle;
          const subtitle = getCardSubtitle(result);
          return (
            <article key={`${title}-${index}`} className="box">
              <h3 className="title is-6 mb-2">{String(title)}</h3>
              {subtitle ? <p className="subtitle is-7 mb-2">{String(subtitle)}</p> : null}
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(result, null, 2)}</pre>
            </article>
          );
        })}
      </div>

      <Paginator
        rowCount={totalResults}
        rowsPerPage={currentLimit}
        currentPage={currentPage}
        onChangePage={(page) => void setPage(page)}
        onChangeRowsPerPage={(rowsPerPage) => void setResultsPerPage(rowsPerPage)}
      />
    </div>
  );
};
