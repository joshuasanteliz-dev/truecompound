import { useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { InputSlider, NumberInput } from '@/components/InputSlider';
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
import { useScenarioStore, type InflationInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { applyInflation, compound, formatCurrency, formatPercent } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function Inflation() {
  const t = useT();
  const inflation = useScenarioStore((s) => s.inflation);
  const setInflation = useScenarioStore((s) => s.setInflation);

  useUrlHydrate(setInflation, {
    principal: 'number',
    monthlyContribution: 'number',
    annualReturn: 'number',
    inflationRate: 'number',
    years: 'int',
  });

  const debounced = useDebouncedValue(inflation, 200);

  const result = useMemo(() => {
    const c = compound(debounced.principal, debounced.monthlyContribution, debounced.annualReturn, debounced.years);
    const real = applyInflation(c.yearlyBalances, debounced.inflationRate);
    return { nominal: c.yearlyBalances, real };
  }, [debounced]);

  const finalNominal = result.nominal[result.nominal.length - 1];
  const finalReal = result.real[result.real.length - 1];
  const gap = finalNominal - finalReal;
  const realReturn = (1 + debounced.annualReturn) / (1 + debounced.inflationRate) - 1;
  const losingPower = realReturn < 0;

  const presetItems = t.presets.inflation.items;
  const presets: PresetChip<InflationInputs>[] = [
    { label: presetItems.longRun.label, blurb: presetItems.longRun.blurb, values: { inflationRate: 0.03 } },
    { label: presetItems.stagflation.label, blurb: presetItems.stagflation.blurb, values: { inflationRate: 0.07 } },
    { label: presetItems.warEra.label, blurb: presetItems.warEra.blurb, values: { inflationRate: 0.10 } },
    { label: presetItems.covid.label, blurb: presetItems.covid.blurb, values: { inflationRate: 0.05 } },
    { label: presetItems.japanDefl.label, blurb: presetItems.japanDefl.blurb, values: { inflationRate: 0.00 } },
  ];

  const series: Series[] = [
    { label: t.inflation.heroNominal, data: result.nominal, color: '#94A3B8', dashed: true, width: 2 },
    {
      label: t.inflation.heroReal,
      data: result.real,
      color: '#22C55E',
      width: 3,
      fill: { target: '0', color: 'rgba(239, 68, 68, 0.08)' },
    },
  ];

  const xLabels = result.nominal.map((_, i) => String(i));

  return (
    <div>
      <ModeHeader
        eyebrow={t.inflation.eyebrow}
        title={t.inflation.title}
        subtitle={t.inflation.subtitle}
        actions={<ShareButton params={inflation as unknown as Record<string, number>} />}
      />

      <ModeExplainer summary={t.inflation.explainerSummary}>{t.inflation.explainer}</ModeExplainer>

      <ScenarioPresets<InflationInputs> presets={presets} onApply={(v) => setInflation(v)} title={t.presets.inflation.title} />

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="label mb-4 text-emerald">REAL VALUE SUMMARY</div>

        <SanityWarning when={losingPower} tone="warning" title={t.inflation.warningTitle}>
          {t.inflation.warningBody({
            nominal: formatPercent(debounced.annualReturn),
            inflation: formatPercent(debounced.inflationRate),
            net: formatPercent(-realReturn),
          })}
        </SanityWarning>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)] lg:items-start">
          <div className="grid gap-4">
            <section className="card border-emerald/30 bg-emerald/5">
              <div className="label text-emerald">{t.inflation.heroReal}</div>
              <div className="mono mt-2 break-words text-4xl font-semibold tracking-tight text-emerald sm:text-5xl">
                {formatCurrency(finalReal)}
              </div>
              <div className="mt-2 text-sm text-muted">{t.inflation.heroRealSub}</div>
            </section>

            <PlainEnglish>
              {t.inflation.plainEnglish({
                years: debounced.years,
                nominal: formatCurrency(finalNominal),
                real: formatCurrency(finalReal),
                gap: formatCurrency(gap),
                realReturn: formatPercent(realReturn),
                annualReturn: formatPercent(debounced.annualReturn),
              })}
            </PlainEnglish>
          </div>

          <div className="grid gap-4">
            <HeroNumber
              label={t.inflation.heroNominal}
              value={formatCurrency(finalNominal)}
              tone="default"
              sublabel={t.inflation.heroNominalSub}
            />
            <HeroNumber
              label={t.inflation.heroDrag}
              value={`−${formatCurrency(gap)}`}
              tone="negative"
              sublabel={t.inflation.heroDragOfNominal(formatPercent(gap / Math.max(finalNominal, 1)))}
            />
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <NumberInput
            label={t.inputs.startingPrincipal}
            value={inflation.principal}
            onChange={(v) => setInflation({ principal: v })}
            prefix="$"
            min={0}
            step={1000}
          />
          <NumberInput
            label={t.inputs.monthlyContribution}
            value={inflation.monthlyContribution}
            onChange={(v) => setInflation({ monthlyContribution: v })}
            prefix="$"
            min={0}
            step={50}
          />
          <InputSlider
            label={t.inputs.annualReturn}
            value={inflation.annualReturn}
            onChange={(v) => setInflation({ annualReturn: v })}
            min={0}
            max={0.2}
            step={0.005}
            displayMultiplier={100}
            displayDecimals={1}
            suffix="%"
            hint={t.hints.annualReturnGeneric}
          />
          <InputSlider
            label={t.inputs.inflationRate}
            value={inflation.inflationRate}
            onChange={(v) => setInflation({ inflationRate: v })}
            min={0}
            max={0.15}
            step={0.0025}
            displayMultiplier={100}
            displayDecimals={2}
            suffix="%"
            hint={t.hints.inflationRateGeneric}
          />
          <InputSlider
            label={t.inputs.years}
            value={inflation.years}
            onChange={(v) => setInflation({ years: v })}
            min={1}
            max={50}
            step={1}
            suffix={t.inputs.yrsSuffix}
          />
        </InputPanel>

        <div className="card">
          <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="label text-emerald">CHART AS PROOF</div>
              <p className="mt-1 text-sm text-muted">The shaded gap is the purchasing power inflation removes.</p>
            </div>

            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-left sm:text-right">
              <div className="label text-muted">{t.inflation.heroDrag}</div>
              <div className="mono mt-1 text-sm font-semibold text-red-300">-{formatCurrency(gap)}</div>
            </div>
          </div>
          <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
          <Callout>{t.inflation.callout(formatCurrency(finalReal))}</Callout>
        </div>
      </div>
    </div>
  );
}
