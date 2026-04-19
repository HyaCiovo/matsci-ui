import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { useSearchUIContext } from '../SearchUIContextProvider';
import { SearchUIDataHeader } from '../SearchUIDataHeader';
import { SearchUIDataView } from './SearchUIDataView';
import { ColumnFormat, SearchUIViewType, type Column } from '../types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: '/materials' },
  },
];

describe('SearchUIDataView', () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/');
  });

  const QueryProbe = () => {
    const { query } = useSearchUIContext();
    return <pre data-testid="search-ui-data-view-query">{JSON.stringify(query)}</pre>;
  };

  it('renders an empty state when there are no results', () => {
    render(
      <SearchUIContainer columns={columns} resultLabel="material" initialResults={[]} initialTotalResults={0}>
        <SearchUIDataView />
      </SearchUIContainer>
    );

    expect(screen.getByText('No records match your search criteria')).toBeInTheDocument();
  });

  it('renders the table view when results exist', () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="material"
        initialResults={[{ material_id: 'mp-149' }]}
        initialTotalResults={1}
      >
        <SearchUIDataView />
      </SearchUIContainer>
    );

    expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
  });

  it('renders the synthesis view and uses paging actions', async () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="recipe"
        view={SearchUIViewType.SYNTHESIS}
        initialResults={[
          { material_id: 'mp-149', formula_pretty: 'Si', doi: '10.1000/example-1' },
          { material_id: 'mp-13', formula_pretty: 'Fe2O3', doi: '10.1000/example-2' },
        ]}
        initialTotalResults={20}
        defaultLimit={10}
      >
        <QueryProbe />
        <SearchUIDataView />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('mpc-synthesis-recipe-cards')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('10.1000/example-1')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByTestId('search-ui-data-view-query')).toHaveTextContent('"_skip":10');
    });
  });

  it('switches between table and synthesis views from the header', async () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="recipe"
        initialResults={[
          { material_id: 'mp-149', formula_pretty: 'Si', doi: '10.1000/example-1' },
          { material_id: 'mp-13', formula_pretty: 'Fe2O3', doi: '10.1000/example-2' },
        ]}
        initialTotalResults={2}
      >
        <SearchUIDataHeader />
        <SearchUIDataView />
      </SearchUIContainer>
    );

    expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
    expect(screen.getByTestId('search-ui-view-table')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByTestId('search-ui-view-synthesis'));

    await waitFor(() => {
      expect(screen.getByTestId('mpc-synthesis-recipe-cards')).toBeInTheDocument();
      expect(screen.getByTestId('search-ui-view-synthesis')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.queryByText('Columns')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('search-ui-view-table'));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
      expect(screen.getByTestId('search-ui-view-table')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText('Columns')).toBeInTheDocument();
    });
  });
});
