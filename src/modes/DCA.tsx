import { type ReactNode, useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { NumberInput, InputSlider } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { HeroNumber } from '@/components/HeroNumber';
import { Callout } from '@/components/Callout';
import { ShareButton } from '@/components/ShareButton';
import { ModeExplainer } from '@/components/ModeExplainer';
import { ScenarioPresets, type PresetChip } from '@/components/ScenarioPresets';
import { PlainEnglish } from '@/components/PlainEnglish';
import { useT } from '@/i18n';
import { useScenarioStore, type DCAInputs } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { calculateDCA, calculateLumpSum, formatCurrency } from '@/engine';
import { RETURN_PRESETS } from '@/data/sp500';
import { useDebouncedValue } from '@/components/useDebouncedValue';

type RecalcPulseTone = 'emerald' | 'muted';

const recalcPulseStyles = `
@keyframes dcaRecalcPulse {
  0% {
    opacity: 0.68;
    transform: translateY(3px);
    text-shadow: 0 0 0 transparent;
  }

  48% {
    opacity: 1;
    text-shadow: 0 0 12px var(--dca-recalc-glow);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    text-shadow: 0 0 0 transparent;
  }
}

.dca-recalc-pulse {
  --dca-recalc-glow: transparent;
  display: inline-block;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
  white-space: normal;
  word-break: break-word;
  animation: dcaRecalcPulse 190ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, text-shadow;
}

.dca-recalc-pulse--emerald {
  --dca-recalc-glow: rgba(34, 197, 94, 0.34);
}

.dca-recalc-pulse--muted {
  --dca-recalc-glow: rgba(148, 163, 184, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  .dca-recalc-pulse {
    animation: none;
  }
}
`;

function RecalcPulse({
  valueKey,
  tone = 'muted',
  children,
}: {
  valueKey: string | number;
  tone?: RecalcPulseTone;
  children: ReactNode;
}) {
  return (
    <span key={valueKey} className={`dca-recalc-pulse dca-recalc-pulse--${tone}`}>
      {children}
    </span>
  );
}

function recalcTextValue<T extends string | number>(valueKey: string | number, tone: RecalcPulseTone, children: ReactNode) {
  return (
    <RecalcPulse valueKey={valueKey} tone={tone}>
      {children}
    </RecalcPulse>
  ) as unknown as T;
}

export default function DCA() {
  const t = useT();
  const dca = useScenarioStore((s) => s.dca);
  const setDCA = useScenarioStore((s) => s.setDCA);

  useUrlHydrate(setDCA, {
    totalCapital: 'number',
    deploymentMonths: 'int',
    presetId: 'string',
  });

  const debounced = useDebouncedValue(dca, 200);

  const preset = RETURN_PRESETS.find((p) => p.id === debounced.presetId) ?? RETURN_PRESETS[0];
  const presetMeta = t.historicalSeries[preset.id];
  const presetLabel = presetMeta?.label ?? preset.label;
  const presetDescription = presetMeta?.description ?? preset.description;

  const result = useMemo(() => {
    const lumpSum = calculateLumpSum(debounced.totalCapital, preset.monthlyReturns);
    const dcaPath = calculateDCA(debounced.totalCapital, preset.monthlyReturns, debounced.deploymentMonths);
    return { lumpSum, dcaPath };
  }, [debounced, preset]);

  const finalLump = result.lumpSum[result.lumpSum.length - 1];
  const finalDCA = result.dcaPath[result.dcaPath.length - 1];
  const diff = finalLump - finalDCA;
  const lumpWins = diff >= 0;
  const winnerLabel = lumpWins ? t.dca.winnerLump : t.dca.winnerDCA;
  const diffAbs = Math.abs(diff);
  const isCloseResult = diffAbs <= Math.max(finalLump, finalDCA, 1) * 0.005;

  const xLabels = result.lumpSum.map((_, i) => (i % 12 === 0 ? String(i / 12) : ''));

  const series: Series[] = [
    { label: t.dca.lumpSumLabel, data: result.lumpSum, color: '#22C55E', width: 2 },
    { label: t.dca.dcaLineLabel(debounced.deploymentMonths), data: result.dcaPath, color: '#F5F7FA', width: 2, dashed: true },
  ];

  const presetItems = t.presets.dca.items;
  const presetChips: PresetChip<DCAInputs>[] = [
    { label: presetItems.standard.label, blurb: presetItems.standard.blurb, values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'sp500-1990-2020' } },
    { label: presetItems.dotcomTop.label, blurb: presetItems.dotcomTop.blurb, values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'dotcom-2000-2003' } },
    { label: presetItems.crisis2008.label, blurb: presetItems.crisis2008.blurb, values: { totalCapital: 120000, deploymentMonths: 12, presetId: 'crisis-2007-2009' } },
    { label: presetItems.japan.label, blurb: presetItems.japan.blurb, values: { totalCapital: 120000, deploymentMonths: 24, presetId: 'nikkei-1990-2010' } },
  ];

  // Group historical-series options by their translated group label.
  const seriesGroups = RETURN_PRESETS.reduce<Array<{ label: string; items: typeof RETURN_PRESETS }>>((groups, p) => {
    const groupLabel = t.historicalSeries[p.id]?.group ?? p.group ?? 'Other';
    const existing = groups.find((group) => group.label === groupLabel);
    if (existing) {
      existing.items.push(p);
    } else {
      groups.push({ label: groupLabel, items: [p] });
    }
    return groups;
  }, []);
  const selectedPreset = RETURN_PRESETS.find((p) => p.id === dca.presetId) ?? preset;
  const activeGroupLabel = t.historicalSeries[selectedPreset.id]?.group ?? selectedPreset.group ?? 'Other';
  const activeGroup = seriesGroups.find((group) => group.label === activeGroupLabel) ?? seriesGroups[0];

  return (
    <div>
      <style>{recalcPulseStyles}</style>

      <ModeHeader
        eyebrow={t.dca.eyebrow}
        title={t.dca.title}
        subtitle={t.dca.subtitle}
        actions={<ShareButton params={dca as unknown as Record<string, string | number>} />}
      />

      <ModeExplainer summary={t.dca.explainerSummary}>{t.dca.explainer}</ModeExplainer>

      <ScenarioPresets<DCAInputs>
        presets={presetChips}
        onApply={(v) => setDCA(v)}
        title={t.presets.dca.title}
        activeLabel={presetChips.find((p) => p.values.presetId === dca.presetId)?.label}
      />

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        <div className="label mb-4 text-emerald">TIMING RESULT</div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.75fr)] lg:items-start">
          <div className="grid gap-4">
            <section className={`card ${isCloseResult ? 'border-white/10 bg-white/[0.02]' : 'border-emerald/30 bg-emerald/5'}`}>
              <div className={`label ${isCloseResult ? 'text-muted' : 'text-emerald'}`}>
                {t.dca.heroWinsBy(winnerLabel)}
              </div>
              <div
                className={`mono mt-2 break-words text-4xl font-semibold tracking-tight sm:text-5xl ${
                  isCloseResult ? 'text-ink' : 'text-emerald'
                }`}
              >
                <RecalcPulse valueKey={diffAbs} tone={isCloseResult ? 'muted' : 'emerald'}>
                  {formatCurrency(diffAbs)}
                </RecalcPulse>
              </div>
              <div className="mt-2 text-sm text-muted">{lumpWins ? t.dca.heroSubLump : t.dca.heroSubDCA}</div>
            </section>

            <PlainEnglish>
              {t.dca.plainEnglish({
                capital: recalcTextValue<string>(debounced.totalCapital, 'muted', formatCurrency(debounced.totalCapital)),
                presetLabel,
                finalLump: recalcTextValue<string>(finalLump, lumpWins ? 'emerald' : 'muted', formatCurrency(finalLump)),
                finalDCA: recalcTextValue<string>(finalDCA, !lumpWins ? 'emerald' : 'muted', formatCurrency(finalDCA)),
                deployMonths: recalcTextValue<number>(debounced.deploymentMonths, 'muted', debounced.deploymentMonths),
                winnerLabel,
                diff: recalcTextValue<string>(diffAbs, isCloseResult ? 'muted' : 'emerald', formatCurrency(diffAbs)),
                lumpWins,
              })}
            </PlainEnglish>
          </div>

          <div className="grid gap-4 [&_.hero-number]:border-[rgba(148,163,184,0.16)] [&_.hero-number]:bg-[rgba(11,14,20,0.78)] [&_.hero-number]:shadow-[inset_0_1px_0_rgba(245,247,250,0.035)]">
            <HeroNumber
              label={t.dca.heroLump}
              value={
                <RecalcPulse valueKey={finalLump} tone="muted">
                  {formatCurrency(finalLump)}
                </RecalcPulse>
              }
              tone="default"
            />
            <HeroNumber
              label={t.dca.heroDCA}
              value={
                <RecalcPulse valueKey={finalDCA} tone="muted">
                  {formatCurrency(finalDCA)}
                </RecalcPulse>
              }
              tone="default"
            />
          </div>
        </div>
      </section>

      <div className="relative isolate grid gap-4 overflow-hidden rounded-3xl border border-[rgba(148,163,184,0.16)] bg-[rgba(5,8,13,0.72)] p-4 shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald/35 before:to-transparent lg:grid-cols-[320px_1fr] lg:gap-5 lg:p-5">
        <div className="grid gap-3 self-start [&_.card]:border-[rgba(148,163,184,0.16)] [&_.card]:bg-[rgba(11,14,20,0.78)] [&_.card]:shadow-[inset_0_1px_0_rgba(245,247,250,0.035)] [&_.input-number]:border-[rgba(148,163,184,0.22)] [&_.input-number]:bg-[rgba(5,8,13,0.72)] [&_input[type=range]]:accent-emerald">
          <div className="rounded-[1.125rem] border border-[rgba(34,197,94,0.14)] bg-[rgba(34,197,94,0.045)] px-4 py-3.5">
            <div className="label text-emerald">DEPLOYMENT ASSUMPTIONS</div>
            <p className="mt-1 text-sm text-muted">Choose how quickly the capital enters the market.</p>
          </div>

          <InputPanel>
            <NumberInput
              label={t.inputs.totalCapital}
              value={dca.totalCapital}
              onChange={(v) => setDCA({ totalCapital: v })}
              prefix="$"
              min={0}
              step={1000}
              hint={t.hints.totalCapital}
            />
            <InputSlider
              label={t.inputs.deploymentWindow}
              value={dca.deploymentMonths}
              onChange={(v) => setDCA({ deploymentMonths: v })}
              min={1}
              max={Math.min(60, preset.monthlyReturns.length)}
              step={1}
              suffix={t.inputs.months}
              hint={t.hints.deploymentWindow}
            />

            <div className="space-y-3">
              <div>
                <div className="label mb-2">MARKET REGION</div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Market region">
                  {seriesGroups.map((group) => {
                    const active = group.label === activeGroup.label;
                    return (
                      <button
                        key={group.label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDCA({ presetId: group.items[0].id })}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? 'border-emerald bg-emerald/10 text-ink'
                            : 'border-border bg-surface text-ink-dim hover:border-emerald hover:text-ink'
                        }`}
                      >
                        {group.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="label mb-2">MARKET WINDOW</div>
                <div className="flex flex-wrap gap-2" role="group" aria-label={t.inputs.historicalSeries}>
                  {activeGroup.items.map((p) => {
                    const active = p.id === dca.presetId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setDCA({ presetId: p.id })}
                        className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-snug transition-colors ${
                          active
                            ? 'border-emerald bg-emerald/10 text-ink'
                            : 'border-border bg-surface text-ink-dim hover:border-emerald hover:text-ink'
                        }`}
                      >
                        {t.historicalSeries[p.id]?.label ?? p.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted leading-snug">{presetDescription}</p>
              </div>
            </div>
          </InputPanel>
        </div>

        <div>
          <div className="card relative grid min-w-0 gap-4 overflow-hidden border-[rgba(148,163,184,0.18)] bg-[rgba(8,12,18,0.84)] shadow-[inset_0_1px_0_rgba(245,247,250,0.04)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-gradient-to-b before:from-emerald/60 before:via-emerald/20 before:to-transparent">
            <div className="border-b border-white/10 pb-4">
              <div className="label text-emerald">PATH AS PROOF</div>
              <p className="mt-1 text-sm text-muted">The lines show how timing changes the ending.</p>
            </div>
            <div className="min-w-0 overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.12)] bg-[rgba(2,6,12,0.42)] px-3 pb-1 pt-3 md:px-4 md:pb-2 md:pt-4">
              <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            </div>
            <Callout>{t.dca.callout}</Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
