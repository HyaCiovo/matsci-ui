import { render, screen } from '@testing-library/react';
import { SearchUIContainer } from '../SearchUIContainer';
import { SearchUIDataView } from './SearchUIDataView';
import { ColumnFormat, type Column } from '../types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: '/materials' },
  },
];

describe('SearchUIDataView', () => {
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
});
