import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * "In plain English" panel — renders below the hero numbers and translates
 * the raw output into a beginner-friendly sentence using the user's actual
 * scenario values. Distinct from <Callout>, which explains the concept.
 */
export function PlainEnglish({ children }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-emerald/40 bg-emerald/[0.06] p-4">
      <div className="flex items-start gap-3">
        <svg
          aria-hidden
          className="mt-0.5 shrink-0 text-emerald"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="label text-emerald mb-1.5">In plain English</div>
          <div className="text-sm text-ink leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
