import { fireEvent, render, screen } from '@testing-library/react';
import { Paginator } from './Paginator';

describe('Paginator', () => {
  it('changes page and rows per page through controls', () => {
    const onChangePage = vi.fn();
    const onChangeRowsPerPage = vi.fn();

    render(
      <Paginator
        rowCount={120}
        rowsPerPage={10}
        currentPage={3}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(onChangePage).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByLabelText(/Page 4/i));
    expect(onChangePage).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByRole('button', { name: '30' }));
    expect(onChangeRowsPerPage).toHaveBeenCalledWith(30);
  });
});
