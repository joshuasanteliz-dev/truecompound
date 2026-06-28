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
      ? 'text-gain'
      : tone === 'negative'
        ? 'text-loss'
        : tone === 'muted'
          ? 'text-muted'
          : 'text-ink';

  const accentBar =
    tone === 'positive'
      ? 'bg-gain'
      : tone === 'negative'
        ? 'bg-loss'
        : 'bg-border-strong';

  return (
    <div className="hero-number relative card overflow-hidden">
      <span aria-hidden className={`absolute left-0 top-0 h-full w-[3px] ${accentBar}`} />
      <div className="label">{label}</div>
      <div className={`hero-number__value mono mt-1.5 display tnum ${valueClass}`}>{value}</div>
      {sublabel && <div className="mt-1.5 text-xs text-muted leading-snug">{sublabel}</div>}
    </div>
  );
}
