import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DualRangeSlider } from './DualRangeSlider';

describe('DualRangeSlider', () => {
  beforeAll(() => {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('updates min and max values through inputs', async () => {
    const onChange = vi.fn();

    render(<DualRangeSlider domain={[0, 10]} step={0.5} valueMin={2} valueMax={8} onChange={onChange} />);

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });
    fireEvent.change(inputs[1], { target: { value: '7' } });

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith(3, 7);
    });
  });
});
