import { render, screen } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIGrid } from './SearchUIGrid';
import { ColumnFormat, type Column } from '../types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: '/materials' },
  },
];

describe('SearchUIGrid', () => {
  it('renders the header and data view together', () => {
    render(
      <SearchUIContainer
        columns={columns}
        resultLabel="material"
        initialResults={[{ material_id: 'mp-149' }]}
        initialTotalResults={1}
      >
        <SearchUIGrid />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('data-table-title')).toHaveTextContent('All 1 material');
    expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
  });

  it('renders optional filters content when provided', () => {
    render(
      <SearchUIContainer columns={columns} resultLabel="material">
        <SearchUIGrid filtersContent={<div data-testid="filters-slot">Filters</div>} />
      </SearchUIContainer>
    );

    expect(screen.getByTestId('filters-slot')).toBeInTheDocument();
  });
});
