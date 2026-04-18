import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIFilters } from './SearchUIFilters';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { FilterType, type FilterGroup } from '../types';

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
          errorMessage: 'Please enter a valid material ID.',
        },
      },
      {
        name: 'Crystal System',
        type: FilterType.SELECT,
        params: ['crystal_system'],
        props: {
          options: [
            { label: 'Cubic', value: 'cubic' },
            { label: 'Trigonal', value: 'trigonal' },
          ],
        },
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
    ],
  },
];

const QueryProbe = () => {
  const { query, activeFilters } = useSearchUIContext();
  return (
    <>
      <pre data-testid="search-ui-query">{JSON.stringify(query)}</pre>
      <div data-testid="search-ui-active-filters">{activeFilters.length}</div>
    </>
  );
};

describe('SearchUIFilters', () => {
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
    vi.restoreAllMocks();
  });

  it('updates query values through filters and resets them', async () => {
    const user = userEvent.setup();
    render(
      <SearchUIContainer filterGroups={filterGroups} defaultQuery={{ sort_fields: ['material_id'] }}>
        <SearchUIFilters />
        <QueryProbe />
      </SearchUIContainer>
    );

    fireEvent.change(screen.getByTestId('materials-input-search-input'), {
      target: { value: 'mp-149' },
    });
    await user.click(screen.getAllByRole('combobox')[0]);
    await user.click(await screen.findByText('Cubic'));
    fireEvent.click(screen.getByLabelText('DOS'));

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('material_ids');
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('crystal_system');
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('has_props');
      expect(screen.getByTestId('search-ui-active-filters')).toHaveTextContent('3');
    });

    fireEvent.click(screen.getByTestId('search-ui-reset-button'));

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-query')).toHaveTextContent('sort_fields');
      expect(screen.getByTestId('search-ui-query')).not.toHaveTextContent('material_ids');
      expect(screen.getByTestId('search-ui-active-filters')).toHaveTextContent('0');
    });
  });
});
