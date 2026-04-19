import * as Slider from '@radix-ui/react-slider';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '../../../utils/hooks';
import './RangeSlider.css';

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const countDecimals = (value: number) => {
  const text = value.toString();
  if (text.includes('e-')) {
    const [, trail] = text.split('e-');
    return Number(trail);
  }
  if (Math.floor(value) !== value) {
    return text.split('.')[1]?.length ?? 0;
  }
  return 0;
};

const formatPow10 = (value: number) => {
  if (value < 0) {
    return Math.pow(10, value).toFixed(Math.ceil(Math.abs(value)));
  }
  return Math.pow(10, value).toFixed();
};

const getDisplayValue = (rawValue: number, isLogScale: boolean) =>
  isLogScale ? formatPow10(rawValue) : rawValue.toString();

const getInputToSliderValue = (inputValue: string, domain: number[], isLogScale: boolean) => {
  const numericValue = Number(inputValue);
  if (Number.isNaN(numericValue)) {
    return domain[0];
  }

  if (isLogScale) {
    return clamp(Math.log10(numericValue), domain[0], domain[1]);
  }

  return clamp(numericValue, domain[0], domain[1]);
};

const getNiceDomain = (domain: number[], isLogScale: boolean) => {
  if (isLogScale) {
    return domain;
  }

  const span = domain[1] - domain[0];
  if (span <= 0) {
    return domain;
  }

  const magnitude = Math.pow(10, Math.floor(Math.log10(span)));
  const niceMin = Math.floor(domain[0] / magnitude) * magnitude;
  const niceMax = Math.ceil(domain[1] / magnitude) * magnitude;
  return [niceMin, niceMax];
};

const getTickMarks = (ticks: number | null, domain: number[], isLogScale: boolean) => {
  if (ticks === null) {
    return null;
  }
  if (ticks === 2) {
    return domain;
  }

  const sourceDomain = getNiceDomain(domain, isLogScale);
  const step = (sourceDomain[1] - sourceDomain[0]) / Math.max(1, ticks - 1);
  return Array.from({ length: ticks }, (_, index) => Number((sourceDomain[0] + step * index).toFixed(12)));
};

export interface RangeSliderProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  domain: number[];
  value?: number | string;
  step?: number;
  isLogScale?: boolean;
  debounce?: number;
  ticks?: number | null;
  inclusiveTickBounds?: boolean;
  onChange?: (values: number[]) => void;
  styleInput?: React.CSSProperties;
  styleSlider?: React.CSSProperties;
}

export const RangeSlider = ({
  id,
  setProps,
  className,
  domain,
  value = domain[0],
  step = 1,
  isLogScale = false,
  debounce = isLogScale ? 1000 : 500,
  ticks = 5,
  inclusiveTickBounds = false,
  onChange,
  styleInput,
  styleSlider,
}: RangeSliderProps) => {
  const decimals = countDecimals(step);
  const initialSliderValue = clamp(Number(value), domain[0], domain[1]);
  const [sliderValue, setSliderValue] = useState(initialSliderValue);
  const [inputValue, setInputValue] = useState(getDisplayValue(initialSliderValue, isLogScale));
  const debouncedInputValue = useDebounce(inputValue, debounce);
  const tickMarks = useMemo(() => getTickMarks(ticks, domain, isLogScale), [domain, isLogScale, ticks]);

  const emitChange = (nextSliderValue: number) => {
    const rounded = Number(nextSliderValue.toFixed(decimals));
    setProps?.({ value: rounded });
    onChange?.([rounded]);
  };

  useEffect(() => {
    const nextSliderValue = clamp(Number(value), domain[0], domain[1]);
    setSliderValue(nextSliderValue);
    setInputValue(getDisplayValue(nextSliderValue, isLogScale));
  }, [domain, isLogScale, value]);

  useEffect(() => {
    const nextSliderValue = getInputToSliderValue(debouncedInputValue, domain, isLogScale);
    if (Number.isNaN(nextSliderValue)) {
      return;
    }

    setSliderValue(nextSliderValue);
    setInputValue(getDisplayValue(nextSliderValue, isLogScale));
    emitChange(nextSliderValue);
  }, [debouncedInputValue]);

  return (
    <div id={id} className={classNames('mpc-range-slider', className, { 'no-ticks': !tickMarks })}>
      <input
        data-testid="range-slider-input"
        className="input is-small"
        style={styleInput}
        type="number"
        value={inputValue}
        min={isLogScale ? Math.pow(10, domain[0]) : domain[0]}
        max={isLogScale ? Math.pow(10, domain[1]) : domain[1]}
        step={isLogScale ? undefined : step}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <div className="slider" style={styleSlider}>
        <Slider.Root
          className="mpc-slider-root"
          min={domain[0]}
          max={domain[1]}
          step={step}
          value={[sliderValue]}
          onValueChange={(next) => {
            setSliderValue(next[0]);
            setInputValue(getDisplayValue(next[0], isLogScale));
          }}
          onValueCommit={(next) => emitChange(next[0])}
        >
          <Slider.Track className="mpc-slider-track">
            <Slider.Range className="mpc-slider-range" />
            {tickMarks?.map((tick, index) => {
              const offset = ((tick - domain[0]) / (domain[1] - domain[0])) * 100;
              const tickLabel = isLogScale ? formatPow10(tick) : tick.toString();

              return (
                <div key={`tick-${tick}-${index}`} style={{ left: `${offset}%` }}>
                  <div className="slider-tick-mark" />
                  <span data-testid="tick-value" className="slider-tick-value">
                    {tickLabel}
                    {inclusiveTickBounds && index === tickMarks.length - 1 ? '+' : ''}
                  </span>
                </div>
              );
            })}
          </Slider.Track>
          <Slider.Thumb data-testid="slider-button" className="mpc-slider-thumb" />
        </Slider.Root>
      </div>
    </div>
  );
};
