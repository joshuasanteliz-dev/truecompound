import { useMemo } from 'react';
import { GrowthChart, type Series } from '@/components/GrowthChart';
import { NumberInput, InputSlider } from '@/components/InputSlider';
import { InputPanel } from '@/components/InputPanel';
import { ModeHeader } from '@/components/Section';
import { HeroNumber } from '@/components/HeroNumber';
import { Callout } from '@/components/Callout';
import { ShareButton } from '@/components/ShareButton';
import { useScenarioStore } from '@/store/store';
import { useUrlHydrate } from '@/store/urlSync';
import { calculateDCA, calculateLumpSum, formatCurrency } from '@/engine';
import { RETURN_PRESETS } from '@/data/sp500';
import { useDebouncedValue } from '@/components/useDebouncedValue';

export default function DCA() {
  const dca = useScenarioStore((s) => s.dca);
  const setDCA = useScenarioStore((s) => s.setDCA);

  useUrlHydrate(setDCA, {
    totalCapital: 'number',
    deploymentMonths: 'int',
    presetId: 'string',
  });

  const debounced = useDebouncedValue(dca, 200);

  const preset = RETURN_PRESETS.find((p) => p.id === debounced.presetId) ?? RETURN_PRESETS[0];

  const result = useMemo(() => {
    const lumpSum = calculateLumpSum(debounced.totalCapital, preset.monthlyReturns);
    const dcaPath = calculateDCA(debounced.totalCapital, preset.monthlyReturns, debounced.deploymentMonths);
    return { lumpSum, dcaPath };
  }, [debounced, preset]);

  const finalLump = result.lumpSum[result.lumpSum.length - 1];
  const finalDCA = result.dcaPath[result.dcaPath.length - 1];
  const diff = finalLump - finalDCA;
  const winner = diff >= 0 ? 'Lump sum' : 'DCA';

  const xLabels = result.lumpSum.map((_, i) => (i % 12 === 0 ? String(i / 12) : ''));

  const series: Series[] = [
    { label: 'Lump sum (day-one deploy)', data: result.lumpSum, color: '#0F766E', width: 2 },
    { label: `DCA over ${debounced.deploymentMonths} months`, data: result.dcaPath, color: '#0A0A0A', width: 2, dashed: true },
  ];

  return (
    <div>
      <ModeHeader
        eyebrow="Mode 02 · Lump Sum vs DCA"
        title="The path matters as much as the destination."
        subtitle="Same capital, same market, two strategies. The market regime decides the winner."
        actions={<ShareButton params={dca as unknown as Record<string, string | number>} />}
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        <InputPanel>
          <NumberInput
            label="Total capital"
            value={dca.totalCapital}
            onChange={(v) => setDCA({ totalCapital: v })}
            prefix="$"
            min={0}
            step={1000}
          />
          <InputSlider
            label="DCA deployment window"
            value={dca.deploymentMonths}
            onChange={(v) => setDCA({ deploymentMonths: v })}
            min={1}
            max={Math.min(60, preset.monthlyReturns.length)}
            step={1}
            suffix=" months"
            hint="How long until all capital is invested."
          />

          <div>
            <label className="label block mb-1.5" htmlFor="preset">
              Historical return series
            </label>
            <select
              id="preset"
              value={dca.presetId}
              onChange={(e) => setDCA({ presetId: e.target.value })}
              className="input-number"
            >
              {RETURN_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">{preset.description}</p>
          </div>
        </InputPanel>

        <div>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <HeroNumber label="Lump sum end" value={formatCurrency(finalLump)} tone={diff >= 0 ? 'positive' : 'default'} />
            <HeroNumber
              label="DCA end"
              value={formatCurrency(finalDCA)}
              tone={diff < 0 ? 'positive' : 'default'}
            />
            <HeroNumber
              label={`${winner} wins by`}
              value={formatCurrency(Math.abs(diff))}
              tone={diff >= 0 ? 'positive' : 'negative'}
              sublabel={diff >= 0 ? 'Time-in-market beat timing' : 'DCA avoided a bad entry'}
            />
          </div>

          <div className="card">
            <GrowthChart series={series} xLabels={xLabels} xAxisLabel="Year" />
            <Callout>
              In rising markets, lump sum wins ~two-thirds of historical periods because cash sitting on the
              sidelines earns nothing. DCA's value isn't returns — it's protection against your own panic when the
              first month goes red.
            </Callout>
          </div>
        </div>
      </div>
    </div>
  );
}
