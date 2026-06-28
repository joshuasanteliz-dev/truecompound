import type { ReactNode } from 'react';

interface Props {
  /** When false, nothing renders — lets callers compute the condition inline. */
  when: boolean;
  /** Severity: 'warning' is amber, 'danger' is red. Defaults to 'warning'. */
  tone?: 'warning' | 'danger';
  title: string;
  children: ReactNode;
}

/**
 * Eye-catching banner shown above a chart when the user's inputs produce a
 * mathematically-correct-but-misleading result (e.g. withdrawal rate so high
 * the portfolio runs out in a few months).
 */
export function SanityWarning({ when, tone = 'warning', title, children }: Props) {
  if (!when) return null;

  const styles =
    tone === 'danger'
      ? 'border-loss/60 bg-loss/10 text-ink'
      : 'border-amber-500/60 bg-amber-500/10 text-ink';

  const iconColor = tone === 'danger' ? 'text-loss' : 'text-amber-400';

  return (
    <div className={`mb-6 flex gap-3 items-start rounded-xl border p-4 ${styles}`} role="alert">
      <svg
        aria-hidden
        className={`mt-0.5 shrink-0 ${iconColor}`}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1">{title}</div>
        <div className="text-sm text-ink-dim leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
