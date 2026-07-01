import { type ReactNode, useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { NumberInput, InputSlider } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { Callout } from '@/components/Callout';
import { ShareButton } from '@/components/ShareButton';
import { ModeExplainer } from '@/components/ModeExplainer';
import { ScenarioPresets, type PresetChip } from '@/components/ScenarioPresets';
import { PlainEnglish } from '@/components/PlainEnglish';
import { SanityWarning } from '@/components/SanityWarning';
import { useT } from '@/i18n';
import { useScenarioStore, type MonteCarloInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { runMonteCarlo, formatCurrency, formatPercent } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

type DominantTone = 'emerald' | 'neutral' | 'red';
type CardTone = 'red' | 'slate';
type RecalcTone = 'emerald' | 'red' | 'muted';

// Local recalculation feedback, matching the pattern Inflation/DCA/Tax/Debt use:
// a keyed span that replays a brief settle animation only when its value changes.
const recalcPulseStyles = `
@keyframes mcRecalcPulse {
  0% {
    opacity: 0.72;
    transform: translateY(2px);
    text-shadow: 0 0 0 transparent;
  }

  48% {
    opacity: 1;
    text-shadow: 0 0 10px var(--mc-recalc-glow);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 0 transparent;
  }
}

.mc-recalc-pulse {
  --mc-recalc-glow: transparent;
  display: inline-block;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
  animation: mcRecalcPulse 190ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, text-shadow;
}

.mc-recalc-pulse--emerald {
  --mc-recalc-glow: rgba(34, 197, 94, 0.26);
}

.mc-recalc-pulse--red {
  --mc-recalc-glow: rgba(248, 113, 113, 0.2);
}

.mc-recalc-pulse--muted {
  --mc-recalc-glow: rgba(148, 163, 184, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .mc-recalc-pulse {
    animation: none;
  }
}
`;

function RecalcPulse({
  valueKey,
  tone = 'muted',
  children,
}: {
  valueKey: string | number;
  tone?: RecalcTone;
  children: ReactNode;
}) {
  return (
    <span key={valueKey} className={`mc-recalc-pulse mc-recalc-pulse--${tone}`}>
      {children}
    </span>
  );
}

const dominantCardStyles: Record<DominantTone, string> = {
  emerald: 'border-emerald/30 bg-emerald/5',
  neutral: 'border-white/10 bg-white/[0.025]',
  red: 'border-red-400/25 bg-[rgba(239,68,68,0.045)]',
};
const dominantAccentStyles: Record<DominantTone, string> = {
  emerald: 'bg-emerald',
  neutral: 'bg-border-strong',
  red: 'bg-red-400/80',
};
const dominantLabelStyles: Record<DominantTone, string> = {
  emerald: 'text-emerald',
  neutral: 'text-muted',
  red: 'text-red-300/90',
};
const dominantNumberStyles: Record<DominantTone, string> = {
  emerald: 'text-emerald',
  neutral: 'text-ink',
  red: 'text-red-200',
};

const secondaryCardStyles: Record<CardTone, string> = {
  red: 'border-[rgba(248,113,113,0.16)] bg-[rgba(239,68,68,0.035)]',
  slate: 'border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)]',
};
const secondaryLabelStyles: Record<CardTone, string> = {
  red: 'text-red-300/85',
  slate: 'text-muted',
};
const secondaryNumberStyles: Record<CardTone, string> = {
  red: 'text-red-200',
  slate: 'text-ink',
};

type SecondaryMetric = {
  key: string;
  label: string;
  value: string;
  note: string;
  tone: CardTone;
};

export default function MonteCarlo() {
  const t = useT();
  const mc = useScenarioStore((s) => s.monteCarlo);
  const setMC = useScenarioStore((s) => s.setMonteCarlo);

  useUrlHydrate(setMC, {
    startingBalance: 'number',
    monthlyContribution: 'number',
    meanAnnualReturn: 'number',
    annualStdDev: 'number',
    years: 'int',
    iterations: 'int',
    mode: 'string',
    monthlyWithdrawal: 'number',
  });

  const debounced = useDebouncedValue(mc, 200);

  const result = useMemo(
    () =>
      runMonteCarlo({
        startingBalance: debounced.startingBalance,
        monthlyContribution: debounced.mode === 'accumulation' ? debounced.monthlyContribution : 0,
        meanAnnualReturn: debounced.meanAnnualReturn,
        annualStdDev: debounced.annualStdDev,
        years: debounced.years,
        iterations: debounced.iterations,
        mode: debounced.mode,
        monthlyWithdrawal: debounced.mode === 'withdrawal' ? debounced.monthlyWithdrawal : 0,
      }),
    [debounced],
  );

  const xLabels = result.p50.map((_, i) => String(i));

  const series: Series[] = [
    {
      label: t.montecarlo.seriesP90,
      data: result.p90,
      color: '#4ADE80',
      width: 2,
      fill: { target: '+1', color: 'rgba(34, 197, 94, 0.10)' },
    },
    {
      label: t.montecarlo.seriesMedian,
      data: result.p50,
      color: '#22C55E',
      width: 2.5,
      fill: { target: '+1', color: 'rgba(34, 197, 94, 0.16)' },
    },
    {
      label: t.montecarlo.seriesP10,
      data: result.p10,
      color: '#F5F7FA',
      width: 2,
      dashed: true,
    },
  ];

  const lastIdx = result.p50.length - 1;
  const isWithdrawal = mc.mode === 'withdrawal';

  const annualWithdrawal = mc.monthlyWithdrawal * 12;
  const withdrawalRate = mc.startingBalance > 0 ? annualWithdrawal / mc.startingBalance : 0;
  const unsustainableWithdrawal = isWithdrawal && withdrawalRate > 0.10;
  const aggressiveWithdrawal = isWithdrawal && withdrawalRate > 0.05 && withdrawalRate <= 0.10;
  const survivalRate = result.survivalRate ?? 0;

  const survivalTone: 'strong' | 'okay' | 'risky' | 'failing' =
    survivalRate > 0.9 ? 'strong' : survivalRate > 0.7 ? 'okay' : survivalRate > 0.3 ? 'risky' : 'failing';

  // Ending-balance percentiles (the range hidden behind the average).
  const medianEnd = result.p50[lastIdx];
  const p10End = result.p10[lastIdx];
  const p90End = result.p90[lastIdx];
  const spreadEnd = p90End - p10End;
  const failureProbability = 1 - survivalRate;

  // Dominant answer: median ending balance (accumulation) or survival rate (withdrawal).
  const dominantTone: DominantTone = isWithdrawal
    ? survivalRate > 0.8
      ? 'emerald'
      : survivalRate < 0.5
        ? 'red'
        : 'neutral'
    : 'emerald';

  const dominantLabel = isWithdrawal ? t.montecarlo.heroSurvival : t.montecarlo.heroMedian;
  const dominantValue = isWithdrawal ? formatPercent(survivalRate) : formatCurrency(medianEnd);
  const dominantSummary = isWithdrawal
    ? `The share of simulated futures that reach year ${mc.years} with money still left. The rest are stress-test failures, not predictions.`
    : 'The middle of the simulated range — half of the futures end above this, half below. The average alone would hide that spread.';

  const secondary: SecondaryMetric[] = isWithdrawal
    ? [
        {
          key: 'p10',
          label: t.montecarlo.hero10,
          value: formatCurrency(p10End),
          note: 'A rougher path — 1 in 10 ended at or below this.',
          tone: 'red',
        },
        {
          key: 'median',
          label: t.montecarlo.heroMedian,
          value: formatCurrency(medianEnd),
          note: 'The middle ending balance across all paths.',
          tone: 'slate',
        },
        {
          key: 'p90',
          label: t.montecarlo.hero90,
          value: formatCurrency(p90End),
          note: 'A favorable path — 1 in 10 ended at or above this.',
          tone: 'slate',
        },
        {
          key: 'failure',
          label: 'Failure probability',
          value: formatPercent(failureProbability),
          note: 'Paths that ran out early — sequence-of-returns risk.',
          tone: 'red',
        },
      ]
    : [
        {
          key: 'p10',
          label: t.montecarlo.hero10,
          value: formatCurrency(p10End),
          note: 'A rougher path — 1 in 10 ended at or below this.',
          tone: 'red',
        },
        {
          key: 'p90',
          label: t.montecarlo.hero90,
          value: formatCurrency(p90End),
          note: 'A favorable path — 1 in 10 ended at or above this.',
          tone: 'slate',
        },
        {
          key: 'spread',
          label: 'P10–P90 spread',
          value: formatCurrency(spreadEnd),
          note: 'The range hidden behind the average.',
          tone: 'slate',
        },
        {
          key: 'iterations',
          label: 'Simulated futures',
          value: String(mc.iterations),
          note: `Simulated return paths over ${mc.years} years.`,
          tone: 'slate',
        },
      ];

  const presetItems = t.presets.monteCarlo.items;
  const presets: PresetChip<MonteCarloInputs>[] = [
    { label: presetItems.building.label, blurb: presetItems.building.blurb, values: { mode: 'accumulation', startingBalance: 50000, monthlyContribution: 1000, monthlyWithdrawal: 0, meanAnnualReturn: 0.08, annualStdDev: 0.15, years: 30, iterations: 1000 } },
    { label: presetItems.standardRetire.label, blurb: presetItems.standardRetire.blurb, values: { mode: 'withdrawal', startingBalance: 1000000, monthlyContribution: 0, monthlyWithdrawal: 4000, meanAnnualReturn: 0.07, annualStdDev: 0.15, years: 30, iterations: 1000 } },
    { label: presetItems.fire.label, blurb: presetItems.fire.blurb, values: { mode: 'withdrawal', startingBalance: 1500000, monthlyContribution: 0, monthlyWithdrawal: 5000, meanAnnualReturn: 0.07, annualStdDev: 0.15, years: 40, iterations: 1000 } },
    { label: presetItems.conservative.label, blurb: presetItems.conservative.blurb, values: { mode: 'withdrawal', startingBalance: 1500000, monthlyContribution: 0, monthlyWithdrawal: 4000, meanAnnualReturn: 0.07, annualStdDev: 0.15, years: 30, iterations: 1000 } },
    { label: presetItems.stress.label, blurb: presetItems.stress.blurb, values: { mode: 'withdrawal', startingBalance: 500000, monthlyContribution: 0, monthlyWithdrawal: 3000, meanAnnualReturn: 0.06, annualStdDev: 0.25, years: 30, iterations: 1000 } },
  ];

  return (
    <div>
      <style>{recalcPulseStyles}</style>

      {/* Desktop intro — original ModeHeader (with Share) + Explainer. Hidden on mobile,
          which uses the compact intro below and moves Share lower. */}
      <div className="hidden lg:block">
        <ModeHeader
          eyebrow={t.montecarlo.eyebrow}
          title={isWithdrawal ? t.montecarlo.titleWithdraw : t.montecarlo.titleAccum}
          subtitle={isWithdrawal ? t.montecarlo.subtitleWithdraw : t.montecarlo.subtitleAccum}
          actions={<ShareButton params={mc as unknown as Record<string, string | number>} />}
        />

        <ModeExplainer summary={t.montecarlo.explainerSummary}>{t.montecarlo.explainer}</ModeExplainer>
      </div>

      {/* Mobile intro — compact eyebrow/title/subtitle, no Share, tight spacing. */}
      <div className="mb-4 lg:hidden">
        <div className="label mb-1 text-emerald">{t.montecarlo.eyebrow}</div>
        <h1 className="display-tight text-2xl leading-tight text-ink">
          {isWithdrawal ? t.montecarlo.titleWithdraw : t.montecarlo.titleAccum}
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-snug text-muted">
          {isWithdrawal ? t.montecarlo.subtitleWithdraw : t.montecarlo.subtitleAccum}
        </p>
      </div>

      {/* Mobile explanation — collapsed and compact, near the top. Desktop shows it up top. */}
      <div className="mb-4 lg:hidden [&>.mode-explainer]:mb-0">
        <ModeExplainer summary={t.montecarlo.explainerSummary}>{t.montecarlo.explainer}</ModeExplainer>
      </div>

      {/* Presets — single horizontal scroll row on mobile; original wrapped row at lg. */}
      <div className="[&_.flex-wrap]:flex-nowrap [&_.flex-wrap]:overflow-x-auto [&_.flex-wrap]:pb-1 [&_.flex-wrap>button]:shrink-0 [&>div]:mb-4 lg:[&_.flex-wrap]:flex-wrap lg:[&_.flex-wrap]:overflow-visible lg:[&_.flex-wrap]:pb-0 lg:[&>div]:mb-6">
        <ScenarioPresets<MonteCarloInputs> presets={presets} onApply={(v) => setMC(v)} title={t.presets.monteCarlo.title} />
      </div>

      <SanityWarning
        when={unsustainableWithdrawal}
        tone="danger"
        title={t.montecarlo.warningUnsustainableTitle(formatPercent(withdrawalRate))}
      >
        {t.montecarlo.warningUnsustainableBody({
          annual: formatCurrency(annualWithdrawal),
          balance: formatCurrency(mc.startingBalance),
          rate: formatPercent(withdrawalRate),
        })}
      </SanityWarning>

      <SanityWarning
        when={aggressiveWithdrawal}
        tone="warning"
        title={t.montecarlo.warningAggressiveTitle(formatPercent(withdrawalRate))}
      >
        {t.montecarlo.warningAggressiveBody}
      </SanityWarning>

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="label mb-4 text-slate-300/80">UNCERTAINTY RESULT</div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.9fr)] lg:items-start">
          <div className="grid gap-4">
            <section
              className={`card p-5 lg:p-6 relative overflow-hidden shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] ${dominantCardStyles[dominantTone]}`}
            >
              <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] ${dominantAccentStyles[dominantTone]}`} />
              <div className={`label ${dominantLabelStyles[dominantTone]}`}>{dominantLabel}</div>
              <div
                className={`mt-2 break-words text-4xl font-semibold tracking-tight sm:text-5xl ${dominantNumberStyles[dominantTone]}`}
              >
                <RecalcPulse valueKey={dominantValue} tone={dominantTone === 'neutral' ? 'muted' : dominantTone}>
                  {dominantValue}
                </RecalcPulse>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{dominantSummary}</p>
              {isWithdrawal && (
                <div className="mt-4 border-t border-white/10 pt-3 text-sm">
                  <div className="label text-muted">Paths that survived</div>
                  <div className="mono mt-1 font-semibold text-ink">
                    <RecalcPulse
                      valueKey={`${Math.round(survivalRate * mc.iterations)}/${mc.iterations}`}
                      tone="muted"
                    >
                      {t.montecarlo.heroSurvivalSub(Math.round(survivalRate * mc.iterations), mc.iterations)}
                    </RecalcPulse>
                  </div>
                </div>
              )}
            </section>

            {/* Desktop keeps Plain English beside the answer; on mobile it moves below the chart. */}
            <div className="hidden lg:block">
            <PlainEnglish>
              {isWithdrawal
                ? t.montecarlo.plainEnglishWithdraw({
                    iterations: mc.iterations,
                    balance: formatCurrency(mc.startingBalance),
                    withdrawal: formatCurrency(mc.monthlyWithdrawal),
                    survivalPct: Math.round(survivalRate * 100),
                    years: mc.years,
                    tone: survivalTone,
                  })
                : t.montecarlo.plainEnglishAccum({
                    iterations: mc.iterations,
                    balance: formatCurrency(mc.startingBalance),
                    contribution: formatCurrency(mc.monthlyContribution),
                    years: mc.years,
                    median: formatCurrency(medianEnd),
                    p10: formatCurrency(p10End),
                    p90: formatCurrency(p90End),
                  })}
            </PlainEnglish>
            </div>
          </div>

          {/* Secondary cards: desktop column. On mobile these move below the chart. */}
          <div className="hidden gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-1 xl:grid-cols-2">
            {secondary.map((metric) => (
              <section
                key={metric.key}
                className={`relative overflow-hidden rounded-xl border p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] ${secondaryCardStyles[metric.tone]}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-[3px] ${metric.tone === 'red' ? 'bg-red-400/45' : 'bg-border-strong'}`}
                />
                <div className={`label ${secondaryLabelStyles[metric.tone]}`}>{metric.label}</div>
                <div className={`mono mt-1.5 break-words text-2xl font-semibold tracking-tight ${secondaryNumberStyles[metric.tone]}`}>
                  <RecalcPulse valueKey={metric.value} tone={metric.tone === 'red' ? 'red' : 'muted'}>
                    {metric.value}
                  </RecalcPulse>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">{metric.note}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <div className="relative isolate grid gap-4 overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.16)] bg-[rgba(5,8,13,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-400/35 before:to-transparent lg:grid-cols-[320px_1fr] lg:gap-5 lg:p-5">
        <div className="grid gap-3 self-start [&_.card]:border-[rgba(148,163,184,0.16)] [&_.card]:bg-[rgba(11,14,20,0.78)] [&_.card]:shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] [&_.input-number]:border-[rgba(148,163,184,0.22)] [&_.input-number]:bg-[rgba(5,8,13,0.72)] [&_input[type=range]]:accent-emerald">
          <div className="rounded-[1.125rem] border border-[rgba(148,163,184,0.16)] bg-white/[0.025] px-4 py-3.5">
            <div className="label text-slate-300/80">UNCERTAINTY ASSUMPTIONS</div>
            <p className="mt-1 text-sm text-muted">
              Set the balance, return, volatility, and horizon. The distribution underneath is unchanged.
            </p>
          </div>

          <InputPanel>
            <div className="flex rounded-md border border-border bg-surface-2 p-0.5 text-xs" role="group" aria-label={t.inputs.mode}>
              <button
                type="button"
                onClick={() => setMC({ mode: 'accumulation' })}
                aria-pressed={mc.mode === 'accumulation'}
                className={`flex-1 px-2 py-1.5 rounded font-semibold ${
                  mc.mode === 'accumulation' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'
                }`}
              >
                {t.inputs.accumulation}
              </button>
              <button
                type="button"
                onClick={() => setMC({ mode: 'withdrawal' })}
                aria-pressed={mc.mode === 'withdrawal'}
                className={`flex-1 px-2 py-1.5 rounded font-semibold ${
                  mc.mode === 'withdrawal' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'
                }`}
              >
                {t.inputs.withdrawal}
              </button>
            </div>
            <p className="text-xs text-muted leading-snug -mt-2">
              {mc.mode === 'accumulation' ? t.inputs.accumulationHint : t.inputs.withdrawalHint}
            </p>

            <NumberInput
              label={t.inputs.startingBalance}
              value={mc.startingBalance}
              onChange={(v) => setMC({ startingBalance: v })}
              prefix="$"
              min={0}
              step={1000}
              hint={mc.mode === 'withdrawal' ? t.hints.monteCarloBalanceWithdraw : t.hints.monteCarloBalanceAccum}
            />

            {mc.mode === 'accumulation' ? (
              <NumberInput
                label={t.inputs.monthlyContribution}
                value={mc.monthlyContribution}
                onChange={(v) => setMC({ monthlyContribution: v })}
                prefix="$"
                min={0}
                step={50}
                hint={t.hints.monteCarloContribution}
              />
            ) : (
              <NumberInput
                label={t.inputs.monthlyWithdrawal}
                value={mc.monthlyWithdrawal}
                onChange={(v) => setMC({ monthlyWithdrawal: v })}
                prefix="$"
                min={0}
                step={100}
                hint={t.hints.monteCarloWithdrawal}
              />
            )}

            <InputSlider
              label={t.inputs.expectedReturn}
              value={mc.meanAnnualReturn}
              onChange={(v) => setMC({ meanAnnualReturn: v })}
              min={0.01}
              max={0.15}
              step={0.005}
              displayMultiplier={100}
              displayDecimals={1}
              suffix="%"
              hint={t.hints.monteCarloExpectedReturn}
            />
            <InputSlider
              label={t.inputs.volatility}
              value={mc.annualStdDev}
              onChange={(v) => setMC({ annualStdDev: v })}
              min={0.02}
              max={0.4}
              step={0.01}
              displayMultiplier={100}
              displayDecimals={0}
              suffix="%"
              hint={t.hints.monteCarloVolatility}
            />
            <InputSlider
              label={t.inputs.years}
              value={mc.years}
              onChange={(v) => setMC({ years: v })}
              min={1}
              max={50}
              step={1}
              suffix={t.inputs.yrsSuffix}
            />
            <InputSlider
              label={t.inputs.iterations}
              value={mc.iterations}
              onChange={(v) => setMC({ iterations: v })}
              min={200}
              max={5000}
              step={100}
              hint={t.hints.monteCarloIterations}
            />
          </InputPanel>
        </div>

        <div>
          <div className="card relative grid min-w-0 gap-4 overflow-hidden border-[rgba(148,163,184,0.18)] bg-[rgba(8,12,18,0.84)] shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-slate-400/60 before:via-slate-400/20 before:to-transparent">
            <div className="border-b border-white/10 pb-4">
              <div className="label text-slate-300/80">RANGE AS PROOF</div>
              <p className="mt-1 text-sm text-muted">
                Each line is a percentile of thousands of simulated return paths. The band is the spread the average leaves out.
              </p>
            </div>
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[rgba(2,6,12,0.42)] px-3 pb-1 pt-3 md:px-4 md:pb-2 md:pt-4">
              <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            </div>
            <Callout>{t.montecarlo.callout}</Callout>
          </div>
        </div>
      </div>

      {/* Mobile-only: Plain English + percentile/secondary cards grouped after the chart so
          the dominant answer sits right above the inputs. display:none at lg (desktop renders
          these inside the result section above — no duplicate a11y exposure). */}
      <div className="mt-5 grid gap-3 lg:hidden">
        <PlainEnglish>
          {isWithdrawal
            ? t.montecarlo.plainEnglishWithdraw({
                iterations: mc.iterations,
                balance: formatCurrency(mc.startingBalance),
                withdrawal: formatCurrency(mc.monthlyWithdrawal),
                survivalPct: Math.round(survivalRate * 100),
                years: mc.years,
                tone: survivalTone,
              })
            : t.montecarlo.plainEnglishAccum({
                iterations: mc.iterations,
                balance: formatCurrency(mc.startingBalance),
                contribution: formatCurrency(mc.monthlyContribution),
                years: mc.years,
                median: formatCurrency(medianEnd),
                p10: formatCurrency(p10End),
                p90: formatCurrency(p90End),
              })}
        </PlainEnglish>
        <div className="grid gap-3">
          {secondary.map((metric) => (
            <section
              key={metric.key}
              className={`relative overflow-hidden rounded-xl border p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] ${secondaryCardStyles[metric.tone]}`}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-[3px] ${metric.tone === 'red' ? 'bg-red-400/45' : 'bg-border-strong'}`}
              />
              <div className={`label ${secondaryLabelStyles[metric.tone]}`}>{metric.label}</div>
              <div className={`mono mt-1.5 break-words text-2xl font-semibold tracking-tight ${secondaryNumberStyles[metric.tone]}`}>
                <RecalcPulse valueKey={metric.value} tone={metric.tone === 'red' ? 'red' : 'muted'}>
                  {metric.value}
                </RecalcPulse>
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">{metric.note}</p>
            </section>
          ))}
        </div>
      </div>

      {/* Mobile-only: Share kept at the bottom so it never delays the calculator. */}
      <div className="mt-6 lg:hidden">
        <ShareButton params={mc as unknown as Record<string, string | number>} />
      </div>
    </div>
  );
}
