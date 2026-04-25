import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from './SearchUIContainer';
import { useSearchUIContext } from './SearchUIContextProvider';
import { SearchUIFilters } from './SearchUIFilters';
import { FilterType, type FilterGroup } from './types';
import {
  initFilterGroups,
  parseSearchQuery,
  preprocessQueryParams,
  serializeSearchQuery,
} from './utils';

const filterGroups: FilterGroup[] = [
  {
    name: 'Composition',
    expanded: true,
    filters: [
      {
        name: 'Material ID',
        type: FilterType.MATERIALS_INPUT,
        params: ['material_ids'],
        props: {
          type: 'mpid',
        },
      },
      {
        name: 'Crystal System',
        type: FilterType.SELECT_CRYSTAL_SYSTEM,
        params: ['crystal_system'],
      },
      {
        name: 'Available Properties',
        type: FilterType.CHECKBOX_LIST,
        params: ['has_props'],
        props: {
          options: [
            { label: 'DOS', value: 'dos' },
            { label: 'Band Structure', value: 'bandstructure' },
          ],
        },
      },
      {
        name: 'Band Gap',
        type: FilterType.SLIDER,
        params: ['band_gap_min', 'band_gap_max'],
        props: {
          domain: [0, 10],
        },
      },
    ],
  },
];

const QueryProbe = () => {
  const { state, query, activeFilters, totalResults, submitSearch, setFilterValue, setPage, setResultsPerPage, setSort } =
    useSearchUIContext();
  return (
    <>
      <pre data-testid="query-probe">{JSON.stringify(query)}</pre>
      <pre data-testid="state-probe">{JSON.stringify({ sortKey: state.sortKey, limitKey: state.limitKey, view: state.view })}</pre>
      <div data-testid="active-filter-count">{activeFilters.length}</div>
      <div data-testid="total-results-probe">{totalResults}</div>
      <button type="button" data-testid="run-search" onClick={() => void submitSearch()}>
        Run Search
      </button>
      <button type="button" data-testid="set-crystal-system" onClick={() => void setFilterValue('cubic', 'crystal_system')}>
        Set Crystal System
      </button>
      <button type="button" data-testid="set-page-two" onClick={() => void setPage(2)}>
        Set Page Two
      </button>
      <button type="button" data-testid="set-results-per-page" onClick={() => void setResultsPerPage(30)}>
        Set Results Per Page
      </button>
      <button type="button" data-testid="set-sort-desc" onClick={() => void setSort('material_id', false)}>
        Set Sort Desc
      </button>
    </>
  );
};

