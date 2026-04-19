import axios from 'axios';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MatscholarSearchUIContainer } from './SearchUIContainer';
import { useSearchUIContext } from './SearchUIContextProvider';

const QueryProbe = () => {
  const { query, totalResults, submitSearch, setPage } = useSearchUIContext();
  return (
    <>
      <pre data-testid="matscholar-query-probe">{JSON.stringify(query)}</pre>
      <div data-testid="matscholar-total-results">{totalResults}</div>
      <button type="button" data-testid="matscholar-run-search" onClick={() => void submitSearch()}>
        Run Search
      </button>
      <button type="button" data-testid="matscholar-page-two" onClick={() => void setPage(2)}>
        Page Two
      </button>
    </>
  );
};

describe('MatscholarSearchUI compatibility', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('resolves q queries through matscholar and then queries materials with material_ids chunks', async () => {
    const getSpy = vi.spyOn(axios, 'get').mockImplementation(async (url, config) => {
      if (url === 'https://example.com/matscholar') {
        return {
          data: {
            results: [
              { material_id: ['mp-149', 'mp-13'] },
              { material_id: ['mp-225'] },
            ],
          },
        };
      }

      return {
        data: {
          data: [{ material_id: 'mp-149' }, { material_id: 'mp-13' }],
        },
      };
    });

    render(
      <MatscholarSearchUIContainer
        apiEndpoint="https://example.com/materials"
        matscholarEndpoint="https://example.com/matscholar"
        searchOnMount={false}
        defaultQuery={{ q: 'thermoelectric' }}
        defaultLimit={2}
        columns={[{ title: 'Material ID', selector: 'material_id' }]}
      >
        <QueryProbe />
      </MatscholarSearchUIContainer>
    );

    fireEvent.click(screen.getByTestId('matscholar-run-search'));

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledTimes(2);
    });

    expect(getSpy.mock.calls[0]?.[0]).toBe('https://example.com/matscholar');
    expect(getSpy.mock.calls[0]?.[1]).toMatchObject({
      params: { q: 'thermoelectric' },
    });
    expect(getSpy.mock.calls[1]?.[0]).toBe('https://example.com/materials');
    expect(getSpy.mock.calls[1]?.[1]?.params).toMatchObject({
      _limit: 2,
      _sort_fields: ['material_id'],
      _fields: ['material_id'],
      material_ids: ['mp-149', 'mp-13'],
    });
    expect(getSpy.mock.calls[1]?.[1]?.params).not.toHaveProperty('_skip');

    await waitFor(() => {
      expect(screen.getByTestId('matscholar-total-results')).toHaveTextContent('3');
    });

    fireEvent.click(screen.getByTestId('matscholar-page-two'));

    await waitFor(() => {
      expect(getSpy).toHaveBeenCalledTimes(3);
    });

    expect(getSpy.mock.calls[2]?.[0]).toBe('https://example.com/materials');
    expect(getSpy.mock.calls[2]?.[1]?.params).toMatchObject({
      _limit: 2,
      _sort_fields: ['material_id'],
      _fields: ['material_id'],
      material_ids: ['mp-225'],
    });
  });
});
