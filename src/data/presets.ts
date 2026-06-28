/**
 * Scenario presets shown as one-click chips on each mode. The job of these
 * presets is teaching, not realism: each one is chosen because it produces a
 * vivid, intuition-building result a beginner can compare to other presets.
 *
 * See [[feedback-newbie-friendly]] (memory) — the target user has no finance
 * background, so canned scenarios beat blank sliders.
 */

import type { PresetChip } from '@/components/ScenarioPresets';
import type {
  InflationInputs,
  DCAInputs,
  DebtInputs,
  TaxInputs,
  MonteCarloInputs,
} from '@/store/store';

// ── Inflation presets ────────────────────────────────────────────────────────

export const INFLATION_PRESETS: PresetChip<InflationInputs>[] = [
  {
    label: 'Long-run US (3%)',
    blurb: 'The post-WWII US average. The "default" backdrop most modern advice assumes.',
    values: { inflationRate: 0.03 },
  },
  {
    label: '1970s stagflation (7%)',
    blurb: 'Oil shocks + loose monetary policy = a decade where inflation chewed through savings.',
    values: { inflationRate: 0.07 },
  },
  {
    label: 'War-era spike (10%)',
    blurb: 'Big-war or supply-shock regimes (post-WWII 1946, 1979 oil crisis). Double-digit price growth.',
    values: { inflationRate: 0.10 },
  },
  {
    label: '2021–2023 surge (5%)',
    blurb: 'Post-COVID inflation peak. Felt mild on paper, painful at the checkout.',
    values: { inflationRate: 0.05 },
  },
  {
    label: 'Japan deflation (0%)',
    blurb: '1990s–2010s Japan: prices flat or falling. Cash gains value just by sitting still.',
    values: { inflationRate: 0.00 },
  },
];

// ── DCA presets (preset id only; the full series lives in sp500.ts) ──────────

export const DCA_QUICK_PRESETS: PresetChip<DCAInputs>[] = [
  {
    label: 'Standard 30yr (S&P 1990–2020)',
    blurb: 'The "if you just held the S&P 500" baseline. Lump sum usually wins.',
    values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'sp500-1990-2020' },
  },
  {
    label: 'Bought at the top (dot-com)',
    blurb: 'You deploy everything in early 2000. The next 3 years are brutal.',
    values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'dotcom-2000-2003' },
  },
  {
    label: '2008 crash window',
    blurb: 'Mid-2007 to early 2009 — a -55% drawdown in 17 months. DCA earns its keep here.',
    values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'crisis-2007-2009' },
  },
  {
    label: 'Japan lost decades',
    blurb: 'The counterexample. 1990–2010: stocks went sideways/down for 20 years.',
    values: { totalCapital: 120000, deploymentMonths: 24, presetId: 'nikkei-1990-2010' },
  },
];

// ── Debt presets ─────────────────────────────────────────────────────────────

export const DEBT_PRESETS: PresetChip<DebtInputs>[] = [
  {
    label: 'Credit card minimum trap',
    blurb: 'A $10k balance at 24% APR with 2% minimum payments. Decades to clear, more interest than principal.',
    values: { balance: 10000, rate: 0.24, years: 30, monthlyAmount: 0 },
  },
  {
    label: 'Mortgage (6%)',
    blurb: 'A $300k mortgage at 6% with a typical $1,800/mo payment over 30 years.',
    values: { balance: 300000, rate: 0.06, years: 30, monthlyAmount: 1800 },
  },
  {
    label: 'Student loan (7%)',
    blurb: '$30k federal-loan-style balance at 7%, $350/mo payment — about 10 years to clear.',
    values: { balance: 30000, rate: 0.07, years: 10, monthlyAmount: 350 },
  },
  {
    label: 'Aggressive payoff',
    blurb: '$25k at 12% paid off at $1,000/mo. Watch how fast the balance falls.',
    values: { balance: 25000, rate: 0.12, years: 5, monthlyAmount: 1000 },
  },
  {
    label: 'Car loan (5yr)',
    blurb: '$28k auto loan at 8%, ~$570/mo for 60 months.',
    values: { balance: 28000, rate: 0.08, years: 5, monthlyAmount: 570 },
  },
];

