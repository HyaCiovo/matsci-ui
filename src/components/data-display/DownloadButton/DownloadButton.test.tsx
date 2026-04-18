import { fireEvent, render, screen } from '@testing-library/react';
import * as downloadUtils from '../../../utils/download';
import { DownloadButton } from './DownloadButton';

describe('DownloadButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children and passes props through', () => {
    render(
      <DownloadButton id="download-id" className="extra" data={{ a: 1 }}>
        Export Data
      </DownloadButton>
    );

    const button = screen.getByRole('button', { name: 'Export Data' });
    expect(button).toHaveAttribute('id', 'download-id');
    expect(button).toHaveClass('mpc-download-button', 'extra');
  });

  it('downloads json by default', () => {
    const spy = vi.spyOn(downloadUtils.downloadAs, 'json').mockReturnValue(true);
    render(<DownloadButton data={{ answer: 42 }}>Export</DownloadButton>);

    fireEvent.click(screen.getByRole('button', { name: 'Export' }));
    expect(spy).toHaveBeenCalledWith({ answer: 42 }, 'export');
  });

  it('supports csv downloads with custom filenames', () => {
    const spy = vi.spyOn(downloadUtils.downloadAs, 'csv').mockReturnValue(true);
    render(
      <DownloadButton data={[{ a: 1 }]} filetype="csv" filename="rows">
        CSV
      </DownloadButton>
    );

    fireEvent.click(screen.getByRole('button', { name: 'CSV' }));
    expect(spy).toHaveBeenCalledWith([{ a: 1 }], 'rows');
  });
});
