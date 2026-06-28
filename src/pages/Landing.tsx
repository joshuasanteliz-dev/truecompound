import { Link } from 'react-router-dom';
import { ModeCard } from '@/components/ModeCard';
import { MiniInflation, MiniDCA, MiniDebt, MiniTax, MiniMonteCarlo } from './landingPreviews';
import { useT } from '@/i18n';

export default function Landing() {
  const t = useT();

  const MODES = [
    { to: '/inflation', title: t.landing.pitches.inflation.title, pitch: t.landing.pitches.inflation.pitch, preview: <MiniInflation /> },
    { to: '/dca', title: t.landing.pitches.dca.title, pitch: t.landing.pitches.dca.pitch, preview: <MiniDCA /> },
    { to: '/debt', title: t.landing.pitches.debt.title, pitch: t.landing.pitches.debt.pitch, preview: <MiniDebt /> },
    { to: '/tax', title: t.landing.pitches.tax.title, pitch: t.landing.pitches.tax.pitch, preview: <MiniTax /> },
    { to: '/monte-carlo', title: t.landing.pitches.monteCarlo.title, pitch: t.landing.pitches.monteCarlo.pitch, preview: <MiniMonteCarlo /> },
  ];

  return (
    <div>
      <section className="py-12 sm:py-20 max-w-3xl">
        <div className="label mb-3 text-emerald">{t.landing.eyebrow}</div>
        <h1 className="display-tight text-5xl sm:text-6xl lg:text-7xl text-ink">
          {t.landing.titleLine1}
          <br />
          {t.landing.titleLine2Prefix}
          <span className="text-emerald">{t.landing.titleLine2Highlight}</span>
          {t.landing.titleLine2Suffix}
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">{t.landing.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/inflation" className="btn-primary">
            {t.landing.ctaPrimary}
            <span aria-hidden className="ml-1.5">→</span>
          </Link>
          <Link to="/monte-carlo" className="btn-secondary">
            {t.landing.ctaSecondary}
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODES.map((mode, i) => (
            <ModeCard key={mode.to} to={mode.to} title={mode.title} pitch={mode.pitch} preview={mode.preview} index={i} />
          ))}
        </div>
      </section>

      <section className="py-16 max-w-2xl">
        <h2 className="display text-2xl sm:text-3xl text-ink mb-3">{t.landing.footnoteTitle}</h2>
        <p className="text-muted leading-relaxed">{t.landing.footnoteBody}</p>
        <Link to="/about" className="mt-4 inline-flex items-center text-emerald hover:text-emerald-light text-sm font-semibold">
          {t.landing.footnoteLink}
          <span aria-hidden className="ml-1">→</span>
        </Link>
      </section>
    </div>
  );
}
