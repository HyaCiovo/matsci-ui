import { DataCard } from '../../DataCard';
import { Paginator } from '../../Paginator';
import { useSearchUIContext } from '../SearchUIContextProvider';

export const SearchUIDataCards = () => {
  const { query, setPage, state } = useSearchUIContext();
  const { results, totalResults, cardOptions, limitKey, skipKey, defaultLimit, defaultSkip } = state;

  const currentLimit = Number(query[limitKey] ?? defaultLimit);
  const currentSkip = Number(query[skipKey] ?? defaultSkip);
  const currentPage = Math.floor(currentSkip / currentLimit) + 1;

  const paginator = (
    <Paginator
      rowCount={totalResults}
      rowsPerPage={currentLimit}
      currentPage={currentPage}
      onChangePage={(page) => setPage(page)}
    />
  );

  return (
    <div data-testid="ms-search-ui-data-cards" className="ms-search-ui-data-cards">
      {paginator}
      <div className="ms-search-ui-data-cards-container">
        {results.map((result: any, index: number) => (
          <DataCard
            key={`ms-data-card-${index}`}
            className="ms-box ms-search-ui-data-card"
            data={result}
            levelOneKey={cardOptions?.levelOneKey}
            levelTwoKey={cardOptions?.levelTwoKey}
            levelThreeKeys={cardOptions?.levelThreeKeys}
            leftComponent={
              cardOptions?.imageBaseURL && cardOptions?.imageKey ? (
                <figure className="ms-image ms-is-128x128">
                  <img src={`${cardOptions.imageBaseURL}${result[cardOptions.imageKey]}.png`} />
                </figure>
              ) : undefined
            }
          />
        ))}
      </div>
      {paginator}
    </div>
  );
};
