import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadDropdown } from './DownloadDropdown';
import * as downloadUtils from '../../../utils/download';

describe('DownloadDropdown', () => {
  it('downloads selected format', async () => {
    const user = userEvent.setup();
    const jsonSpy = vi.spyOn(downloadUtils.downloadAs, 'json').mockReturnValue(true);

    render(
      <DownloadDropdown data={{ a: 1 }} filename="example">
        Export
      </DownloadDropdown>
    );

    await user.click(screen.getByRole('button', { name: /Export/i }));
    await user.click(await screen.findByText('JSON'));

    expect(jsonSpy).toHaveBeenCalledWith({ a: 1 }, 'example');
  });
});
