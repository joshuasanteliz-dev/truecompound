export interface DebtSchedule {
  month: number;
  balance: number;
  interestPaid: number;
  principalPaid: number;
}

export interface AmortizationResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: DebtSchedule[];
  paidOff: boolean;
}

/**
 * Amortize a debt at fixed monthly payment.
 * If payment is too low to cover interest, models negative amortization
 * through the 1200-month cap and returns paidOff: false.
 */
export function amortizeDebt(balance: number, apr: number, payment: number): AmortizationResult {
  const monthlyRate = apr / 12;
  const schedule: DebtSchedule[] = [{ month: 0, balance, interestPaid: 0, principalPaid: 0 }];

  let bal = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  const MAX_MONTHS = 1200;
  let month = 0;

  while (bal > 0.01 && month < MAX_MONTHS) {
    month++;
    const interest = bal * monthlyRate;
    let principal = payment - interest;
    if (principal > bal) principal = bal;
    bal = bal - principal;
    totalInterest += interest;
    totalPaid += principal > 0 ? interest + principal : payment;
    schedule.push({ month, balance: bal, interestPaid: interest, principalPaid: principal });
  }

  return {
    months: month,
    totalInterest,
    totalPaid,
    schedule,
    paidOff: bal <= 0.01,
  };
}

/**
 * Compute the minimum payment for a credit-card style debt:
 *   max(floorAmount, balance * minPercent + monthlyInterest)
 * Recomputed each month against the declining balance.
 */
export function creditCardMinimumSchedule(
  balance: number,
  apr: number,
  minPercent: number = 0.02,
  floorAmount: number = 25,
): AmortizationResult {
  const monthlyRate = apr / 12;
  const schedule: DebtSchedule[] = [{ month: 0, balance, interestPaid: 0, principalPaid: 0 }];
  let bal = balance;
  let totalInterest = 0;
  let totalPaid = 0;
  const MAX_MONTHS = 1200;
  let month = 0;

  while (bal > 0.01 && month < MAX_MONTHS) {
    month++;
    const interest = bal * monthlyRate;
    const minPayment = Math.max(floorAmount, bal * minPercent + interest);
    let principal = minPayment - interest;
    if (principal <= 0) {
      return { months: MAX_MONTHS, totalInterest: Infinity, totalPaid: Infinity, schedule, paidOff: false };
    }
    if (principal > bal) principal = bal;
    bal = bal - principal;
    totalInterest += interest;
    totalPaid += interest + principal;
    schedule.push({ month, balance: bal, interestPaid: interest, principalPaid: principal });
  }
  return { months: month, totalInterest, totalPaid, schedule, paidOff: bal <= 0.01 };
}
