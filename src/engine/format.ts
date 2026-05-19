const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const pct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2, minimumFractionDigits: 0 });

export function formatCurrency(n: number, decimals: 0 | 2 = 0): string {
  if (!Number.isFinite(n)) return '∞';
  return decimals === 0 ? usd0.format(n) : usd2.format(n);
}

export function formatCurrencyCompact(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return usd0.format(n);
}

export function formatPercent(n: number): string {
  return pct.format(n);
}

export function formatMonths(months: number): string {
  if (!Number.isFinite(months)) return 'never';
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}
