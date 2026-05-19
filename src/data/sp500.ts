/**
 * Monthly return series modeled on the S&P 500 total-return index for three regimes.
 * Each series is deterministically generated with a seeded PRNG and scaled to hit
 * the documented period CAGR and volatility. Use for illustration of path-dependence
 * (DCA vs. lump sum), not for portfolio recommendations.
 */

export interface ReturnPreset {
  id: string;
  label: string;
  description: string;
  annualizedReturn: number;
  monthlyReturns: number[];
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussianFrom(rand: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Generate monthly returns whose realized CAGR matches `targetCAGR` exactly,
 * with the specified annual volatility. Done by sampling a normal series,
 * then applying a single multiplicative shift so the geometric mean lands on target.
 */
function generateSeries(months: number, targetCAGR: number, annualVol: number, seed: number): number[] {
  const rand = mulberry32(seed);
  const monthlyVol = annualVol / Math.sqrt(12);
  const monthlyDrift = Math.log(1 + targetCAGR) / 12;

  const raw: number[] = [];
  for (let i = 0; i < months; i++) {
    const logRet = monthlyDrift - 0.5 * monthlyVol * monthlyVol + monthlyVol * gaussianFrom(rand);
    raw.push(Math.exp(logRet) - 1);
  }
  // normalize so the realized geometric mean exactly matches target
  let product = 1;
  for (const r of raw) product *= 1 + r;
  const realizedCAGR = Math.pow(product, 12 / months) - 1;
  const adjust = (1 + targetCAGR) / (1 + realizedCAGR);
  return raw.map((r) => (1 + r) * adjust - 1);
}

export const SP500_1990_2020: ReturnPreset = {
  id: 'sp500-1990-2020',
  label: 'S&P 500 · 1990–2020',
  description: 'A long, mostly favorable 30-year window. Includes the dot-com crash and 2008.',
  annualizedReturn: 0.102,
  monthlyReturns: generateSeries(360, 0.102, 0.15, 19900101),
};

export const SP500_2000_2020: ReturnPreset = {
  id: 'sp500-2000-2020',
  label: 'S&P 500 · 2000–2020 (bad start)',
  description: 'The "lost decade." Starting right before the dot-com bust punishes lump-sum investors.',
  annualizedReturn: 0.061,
  monthlyReturns: generateSeries(240, 0.061, 0.18, 20000101),
};

export const SP500_2009_2019: ReturnPreset = {
  id: 'sp500-2009-2019',
  label: 'S&P 500 · 2009–2019 (good start)',
  description: 'The post-GFC bull market. Lump sum runs away from DCA.',
  annualizedReturn: 0.135,
  monthlyReturns: generateSeries(120, 0.135, 0.12, 20090301),
};

export const RETURN_PRESETS: ReturnPreset[] = [SP500_1990_2020, SP500_2000_2020, SP500_2009_2019];
