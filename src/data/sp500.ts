/**
 * Monthly return series modeled on major equity indices across several historical regimes.
 * Each series is deterministically generated with a seeded PRNG and scaled so its realized
 * CAGR and volatility hit the documented targets exactly. Use these for illustration of
 * path-dependence (DCA vs. lump sum) — NOT raw index data, NOT for backtesting strategies.
 *
 * Target CAGR/vol numbers are rounded approximations of widely-cited historical figures
 * for each window/index. The "shape" is faithful enough to teach intuition (crashes hurt,
 * lost decades exist, Japan != US); the specific monthly path is synthetic.
 */

export interface ReturnPreset {
  id: string;
  /** Optional group label for visual grouping in the dropdown ('US', 'Europe', 'Asia', 'Crisis'). */
  group?: 'US broad market' | 'Crisis windows' | 'Europe' | 'Asia' | 'Other';
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
  let product = 1;
  for (const r of raw) product *= 1 + r;
  const targetProduct = Math.pow(1 + targetCAGR, months / 12);
  const adjust = Math.pow(targetProduct / product, 1 / months);
  return raw.map((r) => (1 + r) * adjust - 1);
}

// ── US broad market ──────────────────────────────────────────────────────────

export const SP500_1990_2020: ReturnPreset = {
  id: 'sp500-1990-2020',
  group: 'US broad market',
  label: 'S&P 500 · 1990–2020',
  description: 'Long, mostly favorable 30-year window — but includes the dot-com crash and 2008.',
  annualizedReturn: 0.102,
  monthlyReturns: generateSeries(360, 0.102, 0.15, 19900101),
};

export const SP500_2000_2020: ReturnPreset = {
  id: 'sp500-2000-2020',
  group: 'US broad market',
  label: 'S&P 500 · 2000–2020 (the "lost decade" start)',
  description: 'Starting right before the dot-com bust punishes lump-sum investors. ~6% CAGR.',
  annualizedReturn: 0.061,
  monthlyReturns: generateSeries(240, 0.061, 0.18, 20000101),
};

export const SP500_2009_2019: ReturnPreset = {
  id: 'sp500-2009-2019',
  group: 'US broad market',
  label: 'S&P 500 · 2009–2019 (post-GFC bull)',
  description: 'The decade after the 2008 crash. Lump sum runs away from DCA.',
  annualizedReturn: 0.135,
  monthlyReturns: generateSeries(120, 0.135, 0.12, 20090301),
};

export const DJIA_1990_2020: ReturnPreset = {
  id: 'djia-1990-2020',
  group: 'US broad market',
  label: 'Dow Jones (DJIA) · 1990–2020',
  description: 'The 30-stock Dow. Similar shape to S&P 500 — slightly lower CAGR, lower volatility.',
  annualizedReturn: 0.095,
  monthlyReturns: generateSeries(360, 0.095, 0.14, 19900102),
};

// ── Crisis windows ───────────────────────────────────────────────────────────

export const DOTCOM_2000_2003: ReturnPreset = {
  id: 'dotcom-2000-2003',
  group: 'Crisis windows',
  label: 'Dot-com crash · 2000–2003',
  description: 'Three years that vaporized half of the NASDAQ. ~-14% CAGR over the window.',
  annualizedReturn: -0.14,
  monthlyReturns: generateSeries(36, -0.14, 0.22, 20000115),
};

export const CRISIS_2007_2009: ReturnPreset = {
  id: 'crisis-2007-2009',
  group: 'Crisis windows',
  label: 'Global Financial Crisis · 2007–2009',
  description: 'The 2008 crash. S&P 500 lost ~55% peak-to-trough in 17 months. Very fast, very deep.',
  annualizedReturn: -0.25,
  monthlyReturns: generateSeries(30, -0.25, 0.3, 20070601),
};

export const GREAT_DEPRESSION_1929_1939: ReturnPreset = {
  id: 'great-depression',
  group: 'Crisis windows',
  label: 'Great Depression · 1929–1939',
  description: 'The worst US equity decade on record. ~-5% CAGR over ten years, with huge swings.',
  annualizedReturn: -0.05,
  monthlyReturns: generateSeries(120, -0.05, 0.3, 19291029),
};

// ── Europe ───────────────────────────────────────────────────────────────────

export const EUROSTOXX_2000_2020: ReturnPreset = {
  id: 'eurostoxx-2000-2020',
  group: 'Europe',
  label: 'Euro Stoxx 50 · 2000–2020',
  description: 'Blue-chip Eurozone index. Two crashes in two decades — modest long-run CAGR.',
  annualizedReturn: 0.025,
  monthlyReturns: generateSeries(240, 0.025, 0.20, 20000201),
};

export const IBEX_1995_2020: ReturnPreset = {
  id: 'ibex-1995-2020',
  group: 'Europe',
  label: 'IBEX 35 (Spain) · 1995–2020',
  description: 'Spanish large-cap index. Strong 90s/00s run, brutal 2008–2012 sovereign-debt era.',
  annualizedReturn: 0.045,
  monthlyReturns: generateSeries(300, 0.045, 0.22, 19950115),
};

// ── Asia ─────────────────────────────────────────────────────────────────────

export const NIKKEI_1990_2010: ReturnPreset = {
  id: 'nikkei-1990-2010',
  group: 'Asia',
  label: 'Nikkei 225 (Japan) · 1990–2010',
  description: 'The original "lost decades." 1989 peak, ~20 years of negative CAGR. Counterexample to "stocks always go up."',
  annualizedReturn: -0.025,
  monthlyReturns: generateSeries(240, -0.025, 0.20, 19900105),
};

export const NIKKEI_2012_2022: ReturnPreset = {
  id: 'nikkei-2012-2022',
  group: 'Asia',
  label: 'Nikkei 225 (Japan) · 2012–2022 (Abenomics recovery)',
  description: 'After two decades of decline, Japan finally trends up. ~8% CAGR over the window.',
  annualizedReturn: 0.08,
  monthlyReturns: generateSeries(120, 0.08, 0.17, 20120115),
};

export const RETURN_PRESETS: ReturnPreset[] = [
  SP500_1990_2020,
  SP500_2000_2020,
  SP500_2009_2019,
  DJIA_1990_2020,
  DOTCOM_2000_2003,
  CRISIS_2007_2009,
  GREAT_DEPRESSION_1929_1939,
  EUROSTOXX_2000_2020,
  IBEX_1995_2020,
  NIKKEI_1990_2010,
  NIKKEI_2012_2022,
];
