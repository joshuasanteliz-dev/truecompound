import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n';
import '../styles/landingMissingLayer.css';

type HeadlineAccentVariant = 'green' | 'warning';
type LayerPreviewKind = 'inflation' | 'dca' | 'debt' | 'tax' | 'uncertainty';

const previewBrandName = 'TrueCompound';
const headlineAccentVariant: HeadlineAccentVariant = 'warning';

const COPY = {
  en: {
    eyebrow: 'A compound interest suite',
    titleA: 'Most calculators',
    titleB: 'lie by ',
    titleHighlight: 'omission',
    intro:
      `They show the clean number and leave out the forces that change it. ${previewBrandName} reveals inflation, timing, debt, taxes, and uncertainty so compound growth feels closer to reality.`,
    primaryCta: 'Start with inflation',
    secondaryCta: 'Explore the hidden layers',
    supportLabel: 'What gets revealed',
    supportIntro: `Normal calculators show one clean number. ${previewBrandName} shows the layers underneath.`,
    supportItems: ['Inflation erosion', 'Tax drag', 'Timing risk', 'Debt compounding', 'Probability range'],
    heroLabel: 'Example scenario',
    heroAssumption: '$10,000 today + $500/mo for 30 years at 8% nominal return',
    normalLabel: 'Normal calculator',
    normalNote: 'Nominal value shown',
    normalValue: '$1,006,265',
    normalAmount: 1006265,
    revealedLabel: 'REAL VALUE',
    revealedNote: 'Estimated spending power after hidden layers',
    revealedValue: '$429,000',
    revealedAmount: 429000,
    ledgerTitle: 'What changed the number',
    chartTitle: 'Nominal growth compared with revealed spending power',
    chartDesc:
      'The upper line shows the nominal number. The lower line shows the revealed value after hidden layers are considered.',
    layersHeading: 'Five hidden layers. Five focused calculators.',
    layersIntro:
      'Choose the force you want to inspect first. Each tool keeps the math focused, visible, and practical.',
    trustHeading: 'Useful math, not a sales funnel.',
    trustBody:
      `${previewBrandName} runs in your browser, keeps your inputs local, and exists to make the assumptions visible. It is educational software, not financial advice.`,
    aboutLink: 'More about the project',
    openTool: 'Open calculator',
    rows: [
      { name: 'Inflation', detail: 'Prices compound too', value: '-$414k', tone: 'amber' },
      { name: 'Taxes and fees', detail: 'The wrapper changes the ending', value: '-$113k', tone: 'red' },
      { name: 'Timing', detail: 'Same money, different path', value: '-$49k', tone: 'gray' },
      { name: 'Uncertainty', detail: 'Average return is not a plan', value: 'range shown', tone: 'green' },
    ],
    modes: [
      {
        to: '/inflation',
        layer: 'Inflation',
        title: 'The number grows. Buying power changes.',
        reason: 'Compare nominal growth with what the money may actually buy in today-like dollars.',
        signal: 'Purchasing power',
      },
      {
        to: '/dca',
        layer: 'DCA / timing',
        title: 'Same money. Different path.',
        reason: 'See how lump sum and DCA behave across real-feeling market windows.',
        signal: 'Path dependence',
      },
      {
        to: '/debt',
        layer: 'Debt',
        title: 'Compounding can work against you.',
        reason: 'Mirror investment growth against debt drag so the same math becomes visible both ways.',
        signal: 'Reverse compound',
      },
      {
        to: '/tax',
        layer: 'Tax',
        title: 'Structure changes the ending.',
        reason: 'Compare taxable, Roth-style, and traditional wrappers under the same contribution path.',
        signal: 'After-tax result',
      },
      {
        to: '/monte-carlo',
        layer: 'Uncertainty',
        title: 'Average return is not a plan.',
        reason: 'Replace one smooth forecast with a range of possible futures and survival outcomes.',
        signal: 'Probability band',
      },
    ],
    trustPoints: ['Local inputs', 'Shareable scenarios', 'No account required', 'Not financial advice'],
  },
  es: {
    eyebrow: 'Una suite de interes compuesto',
    titleA: 'La mayoría de calculadoras',
    titleB: 'mienten por ',
    titleHighlight: 'omisión',
    intro:
      `Te ensenan el numero limpio y dejan fuera las fuerzas que lo cambian. ${previewBrandName} revela inflacion, timing, deuda, impuestos e incertidumbre para que el interes compuesto se sienta mas real.`,
    primaryCta: 'Empieza con la inflacion',
    secondaryCta: 'Explora las capas ocultas',
    supportLabel: 'Lo que se revela',
    supportIntro: `Las calculadoras normales muestran un numero limpio. ${previewBrandName} muestra las capas debajo.`,
    supportItems: ['Erosion por inflacion', 'Arrastre fiscal', 'Riesgo de timing', 'Deuda compuesta', 'Rango probable'],
    heroLabel: 'Escenario de ejemplo',
    heroAssumption: '$10,000 hoy + $500/mes durante 30 anos al 8% nominal',
    normalLabel: 'Calculadora normal',
    normalNote: 'Valor nominal mostrado',
    normalValue: '$1,006,265',
    normalAmount: 1006265,
    revealedLabel: 'VALOR REAL',
    revealedNote: 'Poder de compra estimado tras capas ocultas',
    revealedValue: '$429,000',
    revealedAmount: 429000,
    ledgerTitle: 'Que cambio el numero',
    chartTitle: 'Crecimiento nominal comparado con poder de compra revelado',
    chartDesc:
      'La linea superior muestra el numero nominal. La linea inferior muestra el valor revelado despues de considerar capas ocultas.',
    layersHeading: 'Cinco capas ocultas. Cinco calculadoras enfocadas.',
    layersIntro:
      'Elige la fuerza que quieres inspeccionar primero. Cada herramienta mantiene la matematica enfocada, visible y practica.',
    trustHeading: 'Matematica util, no un embudo de ventas.',
    trustBody:
      `${previewBrandName} corre en tu navegador, mantiene tus datos localmente y existe para hacer visibles los supuestos. Es software educativo, no asesoramiento financiero.`,
    aboutLink: 'Mas sobre el proyecto',
    openTool: 'Abrir calculadora',
    rows: [
      { name: 'Inflacion', detail: 'Los precios tambien componen', value: '-$414k', tone: 'amber' },
      { name: 'Impuestos y comisiones', detail: 'La estructura cambia el final', value: '-$113k', tone: 'red' },
      { name: 'Timing', detail: 'Mismo dinero, camino distinto', value: '-$49k', tone: 'gray' },
      { name: 'Incertidumbre', detail: 'El promedio no es un plan', value: 'rango probable', tone: 'green' },
    ],
    modes: [
      {
        to: '/inflation',
        layer: 'Inflacion',
        title: 'El numero crece. El poder de compra cambia.',
        reason: 'Compara el crecimiento nominal con lo que el dinero podria comprar en dolares de hoy.',
        signal: 'Poder de compra',
      },
      {
        to: '/dca',
        layer: 'DCA / timing',
        title: 'Mismo dinero. Camino distinto.',
        reason: 'Mira como lump sum y DCA se comportan en ventanas de mercado con forma real.',
        signal: 'Dependencia del camino',
      },
      {
        to: '/debt',
        layer: 'Deuda',
        title: 'El compuesto puede ir contra ti.',
        reason: 'Refleja crecimiento de inversion contra arrastre de deuda para ver la misma matematica en ambos sentidos.',
        signal: 'Compuesto inverso',
      },
      {
        to: '/tax',
        layer: 'Impuestos',
        title: 'La estructura cambia el final.',
        reason: 'Compara cuentas taxable, tipo Roth y tradicionales bajo la misma ruta de aportes.',
        signal: 'Resultado neto',
      },
      {
        to: '/monte-carlo',
        layer: 'Incertidumbre',
        title: 'El retorno promedio no es un plan.',
        reason: 'Cambia una prevision suave por un rango de futuros posibles y resultados de supervivencia.',
        signal: 'Banda probable',
      },
    ],
    trustPoints: ['Datos locales', 'Escenarios compartibles', 'Sin cuenta', 'No es asesoramiento financiero'],
  },
} as const;

