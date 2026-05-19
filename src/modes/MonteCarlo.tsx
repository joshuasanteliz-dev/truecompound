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
import { runMonteCarlo, formatCurrency, formatPercent } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function MonteCarlo() {
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
      label: '90th percentile',
      data: result.p90,
      color: '#14B8A6',
      width: 2,
      fill: { target: '+1', color: 'rgba(15, 118, 110, 0.12)' },
    },
    {
      label: 'Median (50th)',
      data: result.p50,
      color: '#0F766E',
      width: 2.5,
      fill: { target: '+1', color: 'rgba(15, 118, 110, 0.18)' },
    },
    {
      label: '10th percentile',
      data: result.p10,
      color: '#0A0A0A',
      width: 2,
      dashed: true,
    },
  ];

  const lastIdx = result.p50.length - 1;
  const isWithdrawal = mc.mode === 'withdrawal';

  return (
    <div>
      <ModeHeader
        eyebrow="Mode 05 · Monte Carlo"
        title={isWithdrawal ? 'Will the money last?' : 'A fan of futures, not a forecast.'}
        subtitle={
          isWithdrawal
            ? 'Run thousands of randomized return paths. Survival rate is the fraction of those paths where the portfolio reaches the finish line above zero.'
            : 'A single "average return" projection is a lie. The honest answer is a probability distribution.'
        }
        actions={<ShareButton params={mc as unknown as Record<string, string | number>} />}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <div className="flex rounded-md border border-gray-200 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMC({ mode: 'accumulation' })}
              className={`flex-1 px-2 py-1.5 rounded ${
                mc.mode === 'accumulation' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Accumulation
            </button>
            <button
              type="button"
              onClick={() => setMC({ mode: 'withdrawal' })}
              className={`flex-1 px-2 py-1.5 rounded ${
                mc.mode === 'withdrawal' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              Withdrawal
            </button>
          </div>

          <NumberInput
            label="Starting balance"
            value={mc.startingBalance}
            onChange={(v) => setMC({ startingBalance: v })}
            prefix="$"
            min={0}
            step={1000}
          />

          {mc.mode === 'accumulation' ? (
            <NumberInput
              label="Monthly contribution"
              value={mc.monthlyContribution}
              onChange={(v) => setMC({ monthlyContribution: v })}
              prefix="$"
              min={0}
              step={50}
            />
          ) : (
            <NumberInput
              label="Monthly withdrawal"
              value={mc.monthlyWithdrawal}
              onChange={(v) => setMC({ monthlyWithdrawal: v })}
              prefix="$"
              min={0}
              step={100}
            />
          )}

          <InputSlider
            label="Expected return"
            value={mc.meanAnnualReturn}
            onChange={(v) => setMC({ meanAnnualReturn: v })}
            min={0.01}
            max={0.15}
            step={0.005}
            displayMultiplier={100}
            displayDecimals={1}
            suffix="%"
          />
          <InputSlider
            label="Volatility (annual σ)"
            value={mc.annualStdDev}
            onChange={(v) => setMC({ annualStdDev: v })}
            min={0.02}
            max={0.4}
            step={0.01}
            displayMultiplier={100}
            displayDecimals={0}
            suffix="%"
            hint="S&P 500 is ~15%."
          />
          <InputSlider
            label="Years"
            value={mc.years}
            onChange={(v) => setMC({ years: v })}
            min={1}
            max={50}
            step={1}
            suffix=" yrs"
          />
          <InputSlider
            label="Iterations"
            value={mc.iterations}
            onChange={(v) => setMC({ iterations: v })}
            min={200}
            max={5000}
            step={100}
            hint="More iterations → smoother bands."
          />
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            {isWithdrawal ? (
              <HeroNumber
                label="Survival rate"
                value={formatPercent(result.survivalRate ?? 0)}
                tone={(result.survivalRate ?? 0) > 0.8 ? 'positive' : (result.survivalRate ?? 0) < 0.5 ? 'negative' : 'default'}
                sublabel={`${Math.round((result.survivalRate ?? 0) * mc.iterations)} of ${mc.iterations} runs ended ≥ $0`}
              />
            ) : (
              <HeroNumber
                label="Median outcome"
                value={formatCurrency(result.p50[lastIdx])}
                tone="positive"
                sublabel="50% of paths land above this"
              />
            )}
            <HeroNumber
              label="10th percentile"
              value={formatCurrency(result.p10[lastIdx])}
              tone="negative"
              sublabel="Bad-luck case"
            />
            <HeroNumber
              label="90th percentile"
              value={formatCurrency(result.p90[lastIdx])}
              tone="default"
              sublabel="Good-luck case"
            />
          </div>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>
              The shaded band is the middle 80% of possible futures. If the 10th-percentile line dips toward zero,
              the "average" projection is hiding a real risk of ruin — especially in withdrawal mode, where early
              losses compound against you (sequence-of-returns risk).
            </Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
