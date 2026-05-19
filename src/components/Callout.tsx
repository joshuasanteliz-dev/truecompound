import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Small italic "lesson" callout used on each mode page to explain what's being shown.
 */
export function Callout({ children }: Props) {
  return (
    <p className="mt-4 border-l-2 border-emerald pl-4 italic text-sm text-muted leading-relaxed">{children}</p>
  );
}
