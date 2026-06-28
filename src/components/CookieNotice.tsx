import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';

const STORAGE_KEY = 'whatifmoney-cookie-ack';

/**
 * Thin sticky bottom bar shown on first visit. Non-blocking — the user can
 * continue using the site immediately. Dismissal is persisted in localStorage
 * so the bar doesn't reappear on subsequent visits.
 */
export function CookieNotice() {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Storage notice"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="flex-1 text-sm text-ink-dim leading-snug">{t.cookieNotice.body}</p>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/cookies"
            className="text-sm text-emerald hover:text-emerald-light font-semibold"
            onClick={dismiss}
          >
            {t.cookieNotice.learnMore}
          </Link>
          <button type="button" onClick={dismiss} className="btn-primary py-1.5 px-4 text-sm">
            {t.cookieNotice.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