// ── Tax presets ──────────────────────────────────────────────────────────────

export const TAX_PRESETS: PresetChip<TaxInputs>[] = [
  {
    label: 'Young investor',
    blurb: 'Starting from $0, $500/mo, low income (22% marginal rate). 30 years to retirement.',
    values: { principal: 0, monthlyContribution: 500, annualReturn: 0.08, years: 30, marginalTaxRate: 0.22, capitalGainsRate: 0.15 },
  },
  {
    label: 'Peak earner',
    blurb: 'High-income professional: $50k starting, $2,000/mo, 37% marginal rate. Pre-tax shelters shine.',
    values: { principal: 50000, monthlyContribution: 2000, annualReturn: 0.08, years: 25, marginalTaxRate: 0.37, capitalGainsRate: 0.20 },
  },
  {
    label: 'Roth IRA max-out',
    blurb: 'Maxing the $7k/yr Roth limit (~$583/mo) for 35 years at moderate tax rate.',
    values: { principal: 0, monthlyContribution: 583, annualReturn: 0.08, years: 35, marginalTaxRate: 0.24, capitalGainsRate: 0.15 },
  },
  {
    label: 'Mid-career catch-up',
    blurb: 'Started late: $100k saved, $1,500/mo for 20 years. 28% rate.',
    values: { principal: 100000, monthlyContribution: 1500, annualReturn: 0.07, years: 20, marginalTaxRate: 0.28, capitalGainsRate: 0.15 },
  },
];

// ── Monte Carlo presets ──────────────────────────────────────────────────────

export const MONTE_CARLO_PRESETS: PresetChip<MonteCarloInputs>[] = [
  {
    label: 'Building wealth (30yr)',
    blurb: '$50k saved, $1,000/mo for 30 years. Classic accumulation Monte Carlo.',
    values: {
      mode: 'accumulation',
      startingBalance: 50000,
      monthlyContribution: 1000,
      monthlyWithdrawal: 0,
      meanAnnualReturn: 0.08,
      annualStdDev: 0.15,
      years: 30,
      iterations: 1000,
    },
  },
  {
    label: 'Standard retirement',
    blurb: '$1M at 65, withdrawing $4k/mo for 30 years. The classic "4% rule" test.',
    values: {
      mode: 'withdrawal',
      startingBalance: 1000000,
      monthlyContribution: 0,
      monthlyWithdrawal: 4000,
      meanAnnualReturn: 0.07,
      annualStdDev: 0.15,
      years: 30,
      iterations: 1000,
    },
  },
  {
    label: 'FIRE / early retire',
    blurb: '$1.5M at 45, withdrawing $5k/mo for 40 years. Sequence risk is brutal here.',
    values: {
      mode: 'withdrawal',
      startingBalance: 1500000,
      monthlyContribution: 0,
      monthlyWithdrawal: 5000,
      meanAnnualReturn: 0.07,
      annualStdDev: 0.15,
      years: 40,
      iterations: 1000,
    },
  },
  {
    label: 'Conservative retire',
    blurb: '$1.5M, $4k/mo for 30 years. Roomier than 4% — watch the survival rate climb.',
    values: {
      mode: 'withdrawal',
      startingBalance: 1500000,
      monthlyContribution: 0,
      monthlyWithdrawal: 4000,
      meanAnnualReturn: 0.07,
      annualStdDev: 0.15,
      years: 30,
      iterations: 1000,
    },
  },
  {
    label: 'Stress test',
    blurb: '$500k, $3k/mo withdrawal, 25% volatility. Realistic worst-case shock scenario.',
    values: {
      mode: 'withdrawal',
      startingBalance: 500000,
      monthlyContribution: 0,
      monthlyWithdrawal: 3000,
      meanAnnualReturn: 0.06,
      annualStdDev: 0.25,
      years: 30,
      iterations: 1000,
    },
  },
];
