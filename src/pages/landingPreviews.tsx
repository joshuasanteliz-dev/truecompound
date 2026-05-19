/**
 * Tiny SVG sparklines for the landing-page mode cards. Pure SVG keeps the
 * landing page light and avoids spinning up Chart.js for static thumbnails.
 */

const W = 240;
const H = 96;
const PAD = 6;

function path(values: number[], smooth = true): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const dx = (W - PAD * 2) / (values.length - 1);
  const pts = values.map((v, i) => [PAD + i * dx, H - PAD - ((v - min) / span) * (H - PAD * 2)] as const);

  if (!smooth) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1];
    const [x2, y2] = pts[i];
    const cx = (x1 + x2) / 2;
    d += ` Q${cx.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return d;
}

function compoundSeries(rate: number, steps: number): number[] {
  const out: number[] = [];
  let v = 100;
  for (let i = 0; i <= steps; i++) {
    out.push(v);
    v *= 1 + rate;
  }
  return out;
}

export function MiniInflation() {
  const nominal = compoundSeries(0.08, 20);
  const real = nominal.map((v, i) => v / Math.pow(1.03, i));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <path d={`${path(nominal)} L${W - PAD},${H - PAD} L${PAD},${H - PAD} Z`} fill="rgba(220,38,38,0.08)" />
      <path d={path(real)} stroke="#0F766E" strokeWidth="2" fill="none" />
      <path d={path(nominal)} stroke="#0A0A0A" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    </svg>
  );
}

export function MiniDCA() {
  const lump = compoundSeries(0.09, 20);
  const dca = lump.map((v, i) => 100 + (v - 100) * Math.min(i / 5, 1));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <path d={path(lump)} stroke="#0F766E" strokeWidth="2" fill="none" />
      <path d={path(dca)} stroke="#0A0A0A" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    </svg>
  );
}

export function MiniDebt() {
  const investment = compoundSeries(0.07, 20);
  const debt = compoundSeries(0.07, 20).map((v, i) => 200 - (v - 100) * (i / 20));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <line x1={PAD} y1={H / 2} x2={W - PAD} y2={H / 2} stroke="#E5E7EB" strokeDasharray="2 3" />
      <path d={path(investment)} stroke="#0F766E" strokeWidth="2" fill="none" />
      <path d={path(debt)} stroke="#DC2626" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function MiniTax() {
  const roth = compoundSeries(0.08, 20);
  const trad = compoundSeries(0.08, 20).map((v) => v * 1.4);
  const taxable = compoundSeries(0.068, 20);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <path d={path(trad)} stroke="#6B7280" strokeWidth="2" fill="none" strokeDasharray="4 3" />
      <path d={path(roth)} stroke="#0F766E" strokeWidth="2" fill="none" />
      <path d={path(taxable)} stroke="#DC2626" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function MiniMonteCarlo() {
  const median = compoundSeries(0.07, 20);
  const p90 = median.map((v, i) => v * (1 + 0.04 * i));
  const p10 = median.map((v, i) => v / (1 + 0.03 * i));
  const upper = path(p90);
  const lower = path(p10);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <path
        d={`${upper} L${W - PAD},${H - PAD - ((p10[p10.length - 1] - Math.min(...p10)) / (Math.max(...p90) - Math.min(...p10))) * (H - PAD * 2)} ${lower
          .split(' ')
          .reverse()
          .join(' ')
          .replace(/M/g, 'L')} Z`}
        fill="rgba(15,118,110,0.12)"
      />
      <path d={path(p90)} stroke="#14B8A6" strokeWidth="1.5" fill="none" />
      <path d={path(median)} stroke="#0F766E" strokeWidth="2" fill="none" />
      <path d={path(p10)} stroke="#0A0A0A" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
    </svg>
  );
}
