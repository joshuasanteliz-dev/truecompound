import { useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { NumberInput, InputSlider } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { HeroNumber } from '@/components/HeroNumber';
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

  const debounced = useDebouncedValue(mc, 300);

  const result = useMemo(
    () =>
      runMonteCarlo({
        startingBalance: debounced.startingBalance,
        monthlyContribution: debounced.mode === 'accumulation' ? debounced.monthlyContribution : 0,
        meanAnnualReturn: debounced.meanAnnualReturn,
        annualStdDev: debounced.annualStdDev,
        years: debounced.years,
        iterations: debounced.iterations,
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
      <ModeHeader
        eyebrow={t.montecarlo.eyebrow}
        title={isWithdrawal ? t.montecarlo.titleWithdraw : t.montecarlo.titleAccum}
        subtitle={isWithdrawal ? t.montecarlo.subtitleWithdraw : t.montecarlo.subtitleAccum}
        actions={<ShareButton params={mc as unknown as Record<string, string | number>} />}
      />

      <ModeExplainer summary={t.montecarlo.explainerSummary}>{t.montecarlo.explainer}</ModeExplainer>

      <ScenarioPresets<MonteCarloInputs> presets={presets} onApply={(v) => setMC(v)} title={t.presets.monteCarlo.title} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <div className="flex rounded-md border border-border bg-surface-2 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMC({ mode: 'accumulation' })}
              className={`flex-1 px-2 py-1.5 rounded font-semibold ${
                mc.mode === 'accumulation' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'
              }`}
            >
              {t.inputs.accumulation}
            </button>
            <button
              type="button"
              onClick={() => setMC({ mode: 'withdrawal' })}
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

        <div>
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

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {isWithdrawal ? (
              <HeroNumber
                label={t.montecarlo.heroSurvival}
                value={formatPercent(survivalRate)}
                tone={survivalRate > 0.8 ? 'positive' : survivalRate < 0.5 ? 'negative' : 'default'}
                sublabel={t.montecarlo.heroSurvivalSub(Math.round(survivalRate * mc.iterations), mc.iterations)}
              />
            ) : (
              <HeroNumber
                label={t.montecarlo.heroMedian}
                value={formatCurrency(result.p50[lastIdx])}
                tone="positive"
                sublabel={t.montecarlo.heroMedianSub}
              />
            )}
            <HeroNumber
              label={t.montecarlo.hero10}
              value={formatCurrency(result.p10[lastIdx])}
              tone="negative"
              sublabel={t.montecarlo.hero10Sub}
            />
            <HeroNumber
              label={t.montecarlo.hero90}
              value={formatCurrency(result.p90[lastIdx])}
              tone="default"
              sublabel={t.montecarlo.hero90Sub}
            />
          </div>

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
                  median: formatCurrency(result.p50[lastIdx]),
                  p10: formatCurrency(result.p10[lastIdx]),
                  p90: formatCurrency(result.p90[lastIdx]),
                })}
          </PlainEnglish>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>{t.montecarlo.callout}</Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
