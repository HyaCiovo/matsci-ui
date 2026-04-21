import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataHeader } from '../SearchUIDataHeader';
import { SearchUIDataTable } from './SearchUIDataTable';
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
    expect(screen.getByText('Showing 1-2')).toBeInTheDocument();
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

  it('lets users toggle visible columns from the legacy header menu', () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="material"
        initialResults={results}
        initialTotalResults={2}
      >
        <SearchUIDataHeader />
        <SearchUIDataTable />
      </SearchUIContainer>
    );

    expect(screen.getByRole('columnheader', { name: 'Crystal System' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    fireEvent.click(screen.getByLabelText('Crystal System'));

    expect(screen.queryByRole('columnheader', { name: 'Crystal System' })).not.toBeInTheDocument();
  });
});
