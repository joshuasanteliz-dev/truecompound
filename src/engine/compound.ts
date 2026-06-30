export type Frequency = 'monthly' | 'annually';
export type RateConvention = 'nominal' | 'effectiveAnnual';

export interface CompoundResult {
  yearlyBalances: number[];
  finalBalance: number;
  totalContributed: number;
  totalInterest: number;
}

/**
 * Compound growth with periodic contributions.
 * Contributions are added at the start of each period.
 */
export function compound(
  principal: number,
  contribution: number,
  rate: number,
  years: number,
  frequency: Frequency = 'monthly',
  rateConvention: RateConvention = 'nominal',
): CompoundResult {
  const periodsPerYear = frequency === 'monthly' ? 12 : 1;
  const periodicRate =
    frequency === 'monthly' && rateConvention === 'effectiveAnnual'
      ? Math.pow(1 + rate, 1 / periodsPerYear) - 1
      : rate / periodsPerYear;
  const totalPeriods = Math.round(years * periodsPerYear);

  const yearlyBalances: number[] = [principal];
  let balance = principal;
  let totalContributed = principal;

  for (let p = 1; p <= totalPeriods; p++) {
    balance = (balance + contribution) * (1 + periodicRate);
    totalContributed += contribution;
    if (p % periodsPerYear === 0) {
      yearlyBalances.push(balance);
    }
  }

  return {
    yearlyBalances,
    finalBalance: balance,
    totalContributed,
    totalInterest: balance - totalContributed,
  };
}

/**
 * Convert nominal balances to today's-dollars (real) by discounting at inflation rate.
 * Index 0 is "now" — no discount; index n is n years in the future.
 */
export function applyInflation(balances: number[], inflationRate: number): number[] {
  return balances.map((b, year) => b / Math.pow(1 + inflationRate, year));
}
