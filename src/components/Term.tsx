import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface Props {
  /** The jargon word/phrase shown inline. */
  children: ReactNode;
  /** Plain-language explanation shown in the popover. */
  explain: ReactNode;
  /** Optional title line on the popover. Defaults to the trigger text. */
  title?: string;
}

/**
 * Inline glossary term. Dotted underline; hover (desktop) or tap (mobile)
 * to open a small popover with a beginner-friendly explanation.
 */
export function Term({ children, explain, title }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popoverId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-describedby={open ? popoverId : undefined}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="term-trigger bg-transparent border-0 p-0"
        style={{ font: 'inherit', color: 'inherit' }}
      >
        {children}
      </button>
      {open && (
        <span
          id={popoverId}
          role="tooltip"
          className="absolute left-1/2 z-30 mt-2 w-[min(20rem,80vw)] -translate-x-1/2 top-full rounded-lg border border-border-strong bg-surface-2 p-3 text-left text-xs leading-relaxed text-ink-dim shadow-card-hover normal-case tracking-normal"
          style={{ fontWeight: 400 }}
        >
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald mb-1">
            {title ?? (typeof children === 'string' ? children : 'Explained')}
          </span>
          <span className="block text-ink-dim">{explain}</span>
        </span>
      )}
    </span>
  );
}
