import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface Props {
  to: string;
  title: string;
  pitch: string;
  preview: ReactNode;
  index: number;
}

export function ModeCard({ to, title, pitch, preview, index }: Props) {
  return (
    <Link
      to={to}
      className="group relative card hover:border-emerald hover:shadow-card-hover transition-all flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="label mb-1.5">0{index + 1} · Mode</div>
          <h3 className="display text-xl text-ink">{title}</h3>
        </div>
        <span
          aria-hidden
          className="text-muted group-hover:text-emerald group-hover:translate-x-0.5 transition-all"
        >
          →
        </span>
      </div>
      <p className="text-sm text-muted leading-relaxed">{pitch}</p>
      <div className="h-24 mt-auto -mx-2 -mb-2 overflow-hidden rounded-lg bg-surface-2 border border-border">{preview}</div>
    </Link>
  );
}