describe('SearchUI query utilities', () => {
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
      configurable: true,
      value: () => false,
    });
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
      configurable: true,
      value: () => undefined,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: () => undefined,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('initializes dynamic filter options and preprocesses/serializes query params', () => {
    const initialized = initFilterGroups(filterGroups);
    expect(initialized[0].filters[1].props?.options?.length).toBeGreaterThan(0);

    const defaultQuery = { _sort_fields: ['material_id'] };
    const parsed = parseSearchQuery('?has_props=dos,bandstructure&band_gap_min=1.5', initialized, defaultQuery);
    expect(parsed.has_props).toEqual(['dos', 'bandstructure']);
    expect(parsed.band_gap_min).toBe(1.5);

    const serialized = serializeSearchQuery(
      {
        ...defaultQuery,
        has_props: ['dos', 'bandstructure'],
        crystal_system: 'cubic',
      },
      defaultQuery
    );
    expect(serialized).toContain('has_props=dos%2Cbandstructure');
    expect(serialized).toContain('crystal_system=cubic');

    const processed = preprocessQueryParams(
      {
        crystal_system: 'CUBIC',
        band_gap_min: 0,
        band_gap_max: 4.2,
      },
      initialized.map((group) => ({
        ...group,
        filters: group.filters.map((filter) =>
          filter.name === 'Crystal System' ? { ...filter, makeLowerCase: true } : filter
        ),
      })),
      defaultQuery
    );
    expect(processed.crystal_system).toBe('cubic');
    expect(processed.band_gap_min).toBeUndefined();
    expect(processed.band_gap_max).toBe(4.2);
    expect(processed._sort_fields).toEqual(['material_id']);

    const processedSecondarySort = preprocessQueryParams(
      { _sort_fields: ['band_gap'] },
      initialized,
      { _sort_fields: ['band_gap', 'formula_pretty'] }
    );
    expect(processedSecondarySort._sort_fields).toEqual(['band_gap', 'formula_pretty']);

    const processedDefaultSecondarySort = preprocessQueryParams(
      {},
      initialized,
      { _sort_fields: [null, 'formula_pretty'] }
    );
    expect(processedDefaultSecondarySort._sort_fields).toEqual(['formula_pretty']);
  });

  it('hydrates query from URL and writes updated filters back to the URL', async () => {
    window.history.replaceState({}, '', '/materials?material_ids=mp-149&has_props=dos');

    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ _sort_fields: ['material_id'] }}>
        <QueryProbe />
      </SearchUIContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('material_ids');
      expect(screen.getByTestId('query-probe')).toHaveTextContent('has_props');
      expect(screen.getByTestId('active-filter-count')).toHaveTextContent('2');
    });

    fireEvent.click(screen.getByTestId('set-crystal-system'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('crystal_system');
      expect(window.location.search).toContain('material_ids=mp-149');
      expect(window.location.search).toContain('has_props=dos');
      expect(window.location.search).toContain('crystal_system=cubic');
    });
  });

  it('syncs query from browser navigation events and exposes legacy state shape', async () => {
    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ _sort_fields: ['material_id'] }}>
        <QueryProbe />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('state-probe')).toHaveTextContent('"sortKey":"_sort_fields"');
    expect(screen.getByTestId('state-probe')).toHaveTextContent('"limitKey":"_limit"');

    window.history.pushState({}, '', '/materials?material_ids=mp-13');
    window.dispatchEvent(new PopStateEvent('popstate'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"material_ids":"mp-13"');
      expect(screen.getByTestId('active-filter-count')).toHaveTextContent('1');
    });
  });

  it('restores legacy paging and sorting actions with default query omission semantics', async () => {
    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ _sort_fields: ['material_id'] }} defaultLimit={15}>
        <QueryProbe />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('query-probe')).toHaveTextContent('"_sort_fields":["material_id"]');
    expect(screen.getByTestId('query-probe')).toHaveTextContent('"_limit":15');
    expect(screen.getByTestId('query-probe')).toHaveTextContent('"_skip":0');

    fireEvent.click(screen.getByTestId('set-page-two'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"_skip":15');
      expect(window.location.search).toContain('_skip=15');
    });

    fireEvent.click(screen.getByTestId('set-results-per-page'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"_limit":30');
      expect(screen.getByTestId('query-probe')).not.toHaveTextContent('"_skip":15');
      expect(window.location.search).toContain('_limit=30');
      expect(window.location.search).not.toContain('_skip=15');
    });

    fireEvent.click(screen.getByTestId('set-sort-desc'));

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"-material_id"');
      expect(window.location.search).toContain('_sort_fields=-material_id');
    });
  });

  it('uses legacy request params, fields key, and total key when submitting a search', async () => {
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        data: [{ material_id: 'mp-149' }],
        meta: {
          custom_total: 42,
        },
      }),
    });

    render(
      <SearchUIContainer
        apiEndpoint="https://example.com/materials"
        apiEndpointParams={{ project: 'materials' }}
        searchOnMount={false}
        columns={[
          { title: 'Material ID', selector: 'material_id' },
          { title: 'Formula', selector: 'formula_pretty' },
        ]}
        totalKey="meta.custom_total"
      >
        <QueryProbe />
      </SearchUIContainer>
    );

    fireEvent.click(screen.getByTestId('run-search'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalled();
    });

    const url = String(mockedFetch.mock.calls[0]?.[0] ?? '');
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe('https://example.com/materials');
    expect(parsed.searchParams.get('_limit')).toBe('15');
    expect(parsed.searchParams.get('_skip')).toBe('0');
    expect(parsed.searchParams.get('project')).toBe('materials');
    expect(parsed.searchParams.get('_sort_fields')).toBe('material_id');
    expect(parsed.searchParams.get('_fields')).toBe('material_id,formula_pretty');

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('"_sort_fields"');
      expect(screen.getByTestId('total-results-probe')).toHaveTextContent('42');
    });
  });

  it('does not loop API requests when a text filter value changes', async () => {
    const mockedFetch = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        data: [],
        meta: {
          total_doc: 0,
        },
      }),
    });

    const textFilterGroups: FilterGroup[] = [
      {
        name: 'Identifiers',
        expanded: true,
        filters: [
          {
            name: 'Identifier',
            type: FilterType.TEXT_INPUT,
            params: ['identifier__exact'],
            props: {
              placeholder: 'Identifier',
            },
          },
        ],
      },
    ];

    render(
      <SearchUIContainer
        apiEndpoint="https://example.com/materials"
        searchOnMount={false}
        filterGroups={textFilterGroups}
      >
        <SearchUIFilters />
      </SearchUIContainer>
    );

    fireEvent.change(screen.getByPlaceholderText('Identifier'), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledTimes(1);
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(String(mockedFetch.mock.calls[0]?.[0] ?? '')).toContain('identifier__exact=1');
  });
});
