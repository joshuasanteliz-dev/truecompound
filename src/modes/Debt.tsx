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
import { useScenarioStore, type DebtInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { amortizeDebt, compound, creditCardMinimumSchedule, formatCurrency, formatMonths } from '@/engine';
import { useDebouncedValue } from '@/components/useDebouncedValue';

type RecalcPulseTone = 'emerald' | 'red' | 'muted';

const recalcPulseStyles = `
@keyframes debtRecalcPulse {
  0% {
    opacity: 0.72;
    transform: translateY(2px);
    text-shadow: 0 0 0 transparent;
  }

  48% {
    opacity: 1;
    text-shadow: 0 0 10px var(--debt-recalc-glow);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 0 transparent;
  }
}

.debt-recalc-pulse {
  --debt-recalc-glow: transparent;
  display: inline-block;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
  animation: debtRecalcPulse 190ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, text-shadow;
}

.debt-recalc-pulse--emerald {
  --debt-recalc-glow: rgba(34, 197, 94, 0.26);
}

.debt-recalc-pulse--red {
  --debt-recalc-glow: rgba(248, 113, 113, 0.2);
}

.debt-recalc-pulse--muted {
  --debt-recalc-glow: rgba(148, 163, 184, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .debt-recalc-pulse {
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
    <span key={valueKey} className={`debt-recalc-pulse debt-recalc-pulse--${tone}`}>
      {children}
    </span>
  );
}

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
  const finalDebtBalance = result.debtMonthly[result.debtMonthly.length - 1] ?? debounced.balance;
  const balanceText = formatCurrency(debounced.balance);
  const ratePctText = `${(debounced.rate * 100).toFixed(1)}% APR`;
  const finalInvestmentText = formatCurrency(finalInvestment);
  const finalDebtBalanceText = formatCurrency(finalDebtBalance);
  const payoffText = result.debtResult.paidOff ? formatMonths(result.debtResult.months) : 'No payoff path';
  const interestText = Number.isFinite(result.debtResult.totalInterest)
    ? formatCurrency(result.debtResult.totalInterest)
    : 'Not paid off';
  const totalPaidText = Number.isFinite(result.debtResult.totalPaid)
    ? formatCurrency(result.debtResult.totalPaid)
    : 'Not paid off';
  const monthlyInterestText = formatCurrency(monthlyInterest);
  const monthlyPaymentText = formatCurrency(debounced.monthlyAmount);
  const paymentAssumptionText = debounced.monthlyAmount > 0 ? monthlyPaymentText : 'minimum-payment mode';
  const payoffPulseKey = result.debtResult.paidOff ? `payoff-${payoffText}` : `no-payoff-${finalDebtBalanceText}`;
  const interestPulseKey = `interest-${interestText}`;
  const totalPaidPulseKey = `total-paid-${totalPaidText}`;
  const endBalancePulseKey = `end-balance-${finalDebtBalanceText}`;
  const investmentPulseKey = `investment-${finalInvestmentText}`;
  const monthlyInterestPulseKey = `monthly-interest-${monthlyInterestText}`;
  const resultTone = result.debtResult.paidOff ? 'text-ink' : 'text-red-200';
  const resultCardTone = result.debtResult.paidOff
    ? 'border-emerald/25 bg-emerald/[0.045]'
    : 'border-red-400/25 bg-[rgba(239,68,68,0.045)]';
  const resultAccent = result.debtResult.paidOff ? 'bg-emerald' : 'bg-red-400/80';
  const resultLabel = result.debtResult.paidOff ? 'Time to debt-free' : 'Payoff status';
  const resultSummary = result.debtResult.paidOff
    ? 'At this payment, the balance reaches zero. The real cost is the interest paid along the way.'
    : paymentTooLow
      ? 'At this payment, interest absorbs the progress before principal can shrink.'
      : 'Under this path, the balance does not reach zero inside the modeled window.';

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
      <style>{recalcPulseStyles}</style>

      {/* Desktop intro — original ModeHeader (with Share) + Explainer. Hidden on mobile,
          which uses the compact intro below and moves Share lower. */}
      <div className="hidden lg:block">
        <ModeHeader
          eyebrow={t.debt.eyebrow}
          title={t.debt.title}
          subtitle={t.debt.subtitle}
          actions={<ShareButton params={debt as unknown as Record<string, number>} />}
        />

        <ModeExplainer summary={t.debt.explainerSummary}>{t.debt.explainer}</ModeExplainer>
      </div>

      {/* Mobile intro — compact eyebrow/title/subtitle, no Share, tight spacing. */}
      <div className="mb-4 lg:hidden">
        <div className="label mb-1 text-emerald">{t.debt.eyebrow}</div>
        <h1 className="display-tight text-2xl leading-tight text-ink">{t.debt.title}</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-snug text-muted">{t.debt.subtitle}</p>
      </div>

      {/* Mobile explanation — collapsed and compact, near the top. Desktop shows it up top. */}
      <div className="mb-4 lg:hidden [&>.mode-explainer]:mb-0">
        <ModeExplainer summary={t.debt.explainerSummary}>{t.debt.explainer}</ModeExplainer>
      </div>

      {/* Presets — single horizontal scroll row on mobile; original wrapped row at lg. */}
      <div className="[&_.flex-wrap]:flex-nowrap [&_.flex-wrap]:overflow-x-auto [&_.flex-wrap]:pb-1 [&_.flex-wrap>button]:shrink-0 [&>div]:mb-4 lg:[&_.flex-wrap]:flex-wrap lg:[&_.flex-wrap]:overflow-visible lg:[&_.flex-wrap]:pb-0 lg:[&>div]:mb-6">
        <ScenarioPresets<DebtInputs> presets={presets} onApply={(v) => setDebt(v)} title={t.presets.debt.title} />
      </div>

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="label mb-4 text-red-300/80">PAYOFF RESULT</div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.9fr)] lg:items-start">
          <div className="grid gap-4">
            <section
              className={`card relative overflow-hidden shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] ${resultCardTone}`}
            >
              <span aria-hidden className={`absolute inset-y-0 left-0 w-[3px] ${resultAccent}`} />
              <div className={`label ${result.debtResult.paidOff ? 'text-emerald' : 'text-red-300/90'}`}>
                {resultLabel}
              </div>
              <div className={`mt-2 break-words text-4xl font-semibold tracking-tight sm:text-5xl ${resultTone}`}>
                <RecalcPulse valueKey={payoffPulseKey} tone={result.debtResult.paidOff ? 'muted' : 'red'}>
                  {payoffText}
                </RecalcPulse>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{resultSummary}</p>
            </section>

            {/* Desktop keeps Plain English beside the answer; on mobile it moves below the chart. */}
            <div className="hidden lg:block">
            <PlainEnglish>
              {result.debtResult.paidOff ? (
                <>
                  With a{' '}
                  <strong>
                    <RecalcPulse valueKey={`balance-${balanceText}`} tone="muted">
                      {balanceText}
                    </RecalcPulse>
                  </strong>{' '}
                  balance at{' '}
                  <strong>
                    <RecalcPulse valueKey={`rate-${ratePctText}`} tone="muted">
                      {ratePctText}
                    </RecalcPulse>
                  </strong>{' '}
                  and{' '}
                  <strong>
                    <RecalcPulse valueKey={`payment-${paymentAssumptionText}`} tone="muted">
                      {paymentAssumptionText}
                    </RecalcPulse>
                  </strong>{', the debt clears in '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={payoffPulseKey} tone="muted">
                      {payoffText}
                    </RecalcPulse>
                  </strong>{'. Interest costs '}
                  <strong className="text-loss">
                    <RecalcPulse valueKey={interestPulseKey} tone="red">
                      {interestText}
                    </RecalcPulse>
                  </strong>{', so the total cash paid is '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={totalPaidPulseKey} tone="muted">
                      {totalPaidText}
                    </RecalcPulse>
                  </strong>{'. The pressure is not moral; it is the math of interest taking the first cut every month.'}
                </>
              ) : (
                <>
                  With a{' '}
                  <strong>
                    <RecalcPulse valueKey={`balance-${balanceText}`} tone="muted">
                      {balanceText}
                    </RecalcPulse>
                  </strong>{' '}
                  balance at{' '}
                  <strong>
                    <RecalcPulse valueKey={`rate-${ratePctText}`} tone="muted">
                      {ratePctText}
                    </RecalcPulse>
                  </strong>{' '}
                  and{' '}
                  <strong>
                    <RecalcPulse valueKey={`payment-${paymentAssumptionText}`} tone="muted">
                      {paymentAssumptionText}
                    </RecalcPulse>
                  </strong>{', the balance does not reach zero in the modeled path. Starting monthly interest is about '}
                  <strong className="text-loss">
                    <RecalcPulse valueKey={monthlyInterestPulseKey} tone="red">
                      {monthlyInterestText}
                    </RecalcPulse>
                  </strong>
                  {'. Increasing the payment changes how much of each month goes to principal instead of interest.'}
                </>
              )}
            </PlainEnglish>
            </div>
          </div>

          {/* Secondary cards: desktop column. On mobile these move below the chart. */}
          <div className="hidden gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-1 xl:grid-cols-2">
            <section className="rounded-xl border border-[rgba(248,113,113,0.16)] bg-[rgba(239,68,68,0.035)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
              <div className="label text-red-300/85">{t.debt.heroDebtCosts}</div>
              <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-red-200">
                <RecalcPulse valueKey={interestPulseKey} tone="red">
                  {interestText}
                </RecalcPulse>
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">{t.debt.heroDebtCostsSub}</p>
            </section>

            <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
              <div className="label text-muted">Total paid</div>
              <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-ink">
                <RecalcPulse valueKey={totalPaidPulseKey} tone="muted">
                  {totalPaidText}
                </RecalcPulse>
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">Principal plus interest before payoff.</p>
            </section>

            <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
              <div className="label text-muted">Modeled end balance</div>
              <div
                className={`mono mt-1.5 break-words text-2xl font-semibold tracking-tight ${
                  result.debtResult.paidOff ? 'text-emerald' : 'text-red-200'
                }`}
              >
                <RecalcPulse valueKey={endBalancePulseKey} tone={result.debtResult.paidOff ? 'emerald' : 'red'}>
                  {finalDebtBalanceText}
                </RecalcPulse>
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">
                {result.debtResult.paidOff
                  ? 'The balance reaches zero in the schedule.'
                  : 'Remaining balance at the modeled end.'}
              </p>
            </section>

            <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
              <div className="label text-muted">{t.debt.heroInvestmentBecomes}</div>
              <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-ink">
                <RecalcPulse valueKey={investmentPulseKey} tone="muted">
                  {finalInvestmentText}
                </RecalcPulse>
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted">
                {t.debt.heroInvestmentBecomesSub(`${(debounced.rate * 100).toFixed(1)}%`)}
              </p>
            </section>
          </div>
        </div>
      </section>

      <div className="relative isolate grid gap-4 overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.16)] bg-[rgba(5,8,13,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-red-400/35 before:to-transparent lg:grid-cols-[320px_1fr] lg:gap-5 lg:p-5">
        <div className="grid gap-3 self-start [&_.card]:border-[rgba(148,163,184,0.16)] [&_.card]:bg-[rgba(11,14,20,0.78)] [&_.card]:shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] [&_.input-number]:border-[rgba(148,163,184,0.22)] [&_.input-number]:bg-[rgba(5,8,13,0.72)] [&_input[type=range]]:accent-red-400">
          <div className="rounded-[1.125rem] border border-[rgba(248,113,113,0.14)] bg-[rgba(239,68,68,0.04)] px-4 py-3.5">
            <div className="label text-red-300/85">DEBT ASSUMPTIONS</div>
            <p className="mt-1 text-sm text-muted">
              Adjust the balance, APR, payment, and modeled time window. The math underneath is unchanged.
            </p>
          </div>

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
        </div>

        <div>

          <div className="card relative grid min-w-0 gap-4 overflow-hidden border-[rgba(148,163,184,0.18)] bg-[rgba(8,12,18,0.84)] shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-red-400/60 before:via-red-400/20 before:to-transparent">
            <div className="grid gap-3 border-b border-white/10 pb-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <div className="label text-red-300/85">PATH AS PROOF</div>
                <p className="mt-1 text-sm text-muted">
                  The charts keep the same rate and starting balance, then show compounding on both sides of the equation.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-left sm:text-right">
                <div className="label text-muted">Starting monthly interest</div>
                <div className="mono mt-1 text-sm font-semibold text-ink">
                  <RecalcPulse valueKey={monthlyInterestPulseKey} tone="muted">
                    {monthlyInterestText}
                  </RecalcPulse>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(34,197,94,0.14)] bg-[rgba(2,6,12,0.42)] px-3 pb-1 pt-3 md:px-4 md:pb-2 md:pt-4">
                <h3 className="label mb-3 text-emerald">{t.debt.asInvestment}</h3>
                <GrowthChart series={investSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
              </div>
              <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(248,113,113,0.16)] bg-[rgba(2,6,12,0.42)] px-3 pb-1 pt-3 md:px-4 md:pb-2 md:pt-4">
                <h3 className="label mb-3 text-loss">{t.debt.asDebt}</h3>
                <GrowthChart series={debtSeries} xLabels={xLabels} xAxisLabel="Year" height={300} allowLogScale={false} />
              </div>
            </div>

            <Callout>
              {result.debtResult.paidOff ? (
                <>
                  Compounding can still be beaten here: the payment is high enough for principal to shrink after interest is
                  charged. The payoff path is{' '}
                  <strong className="text-ink">
                    <RecalcPulse valueKey={payoffPulseKey} tone="muted">
                      {payoffText}
                    </RecalcPulse>
                  </strong>{', with '}
                  <strong className="text-loss">
                    <RecalcPulse valueKey={interestPulseKey} tone="red">
                      {interestText}
                    </RecalcPulse>
                  </strong>{' '}
                  paid to interest.
                </>
              ) : (
                <>
                  At this payment, interest absorbs most of the progress. The balance shrinks slowly, or not at all,
                  because interest is taking the first cut before principal gets reduced. Starting monthly interest is{' '}
                  <strong className="text-loss">
                    <RecalcPulse valueKey={monthlyInterestPulseKey} tone="red">
                      {monthlyInterestText}
                    </RecalcPulse>
                  </strong>{', and the modeled end balance is '}
                  <strong className="text-loss">
                    <RecalcPulse valueKey={endBalancePulseKey} tone="red">
                      {finalDebtBalanceText}
                    </RecalcPulse>
                  </strong>{'.'}
                </>
              )}
            </Callout>
          </div>
        </div>
      </div>

      {/* Mobile-only: Plain English + secondary cards grouped after the charts so the
          payoff result sits right above the inputs. display:none at lg (desktop renders
          these inside the result section above — no duplicate a11y exposure). */}
      <div className="mt-5 grid gap-3 lg:hidden">
        <PlainEnglish>
          {result.debtResult.paidOff ? (
            <>
              With a{' '}
              <strong>
                <RecalcPulse valueKey={`balance-${balanceText}`} tone="muted">
                  {balanceText}
                </RecalcPulse>
              </strong>{' '}
              balance at{' '}
              <strong>
                <RecalcPulse valueKey={`rate-${ratePctText}`} tone="muted">
                  {ratePctText}
                </RecalcPulse>
              </strong>{' '}
              and{' '}
              <strong>
                <RecalcPulse valueKey={`payment-${paymentAssumptionText}`} tone="muted">
                  {paymentAssumptionText}
                </RecalcPulse>
              </strong>{', the debt clears in '}
              <strong className="text-ink">
                <RecalcPulse valueKey={payoffPulseKey} tone="muted">
                  {payoffText}
                </RecalcPulse>
              </strong>{'. Interest costs '}
              <strong className="text-loss">
                <RecalcPulse valueKey={interestPulseKey} tone="red">
                  {interestText}
                </RecalcPulse>
              </strong>{', so the total cash paid is '}
              <strong className="text-ink">
                <RecalcPulse valueKey={totalPaidPulseKey} tone="muted">
                  {totalPaidText}
                </RecalcPulse>
              </strong>{'. The pressure is not moral; it is the math of interest taking the first cut every month.'}
            </>
          ) : (
            <>
              With a{' '}
              <strong>
                <RecalcPulse valueKey={`balance-${balanceText}`} tone="muted">
                  {balanceText}
                </RecalcPulse>
              </strong>{' '}
              balance at{' '}
              <strong>
                <RecalcPulse valueKey={`rate-${ratePctText}`} tone="muted">
                  {ratePctText}
                </RecalcPulse>
              </strong>{' '}
              and{' '}
              <strong>
                <RecalcPulse valueKey={`payment-${paymentAssumptionText}`} tone="muted">
                  {paymentAssumptionText}
                </RecalcPulse>
              </strong>{', the balance does not reach zero in the modeled path. Starting monthly interest is about '}
              <strong className="text-loss">
                <RecalcPulse valueKey={monthlyInterestPulseKey} tone="red">
                  {monthlyInterestText}
                </RecalcPulse>
              </strong>
              {'. Increasing the payment changes how much of each month goes to principal instead of interest.'}
            </>
          )}
        </PlainEnglish>
        <div className="grid gap-3">
          <section className="rounded-xl border border-[rgba(248,113,113,0.16)] bg-[rgba(239,68,68,0.035)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
            <div className="label text-red-300/85">{t.debt.heroDebtCosts}</div>
            <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-red-200">
              <RecalcPulse valueKey={interestPulseKey} tone="red">
                {interestText}
              </RecalcPulse>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted">{t.debt.heroDebtCostsSub}</p>
          </section>

          <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
            <div className="label text-muted">Total paid</div>
            <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-ink">
              <RecalcPulse valueKey={totalPaidPulseKey} tone="muted">
                {totalPaidText}
              </RecalcPulse>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted">Principal plus interest before payoff.</p>
          </section>

          <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
            <div className="label text-muted">Modeled end balance</div>
            <div
              className={`mono mt-1.5 break-words text-2xl font-semibold tracking-tight ${
                result.debtResult.paidOff ? 'text-emerald' : 'text-red-200'
              }`}
            >
              <RecalcPulse valueKey={endBalancePulseKey} tone={result.debtResult.paidOff ? 'emerald' : 'red'}>
                {finalDebtBalanceText}
              </RecalcPulse>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted">
              {result.debtResult.paidOff
                ? 'The balance reaches zero in the schedule.'
                : 'Remaining balance at the modeled end.'}
            </p>
          </section>

          <section className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(11,14,20,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
            <div className="label text-muted">{t.debt.heroInvestmentBecomes}</div>
            <div className="mono mt-1.5 break-words text-2xl font-semibold tracking-tight text-ink">
              <RecalcPulse valueKey={investmentPulseKey} tone="muted">
                {finalInvestmentText}
              </RecalcPulse>
            </div>
            <p className="mt-1.5 text-xs leading-snug text-muted">
              {t.debt.heroInvestmentBecomesSub(`${(debounced.rate * 100).toFixed(1)}%`)}
            </p>
          </section>
        </div>
      </div>

      {/* Mobile-only: Share kept at the bottom so it never delays the calculator. */}
      <div className="mt-6 lg:hidden">
        <ShareButton params={debt as unknown as Record<string, number>} />
      </div>
    </div>
  );
}
