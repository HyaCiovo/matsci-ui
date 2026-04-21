import { fireEvent, render, screen } from '@testing-library/react';
import { DataBlock } from './DataBlock';
import { ColumnFormat, type Column } from '../SearchUI/types';

const columns: Column[] = [
  {
    title: 'Material ID',
    selector: 'material_id',
    formatType: ColumnFormat.LINK,
    formatOptions: {
      baseUrl: 'https://example.com/materials',
    },
  },
  {
    title: 'Formula',
    selector: 'formula_pretty',
    formatType: ColumnFormat.FORMULA,
  },
  {
    title: 'Description',
    selector: 'description',
    isBottom: true,
  },
];

describe('DataBlock', () => {
  it('renders top-section values and footer content', () => {
    render(
      <DataBlock
        data={{
          material_id: 'mp-149',
          formula_pretty: 'Si',
          description: 'Silicon entry',
        }}
        columns={columns}
        footer={<div>Footer</div>}
      />
    );

    expect(screen.getByText('Material ID')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mp-149' })).toBeInTheDocument();
    expect(screen.getByTestId('formula')).toHaveTextContent('Si');
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('expands and collapses bottom-section values', () => {
    render(
      <DataBlock
        data={{
          material_id: 'mp-149',
          formula_pretty: 'Si',
          description: 'Silicon entry',
        }}
        columns={columns}
      />
    );

    expect(screen.getByText('Silicon entry')).toBeInTheDocument();
    expect(screen.getByTestId('data-block-bottom-section')).toHaveClass('is-collapsed');
    fireEvent.click(screen.getByText('See more'));
    expect(screen.getByText('Silicon entry')).toBeInTheDocument();
    expect(screen.getByTestId('data-block-bottom-section')).toHaveClass('is-expanded');
    fireEvent.click(screen.getByText('See less'));
    expect(screen.getByText('Silicon entry')).toBeInTheDocument();
    expect(screen.getByTestId('data-block-bottom-section')).toHaveClass('is-collapsed');
  });

  it('supports old array download link options in datablock arrays', () => {
    render(
      <DataBlock
        data={{
          tables: ['AA'],
          tablesLinks: ['https://example.com/file.csv'],
        }}
        columns={[
          {
            title: 'Tables',
            selector: 'tables',
            formatType: ColumnFormat.ARRAY,
            formatOptions: {
              arrayLinksKey: 'tablesLinks',
              arrayLinksShowDownload: true,
            },
          },
        ]}
      />
    );

    expect(screen.getByRole('link', { name: /AA/i })).toBeInTheDocument();
  });
});
