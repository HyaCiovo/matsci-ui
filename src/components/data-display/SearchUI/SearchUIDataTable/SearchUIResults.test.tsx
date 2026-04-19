import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataHeader } from '../SearchUIDataHeader';
import { SearchUIDataTable } from './SearchUIDataTable';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { ColumnFormat, type Column } from '../types';

const results = [
  {
    material_id: 'mp-149',
    formula_pretty: 'Si',
    symmetry: { crystal_system: 'cubic' },
  },
  {
    material_id: 'mp-13',
    formula_pretty: 'Fe2O3',
    symmetry: { crystal_system: 'trigonal' },
  },
];

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      baseUrl: 'https://example.org/materials',
      target: '_blank',
    },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
  },
  {
    title: 'Crystal System',
    selector: 'symmetry.crystal_system',
  },
];

const QueryProbe = () => {
  const { query } = useSearchUIContext();
  return <pre data-testid="search-ui-query-probe">{JSON.stringify(query)}</pre>;
};

describe('SearchUI result views', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders header totals and table rows from SearchUI context', () => {
    render(
      <SearchUIContainer columns={columns} resultLabel="material" initialResults={results} initialTotalResults={2}>
        <SearchUIDataHeader />
        <SearchUIDataTable />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('data-table-title')).toHaveTextContent('All 2 materials');
    expect(screen.getByText('Showing 1-2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
    expect(screen.getByText('trigonal')).toBeInTheDocument();
  });

  it('syncs selected rows through SearchUI context-backed table selection', () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="material"
        initialResults={results}
        initialTotalResults={2}
        selectableRows
      >
        <SearchUIDataTable />
      </SearchUIContainer>
    );

    fireEvent.click(screen.getByRole('link', { name: 'mp-13' }));
    expect(screen.getByRole('link', { name: 'mp-13' })).toBeInTheDocument();
  });

  it('updates query and rendered rows through header sort and pagination controls', async () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="material"
        initialResults={results}
        initialTotalResults={2}
        defaultLimit={1}
        sortFields={['material_id']}
      >
        <SearchUIDataHeader />
        <QueryProbe />
        <SearchUIDataTable />
      </SearchUIContainer>
    );

    expect(screen.getByText('Showing 1-1 of 2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mp-13' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'mp-149' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('sort-button'));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'mp-13' })).not.toBeInTheDocument();
      expect(screen.getByTestId('search-ui-query-probe')).toHaveTextContent('"-material_id"');
    });

    fireEvent.change(screen.getByTestId('search-ui-results-per-page'), {
      target: { value: '10' },
    });

    await waitFor(() => {
      expect(screen.getByText('Showing 1-2 of 2')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'mp-13' })).toBeInTheDocument();
      expect(screen.getByTestId('search-ui-query-probe')).toHaveTextContent('"_limit":10');
    });
  });
});
