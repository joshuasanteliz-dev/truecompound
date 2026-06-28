import { useMemo } from 'react';
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

  // Group historical-series options by their translated group label
  const seriesByGroup = RETURN_PRESETS.reduce<Record<string, typeof RETURN_PRESETS>>((acc, p) => {
    const group = t.historicalSeries[p.id]?.group ?? 'Other';
    (acc[group] = acc[group] ?? []).push(p);
    return acc;
  }, {});

  return (
    <div>
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

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
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

          <div>
            <label className="label block mb-1.5" htmlFor="preset">
              {t.inputs.historicalSeries}
            </label>
            <select
              id="preset"
              value={dca.presetId}
              onChange={(e) => setDCA({ presetId: e.target.value })}
              className="input-number"
            >
              {Object.entries(seriesByGroup).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map((p) => (
                    <option key={p.id} value={p.id}>
                      {t.historicalSeries[p.id]?.label ?? p.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-muted leading-snug">{presetDescription}</p>
          </div>
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber label={t.dca.heroLump} value={formatCurrency(finalLump)} tone={lumpWins ? 'positive' : 'default'} />
            <HeroNumber label={t.dca.heroDCA} value={formatCurrency(finalDCA)} tone={!lumpWins ? 'positive' : 'default'} />
            <HeroNumber
              label={t.dca.heroWinsBy(winnerLabel)}
              value={formatCurrency(Math.abs(diff))}
              tone={lumpWins ? 'positive' : 'negative'}
              sublabel={lumpWins ? t.dca.heroSubLump : t.dca.heroSubDCA}
            />
          </div>

          <PlainEnglish>
            {t.dca.plainEnglish({
              capital: formatCurrency(debounced.totalCapital),
              presetLabel,
              finalLump: formatCurrency(finalLump),
              finalDCA: formatCurrency(finalDCA),
              deployMonths: debounced.deploymentMonths,
              winnerLabel,
              diff: formatCurrency(Math.abs(diff)),
              lumpWins,
            })}
          </PlainEnglish>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>{t.dca.callout}</Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
