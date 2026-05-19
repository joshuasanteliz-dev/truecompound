import { compound } from './compound';

export interface TaxComparisonInputs {
  principal: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  marginalTaxRate: number;
  capitalGainsRate: number;
}

export interface TaxComparisonResult {
  taxable: { yearlyBalances: number[]; afterTax: number };
  rothTfsa: { yearlyBalances: number[]; afterTax: number };
  traditionalRrsp: { yearlyBalances: number[]; afterTax: number };
}

/**
 * Apply annual capital-gains drag to a compounding portfolio.
 * Each year, gains are taxed at the capital gains rate (a simplification — assumes realization annually).
 */
export function applyTaxDrag(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  capitalGainsRate: number,
): number[] {
  const effectiveAnnualReturn = annualReturn * (1 - capitalGainsRate);
  return compound(principal, monthlyContribution, effectiveAnnualReturn, years, 'monthly').yearlyBalances;
}

/**
 * Side-by-side comparison of three account types.
 * - Taxable: capital-gains drag applied annually
 * - Roth/TFSA: contributions post-tax (assumed), no drag, no withdrawal tax
 * - Traditional/RRSP: contributions pre-tax (modeled as scaled-up by 1/(1-mtr)), no drag, but full balance taxed at withdrawal
 */
export function compareTaxAccounts(inputs: TaxComparisonInputs): TaxComparisonResult {
  const { principal, monthlyContribution, annualReturn, years, marginalTaxRate, capitalGainsRate } = inputs;

  const taxableBalances = applyTaxDrag(principal, monthlyContribution, annualReturn, years, capitalGainsRate);

  const rothBalances = compound(principal, monthlyContribution, annualReturn, years, 'monthly').yearlyBalances;

  const grossUpFactor = 1 / Math.max(1 - marginalTaxRate, 0.01);
  const traditionalBalances = compound(
    principal * grossUpFactor,
    monthlyContribution * grossUpFactor,
    annualReturn,
    years,
    'monthly',
  ).yearlyBalances;

  return {
    taxable: {
      yearlyBalances: taxableBalances,
      afterTax: taxableBalances[taxableBalances.length - 1],
    },
    rothTfsa: {
      yearlyBalances: rothBalances,
      afterTax: rothBalances[rothBalances.length - 1],
    },
    traditionalRrsp: {
      yearlyBalances: traditionalBalances,
      afterTax: traditionalBalances[traditionalBalances.length - 1] * (1 - marginalTaxRate),
    },
  };
}
