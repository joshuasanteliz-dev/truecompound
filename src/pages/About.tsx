import { Link } from 'react-router-dom';

export default function About() {
  return (
    <article className="prose max-w-2xl py-8">
      <div className="label mb-2">About</div>
      <h1 className="text-4xl font-semibold tracking-tight">Why this project exists.</h1>

      <p className="mt-6 text-lg text-muted leading-relaxed">
        Most retirement calculators are built by people trying to sell you something — usually a fund, an advisor,
        or both. The math they show you isn't wrong, but it leaves things out: inflation, taxes, sequence-of-returns
        risk, the path your specific dollars actually took through the market. The result is a clean number that
        feels reassuring and isn't.
      </p>

      <p className="mt-4 text-muted leading-relaxed">
        WhatIfMoney is five small tools, each pointed at one of those omissions:
      </p>

      <ul className="mt-4 space-y-2 text-muted">
        <li>
          <strong className="text-ink">Inflation</strong> — shows nominal vs. real (today's-dollar) growth on the
          same axis.
        </li>
        <li>
          <strong className="text-ink">Lump Sum vs DCA</strong> — runs both strategies against actual-shape
          historical regimes (favorable, lost-decade, post-crisis).
        </li>
        <li>
          <strong className="text-ink">Debt Mirror</strong> — puts an investment and a debt at the same rate
          side-by-side, so you can see compounding works both directions.
        </li>
        <li>
          <strong className="text-ink">Tax Shelter</strong> — compares taxable, Roth/TFSA, and Traditional/RRSP
          accounts after-tax. The wrapper often matters more than the fund.
        </li>
        <li>
          <strong className="text-ink">Monte Carlo</strong> — replaces a single point-estimate with a fan of
          probability bands, including a withdrawal-mode survival rate.
        </li>
      </ul>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">How it works.</h2>
      <p className="mt-3 text-muted leading-relaxed">
        Every mode imports from the same calculation engine — pure TypeScript functions, fully unit-testable. No
        backend, no analytics, no tracking. Your inputs persist in <code>localStorage</code>; every scenario gets a
        shareable URL that encodes the inputs as query params.
      </p>

      <h2 className="mt-10 text-2xl font-semibold tracking-tight">What this is not.</h2>
      <p className="mt-3 text-muted leading-relaxed">
        It is not financial advice. It is not a recommendation. Historical return series here are{' '}
        <em>shape-faithful</em> to their period CAGR and volatility but are deterministically generated, not raw
        index data — they're for teaching path-dependence intuition, not for backtesting strategies. Talk to an
        actual fiduciary before doing anything irreversible with money.
      </p>

      <p className="mt-10 text-sm text-muted">
        Built by Joshua Santeliz · <Link to="/" className="text-emerald hover:text-emerald-dark">Back home</Link>
      </p>
    </article>
  );
}
