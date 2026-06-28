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
import { useScenarioStore, type DebtInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { amortizeDebt, compound, creditCardMinimumSchedule, formatCurrency, formatMonths } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function Debt() {
  const t = useT();
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
    { label: t.debt.debtBalance, data: result.debtMonthly, color: '#EF4444', width: 2 },
  ];
  const investSeries: Series[] = [
    { label: t.debt.investmentBalance, data: result.investmentMonthly, color: '#22C55E', width: 2 },
  ];

  const monthlyInterest = (debounced.balance * debounced.rate) / 12;
  const paymentTooLow = debounced.monthlyAmount > 0 && debounced.monthlyAmount <= monthlyInterest;
  const finalInvestment = result.investmentMonthly[result.investmentMonthly.length - 1];

  const presetItems = t.presets.debt.items;
  const presets: PresetChip<DebtInputs>[] = [
    { label: presetItems.ccTrap.label, blurb: presetItems.ccTrap.blurb, values: { balance: 10000, rate: 0.24, years: 30, monthlyAmount: 0 } },
    { label: presetItems.mortgage.label, blurb: presetItems.mortgage.blurb, values: { balance: 300000, rate: 0.06, years: 30, monthlyAmount: 1800 } },
    { label: presetItems.student.label, blurb: presetItems.student.blurb, values: { balance: 30000, rate: 0.07, years: 10, monthlyAmount: 350 } },
    { label: presetItems.aggressive.label, blurb: presetItems.aggressive.blurb, values: { balance: 25000, rate: 0.12, years: 5, monthlyAmount: 1000 } },
    { label: presetItems.car.label, blurb: presetItems.car.blurb, values: { balance: 28000, rate: 0.08, years: 5, monthlyAmount: 570 } },
  ];

  return (
    <div>
      <ModeHeader
        eyebrow={t.debt.eyebrow}
        title={t.debt.title}
        subtitle={t.debt.subtitle}
        actions={<ShareButton params={debt as unknown as Record<string, number>} />}
      />

      <ModeExplainer summary={t.debt.explainerSummary}>{t.debt.explainer}</ModeExplainer>

      <ScenarioPresets<DebtInputs> presets={presets} onApply={(v) => setDebt(v)} title={t.presets.debt.title} />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <NumberInput
            label={t.inputs.balance}
            value={debt.balance}
            onChange={(v) => setDebt({ balance: v })}
            prefix="$"
            min={0}
            step={500}
            hint={t.hints.debtBalance}
          />
          <InputSlider
            label={t.inputs.apr}
            value={debt.rate}
            onChange={(v) => setDebt({ rate: v })}
            min={0.01}
            max={0.35}
            step={0.005}
            displayMultiplier={100}
            displayDecimals={1}
            suffix="%"
            hint={t.hints.debtRate}
          />
          <NumberInput
            label={t.inputs.monthlyPayment}
            value={debt.monthlyAmount}
            onChange={(v) => setDebt({ monthlyAmount: v })}
            prefix="$"
            min={0}
            step={25}
            hint={t.hints.debtPayment}
          />
          <InputSlider
            label={t.inputs.timeAxisMax}
            value={debt.years}
            onChange={(v) => setDebt({ years: v })}
            min={5}
            max={40}
            step={1}
            suffix={t.inputs.yrsSuffix}
          />
        </InputPanel>

        <div>
          <SanityWarning when={paymentTooLow} tone="danger" title={t.debt.warningTitle}>
            {t.debt.warningBody({
              rate: `${(debounced.rate * 100).toFixed(1)}%`,
              balance: formatCurrency(debounced.balance),
              interest: formatCurrency(monthlyInterest),
              payment: formatCurrency(debounced.monthlyAmount),
            })}
          </SanityWarning>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber
              label={t.debt.heroInvestmentBecomes}
              value={formatCurrency(finalInvestment)}
              tone="positive"
              sublabel={t.debt.heroInvestmentBecomesSub(`${(debounced.rate * 100).toFixed(1)}%`)}
            />
            <HeroNumber
              label={t.debt.heroDebtCosts}
              value={Number.isFinite(result.debtResult.totalInterest) ? formatCurrency(result.debtResult.totalInterest) : '∞'}
              tone="negative"
              sublabel={t.debt.heroDebtCostsSub}
            />
            <HeroNumber
              label={t.debt.heroTime}
              value={formatMonths(result.debtResult.months)}
              tone={result.debtResult.paidOff ? 'default' : 'negative'}
              sublabel={result.debtResult.paidOff ? '' : t.debt.heroTimeSubNeverPaid}
            />
          </div>

          <PlainEnglish>
            {t.debt.plainEnglish({
              balance: formatCurrency(debounced.balance),
              ratePct: `${(debounced.rate * 100).toFixed(1)}%`,
              payment: formatCurrency(debounced.monthlyAmount || monthlyInterest * 1.2),
              paidOff: result.debtResult.paidOff,
              timeText: formatMonths(result.debtResult.months),
              interest: formatCurrency(result.debtResult.totalInterest),
              investmentEnd: formatCurrency(finalInvestment),
            })}
          </PlainEnglish>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="label text-emerald mb-3">{t.debt.asInvestment}</h3>
              <GrowthChart series={investSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
            </div>
            <div className="card">
              <h3 className="label text-loss mb-3">{t.debt.asDebt}</h3>
              <GrowthChart series={debtSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
            </div>
          </div>
          <Callout>{t.debt.callout}</Callout>
        </div>
      </div>
    </div>
  );
}
