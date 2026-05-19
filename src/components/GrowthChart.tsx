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

interface Props {
  series: Series[];
  xLabels: (string | number)[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  allowLogScale?: boolean;
  /** When true (default), values are rendered as currency. Set false for raw numbers. */
  currency?: boolean;
}

export function GrowthChart({
  series,
  xLabels,
  xAxisLabel = 'Year',
  yAxisLabel = 'Balance',
  height = 380,
  allowLogScale = true,
  currency = true,
}: Props) {
  const [scale, setScale] = useState<'linear' | 'logarithmic'>('linear');

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
        pointHoverBorderColor: '#fff',
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
      animation: { duration: 350, easing: 'easeOutQuart' },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0A0A0A',
          titleColor: '#FAFAF7',
          bodyColor: '#FAFAF7',
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          titleFont: { family: 'Inter', size: 13, weight: 600 },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          callbacks: {
            title: (items) => `${xAxisLabel} ${items[0].label}`,
            label: (ctx) => {
              const v = ctx.parsed.y ?? 0;
              return `  ${ctx.dataset.label}: ${currency ? formatCurrency(v) : v.toFixed(2)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)' },
          border: { display: false },
          ticks: { color: '#6B7280', font: { family: 'JetBrains Mono', size: 11 }, maxRotation: 0, autoSkipPadding: 18 },
          title: xAxisLabel
            ? { display: true, text: xAxisLabel, color: '#6B7280', font: { family: 'Inter', size: 11 } }
            : undefined,
        },
        y: {
          type: scale,
          grid: { color: 'rgba(0,0,0,0.06)' },
          border: { display: false },
          ticks: {
            color: '#6B7280',
            font: { family: 'JetBrains Mono', size: 11 },
            callback: (v) => {
              const n = Number(v);
              return currency ? formatCurrencyCompact(n) : String(n);
            },
          },
          title: yAxisLabel
            ? { display: true, text: yAxisLabel, color: '#6B7280', font: { family: 'Inter', size: 11 } }
            : undefined,
        },
      },
    }),
    [scale, xAxisLabel, yAxisLabel, currency],
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          {series.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs text-muted">
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
          <div className="flex rounded-md border border-gray-200 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setScale('linear')}
              className={`px-2 py-1 rounded ${scale === 'linear' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
            >
              Linear
            </button>
            <button
              type="button"
              onClick={() => setScale('logarithmic')}
              className={`px-2 py-1 rounded ${scale === 'logarithmic' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
            >
              Log
            </button>
          </div>
        )}
      </div>
      <div style={{ height }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
