import { useId } from 'react';
import type { ReactNode } from 'react';

interface Props {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Suffix shown after the number (e.g. "%", " yrs"). */
  suffix?: string;
  /** Prefix shown before the number (e.g. "$"). */
  prefix?: string;
  /** Multiply the slider value by this when rendering (e.g. show 0.07 as "7"). */
  displayMultiplier?: number;
  displayDecimals?: number;
  hint?: ReactNode;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  prefix = '',
  displayMultiplier = 1,
  displayDecimals = 0,
  hint,
}: Props) {
  const id = useId();
  const display = (value * displayMultiplier).toFixed(displayDecimals);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <label htmlFor={id} className="label">
          {label}
        </label>
        <div className="mono text-sm text-ink font-semibold">
          {prefix}
          {display}
          {suffix}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={`${prefix}${display}${suffix}`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      {hint && <p className="mt-1 text-xs text-muted leading-snug">{hint}</p>}
    </div>
  );
}

interface NumberInputProps {
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: ReactNode;
}

export function NumberInput({ label, value, onChange, prefix, suffix, min, max, step, hint }: NumberInputProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`input-number ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-muted leading-snug">{hint}</p>}
    </div>
  );
}
