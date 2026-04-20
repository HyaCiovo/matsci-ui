import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from '../../../utils/hooks';
import './DualRangeSlider.css';

export interface DualRangeSliderProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  domain: number[];
  value?: number[];
  valueMin?: number | null;
  valueMax?: number | null;
  step: number;
  debounce?: number;
  onChange?: (min: number, max: number) => void;
  onPropsChange?: (props: any) => void;
  styleInput?: React.CSSProperties;
  styleSlider?: React.CSSProperties;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const DualRangeSlider = ({
  domain,
  value,
  valueMin,
  valueMax,
  step,
  debounce = 300,
  onChange,
  onPropsChange,
  setProps,
  className,
  styleInput,
  styleSlider,
}: DualRangeSliderProps) => {
  const minDomain = domain[0];
  const maxDomain = domain[1];
  const initialValues = value ?? [valueMin ?? minDomain, valueMax ?? maxDomain];
  const [values, setValues] = useState<[number, number]>([
    clamp(initialValues[0] ?? minDomain, minDomain, maxDomain),
    clamp(initialValues[1] ?? maxDomain, minDomain, maxDomain),
  ]);
  const debouncedValues = useDebounce(values, debounce);

  useEffect(() => {
    onPropsChange?.({ domain, step });
  }, [domain, onPropsChange, step]);

  useEffect(() => {
    const next = value ?? [valueMin ?? minDomain, valueMax ?? maxDomain];
    setValues([
      clamp(next[0] ?? minDomain, minDomain, maxDomain),
      clamp(next[1] ?? maxDomain, minDomain, maxDomain),
    ]);
  }, [maxDomain, minDomain, value, valueMax, valueMin]);

  const setPropsRef = useRef(setProps);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    setPropsRef.current = setProps;
    onChangeRef.current = onChange;
  }, [setProps, onChange]);

  useEffect(() => {
    setPropsRef.current?.({ value: debouncedValues, valueMin: debouncedValues[0], valueMax: debouncedValues[1] });
    onChangeRef.current?.(debouncedValues[0], debouncedValues[1]);
  }, [debouncedValues]);

  const updateValue = (index: 0 | 1, nextRawValue: string) => {
    if (nextRawValue === '') {
      return;
    }
    const numericValue = clamp(Number(nextRawValue), minDomain, maxDomain);
    setValues((current) => {
      const nextValues: [number, number] = [...current] as [number, number];
      nextValues[index] = numericValue;
      if (nextValues[0] > nextValues[1]) {
        nextValues[index === 0 ? 1 : 0] = numericValue;
      }
      return nextValues;
    });
  };

  return (
    <div className={clsx('mpc-dual-range-slider', className)}>
      <div className="field has-addons mb-4">
        <div className="control is-expanded">
          <input
            className="input"
            type="number"
            value={values[0]}
            min={minDomain}
            max={maxDomain}
            step={step}
            style={styleInput}
            onChange={(event) => updateValue(0, event.target.value)}
          />
        </div>
        <div className="control is-expanded">
          <input
            className="input"
            type="number"
            value={values[1]}
            min={minDomain}
            max={maxDomain}
            step={step}
            style={styleInput}
            onChange={(event) => updateValue(1, event.target.value)}
          />
        </div>
      </div>

      <Slider.Root
        className="mpc-slider-root"
        min={minDomain}
        max={maxDomain}
        step={step}
        value={values}
        minStepsBetweenThumbs={0}
        onValueChange={(next) => setValues([next[0], next[1]])}
        style={styleSlider}
      >
        <Slider.Track className="mpc-slider-track">
          <Slider.Range className="mpc-slider-range" />
        </Slider.Track>
        <Slider.Thumb className="mpc-slider-thumb" />
        <Slider.Thumb className="mpc-slider-thumb" />
      </Slider.Root>
    </div>
  );
};
