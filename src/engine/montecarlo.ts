export interface MonteCarloInputs {
  startingBalance: number;
  monthlyContribution: number;
  meanAnnualReturn: number;
  annualStdDev: number;
  years: number;
  iterations: number;
  mode?: 'accumulation' | 'withdrawal';
  monthlyWithdrawal?: number;
}

export interface MonteCarloResult {
  p10: number[];
  p50: number[];
  p90: number[];
  finalBalances: number[];
  survivalRate?: number;
  sampleRuns: number[][];
}

/**
 * Box-Muller transform — produces a normally-distributed random number.
 */
function gaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/**
 * Run iterations of monthly-step geometric Brownian-ish returns and return
 * percentile bands (10/50/90) for each year, plus final-balance distribution
 * and survival rate (for withdrawal mode).
 *
 * In withdrawal mode, a run is "successful" if balance
 * stays >= 0 for all months.
 */
export function runMonteCarlo(inputs: MonteCarloInputs): MonteCarloResult {
  const {
    startingBalance,
    monthlyContribution,
    meanAnnualReturn,
    annualStdDev,
    years,
    iterations,
    mode,
    monthlyWithdrawal = 0,
  } = inputs;

  const months = Math.round(years * 12);
  const monthlyMean = Math.pow(1 + meanAnnualReturn, 1 / 12) - 1;
  const monthlyStd = annualStdDev / Math.sqrt(12);
  const isWithdrawal = mode === 'withdrawal' || monthlyWithdrawal > 0;

  const yearlyByIteration: number[][] = [];
  const finalBalances: number[] = [];
  let survivors = 0;
  const SAMPLE_COUNT = Math.min(30, iterations);
  const sampleRuns: number[][] = [];

  for (let i = 0; i < iterations; i++) {
    let balance = startingBalance;
    const yearly: number[] = [balance];
    let survived = true;

    for (let m = 1; m <= months; m++) {
      const r = monthlyMean + monthlyStd * gaussian();
      balance = balance * (1 + r) + monthlyContribution - monthlyWithdrawal;
      if (balance < 0) {
        balance = 0;
        survived = false;
      }
      if (m % 12 === 0) yearly.push(balance);
    }

    yearlyByIteration.push(yearly);
    finalBalances.push(balance);
    if (survived) survivors++;
    if (i < SAMPLE_COUNT) sampleRuns.push(yearly);
  }

  const yearsCount = yearlyByIteration[0].length;
  const p10: number[] = [];
  const p50: number[] = [];
  const p90: number[] = [];

  for (let y = 0; y < yearsCount; y++) {
    const column = yearlyByIteration.map((run) => run[y]).sort((a, b) => a - b);
    p10.push(percentile(column, 0.1));
    p50.push(percentile(column, 0.5));
    p90.push(percentile(column, 0.9));
  }

  return {
    p10,
    p50,
    p90,
    finalBalances,
    survivalRate: isWithdrawal ? survivors / iterations : undefined,
    sampleRuns,
  };
}
