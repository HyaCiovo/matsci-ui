import { fireEvent, render, screen } from '@testing-library/react';
import { DownloadDropdown } from './DownloadDropdown';
import * as downloadUtils from '../../../utils/download';

describe('DownloadDropdown', () => {
  it('downloads selected format', () => {
    const jsonSpy = vi.spyOn(downloadUtils.downloadAs, 'json').mockReturnValue(true);

    render(
      <DownloadDropdown data={{ a: 1 }} filename="example">
        Export
      </DownloadDropdown>
    );

    fireEvent.click(screen.getByRole('button', { name: /Export/i }));
    fireEvent.click(screen.getByRole('button', { name: 'JSON' }));

    expect(jsonSpy).toHaveBeenCalledWith({ a: 1 }, 'example');
  });
});
