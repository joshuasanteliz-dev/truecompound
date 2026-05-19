import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function ModeHeader({ eyebrow, title, subtitle, actions }: Props) {
  return (
    <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        {eyebrow && <div className="label mb-1">{eyebrow}</div>}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-muted max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
