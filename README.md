# TrueCompound

**[▶ Live demo](https://truecompound.netlify.app/)**  ·  React 18 + TypeScript  ·  [Unit-tested engine](#architecture)  ·  Deployed on Netlify

TrueCompound is a compound-growth calculator suite — five focused financial visualizations that share a single calculation engine. Built to reveal the real value behind the number after inflation drag, sequence-of-returns risk, tax-wrapper differences, and the symmetry between debt and investment growth.

> "Most calculators lie by omission. These don't."

![TrueCompound — Monte Carlo mode](./docs/hero.png)

## Modes

- **Inflation** (`/inflation`) — Nominal vs. real (today's-dollar) growth on the same axis.
- **Lump Sum vs DCA** (`/dca`) — Two deployment strategies run against three historical regimes.
- **Debt Mirror** (`/debt`) — Investment compounding and debt amortization side-by-side at the same rate.
- **Tax Shelter** (`/tax`) — Taxable vs Roth/TFSA vs Traditional/RRSP, comparing after-tax outcomes.
- **Monte Carlo** (`/monte-carlo`) — 10/50/90 percentile fan chart, with an accumulation/withdrawal toggle and survival rate.

## Stack

- React 18 · Vite · TypeScript
- Chart.js via react-chartjs-2
- Tailwind CSS
- Zustand (with localStorage persistence)
- React Router v6

## Architecture

Every mode imports from `src/engine/` — a set of pure, unit-tested functions:

```
compound(principal, contribution, rate, years, frequency)
applyInflation(balances, rate)
calculateLumpSum / calculateDCA(totalCapital, monthlyReturns, ...)
amortizeDebt(balance, apr, payment)
compareTaxAccounts({ ... })
runMonteCarlo({ ... })  // returns p10/p50/p90 + survival rate
```

No mode reimplements compound math. The shared `<GrowthChart>` component handles styling, hover, and the linear/log scale toggle for every chart in the app.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # vitest unit tests for the engine
npm run build        # production build → dist/
npm run preview      # serve the built bundle
```

## Deploy (Netlify)

`netlify.toml` is included. Either connect the repo to Netlify (build = `npm run build`, publish = `dist`) or run `npx netlify deploy --prod --dir=dist` after a build.

## File Layout

```
src/
  engine/        # pure calculation functions + tests
  components/    # GrowthChart, InputSlider, ModeCard, Layout, …
  modes/         # Inflation, DCA, Debt, Tax, MonteCarlo
  data/          # historical-shape return presets
  store/         # Zustand store + URL-param hydration
  pages/         # Landing, About
  App.tsx, main.tsx, styles.css
```

## Not financial advice.

Historical return series are *shape-faithful* (period CAGR + volatility) but deterministically generated, not raw index data. For path-dependence intuition, not backtesting.

---

Built by **Joshua Santeliz** — full-stack developer (fintech / data-systems focus), Madrid.
[LinkedIn](https://linkedin.com/in/joshuasanteliz/) · [GitHub](https://github.com/[[joshuasanteliz-dev]])
