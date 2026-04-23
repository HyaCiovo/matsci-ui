import { fireEvent, render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';
import { ColumnFormat, type Column } from '../SearchUI/types';

const records = [
  {
    material_id: 'mp-1',
    formula_pretty: 'Li4Ti5O12',
    density: 2.34,
    symmetry: { crystal_system: 'cubic' },
    is_stable: true,
  },
  {
    material_id: 'mp-2',
    formula_pretty: 'Fe2O3',
    density: 4.56,
    symmetry: { crystal_system: 'tetragonal' },
    is_stable: false,
  },
];

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: { baseUrl: 'https://example.org/materials', target: '_blank' },
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
  {
    title: 'Density',
    selector: 'density',
    formatType: ColumnFormat.FIXED_DECIMAL,
    formatOptions: { decimals: 2 },
  },
];

describe('DataTable', () => {
  it('renders nested selector values and formatted cells', () => {
    render(<DataTable data={records} columns={columns} />);

    expect(screen.getByRole('link', { name: 'mp-1' })).toHaveAttribute(
      'href',
      'https://example.org/materials/mp-1'
    );
    expect(screen.getByText('cubic')).toBeInTheDocument();
    expect(screen.getByText('2.34')).toBeInTheDocument();
  });

  it('reports selected rows through setProps', () => {
    const setProps = vi.fn();
    render(<DataTable data={records} columns={columns} selectableRows setProps={setProps} />);

    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: /Select row/i })).toHaveLength(2);

    fireEvent.click(screen.getByRole('link', { name: 'mp-2' }));
    expect(setProps).toHaveBeenLastCalledWith({
      data: records,
      selectedRows: [records[1]],
    });
  });

  it('renders centered radio controls for single selectable rows', () => {
    render(<DataTable data={records} columns={columns} selectableRows singleSelectableRows />);

    expect(screen.getAllByRole('radio', { name: /Select row/i })).toHaveLength(2);
  });

  it('sorts rows by column value when a sortable header is clicked', () => {
    render(<DataTable data={records} columns={columns} />);

    const densityHeader = screen.getByText('Density');
    const initialLinks = screen.getAllByRole('link');
    expect(initialLinks[0]).toHaveTextContent('mp-1');

    fireEvent.click(densityHeader);
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('mp-2');

    fireEvent.click(densityHeader);
    expect(screen.getAllByRole('link')[0]).toHaveTextContent('mp-1');
  });

  it('supports custom renderers and column width styling', () => {
    render(
      <DataTable
        data={records}
        columns={[
          {
            title: 'Custom',
            selector: 'material_id',
            width: '160px',
            render: (row) => <span>custom-{row.material_id}</span>,
          },
        ]}
      />
    );

    expect(screen.getByText('custom-mp-1')).toBeInTheDocument();
    const header = screen.getByRole('columnheader');
    expect(header).toHaveStyle({ width: '160px' });
  });

  it('supports fixed columns and left-positioned sort icons', () => {
    render(
      <DataTable
        data={records}
        columns={[
          {
            title: 'Material ID',
            selector: 'material_id',
            fixed: 'left',
            sortIconPosition: 'left',
          },
          columns[1],
        ]}
      />
    );

    const header = screen.getByText('Material ID').closest('th');
    expect(header).toHaveClass('ms-is-fixed-left');
    expect(header?.querySelector('.ms-column-header-content')).toHaveClass('ms-is-sort-icon-left');
  });

  it('supports pagination and header rendering', () => {
    const longRecords = Array.from({ length: 12 }, (_, index) => ({
      material_id: `mp-${index}`,
      formula_pretty: `Li${index}O`,
      density: index + 0.1,
      symmetry: { crystal_system: 'cubic' },
      is_stable: index % 2 === 0,
    }));

    render(
      <DataTable
        data={longRecords}
        columns={columns}
        hasHeader
        resultLabel="material"
        pagination
      />
    );

    expect(screen.getByText('12 materials')).toBeInTheDocument();
    expect(screen.getByText('1-10 of 12')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('11-12 of 12')).toBeInTheDocument();
  });

  it('uses the expanded paginator when requested', () => {
    const longRecords = Array.from({ length: 12 }, (_, index) => ({
      material_id: `mp-${index}`,
      formula_pretty: `Li${index}O`,
      density: index + 0.1,
      symmetry: { crystal_system: 'cubic' },
      is_stable: index % 2 === 0,
    }));

    render(
      <DataTable
        data={longRecords}
        columns={columns}
        pagination
        paginationIsExpanded
      />
    );

    expect(screen.getByTestId('ms-paginator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Jump to/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /10 \/ page/i })).toBeInTheDocument();
  });

  it('closes the columns menu when clicking outside', () => {
    render(
      <DataTable
        data={records}
        columns={columns}
        hasHeader
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Columns/i }));
    expect(screen.getByText('Select all')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Select all')).not.toBeInTheDocument();
  });
});
