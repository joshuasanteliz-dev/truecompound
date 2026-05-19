import { Link } from 'react-router-dom';
import { ModeCard } from '@/components/ModeCard';
import { MiniInflation, MiniDCA, MiniDebt, MiniTax, MiniMonteCarlo } from './landingPreviews';

const MODES = [
  {
    to: '/inflation',
    title: 'Inflation',
    pitch: 'See the gap between the nominal number you "have" and what it actually buys.',
    preview: <MiniInflation />,
  },
  {
    to: '/dca',
    title: 'Lump Sum vs DCA',
    pitch: 'Same capital, same market — two strategies, plotted against real historical regimes.',
    preview: <MiniDCA />,
  },
  {
    to: '/debt',
    title: 'Debt Mirror',
    pitch: 'Compounding works both ways. The same equation builds wealth or grinds you down.',
    preview: <MiniDebt />,
  },
  {
    to: '/tax',
    title: 'Tax Shelter',
    pitch: 'Same fund, three legal wrappers. The envelope is sometimes worth more than the contents.',
    preview: <MiniTax />,
  },
  {
    to: '/monte-carlo',
    title: 'Monte Carlo',
    pitch: 'Replace the comfortable lie of "average return" with the honest fan of probabilities.',
    preview: <MiniMonteCarlo />,
  },
];

export default function Landing() {
  return (
    <div>
      <section className="py-12 sm:py-20 max-w-3xl">
        <div className="label mb-3">A compound interest suite</div>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          Most calculators<br />
          lie by <span className="text-emerald">omission</span>.
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed max-w-2xl">
          They show you the nominal number and hide inflation. They show the average and hide the variance. They
          ignore taxes, fees, and timing. WhatIfMoney is five focused tools that put those things back in the
          picture — so you can see what compound growth actually looks like.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/inflation" className="btn-primary">
            Start with inflation
            <span aria-hidden className="ml-1.5">
              →
            </span>
          </Link>
          <Link to="/monte-carlo" className="btn-secondary">
            Or jump to Monte Carlo
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODES.map((mode, i) => (
            <ModeCard
              key={mode.to}
              to={mode.to}
              title={mode.title}
              pitch={mode.pitch}
              preview={mode.preview}
              index={i}
            />
          ))}
        </div>
      </section>

      <section className="py-16 max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">Built to be useful, not to sell anything.</h2>
        <p className="text-muted leading-relaxed">
          Everything runs in your browser. Nothing is logged, nothing is sold, nothing is "free during a 14-day
          trial." Your inputs persist locally so refreshing doesn't reset them, and every scenario gets a shareable
          URL.
        </p>
        <Link to="/about" className="mt-4 inline-flex items-center text-emerald hover:text-emerald-dark text-sm font-medium">
          More about the project
          <span aria-hidden className="ml-1">
            →
          </span>
        </Link>
      </section>
    </div>
  );
}
