import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function ModeHeader({ eyebrow, title, subtitle, actions }: Props) {
  return (
    <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="label mb-1.5 text-emerald">{eyebrow}</div>}
        <h1 className="display-tight text-3xl sm:text-4xl lg:text-5xl text-ink">{title}</h1>
        {subtitle && <p className="mt-3 text-muted max-w-xl leading-relaxed">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
