import type { ReactNode } from 'react';

interface Props {
  /** Trigger label, e.g. "How this mode works". */
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Collapsible "desplegable" disclosure used under each ModeHeader to host a
 * fuller, beginner-friendly explanation of the mode. Uses native <details>
 * so it works without JS and is keyboard-accessible by default.
 */
export function ModeExplainer({ summary = 'How this mode works — full explanation', children, defaultOpen = false }: Props) {
  return (
    <details className="mode-explainer mb-8" open={defaultOpen}>
      <summary>
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-emerald">↳</span>
          {summary}
        </span>
        <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="px-4 pb-4 pt-1 text-sm text-ink-dim leading-relaxed space-y-3 border-t border-border">
        {children}
      </div>
    </details>
  );
}
