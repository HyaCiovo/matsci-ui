import { FaExclamationTriangle } from 'react-icons/fa';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { searchUIViewsMap } from '../searchUIViewsMap';
import { mergeTexts } from '../../../../text/mergeTexts';

export interface SearchUIDataViewTexts {
  errorTitle: string;
  errorDescription: string;
  emptyTitle: string;
}

export interface SearchUIDataViewProps {
  texts?: Partial<SearchUIDataViewTexts>;
}

const DEFAULT_TEXTS: SearchUIDataViewTexts = {
  errorTitle: 'There was an error with your search.',
  errorDescription: 'You may have entered an invalid search value, or the API may be temporarily unavailable.',
  emptyTitle: 'No records match your search criteria',
};

export const SearchUIDataView = ({ texts: textsProp }: SearchUIDataViewProps) => {
  const texts = mergeTexts(DEFAULT_TEXTS, textsProp);
  const { error, results, view } = useSearchUIContext();

  if (error) {
    return (
      <div className="react-data-table-message">
        <p>
          <FaExclamationTriangle />
          {texts.errorTitle}
        </p>
        <p>{texts.errorDescription}</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="react-data-table-message">
        <p>{texts.emptyTitle}</p>
      </div>
    );
  }

  const SearchUIViewComponent = searchUIViewsMap[view] ?? searchUIViewsMap.table;

  return (
    <div className="mpc-search-ui-data-view">
      {SearchUIViewComponent ? <SearchUIViewComponent /> : null}
    </div>
  );
};
