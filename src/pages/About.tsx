import { Link } from 'react-router-dom';
import { useT } from '@/i18n';

export default function About() {
  const t = useT();
  return (
    <article className="max-w-2xl py-8">
      <div className="label mb-2 text-emerald">{t.about.eyebrow}</div>
      <h1 className="display-tight text-4xl sm:text-5xl text-ink">{t.about.title}</h1>

      <p className="mt-6 text-lg text-ink-dim leading-relaxed">{t.about.intro}</p>

      <p className="mt-4 text-muted leading-relaxed">{t.about.listIntro}</p>

      <ul className="mt-4 space-y-2 text-muted">
        <li>{t.about.bullets.inflation}</li>
        <li>{t.about.bullets.dca}</li>
        <li>{t.about.bullets.debt}</li>
        <li>{t.about.bullets.tax}</li>
        <li>{t.about.bullets.monteCarlo}</li>
      </ul>

      <h2 className="mt-10 display text-2xl sm:text-3xl text-ink">{t.about.howItWorks.title}</h2>
      <p className="mt-3 text-muted leading-relaxed">{t.about.howItWorks.body}</p>

      <h2 className="mt-10 display text-2xl sm:text-3xl text-ink">{t.about.whatItIsNot.title}</h2>
      <p className="mt-3 text-muted leading-relaxed">{t.about.whatItIsNot.body}</p>

      <p className="mt-10 text-sm text-muted">
        {t.about.sig} · <Link to="/" className="text-emerald hover:text-emerald-light">{t.common.backHome}</Link>
      </p>
    </article>
  );
}
