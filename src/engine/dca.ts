/**
 * Lump sum strategy: deploy all capital on day one, ride the monthly return series.
 * Returns the balance at the end of each month (length = monthlyReturns.length + 1, including initial).
 */
export function calculateLumpSum(totalCapital: number, monthlyReturns: number[]): number[] {
  const balances: number[] = [totalCapital];
  let bal = totalCapital;
  for (const r of monthlyReturns) {
    bal = bal * (1 + r);
    balances.push(bal);
  }
  return balances;
}

/**
 * Dollar-cost averaging: deploy capital evenly over `deploymentMonths`, the rest sits in cash (0% return) until deployed.
 * If deploymentMonths >= monthlyReturns.length, deploy across all available months.
 */
export function calculateDCA(
  totalCapital: number,
  monthlyReturns: number[],
  deploymentMonths?: number,
): number[] {
  const months = monthlyReturns.length;
  const deployOver = Math.min(deploymentMonths ?? months, months);
  const perMonth = totalCapital / deployOver;

  const balances: number[] = [0];
  let invested = 0;
  let cash = totalCapital;

  for (let m = 0; m < months; m++) {
    if (m < deployOver) {
      invested = invested + perMonth;
      cash = cash - perMonth;
    }
    invested = invested * (1 + monthlyReturns[m]);
    balances.push(invested + Math.max(cash, 0));
  }
  return balances;
}

/**
 * Convert an annual return rate to a flat monthly return series of length `months`.
 * Useful as a fallback when historical data isn't selected.
 */
export function flatMonthlyReturns(annualRate: number, months: number): number[] {
  const monthly = Math.pow(1 + annualRate, 1 / 12) - 1;
  return new Array(months).fill(monthly);
}
