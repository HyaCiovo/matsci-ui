import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from './SearchUIContainer';
import { SearchUIFilters } from './SearchUIFilters';
import { useSearchUIContext } from './SearchUIContextProvider';
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
  const { query, activeFilters, setFilterValue } = useSearchUIContext();
  return (
    <>
      <pre data-testid="query-probe">{JSON.stringify(query)}</pre>
      <div data-testid="active-filter-count">{activeFilters.length}</div>
      <button type="button" data-testid="set-crystal-system" onClick={() => void setFilterValue('cubic', 'crystal_system')}>
        Set Crystal System
      </button>
    </>
  );
};

describe('SearchUI query utilities', () => {
  beforeAll(() => {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
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

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/');
  });

  it('initializes dynamic filter options and preprocesses/serializes query params', () => {
    const initialized = initFilterGroups(filterGroups);
    expect(initialized[0].filters[1].props?.options?.length).toBeGreaterThan(0);

    const defaultQuery = { sort_fields: ['material_id'] };
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
    expect(processed.sort_fields).toEqual(['material_id']);
  });

  it('hydrates query from URL and writes updated filters back to the URL', async () => {
    window.history.replaceState({}, '', '/materials?material_ids=mp-149&has_props=dos');

    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ sort_fields: ['material_id'] }}>
        <QueryProbe />
      </SearchUIContainer>
    );

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('material_ids');
      expect(screen.getByTestId('query-probe')).toHaveTextContent('has_props');
      expect(screen.getByTestId('active-filter-count')).toHaveTextContent('2');
    });

    screen.getByTestId('set-crystal-system').click();

    await waitFor(() => {
      expect(screen.getByTestId('query-probe')).toHaveTextContent('crystal_system');
      expect(window.location.search).toContain('material_ids=mp-149');
      expect(window.location.search).toContain('has_props=dos');
      expect(window.location.search).toContain('crystal_system=cubic');
    });
  });
});
