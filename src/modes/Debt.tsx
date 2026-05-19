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
import { amortizeDebt, compound, creditCardMinimumSchedule, formatCurrency, formatMonths } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

const PRESETS = [
  { id: 'cc-trap', label: 'Credit card minimum trap', balance: 10000, rate: 0.24, years: 30, monthlyAmount: 0 },
  { id: 'mortgage', label: 'Mortgage-style 6%', balance: 300000, rate: 0.06, years: 30, monthlyAmount: 1800 },
  { id: 'student', label: 'Student loan 7%', balance: 30000, rate: 0.07, years: 10, monthlyAmount: 350 },
];

export default function Debt() {
  const debt = useScenarioStore((s) => s.debt);
  const setDebt = useScenarioStore((s) => s.setDebt);

  useUrlHydrate(setDebt, {
    balance: 'number',
    rate: 'number',
    years: 'int',
    monthlyAmount: 'number',
  });

  const debounced = useDebouncedValue(debt, 200);

  const result = useMemo(() => {
    const isCCTrap = debounced.monthlyAmount === 0;
    const debtResult = isCCTrap
      ? creditCardMinimumSchedule(debounced.balance, debounced.rate)
      : amortizeDebt(debounced.balance, debounced.rate, debounced.monthlyAmount);

    const investmentYears = Math.max(debounced.years, Math.ceil(debtResult.months / 12));
    const investment = compound(debounced.balance, 0, debounced.rate, investmentYears, 'monthly');

    const monthsCount = Math.min(debtResult.months, investmentYears * 12);
    const debtMonthly: number[] = [];
    for (let m = 0; m <= monthsCount; m++) {
      debtMonthly.push(debtResult.schedule[Math.min(m, debtResult.schedule.length - 1)]?.balance ?? 0);
    }

    const investmentMonthly: number[] = [];
    const monthlyRate = debounced.rate / 12;
    let bal = debounced.balance;
    investmentMonthly.push(bal);
    for (let m = 1; m <= monthsCount; m++) {
      bal = bal * (1 + monthlyRate);
      investmentMonthly.push(bal);
    }

    return { debtResult, investment, debtMonthly, investmentMonthly, monthsCount };
  }, [debounced]);

  const xLabels = result.debtMonthly.map((_, i) => (i % 12 === 0 ? String(i / 12) : ''));

  const debtSeries: Series[] = [
    { label: 'Debt balance', data: result.debtMonthly, color: '#DC2626', width: 2 },
  ];
  const investSeries: Series[] = [
    { label: 'Investment balance', data: result.investmentMonthly, color: '#0F766E', width: 2 },
  ];

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (p) setDebt({ balance: p.balance, rate: p.rate, years: p.years, monthlyAmount: p.monthlyAmount });
  };

  return (
    <div>
      <ModeHeader
        eyebrow="Mode 03 · Debt Mirror"
        title="The same math runs in both directions."
        subtitle="Compounding is symmetric. The investment chart and the debt chart are the same equation with the sign flipped."
        actions={<ShareButton params={debt as unknown as Record<string, number>} />}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <div>
            <label className="label block mb-1.5" htmlFor="preset">
              Preset
            </label>
            <select id="preset" onChange={(e) => applyPreset(e.target.value)} className="input-number" defaultValue="">
              <option value="" disabled>
                Load a scenario…
              </option>
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <NumberInput
            label="Balance"
            value={debt.balance}
            onChange={(v) => setDebt({ balance: v })}
            prefix="$"
            min={0}
            step={500}
          />
          <InputSlider
            label="Interest rate"
            value={debt.rate}
            onChange={(v) => setDebt({ rate: v })}
            min={0.01}
            max={0.35}
            step={0.005}
            displayMultiplier={100}
            displayDecimals={1}
            suffix="%"
          />
          <NumberInput
            label="Monthly payment"
            value={debt.monthlyAmount}
            onChange={(v) => setDebt({ monthlyAmount: v })}
            prefix="$"
            min={0}
            step={25}
            hint="Set 0 to use 2% credit-card minimum."
          />
          <InputSlider
            label="Time axis (max)"
            value={debt.years}
            onChange={(v) => setDebt({ years: v })}
            min={5}
            max={40}
            step={1}
            suffix=" yrs"
          />
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber
              label="Investment becomes"
              value={formatCurrency(result.investmentMonthly[result.investmentMonthly.length - 1])}
              tone="positive"
              sublabel={`At ${(debounced.rate * 100).toFixed(1)}%, no contributions`}
            />
            <HeroNumber
              label="Debt costs"
              value={Number.isFinite(result.debtResult.totalInterest) ? formatCurrency(result.debtResult.totalInterest) : '∞'}
              tone="negative"
              sublabel="Total interest paid"
            />
            <HeroNumber
              label="Time to payoff"
              value={formatMonths(result.debtResult.months)}
              tone={result.debtResult.paidOff ? 'default' : 'negative'}
              sublabel={result.debtResult.paidOff ? '' : 'Payment too low — debt grows'}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald mb-3">As an investment</h3>
              <GrowthChart series={investSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-loss mb-3">As a debt</h3>
              <GrowthChart series={debtSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
            </div>
          </div>
          <Callout>
            The shape is the same — exponential. The credit-card minimum-payment trap is what happens when your
            payment is barely above the interest line. The principal moves a millimeter while time moves a mile.
          </Callout>
        </div>
      </div>
    </div>
  );
}
