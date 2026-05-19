import type { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function InputPanel({ title = 'Inputs', children, actions }: Props) {
  return (
    <aside className="card lg:sticky lg:top-24 self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-tight uppercase text-muted">{title}</h2>
        {actions}
      </div>
      <div className="space-y-5">{children}</div>
    </aside>
  );
}