export default function LandingMissingLayer() {
  const { lang } = useLang();
  const copy = COPY[lang];
  const reduceMotion = usePrefersReducedMotion();
  const heroReveal = useRevealOnce<HTMLElement>(reduceMotion);
  const layersReveal = useRevealOnce<HTMLElement>(reduceMotion);

  return (
    <div className="landing-missing-layer">
      <section
        ref={heroReveal.ref}
        className={`layer-hero ${heroReveal.isRevealed ? 'is-revealed' : ''}`}
        aria-labelledby="missing-layer-title"
      >
        <div className="layer-hero__copy">
          <div className="label mb-4 text-emerald">{copy.eyebrow}</div>
          <HeroHeadline copy={copy} lang={lang} />
          <p className="layer-hero__intro">{copy.intro}</p>
          <div className="layer-hero__actions" aria-label="Primary landing actions">
            <Link to="/inflation" className="btn-primary layer-hero__primary">
              {copy.primaryCta}
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <a href="#hidden-layers" className="btn-secondary layer-hero__secondary">
              {copy.secondaryCta}
              <span aria-hidden="true">-&gt;</span>
            </a>
          </div>
          <aside className="layer-hero__support" aria-labelledby="layer-hero-support-title">
            <p id="layer-hero-support-title" className="layer-hero__support-label">
              {copy.supportLabel}
            </p>
            <p className="layer-hero__support-intro">{copy.supportIntro}</p>
            <ul className="layer-hero__support-list">
              {copy.supportItems.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <CalculationReveal copy={copy} active={heroReveal.isRevealed} reduceMotion={reduceMotion} />
      </section>

      <section
        id="hidden-layers"
        ref={layersReveal.ref}
        className={`layer-section ${layersReveal.isRevealed ? 'is-revealed' : ''}`}
        aria-labelledby="hidden-layers-title"
      >
        <div className="layer-section__header">
          <p className="label text-emerald">The missing layer</p>
          <h2 id="hidden-layers-title" className="display text-3xl sm:text-4xl text-ink">
            {copy.layersHeading}
          </h2>
          <p>{copy.layersIntro}</p>
        </div>

        <div className="layer-chooser" aria-label={copy.layersHeading}>
          {copy.modes.map((mode, index) => (
            <Link key={mode.to} to={mode.to} className="layer-choice">
              <span className="layer-choice__index mono" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="layer-choice__body">
                <span className="layer-choice__kicker">{mode.layer}</span>
                <span className="layer-choice__title">{mode.title}</span>
                <span className="layer-choice__reason">{mode.reason}</span>
              </span>
              <LayerMiniPreview kind={layerPreviewKindForRoute(mode.to)} />
              <span className="layer-choice__signal">{mode.signal}</span>
              <span className="layer-choice__action">
                {copy.openTool}
                <span aria-hidden="true">-&gt;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="layer-trust" aria-labelledby="layer-trust-title">
        <div>
          <p className="label text-emerald">Trust layer</p>
          <h2 id="layer-trust-title" className="display text-2xl sm:text-3xl text-ink">
            {copy.trustHeading}
          </h2>
          <p>{copy.trustBody}</p>
          <Link to="/about" className="layer-trust__link">
            {copy.aboutLink}
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </div>
        <ul className="layer-trust__points" aria-label="Trust points">
          {copy.trustPoints.map((point) => (
            <li key={point}>
              <span aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type Copy = (typeof COPY)[keyof typeof COPY];

function HeroHeadline({ copy, lang }: { copy: Copy; lang: 'en' | 'es' }) {
  const headlineAccentClass = `layer-hero__accent layer-hero__accent--${headlineAccentVariant}`;

  if (lang === 'es') {
    return (
      <h1 id="missing-layer-title" className="display-tight layer-hero__title layer-hero__title--es text-ink">
        <span className="layer-hero__line">La mayoría de</span>
        <span className="layer-hero__line">calculadoras</span>
        <span className="layer-hero__line">mienten por</span>
        <span className="layer-hero__line layer-hero__line--accent">
          <span className={headlineAccentClass}>omisión</span>.
        </span>
      </h1>
    );
  }

  return (
    <h1 id="missing-layer-title" className="display-tight layer-hero__title text-ink">
      <span className="layer-hero__line">{copy.titleA}</span>
      <span className="layer-hero__line">
        {copy.titleB}
        <span className={headlineAccentClass}>{copy.titleHighlight}</span>.
      </span>
    </h1>
  );
}

function layerPreviewKindForRoute(route: string): LayerPreviewKind {
  switch (route) {
    case '/dca':
      return 'dca';
    case '/debt':
      return 'debt';
    case '/tax':
      return 'tax';
    case '/monte-carlo':
      return 'uncertainty';
    case '/inflation':
    default:
      return 'inflation';
  }
}

function LayerMiniPreview({ kind }: { kind: LayerPreviewKind }) {
  return (
    <span className={`layer-mini-preview layer-mini-preview--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 128 54" focusable="false">
        <path className="layer-mini-preview__grid" d="M8 42H120 M8 28H120 M8 14H120" />
        {kind === 'inflation' && (
          <>
            <path className="layer-mini-preview__band" d="M10 42 C34 34 58 24 84 16 C98 12 110 9 120 7 L120 29 C108 31 96 33 84 35 C58 39 34 42 10 44 Z" />
            <path className="layer-mini-preview__path layer-mini-preview__path--nominal" d="M10 42 C34 34 58 24 84 16 C98 12 110 9 120 7" />
            <path className="layer-mini-preview__path layer-mini-preview__path--warning" d="M10 44 C34 42 58 39 84 35 C96 33 108 31 120 29" />
            <circle className="layer-mini-preview__dot layer-mini-preview__dot--warning" cx="120" cy="29" r="3.2" />
          </>
        )}
        {kind === 'dca' && (
          <>
            <path className="layer-mini-preview__path layer-mini-preview__path--muted" d="M10 40 C28 36 38 20 56 28 C74 37 88 20 118 14" />
            <path className="layer-mini-preview__path layer-mini-preview__path--green" d="M10 42 C30 41 44 43 62 31 C80 19 94 17 118 10" />
            <circle className="layer-mini-preview__dot layer-mini-preview__dot--green" cx="118" cy="10" r="3.1" />
          </>
        )}
        {kind === 'debt' && (
          <>
            <path className="layer-mini-preview__path layer-mini-preview__path--green" d="M10 40 C32 34 52 28 70 20 C88 12 104 9 118 8" />
            <path className="layer-mini-preview__path layer-mini-preview__path--red" d="M10 16 C32 19 54 24 74 32 C92 39 106 43 118 45" />
            <circle className="layer-mini-preview__dot layer-mini-preview__dot--red" cx="118" cy="45" r="3.1" />
          </>
        )}
        {kind === 'tax' && (
          <>
            <path className="layer-mini-preview__path layer-mini-preview__path--green" d="M10 42 C32 34 52 28 72 20 C90 13 106 10 118 9" />
            <path className="layer-mini-preview__cut" d="M46 25L46 37 M72 17L72 30 M98 11L98 24" />
            <path className="layer-mini-preview__path layer-mini-preview__path--warning" d="M10 42 C32 35 52 31 72 27 C90 23 106 21 118 19" />
            <circle className="layer-mini-preview__dot layer-mini-preview__dot--warning" cx="118" cy="19" r="3.1" />
          </>
        )}
        {kind === 'uncertainty' && (
          <>
            <path className="layer-mini-preview__band" d="M10 39 C34 30 54 19 76 15 C94 12 106 14 120 18 L120 34 C104 30 92 28 76 30 C54 32 34 39 10 45 Z" />
            <path className="layer-mini-preview__path layer-mini-preview__path--muted" d="M10 43 C34 37 52 27 76 23 C96 20 108 24 120 27" />
            <path className="layer-mini-preview__path layer-mini-preview__path--green" d="M10 39 C34 31 54 22 76 18 C94 15 108 16 120 18" />
            <path className="layer-mini-preview__path layer-mini-preview__path--faint" d="M10 45 C34 44 54 34 76 31 C95 28 106 31 120 34" />
          </>
        )}
      </svg>
    </span>
  );
}

function CalculationReveal({
  copy,
  active,
  reduceMotion,
}: {
  copy: Copy;
  active: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div
      className={`layer-peel-object ${active ? 'layer-peel-object--active' : ''}`}
      aria-label={`${copy.heroLabel}: ${copy.normalValue} becomes ${copy.revealedValue}`}
      tabIndex={0}
    >
      <div className="layer-peel-object__topline">
        <span className="layer-peel-object__badge">{copy.heroLabel}</span>
        <span>{copy.heroAssumption}</span>
      </div>

      <div className="layer-value-compare" aria-label="Nominal value compared with revealed value">
        <div className="layer-value-card layer-value-card--muted">
          <span>{copy.normalLabel}</span>
          <CountedMoney
            active={active}
            reduceMotion={reduceMotion}
            from={0}
            to={copy.normalAmount}
            label={copy.normalValue}
          />
          <small>{copy.normalNote}</small>
        </div>
        <div className="layer-value-card layer-value-card--truth">
          <span>{copy.revealedLabel}</span>
          <CountedMoney
            active={active}
            reduceMotion={reduceMotion}
            from={copy.normalAmount}
            to={copy.revealedAmount}
            label={copy.revealedValue}
          />
          <small>{copy.revealedNote}</small>
        </div>
      </div>

      <div className="layer-chart-shell">
        <svg className="layer-chart" viewBox="0 0 520 190" role="img" aria-labelledby="layer-chart-title layer-chart-desc">
          <title id="layer-chart-title">{copy.chartTitle}</title>
          <desc id="layer-chart-desc">{copy.chartDesc}</desc>
          <path className="layer-chart__grid" d="M34 42H486 M34 86H486 M34 130H486 M34 174H486" />
          <path className="layer-chart__band" d="M36 152 C128 135 200 102 286 70 C354 45 418 30 484 18 L484 134 C404 140 342 151 286 158 C190 170 112 169 36 166 Z" />
          <path className="layer-chart__nominal" d="M36 152 C128 135 200 102 286 70 C354 45 418 30 484 18" />
          <path className="layer-chart__real" d="M36 166 C112 169 190 170 286 158 C342 151 404 140 484 134" />
          <circle className="layer-chart__dot layer-chart__dot--nominal" cx="484" cy="18" r="5" />
          <circle className="layer-chart__dot layer-chart__dot--real" cx="484" cy="134" r="5" />
        </svg>
      </div>

      <div className="layer-ledger" aria-labelledby="layer-ledger-title">
        <h2 id="layer-ledger-title">{copy.ledgerTitle}</h2>
        {copy.rows.map((row) => (
          <div key={row.name} className={`layer-ledger-row layer-ledger-row--${row.tone}`}>
            <span className="layer-ledger-row__mark" aria-hidden="true" />
            <span>
              <strong>{row.name}</strong>
              <small>{row.detail}</small>
            </span>
            <em className="mono">{row.value}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountedMoney({
  active,
  reduceMotion,
  from,
  to,
  label,
}: {
  active: boolean;
  reduceMotion: boolean;
  from: number;
  to: number;
  label: string;
}) {
  const [value, setValue] = useState(reduceMotion ? to : from);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }),
    [],
  );

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      return;
    }
    if (!active) {
      setValue(from);
      return;
    }

    let frame = 0;
    let start = 0;
    const duration = 1050;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, from, reduceMotion, to]);

  return (
    <strong className="mono layer-counted-money" aria-label={label}>
      <span aria-hidden="true">{formatter.format(value)}</span>
    </strong>
  );
}

function useRevealOnce<T extends HTMLElement>(reduceMotion: boolean) {
  const ref = useRef<T | null>(null);
  const [isRevealed, setRevealed] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      setRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return { ref, isRevealed };
}

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return reduceMotion;
}
