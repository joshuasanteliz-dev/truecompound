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
import { useT } from '@/i18n';
import { useScenarioStore, type TaxInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { compareTaxAccounts, formatCurrency } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

type AccountKey = 'rothTfsa' | 'traditionalRrsp' | 'taxable';
type RecalcPulseTone = 'emerald' | 'red' | 'muted';

const recalcPulseStyles = `
@keyframes taxRecalcPulse {
  0% {
    opacity: 0.72;
    transform: translateY(2px);
    text-shadow: 0 0 0 transparent;
  }

  48% {
    opacity: 1;
    text-shadow: 0 0 10px var(--tax-recalc-glow);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 0 transparent;
  }
}

.tax-recalc-pulse {
  --tax-recalc-glow: transparent;
  display: inline-block;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
  animation: taxRecalcPulse 190ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, text-shadow;
}

.tax-recalc-pulse--emerald {
  --tax-recalc-glow: rgba(34, 197, 94, 0.3);
}

.tax-recalc-pulse--red {
  --tax-recalc-glow: rgba(248, 113, 113, 0.22);
}

.tax-recalc-pulse--muted {
  --tax-recalc-glow: rgba(148, 163, 184, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .tax-recalc-pulse {
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
  tone?: RecalcPulseTone;
  children: ReactNode;
}) {
  return (
    <span key={valueKey} className={`tax-recalc-pulse tax-recalc-pulse--${tone}`}>
      {children}
    </span>
  );
}

export default function Tax() {
  const t = useT();
  const tax = useScenarioStore((s) => s.tax);
  const setTax = useScenarioStore((s) => s.setTax);

  useUrlHydrate(setTax, {
    principal: 'number',
    monthlyContribution: 'number',
    annualReturn: 'number',
    years: 'int',
    marginalTaxRate: 'number',
    capitalGainsRate: 'number',
  });

  const debounced = useDebouncedValue(tax, 200);
  const result = useMemo(() => compareTaxAccounts(debounced), [debounced]);

  const xLabels = result.taxable.yearlyBalances.map((_, i) => String(i));

  const series: Series[] = [
    { label: t.tax.accountNames.roth, data: result.rothTfsa.yearlyBalances, color: '#22C55E', width: 2 },
    {
      label: t.tax.accountNames.traditional,
      data: result.traditionalRrsp.yearlyBalances,
      color: '#8B92A5',
      width: 2,
      dashed: true,
    },
    { label: t.tax.accountNames.taxable, data: result.taxable.yearlyBalances, color: '#EF4444', width: 2 },
  ];

  const accounts: Array<{
    key: AccountKey;
    label: string;
    heroLabel: string;
    afterTax: number;
    roundedAfterTax: number;
    note: string;
  }> = [
    {
      key: 'rothTfsa',
      label: t.tax.accountNames.roth,
      heroLabel: t.tax.heroRoth,
      afterTax: result.rothTfsa.afterTax,
      roundedAfterTax: Math.round(result.rothTfsa.afterTax),
      note: 'Tax-free growth and withdrawal value.',
    },
    {
      key: 'traditionalRrsp',
      label: t.tax.accountNames.traditional,
      heroLabel: t.tax.heroTrad,
      afterTax: result.traditionalRrsp.afterTax,
      roundedAfterTax: Math.round(result.traditionalRrsp.afterTax),
      note: 'Pre-tax balance, then taxed at withdrawal.',
    },
    {
      key: 'taxable',
      label: t.tax.accountNames.taxable,
      heroLabel: t.tax.heroTaxable,
      afterTax: result.taxable.afterTax,
      roundedAfterTax: Math.round(result.taxable.afterTax),
      note: 'Annual taxable drag on compounding.',
    },
  ];

  const rankedAccounts = [...accounts].sort((a, b) => b.roundedAfterTax - a.roundedAfterTax || b.afterTax - a.afterTax);
  const leader = rankedAccounts[0];
  const nextBest = rankedAccounts[1];
  const topRounded = leader.roundedAfterTax;
  const tiedLeaders = rankedAccounts.filter((account) => account.roundedAfterTax === topRounded);
  const hasRoundedTie = tiedLeaders.length > 1;
  const tiedNames =
    tiedLeaders.length === 2
      ? `${tiedLeaders[0].label} and ${tiedLeaders[1].label} tie`
      : 'No clear winner under these assumptions';
  const resultHeadline = hasRoundedTie ? tiedNames : leader.label;
  const resultKicker = hasRoundedTie ? 'No clear winner' : 'Best usable wrapper';
  const resultSummary = hasRoundedTie
    ? 'The top account structures land on the same after-tax dollar once rounded.'
    : 'This structure leaves the highest after-tax balance in the current scenario.';
  const resultDeltaLabel = hasRoundedTie ? 'Difference after rounding' : 'Ahead of next best';
  const resultDeltaValue = hasRoundedTie ? '$0 difference after rounding' : formatCurrency(leader.afterTax - nextBest.afterTax);
  const winnerName = hasRoundedTie ? 'No clear winner' : leader.label;
  const leaderAfterTaxDisplay = formatCurrency(leader.afterTax);
  const resultHeadlineKey = hasRoundedTie
    ? `${resultHeadline}-${topRounded}`
    : `${leader.key}-${leader.roundedAfterTax}`;
  const resultDeltaKey = hasRoundedTie ? `tie-${topRounded}` : `gap-${Math.round(leader.afterTax - nextBest.afterTax)}`;

  const presetItems = t.presets.tax.items;
  const presets: PresetChip<TaxInputs>[] = [
    { label: presetItems.young.label, blurb: presetItems.young.blurb, values: { principal: 0, monthlyContribution: 500, annualReturn: 0.08, years: 30, marginalTaxRate: 0.22, capitalGainsRate: 0.15 } },
    { label: presetItems.peak.label, blurb: presetItems.peak.blurb, values: { principal: 50000, monthlyContribution: 2000, annualReturn: 0.08, years: 25, marginalTaxRate: 0.37, capitalGainsRate: 0.20 } },
    { label: presetItems.rothMax.label, blurb: presetItems.rothMax.blurb, values: { principal: 0, monthlyContribution: 583, annualReturn: 0.08, years: 35, marginalTaxRate: 0.24, capitalGainsRate: 0.15 } },
    { label: presetItems.midCareer.label, blurb: presetItems.midCareer.blurb, values: { principal: 100000, monthlyContribution: 1500, annualReturn: 0.07, years: 20, marginalTaxRate: 0.28, capitalGainsRate: 0.15 } },
  ];

  return (
    <div>
      <style>{recalcPulseStyles}</style>

      <ModeHeader
        eyebrow={t.tax.eyebrow}
        title="The wrapper changes the ending."
        subtitle={t.tax.subtitle}
        actions={<ShareButton params={tax as unknown as Record<string, number>} />}
      />

      <ModeExplainer summary={t.tax.explainerSummary}>{t.tax.explainer}</ModeExplainer>

      <ScenarioPresets<TaxInputs> presets={presets} onApply={(v) => setTax(v)} title={t.presets.tax.title} />

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="label mb-4 text-emerald">AFTER-TAX RESULT</div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)] lg:items-start">
          <div className="grid gap-4">
            <section
              className={`card relative overflow-hidden shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] ${
                hasRoundedTie ? 'border-white/10 bg-white/[0.025]' : 'border-emerald/30 bg-emerald/5'
              }`}
            >
              <span
                aria-hidden
                className={`absolute inset-y-0 left-0 w-[3px] ${hasRoundedTie ? 'bg-border-strong' : 'bg-emerald'}`}
              />
              <div className={`label ${hasRoundedTie ? 'text-muted' : 'text-emerald'}`}>{resultKicker}</div>
              <div
                className={`mt-2 break-words text-4xl font-semibold tracking-tight sm:text-5xl ${
                  hasRoundedTie ? 'text-ink' : 'text-emerald'
                }`}
              >
                <RecalcPulse valueKey={resultHeadlineKey} tone={hasRoundedTie ? 'muted' : 'emerald'}>
                  {resultHeadline}
                </RecalcPulse>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{resultSummary}</p>
              <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 text-sm sm:grid-cols-2">
                <div>
                  <div className="label text-muted">Visible after-tax value</div>
                  <div className="mono mt-1 font-semibold text-ink">
                    <RecalcPulse valueKey={leader.roundedAfterTax} tone="muted">
                      {leaderAfterTaxDisplay}
                    </RecalcPulse>
                  </div>
                </div>
                <div>
                  <div className={`label ${hasRoundedTie ? 'text-muted' : 'text-emerald'}`}>{resultDeltaLabel}</div>
                  <div className={`mono mt-1 font-semibold ${hasRoundedTie ? 'text-ink' : 'text-emerald'}`}>
                    <RecalcPulse valueKey={resultDeltaKey} tone={hasRoundedTie ? 'muted' : 'emerald'}>
                      {resultDeltaValue}
                    </RecalcPulse>
                  </div>
                  {!hasRoundedTie && <div className="mt-0.5 text-xs text-muted">vs. {nextBest.label}</div>}
                </div>
              </div>
            </section>

            <PlainEnglish>
              {hasRoundedTie ? (
                <>
                  With these inputs,{' '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={resultHeadlineKey} tone="muted">
                      {tiedLeaders.map((account) => account.label).join(' and ')}
                    </RecalcPulse>
                  </strong>{' '}
                  show the same after-tax result once rounded:{' '}
                  <strong className="text-gain">
                    <RecalcPulse valueKey={leader.roundedAfterTax} tone="emerald">
                      {leaderAfterTaxDisplay}
                    </RecalcPulse>
                  </strong>.
                  There is no clear winner under these assumptions; the wrapper choice is effectively a tie in the displayed
                  result.
                </>
              ) : (
                <>
                  With these inputs,{' '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={resultHeadlineKey} tone="muted">
                      {leader.label}
                    </RecalcPulse>
                  </strong>{' '}
                  leaves the most usable money after tax:{' '}
                  <strong className="text-gain">
                    <RecalcPulse valueKey={leader.roundedAfterTax} tone="emerald">
                      {leaderAfterTaxDisplay}
                    </RecalcPulse>
                  </strong>.
                  That is{' '}
                  <strong className="text-gain">
                    <RecalcPulse valueKey={resultDeltaKey} tone="emerald">
                      {resultDeltaValue}
                    </RecalcPulse>
                  </strong>{' '}
                  more than <strong className="text-ink">{nextBest.label}</strong>. The difference comes from account
                  structure and tax timing, not a different fund or return assumption.
                </>
              )}
            </PlainEnglish>
          </div>

          <div className="grid gap-4">
            {accounts.map((account) => {
              const isLeader = account.roundedAfterTax === topRounded;
              const isTaxable = account.key === 'taxable';

              return (
                <section
                  key={account.key}
                  className={`relative overflow-hidden rounded-xl border p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] ${
                    isLeader
                      ? 'border-emerald/20 bg-emerald/[0.035]'
                      : isTaxable
                        ? 'border-[rgba(248,113,113,0.12)] bg-[rgba(239,68,68,0.025)]'
                        : 'border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)]'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-[3px] ${
                      isLeader ? 'bg-emerald/80' : isTaxable ? 'bg-red-400/45' : 'bg-border-strong'
                    }`}
                  />
                  <div className={`label ${isLeader ? 'text-emerald' : isTaxable ? 'text-red-300/80' : 'text-muted'}`}>
                    {account.heroLabel}
                  </div>
                  <div
                    className={`mono mt-1.5 break-words text-2xl font-semibold tracking-tight ${
                      isLeader ? 'text-emerald' : isTaxable ? 'text-red-200/90' : 'text-ink'
                    }`}
                  >
                    <RecalcPulse
                      valueKey={`${account.key}-${account.roundedAfterTax}`}
                      tone={isLeader ? 'emerald' : isTaxable ? 'red' : 'muted'}
                    >
                      {formatCurrency(account.afterTax)}
                    </RecalcPulse>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-muted">{account.note}</p>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative isolate grid gap-4 overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.16)] bg-[rgba(5,8,13,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald/35 before:to-transparent lg:grid-cols-[320px_1fr] lg:gap-5 lg:p-5">
        <div className="grid gap-3 self-start [&_.card]:border-[rgba(148,163,184,0.16)] [&_.card]:bg-[rgba(11,14,20,0.78)] [&_.card]:shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] [&_.input-number]:border-[rgba(148,163,184,0.22)] [&_.input-number]:bg-[rgba(5,8,13,0.72)] [&_input[type=range]]:accent-emerald">
          <div className="rounded-[1.125rem] border border-[rgba(34,197,94,0.14)] bg-[rgba(34,197,94,0.045)] px-4 py-3.5">
            <div className="label text-emerald">ACCOUNT ASSUMPTIONS</div>
            <p className="mt-1 text-sm text-muted">Adjust the contribution, tax rate, and time horizon behind the comparison.</p>
          </div>

          <InputPanel>
            <NumberInput
              label={t.inputs.startingPrincipal}
              value={tax.principal}
              onChange={(v) => setTax({ principal: v })}
              prefix="$"
              min={0}
              step={1000}
            />
            <NumberInput
              label={t.inputs.monthlyContribution}
              value={tax.monthlyContribution}
              onChange={(v) => setTax({ monthlyContribution: v })}
              prefix="$"
              min={0}
              step={50}
            />
            <InputSlider
              label={t.inputs.annualReturn}
              value={tax.annualReturn}
              onChange={(v) => setTax({ annualReturn: v })}
              min={0.01}
              max={0.15}
              step={0.005}
              displayMultiplier={100}
              displayDecimals={1}
              suffix="%"
            />
            <InputSlider
              label={t.inputs.years}
              value={tax.years}
              onChange={(v) => setTax({ years: v })}
              min={1}
              max={50}
              step={1}
              suffix={t.inputs.yrsSuffix}
            />
            <InputSlider
              label={t.inputs.marginalTaxRate}
              value={tax.marginalTaxRate}
              onChange={(v) => setTax({ marginalTaxRate: v })}
              min={0}
              max={0.5}
              step={0.01}
              displayMultiplier={100}
              displayDecimals={0}
              suffix="%"
              hint={t.hints.marginalTaxBrackets}
            />
            <InputSlider
              label={t.inputs.capitalGainsRate}
              value={tax.capitalGainsRate}
              onChange={(v) => setTax({ capitalGainsRate: v })}
              min={0}
              max={0.35}
              step={0.01}
              displayMultiplier={100}
              displayDecimals={0}
              suffix="%"
              hint={t.hints.capitalGainsBrackets}
            />
          </InputPanel>
        </div>

        <div>
          <div className="card relative grid min-w-0 gap-4 overflow-hidden border-[rgba(148,163,184,0.18)] bg-[rgba(8,12,18,0.84)] shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-emerald/60 before:via-emerald/20 before:to-transparent">
            <div className="border-b border-white/10 pb-4">
              <div className="label text-emerald">STRUCTURE AS PROOF</div>
              <p className="mt-1 text-sm text-muted">The chart keeps the same growth paths and shows how each wrapper changes usable ending value.</p>
            </div>
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[rgba(2,6,12,0.42)] px-3 pb-1 pt-3 md:px-4 md:pb-2 md:pt-4">
              <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            </div>
            <Callout>
              {hasRoundedTie ? (
                <>
                  <strong className="text-ink">
                    <RecalcPulse valueKey={resultHeadlineKey} tone="muted">
                      No clear winner
                    </RecalcPulse>
                  </strong>{' '}
                  appears in this scenario after rounding. The chart still shows how each legal wrapper changes the
                  path; the visible ending result is{' '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={resultDeltaKey} tone="muted">
                      effectively tied
                    </RecalcPulse>
                  </strong>.
                </>
              ) : (
                <>
                  <strong className="text-ink">
                    <RecalcPulse valueKey={resultHeadlineKey} tone="muted">
                      {winnerName}
                    </RecalcPulse>
                  </strong>{' '}
                  wins this scenario. The Traditional/RRSP line is highest pre-tax because the government temporarily
                  owns some of it. Roth/TFSA usually wins when your future tax bracket is equal-or-higher than today's.
                </>
              )}
            </Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
