import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '@/i18n';

interface Props {
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: ReactNode }[];
}

/**
 * Shared layout for the four legal pages (Privacy / Terms / Cookies / Imprint).
 * Content comes from the i18n dictionary so each page is fully bilingual.
 */
export function LegalPage({ title, lastUpdated, sections }: Props) {
  const t = useT();
  return (
    <article className="max-w-3xl py-8">
      <div className="label mb-2 text-emerald">{t.nav.legal} · {title}</div>
      <h1 className="display-tight text-4xl sm:text-5xl text-ink">{title}</h1>
      <p className="mt-3 text-xs text-muted">{lastUpdated}</p>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="display text-xl sm:text-2xl text-ink mb-3">{s.heading}</h2>
            <div className="text-muted leading-relaxed text-sm space-y-3">{s.body}</div>
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        <Link to="/privacy" className="hover:text-ink">{t.nav.privacy}</Link>
        <Link to="/terms" className="hover:text-ink">{t.nav.terms}</Link>
        <Link to="/cookies" className="hover:text-ink">{t.nav.cookies}</Link>
        <Link to="/legal" className="hover:text-ink">{t.nav.legal}</Link>
        <Link to="/" className="hover:text-ink ml-auto">{t.common.backHome} →</Link>
      </div>
    </article>
  );
}
