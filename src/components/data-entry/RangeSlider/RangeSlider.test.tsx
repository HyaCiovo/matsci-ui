import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
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

  it('renders the initial value and nice ticks', () => {
    render(<RangeSlider domain={[-97, 88]} value={-20} step={1} />);

    expect(screen.getByTestId('range-slider-input')).toHaveValue(-20);
    const tickValues = screen.getAllByTestId('tick-value');
    expect(tickValues[0]).toHaveTextContent('-100');
    expect(tickValues[tickValues.length - 1]).toHaveTextContent('100');
  });

  it('updates from the numeric input and emits change', async () => {
    const onChange = vi.fn();

    render(<RangeSlider domain={[0, 25]} value={5} step={1} debounce={0} onChange={onChange} />);

    fireEvent.change(screen.getByTestId('range-slider-input'), { target: { value: '9' } });

    await waitFor(() => {
      expect(onChange).toHaveBeenLastCalledWith([9]);
    });
  });

  it('formats the input for log scale values', () => {
    render(<RangeSlider domain={[-2, 3]} value={-1} step={0.01} isLogScale />);

    expect(screen.getByTestId('range-slider-input')).toHaveValue(0.1);
  });
});
