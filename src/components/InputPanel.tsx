import type { ReactNode } from 'react';
import { useT } from '@/i18n';

interface Props {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function InputPanel({ title, children, actions }: Props) {
  const t = useT();
  const heading = title ?? t.inputs.inputsLabel;
  return (
    <aside className="card lg:sticky lg:top-24 self-start">
      <div className="flex items-center justify-between mb-4">
        <h2 className="label text-emerald">{heading}</h2>
        {actions}
      </div>
      <div className="space-y-5">{children}</div>
    </aside>
  );
}
