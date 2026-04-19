import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Download } from './Download';

describe('Download', () => {
  it('creates a downloadable object url when data is provided', () => {
    const createObjectURL = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    render(
      <Download
        id="download"
        data={{
          filename: 'test.txt',
          content: 'hello world',
          mimeType: 'text/plain',
        }}
      />
    );

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
    clickSpy.mockRestore();
  });
});
