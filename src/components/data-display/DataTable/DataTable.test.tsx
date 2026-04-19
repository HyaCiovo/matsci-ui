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

    fireEvent.click(screen.getByRole('link', { name: 'mp-2' }));
    expect(setProps).toHaveBeenLastCalledWith({
      data: records,
      selectedRows: [records[1]],
    });
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
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText(/Page 2 of 2/)).toBeInTheDocument();
  });
});
