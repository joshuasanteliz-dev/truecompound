import { describe, expect, it } from 'vitest';
import { compound, applyInflation } from '../compound';
import { calculateLumpSum, calculateDCA, flatMonthlyReturns } from '../dca';
import { amortizeDebt } from '../debt';
import { compareTaxAccounts } from '../tax';
import { runMonteCarlo } from '../montecarlo';
import { RETURN_PRESETS, SP500_1990_2020 } from '../../data/sp500';

describe('compound', () => {
  it('grows $0 + $0 to $0', () => {
    const r = compound(0, 0, 0.07, 10);
    expect(r.finalBalance).toBe(0);
  });

  it('matches FV formula for lump sum, no contributions', () => {
    const r = compound(10000, 0, 0.07, 10, 'annually');
    expect(r.finalBalance).toBeCloseTo(10000 * Math.pow(1.07, 10), 0);
  });

  it('can treat monthly compounding input as an effective annual return', () => {
    const r = compound(1000, 0, 0.075, 1, 'monthly', 'effectiveAnnual');
    expect(r.finalBalance).toBeCloseTo(1075, 6);
  });

  it('contributions add up correctly', () => {
    const r = compound(0, 100, 0, 1, 'monthly');
    expect(r.totalContributed).toBe(1200);
    expect(r.finalBalance).toBe(1200);
  });

  it('returns years+1 yearly balances', () => {
    const r = compound(1000, 50, 0.05, 5);
    expect(r.yearlyBalances).toHaveLength(6);
  });
});

describe('applyInflation', () => {
  it('discounts future values to present value', () => {
    const real = applyInflation([100, 103, 106.09], 0.03);
    expect(real[0]).toBeCloseTo(100, 4);
    expect(real[1]).toBeCloseTo(100, 4);
    expect(real[2]).toBeCloseTo(100, 4);
  });

  it('keeps effective annual nominal growth consistent with real return math', () => {
    const annualReturn = 0.075;
    const inflationRate = 0.03;
    const nominal = compound(1000, 0, annualReturn, 1, 'monthly', 'effectiveAnnual').yearlyBalances;
    const real = applyInflation(nominal, inflationRate);
    const realReturn = (1 + annualReturn) / (1 + inflationRate) - 1;

    expect(nominal[1]).toBeCloseTo(1075, 6);
    expect(real[1]).toBeCloseTo(1000 * (1 + realReturn), 6);
  });
});

describe('DCA vs lump sum', () => {
  it('lump sum equals DCA when returns are flat and DCA window = 1 month', () => {
    const returns = flatMonthlyReturns(0.07, 12);
    const ls = calculateLumpSum(12000, returns);
    const dca = calculateDCA(12000, returns, 1);
    expect(ls[ls.length - 1]).toBeCloseTo(dca[dca.length - 1], 0);
  });

  it('DCA underperforms lump sum in a flat, rising market', () => {
    const returns = flatMonthlyReturns(0.10, 24);
    const ls = calculateLumpSum(12000, returns);
    const dca = calculateDCA(12000, returns, 12);
    expect(ls[ls.length - 1]).toBeGreaterThan(dca[dca.length - 1]);
  });

  it('generated return presets realize their declared annualized returns', () => {
    for (const preset of RETURN_PRESETS) {
      const product = preset.monthlyReturns.reduce((acc, r) => acc * (1 + r), 1);
      const realizedCAGR = Math.pow(product, 12 / preset.monthlyReturns.length) - 1;

      expect(realizedCAGR).toBeCloseTo(preset.annualizedReturn, 10);
    }
  });

  it('keeps the S&P 500 1990-2020 lump sum result near the intended CAGR result', () => {
    const balances = calculateLumpSum(1000, SP500_1990_2020.monthlyReturns);
    const endingBalance = balances[balances.length - 1];

    expect(endingBalance).toBeCloseTo(18426.71, 2);
    expect(endingBalance).toBeLessThan(20000);
  });
});

describe('amortizeDebt', () => {
  it('pays off a simple loan', () => {
    const r = amortizeDebt(10000, 0.06, 200);
    expect(r.paidOff).toBe(true);
    expect(r.months).toBeGreaterThan(0);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it('returns paidOff:false when payment cannot cover interest', () => {
    const r = amortizeDebt(10000, 0.24, 10);
    expect(r.paidOff).toBe(false);
  });
});

describe('compareTaxAccounts', () => {
  it('Roth/TFSA outperforms taxable for identical contributions', () => {
    const r = compareTaxAccounts({
      principal: 10000,
      monthlyContribution: 500,
      annualReturn: 0.08,
      years: 30,
      marginalTaxRate: 0.3,
      capitalGainsRate: 0.15,
    });
    expect(r.rothTfsa.afterTax).toBeGreaterThan(r.taxable.afterTax);
  });
});

describe('runMonteCarlo', () => {
  it('returns 10/50/90 bands in increasing order', () => {
    const r = runMonteCarlo({
      startingBalance: 10000,
      monthlyContribution: 500,
      meanAnnualReturn: 0.07,
      annualStdDev: 0.15,
      years: 10,
      iterations: 200,
    });
    const last = r.p50.length - 1;
    expect(r.p10[last]).toBeLessThanOrEqual(r.p50[last]);
    expect(r.p50[last]).toBeLessThanOrEqual(r.p90[last]);
  });

  it('reports survival rate in withdrawal mode', () => {
    const r = runMonteCarlo({
      startingBalance: 100000,
      monthlyContribution: 0,
      meanAnnualReturn: 0.05,
      annualStdDev: 0.15,
      years: 30,
      iterations: 200,
      monthlyWithdrawal: 5000,
    });
    expect(r.survivalRate).toBeDefined();
    expect(r.survivalRate).toBeGreaterThanOrEqual(0);
    expect(r.survivalRate).toBeLessThanOrEqual(1);
  });
});
