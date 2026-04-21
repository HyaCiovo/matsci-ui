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
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockImplementation(async (input: any) => {
      const url = String(input);
      if (url.startsWith('https://example.com/matscholar')) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => ({
            results: [
              { material_id: ['mp-149', 'mp-13'] },
              { material_id: ['mp-225'] },
            ],
          }),
        };
      }
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          data: [{ material_id: 'mp-149' }, { material_id: 'mp-13' }],
        }),
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
      expect(mockedFetch).toHaveBeenCalledTimes(2);
    });

    const firstUrl = String(mockedFetch.mock.calls[0]?.[0] ?? '');
    const firstParsed = new URL(firstUrl);
    expect(firstParsed.origin + firstParsed.pathname).toBe('https://example.com/matscholar');
    expect(firstParsed.searchParams.get('q')).toBe('thermoelectric');

    const secondUrl = String(mockedFetch.mock.calls[1]?.[0] ?? '');
    const secondParsed = new URL(secondUrl);
    expect(secondParsed.origin + secondParsed.pathname).toBe('https://example.com/materials');
    expect(secondParsed.searchParams.get('_limit')).toBe('2');
    expect(secondParsed.searchParams.get('_fields')).toBe('material_id');
    expect(secondParsed.searchParams.get('_sort_fields')).toBe('material_id');
    expect(secondParsed.searchParams.get('material_ids')).toBe('mp-149,mp-13');
    expect(secondParsed.searchParams.get('_skip')).toBeNull();

    await waitFor(() => {
      expect(screen.getByTestId('matscholar-total-results')).toHaveTextContent('3');
    });

    fireEvent.click(screen.getByTestId('matscholar-page-two'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledTimes(3);
    });

    const thirdUrl = String(mockedFetch.mock.calls[2]?.[0] ?? '');
    const thirdParsed = new URL(thirdUrl);
    expect(thirdParsed.origin + thirdParsed.pathname).toBe('https://example.com/materials');
    expect(thirdParsed.searchParams.get('_limit')).toBe('2');
    expect(thirdParsed.searchParams.get('_fields')).toBe('material_id');
    expect(thirdParsed.searchParams.get('_sort_fields')).toBe('material_id');
    expect(thirdParsed.searchParams.get('material_ids')).toBe('mp-225');
  });
});
