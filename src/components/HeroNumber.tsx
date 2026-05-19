import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  tone?: 'default' | 'positive' | 'negative' | 'muted';
}

export function HeroNumber({ label, value, sublabel, tone = 'default' }: Props) {
  const valueClass =
    tone === 'positive'
      ? 'text-emerald'
      : tone === 'negative'
        ? 'text-loss'
        : tone === 'muted'
          ? 'text-muted'
          : 'text-ink';

  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className={`mono mt-1 text-3xl sm:text-4xl font-semibold tracking-tight ${valueClass}`}>{value}</div>
      {sublabel && <div className="mt-1 text-sm text-muted">{sublabel}</div>}
    </div>
  );
}
