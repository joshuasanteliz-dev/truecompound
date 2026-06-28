import type { ReactNode } from 'react';

export interface PresetChip<T> {
  /** Short label shown on the chip — keep under ~18 chars. */
  label: string;
  /** One-line teaser, shown as title tooltip + below the chips. */
  blurb: string;
  /** Optional emoji prefix for visual recognition. */
  icon?: string;
  /** Partial scenario state to apply when the chip is clicked. */
  values: Partial<T>;
}

interface Props<T> {
  presets: PresetChip<T>[];
  onApply: (values: Partial<T>) => void;
  /** Currently selected preset id, if known — highlights the matching chip. */
  activeLabel?: string;
  title?: ReactNode;
}

/**
 * Horizontal row of "scenario preset" chips for newcomers — one click loads a
 * complete worked example into the input panel so users can see what the
 * calculator does without having to know what to type.
 */
export function ScenarioPresets<T>({ presets, onApply, activeLabel, title = 'Try a scenario' }: Props<T>) {
  return (
    <div className="mb-6">
      <div className="label text-emerald mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const isActive = activeLabel === p.label;
          return (
            <button
              key={p.label}
              type="button"
              title={p.blurb}
              onClick={() => onApply(p.values)}
              className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'border-emerald bg-emerald/15 text-emerald'
                  : 'border-border bg-surface text-ink-dim hover:border-emerald hover:text-ink'
              }`}
            >
              {p.icon && <span aria-hidden>{p.icon}</span>}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
