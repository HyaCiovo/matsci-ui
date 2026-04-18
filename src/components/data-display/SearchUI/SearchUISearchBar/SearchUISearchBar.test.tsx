import axios from 'axios';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PeriodicTableMode } from '../../../data-entry/MaterialsInput/MaterialsInput';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUISearchBar } from './SearchUISearchBar';
import { useSearchUIContext } from '../SearchUIContextProvider';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

const SearchResultsProbe = () => {
  const { results, totalResults, query, loading } = useSearchUIContext();

  return (
    <div>
      <div data-testid="search-ui-loading">{String(loading)}</div>
      <div data-testid="search-ui-total">{totalResults}</div>
      <div data-testid="search-ui-query">{JSON.stringify(query)}</div>
      <div data-testid="search-ui-results">{results.map((item) => item.material_id).join(',')}</div>
    </div>
  );
};

describe('SearchUISearchBar', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('maps input types to query fields and submits a search request through context', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [{ material_id: 'mp-149' }],
        meta: { total_doc: 1 },
      },
    } as any);

    render(
      <SearchUIContainer apiEndpoint="https://example.org/materials/search" autocompleteFormulaUrl="https://example.org/autocomplete">
        <SearchUISearchBar
          periodicTableMode={PeriodicTableMode.TOGGLE}
          placeholder="Search by elements, formula, or ID"
          errorMessage="Invalid search value"
          allowedInputTypesMap={{
            elements: { field: 'elements' },
            formula: { field: 'formula' },
            mpid: { field: 'material_ids' },
          }}
          helpItems={[{ label: 'Search examples' }]}
        />
        <SearchResultsProbe />
      </SearchUIContainer>
    );

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'mp-149' },
    });
    fireEvent.click(screen.getByTestId('materials-input-submit-button'));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('https://example.org/materials/search', {
        params: { material_ids: 'mp-149' },
        headers: undefined,
      });
      expect(screen.getByTestId('search-ui-total')).toHaveTextContent('1');
      expect(screen.getByTestId('search-ui-results')).toHaveTextContent('mp-149');
    });
  });
});
