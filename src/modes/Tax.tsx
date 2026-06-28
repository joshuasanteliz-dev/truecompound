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
import { useT } from '@/i18n';
import { useScenarioStore, type TaxInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { compareTaxAccounts, formatCurrency } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

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

  const winner = ['rothTfsa', 'traditionalRrsp', 'taxable']
    .map((k) => ({ k, v: result[k as keyof typeof result].afterTax }))
    .sort((a, b) => b.v - a.v)[0];

  const winnerName =
    winner.k === 'rothTfsa'
      ? t.tax.accountNames.roth
      : winner.k === 'traditionalRrsp'
        ? t.tax.accountNames.traditional
        : t.tax.accountNames.taxable;

  const taxableGap = result.rothTfsa.afterTax - result.taxable.afterTax;

  const presetItems = t.presets.tax.items;
  const presets: PresetChip<TaxInputs>[] = [
    { label: presetItems.young.label, blurb: presetItems.young.blurb, values: { principal: 0, monthlyContribution: 500, annualReturn: 0.08, years: 30, marginalTaxRate: 0.22, capitalGainsRate: 0.15 } },
    { label: presetItems.peak.label, blurb: presetItems.peak.blurb, values: { principal: 50000, monthlyContribution: 2000, annualReturn: 0.08, years: 25, marginalTaxRate: 0.37, capitalGainsRate: 0.20 } },
    { label: presetItems.rothMax.label, blurb: presetItems.rothMax.blurb, values: { principal: 0, monthlyContribution: 583, annualReturn: 0.08, years: 35, marginalTaxRate: 0.24, capitalGainsRate: 0.15 } },
    { label: presetItems.midCareer.label, blurb: presetItems.midCareer.blurb, values: { principal: 100000, monthlyContribution: 1500, annualReturn: 0.07, years: 20, marginalTaxRate: 0.28, capitalGainsRate: 0.15 } },
  ];

  return (
    <div>
      <ModeHeader
        eyebrow={t.tax.eyebrow}
        title={t.tax.title}
        subtitle={t.tax.subtitle}
        actions={<ShareButton params={tax as unknown as Record<string, number>} />}
      />

      <ModeExplainer summary={t.tax.explainerSummary}>{t.tax.explainer}</ModeExplainer>

      <ScenarioPresets<TaxInputs> presets={presets} onApply={(v) => setTax(v)} title={t.presets.tax.title} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
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

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber
              label={t.tax.heroRoth}
              value={formatCurrency(result.rothTfsa.afterTax)}
              tone={winner.k === 'rothTfsa' ? 'positive' : 'default'}
            />
            <HeroNumber
              label={t.tax.heroTrad}
              value={formatCurrency(result.traditionalRrsp.afterTax)}
              tone={winner.k === 'traditionalRrsp' ? 'positive' : 'default'}
            />
            <HeroNumber
              label={t.tax.heroTaxable}
              value={formatCurrency(result.taxable.afterTax)}
              tone={winner.k === 'taxable' ? 'positive' : 'negative'}
            />
          </div>

          <PlainEnglish>
            {t.tax.plainEnglish({
              winner: winnerName,
              rothAfterTax: formatCurrency(result.rothTfsa.afterTax),
              taxableAfterTax: formatCurrency(result.taxable.afterTax),
              gap: formatCurrency(taxableGap),
            })}
          </PlainEnglish>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>{t.tax.callout(winnerName)}</Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
