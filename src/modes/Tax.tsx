import { useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { NumberInput, InputSlider } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { HeroNumber } from '@/components/HeroNumber';
import { Callout } from '@/components/Callout';
import { ShareButton } from '@/components/ShareButton';
import { useScenarioStore } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { compareTaxAccounts, formatCurrency } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function Tax() {
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
    { label: 'Roth / TFSA', data: result.rothTfsa.yearlyBalances, color: '#0F766E', width: 2 },
    {
      label: 'Traditional / RRSP (pre-tax)',
      data: result.traditionalRrsp.yearlyBalances,
      color: '#6B7280',
      width: 2,
      dashed: true,
    },
    { label: 'Taxable brokerage', data: result.taxable.yearlyBalances, color: '#DC2626', width: 2 },
  ];

  const winner = ['rothTfsa', 'traditionalRrsp', 'taxable']
    .map((k) => ({ k, v: result[k as keyof typeof result].afterTax }))
    .sort((a, b) => b.v - a.v)[0];

  const winnerLabel =
    winner.k === 'rothTfsa' ? 'Roth/TFSA' : winner.k === 'traditionalRrsp' ? 'Traditional/RRSP' : 'Taxable';

  return (
    <div>
      <ModeHeader
        eyebrow="Mode 04 · Tax Shelter"
        title="The account wrapper is worth more than the fund inside it."
        subtitle="Same contribution, same return, three legal envelopes. The gap at year 30 is sometimes more than your principal."
        actions={<ShareButton params={tax as unknown as Record<string, number>} />}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <NumberInput
            label="Starting principal"
            value={tax.principal}
            onChange={(v) => setTax({ principal: v })}
            prefix="$"
            min={0}
            step={1000}
          />
          <NumberInput
            label="Monthly contribution"
            value={tax.monthlyContribution}
            onChange={(v) => setTax({ monthlyContribution: v })}
            prefix="$"
            min={0}
            step={50}
          />
          <InputSlider
            label="Annual return"
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
            label="Years"
            value={tax.years}
            onChange={(v) => setTax({ years: v })}
            min={1}
            max={50}
            step={1}
            suffix=" yrs"
          />
          <InputSlider
            label="Marginal tax rate"
            value={tax.marginalTaxRate}
            onChange={(v) => setTax({ marginalTaxRate: v })}
            min={0}
            max={0.5}
            step={0.01}
            displayMultiplier={100}
            displayDecimals={0}
            suffix="%"
          />
          <InputSlider
            label="Capital gains rate"
            value={tax.capitalGainsRate}
            onChange={(v) => setTax({ capitalGainsRate: v })}
            min={0}
            max={0.35}
            step={0.01}
            displayMultiplier={100}
            displayDecimals={0}
            suffix="%"
          />
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber
              label="Roth / TFSA (after-tax)"
              value={formatCurrency(result.rothTfsa.afterTax)}
              tone={winner.k === 'rothTfsa' ? 'positive' : 'default'}
            />
            <HeroNumber
              label="Traditional / RRSP (after-tax)"
              value={formatCurrency(result.traditionalRrsp.afterTax)}
              tone={winner.k === 'traditionalRrsp' ? 'positive' : 'default'}
            />
            <HeroNumber
              label="Taxable brokerage (after-tax)"
              value={formatCurrency(result.taxable.afterTax)}
              tone={winner.k === 'taxable' ? 'positive' : 'negative'}
            />
          </div>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>
              <strong>{winnerLabel}</strong> wins this scenario. The Traditional/RRSP line is highest pre-tax because
              the government temporarily owns some of it. Roth/TFSA usually wins when your future tax bracket is
              equal-or-higher than today's.
            </Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
