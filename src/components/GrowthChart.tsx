import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  LogarithmicScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { useMemo, useState } from 'react';
import { formatCurrency, formatCurrencyCompact } from '@/engine/format';

ChartJS.register(LineElement, PointElement, LinearScale, LogarithmicScale, CategoryScale, Tooltip, Filler);

export interface Series {
  label: string;
  data: number[];
  color: string;
  fill?: { target: string; color: string } | false;
  dashed?: boolean;
  width?: number;
}

type ChartMotion = 'default' | 'proof' | 'none';

interface Props {
  series: Series[];
  xLabels: (string | number)[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  allowLogScale?: boolean;
  /** When true (default), values are rendered as currency. Set false for raw numbers. */
  currency?: boolean;
  motion?: ChartMotion;
  respectReducedMotion?: boolean;
  formatYTick?: (value: number) => string;
  formatTooltipValue?: (value: number) => string;
}

export function GrowthChart({
  series,
  xLabels,
  xAxisLabel = 'Year',
  yAxisLabel = 'Balance',
  height = 380,
  allowLogScale = true,
  currency = true,
  motion = 'default',
  respectReducedMotion = false,
  formatYTick,
  formatTooltipValue,
}: Props) {
  const [scale, setScale] = useState<'linear' | 'logarithmic'>('linear');
  const reducedMotion =
    respectReducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationDuration = reducedMotion || motion === 'none' ? 0 : motion === 'proof' ? 240 : 350;

  const data = useMemo<ChartData<'line'>>(
    () => ({
      labels: xLabels as unknown as string[],
      datasets: series.map((s, idx) => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        borderWidth: s.width ?? 2,
        borderDash: s.dashed ? [6, 4] : undefined,
        backgroundColor: s.fill ? s.fill.color : 'transparent',
        fill: s.fill ? s.fill.target : false,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: s.color,
        pointHoverBorderColor: '#0B0E14',
        pointHoverBorderWidth: 2,
        tension: 0.18,
        order: idx,
      })),
    }),
    [series, xLabels],
  );

  const options = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: animationDuration, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1A1E27',
          titleColor: '#F5F7FA',
          bodyColor: '#C9CFDB',
          borderColor: '#363B47',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          titleFont: { family: 'Inter', size: 13, weight: 700 },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          callbacks: {
            title: (items) => `${xAxisLabel} ${items[0].label}`,
            label: (ctx) => {
              const v = ctx.parsed.y ?? 0;
              return `  ${ctx.dataset.label}: ${
                formatTooltipValue ? formatTooltipValue(v) : currency ? formatCurrency(v) : v.toFixed(2)
              }`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { display: false },
          ticks: { color: '#8B92A5', font: { family: 'JetBrains Mono', size: 11 }, maxRotation: 0, autoSkipPadding: 18 },
          title: xAxisLabel
            ? { display: true, text: xAxisLabel, color: '#8B92A5', font: { family: 'Inter', size: 11, weight: 600 } }
            : undefined,
        },
        y: {
          type: scale,
          grid: { color: 'rgba(255,255,255,0.06)' },
          border: { display: false },
          ticks: {
            color: '#8B92A5',
            font: { family: 'JetBrains Mono', size: 11 },
            callback: (v) => {
              const n = Number(v);
              return formatYTick ? formatYTick(n) : currency ? formatCurrencyCompact(n) : String(n);
            },
          },
          title: yAxisLabel
            ? { display: true, text: yAxisLabel, color: '#8B92A5', font: { family: 'Inter', size: 11, weight: 600 } }
            : undefined,
        },
      },
    }),
    [scale, xAxisLabel, yAxisLabel, currency, animationDuration, formatYTick, formatTooltipValue],
  );

  // Concise text alternative for the canvas, which is otherwise opaque to assistive tech.
  const chartSummary = useMemo(() => {
    const fmt = currency ? (n: number) => formatCurrency(n) : (n: number) => formatCurrencyCompact(n);
    const parts = series.map((s) => {
      const start = s.data[0] ?? 0;
      const end = s.data[s.data.length - 1] ?? 0;
      return `${s.label}: ${fmt(start)} to ${fmt(end)}`;
    });
    return `Line chart of ${yAxisLabel.toLowerCase()} over ${xAxisLabel.toLowerCase()}. ${parts.join('. ')}.`;
  }, [series, currency, xAxisLabel, yAxisLabel]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs text-ink-dim">
              <span
                className="inline-block w-3 h-[3px] rounded-sm"
                style={{
                  backgroundColor: s.color,
                  borderTop: s.dashed ? `2px dashed ${s.color}` : 'none',
                  borderColor: s.color,
                }}
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        {allowLogScale && (
          <div className="flex rounded-md border border-border bg-surface-2 p-0.5 text-xs" role="group" aria-label="Chart scale">
            <button
              type="button"
              onClick={() => setScale('linear')}
              aria-pressed={scale === 'linear'}
              className={`px-2 py-1 rounded font-semibold ${scale === 'linear' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'}`}
            >
              Linear
            </button>
            <button
              type="button"
              onClick={() => setScale('logarithmic')}
              aria-pressed={scale === 'logarithmic'}
              className={`px-2 py-1 rounded font-semibold ${scale === 'logarithmic' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'}`}
            >
              Log
            </button>
          </div>
        )}
      </div>
      <div style={{ height }} role="img" aria-label={chartSummary}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
