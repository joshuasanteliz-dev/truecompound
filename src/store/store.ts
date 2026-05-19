import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface InflationInputs {
  principal: number;
  monthlyContribution: number;
  annualReturn: number;
  inflationRate: number;
  years: number;
}

export interface DCAInputs {
  totalCapital: number;
  deploymentMonths: number;
  presetId: string;
}

export interface DebtInputs {
  balance: number;
  rate: number;
  years: number;
  monthlyAmount: number;
}

export interface TaxInputs {
  principal: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
  marginalTaxRate: number;
  capitalGainsRate: number;
}

export interface MonteCarloInputs {
  startingBalance: number;
  monthlyContribution: number;
  meanAnnualReturn: number;
  annualStdDev: number;
  years: number;
  iterations: number;
  mode: 'accumulation' | 'withdrawal';
  monthlyWithdrawal: number;
}

interface State {
  inflation: InflationInputs;
  dca: DCAInputs;
  debt: DebtInputs;
  tax: TaxInputs;
  monteCarlo: MonteCarloInputs;
  setInflation: (patch: Partial<InflationInputs>) => void;
  setDCA: (patch: Partial<DCAInputs>) => void;
  setDebt: (patch: Partial<DebtInputs>) => void;
  setTax: (patch: Partial<TaxInputs>) => void;
  setMonteCarlo: (patch: Partial<MonteCarloInputs>) => void;
  reset: () => void;
}

const defaults = {
  inflation: { principal: 10000, monthlyContribution: 500, annualReturn: 0.08, inflationRate: 0.03, years: 30 },
  dca: { totalCapital: 120000, deploymentMonths: 12, presetId: 'sp500-1990-2020' },
  debt: { balance: 25000, rate: 0.08, years: 20, monthlyAmount: 400 },
  tax: {
    principal: 10000,
    monthlyContribution: 500,
    annualReturn: 0.08,
    years: 30,
    marginalTaxRate: 0.32,
    capitalGainsRate: 0.15,
  },
  monteCarlo: {
    startingBalance: 50000,
    monthlyContribution: 1000,
    meanAnnualReturn: 0.08,
    annualStdDev: 0.15,
    years: 30,
    iterations: 1000,
    mode: 'accumulation' as const,
    monthlyWithdrawal: 4000,
  },
};

export const useScenarioStore = create<State>()(
  persist(
    (set) => ({
      ...defaults,
      setInflation: (patch) => set((s) => ({ inflation: { ...s.inflation, ...patch } })),
      setDCA: (patch) => set((s) => ({ dca: { ...s.dca, ...patch } })),
      setDebt: (patch) => set((s) => ({ debt: { ...s.debt, ...patch } })),
      setTax: (patch) => set((s) => ({ tax: { ...s.tax, ...patch } })),
      setMonteCarlo: (patch) => set((s) => ({ monteCarlo: { ...s.monteCarlo, ...patch } })),
      reset: () => set({ ...defaults }),
    }),
    { name: 'whatifmoney-v1' },
  ),
);

export const DEFAULTS = defaults;
