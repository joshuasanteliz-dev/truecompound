import { useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { InputSlider, NumberInput } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { HeroNumber } from '@/components/HeroNumber';
import { Callout } from '@/components/Callout';
import { ShareButton } from '@/components/ShareButton';
import { useScenarioStore } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { applyInflation, compound, formatCurrency, formatPercent } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function Inflation() {
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
    return { nominal: c.yearlyBalances, real, totalContributed: c.totalContributed };
  }, [debounced]);

  const finalNominal = result.nominal[result.nominal.length - 1];
  const finalReal = result.real[result.real.length - 1];
  const gap = finalNominal - finalReal;

  const series: Series[] = [
    {
      label: 'Nominal balance',
      data: result.nominal,
      color: '#0F766E',
      width: 2,
    },
    {
      label: "Today's dollars (real)",
      data: result.real,
      color: '#0A0A0A',
      dashed: true,
      width: 2,
      fill: { target: '0', color: 'rgba(220, 38, 38, 0.06)' },
    },
  ];

  const xLabels = result.nominal.map((_, i) => String(i));

  return (
    <div>
      <ModeHeader
        eyebrow="Mode 01 · Inflation"
        title="The number you see isn't the number you'll spend."
        subtitle="A 7% nominal return at 3% inflation is really 4%. Watch the gap open."
        actions={<ShareButton params={inflation as unknown as Record<string, number>} />}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <NumberInput
            label="Starting principal"
            value={inflation.principal}
            onChange={(v) => setInflation({ principal: v })}
            prefix="$"
            min={0}
            step={1000}
          />
          <NumberInput
            label="Monthly contribution"
            value={inflation.monthlyContribution}
            onChange={(v) => setInflation({ monthlyContribution: v })}
            prefix="$"
            min={0}
            step={50}
          />
          <InputSlider
            label="Annual return"
            value={inflation.annualReturn}
            onChange={(v) => setInflation({ annualReturn: v })}
            min={0}
            max={0.2}
            step={0.005}
            displayMultiplier={100}
            displayDecimals={1}
            suffix="%"
          />
          <InputSlider
            label="Inflation rate"
            value={inflation.inflationRate}
            onChange={(v) => setInflation({ inflationRate: v })}
            min={0}
            max={0.1}
            step={0.0025}
            displayMultiplier={100}
            displayDecimals={2}
            suffix="%"
            hint="Long-run US average is ~3%."
          />
          <InputSlider
            label="Years"
            value={inflation.years}
            onChange={(v) => setInflation({ years: v })}
            min={1}
            max={50}
            step={1}
            suffix=" yrs"
          />
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber label="Nominal balance" value={formatCurrency(finalNominal)} tone="default" />
            <HeroNumber
              label={`Real (today's $)`}
              value={formatCurrency(finalReal)}
              tone="positive"
              sublabel={`What it'll actually buy you`}
            />
            <HeroNumber
              label="Inflation drag"
              value={`−${formatCurrency(gap)}`}
              tone="negative"
              sublabel={formatPercent(gap / Math.max(finalNominal, 1))}
            />
          </div>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>
              In today's dollars, you'll actually have <strong>{formatCurrency(finalReal)}</strong>. The shaded gap
              is purchasing power your future self quietly loses to inflation — it widens exponentially after about
              year 15.
            </Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
