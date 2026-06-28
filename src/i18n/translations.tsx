import type { ReactNode } from 'react';

export type Lang = 'en' | 'es';

/**
 * Centralized EN/ES dictionary. Use property access via `useT()` so TS keeps
 * both languages structurally identical — adding a key to `en` without `es`
 * is a type error.
 */

interface PresetCopy {
  label: string;
  blurb: string;
}

interface PresetSet<K extends string> {
  title: string;
  items: Record<K, PresetCopy>;
}

export interface Dictionary {
  common: {
    appName: string;
    notFinancialAdvice: string;
    builtBy: string;
    backHome: string;
    loading: string;
    aboutThisProject: string;
    learnMore: string;
    gotIt: string;
    dismiss: string;
  };
  nav: {
    inflation: string;
    dca: string;
    debt: string;
    tax: string;
    monteCarlo: string;
    about: string;
    privacy: string;
    terms: string;
    cookies: string;
    legal: string;
  };
  landing: {
    eyebrow: string;
    titleLine1: string;
    titleLine2Prefix: string;
    titleLine2Highlight: string;
    titleLine2Suffix: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pitches: {
      inflation: { title: string; pitch: string };
      dca: { title: string; pitch: string };
      debt: { title: string; pitch: string };
      tax: { title: string; pitch: string };
      monteCarlo: { title: string; pitch: string };
    };
    footnoteTitle: string;
    footnoteBody: string;
    footnoteLink: string;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    bullets: {
      inflation: ReactNode;
      dca: ReactNode;
      debt: ReactNode;
      tax: ReactNode;
      monteCarlo: ReactNode;
    };
    listIntro: string;
    howItWorks: { title: string; body: ReactNode };
    whatItIsNot: { title: string; body: ReactNode };
    sig: string;
  };
  inputs: {
    inputsLabel: string;
    startingPrincipal: string;
    monthlyContribution: string;
    annualReturn: string;
    inflationRate: string;
    years: string;
    yrsSuffix: string;
    balance: string;
    apr: string;
    monthlyPayment: string;
    timeAxisMax: string;
    totalCapital: string;
    deploymentWindow: string;
    months: string;
    historicalSeries: string;
    marginalTaxRate: string;
    capitalGainsRate: string;
    startingBalance: string;
    monthlyWithdrawal: string;
    expectedReturn: string;
    volatility: string;
    iterations: string;
    accumulation: string;
    withdrawal: string;
    accumulationHint: string;
    withdrawalHint: string;
    sharescenario: string;
    copied: string;
  };
  hints: {
    inflationRateGeneric: string;
    annualReturnGeneric: string;
    deploymentWindow: string;
    totalCapital: string;
    debtBalance: string;
    debtRate: string;
    debtPayment: string;
    marginalTaxBrackets: string;
    capitalGainsBrackets: string;
    monteCarloBalanceWithdraw: string;
    monteCarloBalanceAccum: string;
    monteCarloContribution: string;
    monteCarloWithdrawal: string;
    monteCarloExpectedReturn: string;
    monteCarloVolatility: string;
    monteCarloIterations: string;
  };
  inflation: {
    eyebrow: string;
    title: string;
    subtitle: ReactNode;
    explainerSummary: string;
    explainer: ReactNode;
    presetsTitle: string;
    heroNominal: string;
    heroReal: string;
    heroRealSub: string;
    heroDrag: string;
    heroDragOfNominal: (pct: string) => string;
    heroNominalSub: string;
    plainEnglish: (args: {
      years: number;
      nominal: string;
      real: string;
      gap: string;
      realReturn: string;
      annualReturn: string;
    }) => ReactNode;
    callout: (real: string) => ReactNode;
    warningTitle: string;
    warningBody: (args: { nominal: string; inflation: string; net: string }) => ReactNode;
  };
  dca: {
    eyebrow: string;
    title: string;
    subtitle: ReactNode;
    explainerSummary: string;
    explainer: ReactNode;
    presetsTitle: string;
    heroLump: string;
    heroDCA: string;
    heroWinsBy: (winner: string) => string;
    heroSubLump: string;
    heroSubDCA: string;
    lumpSumLabel: string;
    dcaLineLabel: (months: number) => string;
    winnerLump: string;
    winnerDCA: string;
    plainEnglish: (args: {
      capital: string;
      presetLabel: string;
      finalLump: string;
      finalDCA: string;
      deployMonths: number;
      winnerLabel: string;
      diff: string;
      lumpWins: boolean;
    }) => ReactNode;
    callout: ReactNode;
  };
  debt: {
    eyebrow: string;
    title: string;
    subtitle: ReactNode;
    explainerSummary: string;
    explainer: ReactNode;
    presetsTitle: string;
    heroInvestmentBecomes: string;
    heroInvestmentBecomesSub: (rate: string) => string;
    heroDebtCosts: string;
    heroDebtCostsSub: string;
    heroTime: string;
    heroTimeSubNeverPaid: string;
    asInvestment: string;
    asDebt: string;
    debtBalance: string;
    investmentBalance: string;
    callout: ReactNode;
    warningTitle: string;
    warningBody: (args: { rate: string; balance: string; interest: string; payment: string }) => ReactNode;
    plainEnglish: (args: {
      balance: string;
      ratePct: string;
      payment: string;
      paidOff: boolean;
      timeText: string;
      interest: string;
      investmentEnd: string;
    }) => ReactNode;
  };
  tax: {
    eyebrow: string;
    title: string;
    subtitle: ReactNode;
    explainerSummary: string;
    explainer: ReactNode;
    presetsTitle: string;
    heroRoth: string;
    heroTrad: string;
    heroTaxable: string;
    callout: (winner: string) => ReactNode;
    plainEnglish: (args: {
      winner: string;
      rothAfterTax: string;
      taxableAfterTax: string;
      gap: string;
    }) => ReactNode;
    accountNames: {
      roth: string;
      traditional: string;
      taxable: string;
    };
  };
  montecarlo: {
    eyebrow: string;
    titleAccum: string;
    titleWithdraw: string;
    subtitleAccum: ReactNode;
    subtitleWithdraw: ReactNode;
    explainerSummary: string;
    explainer: ReactNode;
    presetsTitle: string;
    heroSurvival: string;
    heroSurvivalSub: (survived: number, total: number) => string;
    heroMedian: string;
    heroMedianSub: string;
    hero10: string;
    hero10Sub: string;
    hero90: string;
    hero90Sub: string;
    seriesP90: string;
    seriesMedian: string;
    seriesP10: string;
    warningUnsustainableTitle: (rate: string) => string;
    warningUnsustainableBody: (args: { annual: string; balance: string; rate: string }) => ReactNode;
    warningAggressiveTitle: (rate: string) => string;
    warningAggressiveBody: ReactNode;
    plainEnglishWithdraw: (args: { iterations: number; balance: string; withdrawal: string; survivalPct: number; years: number; tone: 'strong' | 'okay' | 'risky' | 'failing' }) => ReactNode;
    plainEnglishAccum: (args: { iterations: number; balance: string; contribution: string; years: number; median: string; p10: string; p90: string }) => ReactNode;
    callout: ReactNode;
  };
  presets: {
    inflation: PresetSet<'longRun' | 'stagflation' | 'warEra' | 'covid' | 'japanDefl'>;
    dca: PresetSet<'standard' | 'dotcomTop' | 'crisis2008' | 'japan'>;
    debt: PresetSet<'ccTrap' | 'mortgage' | 'student' | 'aggressive' | 'car'>;
    tax: PresetSet<'young' | 'peak' | 'rothMax' | 'midCareer'>;
    monteCarlo: PresetSet<'building' | 'standardRetire' | 'fire' | 'conservative' | 'stress'>;
  };
  /** Historical return series labels + descriptions for the DCA dropdown. */
  historicalSeries: Record<string, { label: string; description: string; group: string }>;
  cookieNotice: {
    body: ReactNode;
    accept: string;
    learnMore: string;
  };
  legal: {
    privacy: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: ReactNode }[];
    };
    terms: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: ReactNode }[];
    };
    cookies: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: ReactNode }[];
    };
    imprint: {
      title: string;
      lastUpdated: string;
      sections: { heading: string; body: ReactNode }[];
    };
  };
}

const OWNER = 'Joshua Santeliz';
const OWNER_EMAIL = 'joshuasantelizacosta@gmail.com';
const OWNER_GITHUB = 'https://github.com/joshuasanteliz-dev';
const LAST_UPDATED = '2026-05-20';

const en: Dictionary = {
  common: {
    appName: 'TrueCompound',
    notFinancialAdvice: 'Not financial advice.',
    builtBy: 'Built by',
    backHome: 'Back home',
    loading: 'Loading…',
    aboutThisProject: 'About this project',
    learnMore: 'Learn more',
    gotIt: 'Got it',
    dismiss: 'Dismiss',
  },
  nav: {
    inflation: 'Inflation',
    dca: 'DCA',
    debt: 'Debt',
    tax: 'Tax',
    monteCarlo: 'Monte Carlo',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    legal: 'Imprint',
  },
  landing: {
    eyebrow: 'A compound interest suite',
    titleLine1: 'Most calculators',
    titleLine2Prefix: 'lie by ',
    titleLine2Highlight: 'omission',
    titleLine2Suffix: '.',
    intro:
      'They show you the nominal number and hide inflation. They show the average and hide the variance. They ignore taxes, fees, and timing. TrueCompound shows the real value behind the number — so you can see what compound growth actually looks like.',
    ctaPrimary: 'Start with inflation',
    ctaSecondary: 'Or jump to Monte Carlo',
    pitches: {
      inflation: {
        title: 'Inflation',
        pitch: 'See the gap between the nominal number you "have" and what it actually buys.',
      },
      dca: {
        title: 'Lump Sum vs DCA',
        pitch: 'Same capital, same market — two strategies, plotted against real historical regimes.',
      },
      debt: {
        title: 'Debt Mirror',
        pitch: 'Compounding works both ways. The same equation builds wealth or grinds you down.',
      },
      tax: {
        title: 'Tax Shelter',
        pitch: 'Same fund, three legal wrappers. The envelope is sometimes worth more than the contents.',
      },
      monteCarlo: {
        title: 'Monte Carlo',
        pitch: 'Replace the comfortable lie of "average return" with the honest fan of probabilities.',
      },
    },
    footnoteTitle: 'Built to be useful, not to sell anything.',
    footnoteBody:
      'Everything runs in your browser. Nothing is logged, nothing is sold, nothing is "free during a 14-day trial." Your inputs persist locally so refreshing doesn\'t reset them, and every scenario gets a shareable URL.',
    footnoteLink: 'More about the project',
  },
  about: {
    eyebrow: 'About',
    title: 'Why this project exists.',
    intro:
      "Most retirement calculators are built by people trying to sell you something — usually a fund, an advisor, or both. The math they show you isn't wrong, but it leaves things out: inflation, taxes, sequence-of-returns risk, the path your specific dollars actually took through the market. The result is a clean number that feels reassuring and isn't.",
    bullets: {
      inflation: (
        <>
          <strong className="text-ink">Inflation</strong> — shows nominal vs. real (today's-dollar) growth on the same axis.
        </>
      ),
      dca: (
        <>
          <strong className="text-ink">Lump Sum vs DCA</strong> — runs both strategies against actual-shape historical regimes (favorable, lost-decade, post-crisis).
        </>
      ),
      debt: (
        <>
          <strong className="text-ink">Debt Mirror</strong> — puts an investment and a debt at the same rate side-by-side, so you can see compounding works both directions.
        </>
      ),
      tax: (
        <>
          <strong className="text-ink">Tax Shelter</strong> — compares taxable, Roth/TFSA, and Traditional/RRSP accounts after-tax. The wrapper often matters more than the fund.
        </>
      ),
      monteCarlo: (
        <>
          <strong className="text-ink">Monte Carlo</strong> — replaces a single point-estimate with a fan of probability bands, including a withdrawal-mode survival rate.
        </>
      ),
    },
    listIntro: 'TrueCompound is five small tools, each pointed at one of those omissions:',
    howItWorks: {
      title: 'How it works.',
      body: (
        <>
          Every mode imports from the same calculation engine — pure TypeScript functions, fully unit-testable. No backend, no analytics, no tracking. Your inputs persist in <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code>; every scenario gets a shareable URL that encodes the inputs as query params.
        </>
      ),
    },
    whatItIsNot: {
      title: 'What this is not.',
      body: (
        <>
          It is not financial advice. It is not a recommendation. Historical return series here are <em>shape-faithful</em> to their period CAGR and volatility but are deterministically generated, not raw index data — they're for teaching path-dependence intuition, not for backtesting strategies. Talk to an actual fiduciary before doing anything irreversible with money.
        </>
      ),
    },
    sig: `Built by ${OWNER}`,
  },
  inputs: {
    inputsLabel: 'Inputs',
    startingPrincipal: 'Starting principal',
    monthlyContribution: 'Monthly contribution',
    annualReturn: 'Annual return',
    inflationRate: 'Inflation rate',
    years: 'Years',
    yrsSuffix: ' yrs',
    balance: 'Balance',
    apr: 'Interest rate (APR)',
    monthlyPayment: 'Monthly payment',
    timeAxisMax: 'Time axis (max)',
    totalCapital: 'Total capital',
    deploymentWindow: 'DCA deployment window',
    months: ' months',
    historicalSeries: 'Historical return series',
    marginalTaxRate: 'Marginal tax rate',
    capitalGainsRate: 'Capital gains rate',
    startingBalance: 'Starting balance',
    monthlyWithdrawal: 'Monthly withdrawal',
    expectedReturn: 'Expected return',
    volatility: 'Volatility (annual σ)',
    iterations: 'Iterations',
    accumulation: 'Accumulation',
    withdrawal: 'Withdrawal',
    accumulationHint: "You're building wealth — adding money each month, never taking any out.",
    withdrawalHint: "You're in retirement — drawing money out each month, no longer contributing.",
    sharescenario: 'Share scenario',
    copied: 'Copied!',
  },
  hints: {
    inflationRateGeneric: 'Long-run US average is ~3%. Use the chips above for historical regimes.',
    annualReturnGeneric: 'What your investments grow by, before inflation.',
    deploymentWindow: 'How many months DCA spreads the buying over. 1 = effectively lump sum.',
    totalCapital: "The pile of money you're choosing how to deploy.",
    debtBalance: 'How much you currently owe.',
    debtRate: 'Mortgages: 3–7%. Student loans: 5–8%. Credit cards: 18–30%.',
    debtPayment: 'Set to 0 to use the 2% credit-card minimum.',
    marginalTaxBrackets: 'US brackets: 22% (~$45k), 32% (~$190k), 37% (~$580k).',
    capitalGainsBrackets: 'US long-term: 0%, 15%, or 20% by income.',
    monteCarloBalanceWithdraw: 'Your retirement nest egg on day one.',
    monteCarloBalanceAccum: "What you've saved so far.",
    monteCarloContribution: 'What you add to the portfolio each month.',
    monteCarloWithdrawal: 'What you pull out for living expenses each month.',
    monteCarloExpectedReturn: 'Long-run S&P 500 is ~7% real (10% nominal).',
    monteCarloVolatility: 'S&P 500 ≈ 15%. Bonds ≈ 5%. Crypto ≈ 70%+.',
    monteCarloIterations: 'How many random futures to simulate. More = smoother bands, slower.',
  },
  inflation: {
    eyebrow: 'Mode 01 · Inflation',
    title: "The number you see isn't the number you'll spend.",
    subtitle: <>A 7% nominal return at 3% inflation is really 4%. Watch the gap open.</>,
    explainerSummary: "What 'inflation drag' actually means — full explanation",
    explainer: (
      <>
        <p>
          Every year your money sits, two things happen at the same time: your balance grows (returns), and prices rise (inflation). The headline return — say 8% — is the <strong>nominal</strong> number. Subtract inflation, and you get the <strong>real</strong> return — what your dollars actually buy.
        </p>
        <p>
          Example: you have $100 earning 8% in a year prices rise 3%. End of year you have $108 nominal, but a basket of stuff that cost $100 now costs $103. So your real gain is about $108 ÷ $103 ≈ <strong>+4.8%</strong>, not +8%.
        </p>
        <p>
          Most calculators show only the nominal line. The shaded red gap on the chart below is the purchasing power you quietly lose — and because both growth and inflation compound, the gap widens exponentially. After ~15 years the difference between "what the screen says" and "what you can spend" stops being a rounding error.
        </p>
      </>
    ),
    presetsTitle: 'Try an inflation regime',
    heroNominal: 'Nominal balance',
    heroReal: "Real (today's $)",
    heroRealSub: "What it'll actually buy",
    heroDrag: 'Inflation drag',
    heroDragOfNominal: (pct) => `${pct} of nominal lost`,
    heroNominalSub: 'What the bank statement says',
    plainEnglish: ({ years, nominal, real, gap, realReturn, annualReturn }) => (
      <>
        After <strong>{years} years</strong>, your balance will <em>look like</em>{' '}
        <strong className="text-ink">{nominal}</strong> — but in today's purchasing power, it's really worth{' '}
        <strong className="text-emerald">{real}</strong>. Inflation quietly took{' '}
        <strong className="text-loss">{gap}</strong> off the top. Your <em>real</em> return — what actually grows your buying power — is{' '}
        <strong className="text-ink">{realReturn}/yr</strong>, not the {annualReturn} headline number.
      </>
    ),
    callout: (real) => (
      <>
        In today's dollars, you'll actually have <strong className="text-ink">{real}</strong>. The shaded gap is purchasing power your future self quietly loses to inflation — it widens exponentially after about year 15.
      </>
    ),
    warningTitle: 'Your real return is negative.',
    warningBody: ({ nominal, inflation, net }) => (
      <>
        Your investments grow at <strong className="text-ink">{nominal}</strong>, but inflation grows at <strong className="text-ink">{inflation}</strong>. Net effect: you're <em>losing</em> about <strong className="text-loss">{net}/yr</strong> in purchasing power. The nominal line still rises — the real line slowly falls.
      </>
    ),
  },
  dca: {
    eyebrow: 'Mode 02 · Lump Sum vs DCA',
    title: 'The path matters as much as the destination.',
    subtitle: <>Same capital, same market, two strategies. The market regime decides the winner.</>,
    explainerSummary: 'Lump sum vs DCA — full explanation',
    explainer: (
      <>
        <p>You have a pile of cash you want invested. Two options:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-ink">Lump sum:</strong> deploy everything on day one. You're 100% exposed immediately — to gains <em>and</em> losses.</li>
          <li><strong className="text-ink">DCA (dollar-cost averaging):</strong> split it into equal monthly buys over N months. You average your entry price; if the market dips during the deployment window, your later buys are cheaper.</li>
        </ul>
        <p>
          Historically, in <strong>rising</strong> markets — which is most of them — lump sum wins about two-thirds of the time, because cash waiting on the sidelines earns nothing while the market drifts up. DCA only wins when the deployment window happens to straddle a meaningful drawdown.
        </p>
        <p>
          So why DCA at all? <strong>Behavior.</strong> The real risk isn't whether lump sum or DCA gives you 1.4% more — it's whether you panic-sell the morning after a 10% red day. DCA buys you a smoother emotional ride at a small expected cost.
        </p>
        <p className="text-muted text-xs mt-3">
          Try the <em>"Bought at the top (dot-com)"</em> or <em>"Japan lost decades"</em> chips above to see scenarios where DCA actually wins.
        </p>
      </>
    ),
    presetsTitle: 'Try a market window',
    heroLump: 'Lump sum end',
    heroDCA: 'DCA end',
    heroWinsBy: (w) => `${w} wins by`,
    heroSubLump: 'Time-in-market beat timing',
    heroSubDCA: 'DCA avoided a bad entry',
    lumpSumLabel: 'Lump sum (day-one deploy)',
    dcaLineLabel: (m) => `DCA over ${m} months`,
    winnerLump: 'Lump sum',
    winnerDCA: 'DCA',
    plainEnglish: ({ capital, presetLabel, finalLump, finalDCA, deployMonths, winnerLabel, diff, lumpWins }) => (
      <>
        You started with <strong>{capital}</strong> and ran it through <strong className="text-ink">{presetLabel}</strong>. The lump-sum buyer ended with <strong className="text-emerald">{finalLump}</strong>; the DCA buyer (spreading buys over {deployMonths} months) ended with <strong className="text-emerald">{finalDCA}</strong>. <strong>{winnerLabel}</strong> won by <strong className={lumpWins ? 'text-gain' : 'text-loss'}>{diff}</strong>.{' '}
        {lumpWins
          ? 'Lump sum usually wins when the market trends up during the deployment window — time-in-market beats timing.'
          : 'DCA wins here because lumping in caught the start of a drawdown; spreading the buys averaged into lower prices.'}
      </>
    ),
    callout: (
      <>
        In rising markets, lump sum wins ~two-thirds of historical periods because cash sitting on the sidelines earns nothing. DCA's value isn't returns — it's protection against your own panic when the first month goes red.
      </>
    ),
  },
  debt: {
    eyebrow: 'Mode 03 · Debt Mirror',
    title: 'The same math runs in both directions.',
    subtitle: <>Compounding is symmetric. The investment chart and the debt chart are the same equation with the sign flipped.</>,
    explainerSummary: 'The debt mirror — full explanation',
    explainer: (
      <>
        <p>
          Compound interest is usually sold as a miracle. It is — but only when you're on the right side of the equation. A balance growing at 7% per year and a debt growing at 7% per year follow the exact same exponential curve. One ends with wealth; the other ends with you working to feed the principal.
        </p>
        <p>
          The most extreme version is the <strong>credit-card minimum-payment trap</strong>. A 2% monthly minimum on a 24% APR card barely covers the interest. Each month, principal moves a millimeter while interest moves a mile. A $10,000 balance can take <em>decades</em> to pay off and cost more in interest than the original balance itself.
        </p>
        <p>
          Practical takeaway: a dollar used to kill 7% debt is worth exactly as much as a dollar earning 7% in the market — except it's <strong>guaranteed</strong>, tax-free, and risk-free. That's why "pay off high-interest debt first" beats almost every investing strategy until the high-rate debt is gone.
        </p>
      </>
    ),
    presetsTitle: 'Try a debt scenario',
    heroInvestmentBecomes: 'Investment becomes',
    heroInvestmentBecomesSub: (r) => `At ${r}, no contributions`,
    heroDebtCosts: 'Debt costs',
    heroDebtCostsSub: 'Total interest paid',
    heroTime: 'Time to payoff',
    heroTimeSubNeverPaid: 'Payment too low — debt grows',
    asInvestment: 'As an investment',
    asDebt: 'As a debt',
    debtBalance: 'Debt balance',
    investmentBalance: 'Investment balance',
    callout: (
      <>
        The shape is the same — exponential. The credit-card minimum-payment trap is what happens when your payment is barely above the interest line. The principal moves a millimeter while time moves a mile.
      </>
    ),
    warningTitle: "Your payment doesn't cover the interest.",
    warningBody: ({ rate, balance, interest, payment }) => (
      <>
        At {rate} APR on {balance}, monthly interest is <strong className="text-loss">{interest}</strong>. With a payment of {payment}, the balance <em>grows every month</em>. Try a higher payment, or set it to <strong>0</strong> to see the credit-card-minimum trap pattern.
      </>
    ),
    plainEnglish: ({ balance, ratePct, payment, paidOff, timeText, interest, investmentEnd }) => (
      <>
        If you <em>owe</em> <strong>{balance}</strong> at {ratePct} APR and pay <strong>{payment}/mo</strong>, you'll{' '}
        {paidOff ? (
          <>
            clear it in <strong className="text-ink">{timeText}</strong> and pay <strong className="text-loss">{interest}</strong> in interest along the way.
          </>
        ) : (
          <>
            <strong className="text-loss">never pay it off</strong> at this payment level — the interest outruns the payment.
          </>
        )}{' '}
        Same balance <em>invested</em> at the same rate (no further contributions) would become <strong className="text-gain">{investmentEnd}</strong> over the same window. Compounding doesn't care which direction it works in.
      </>
    ),
  },
  tax: {
    eyebrow: 'Mode 04 · Tax Shelter',
    title: 'The account wrapper is worth more than the fund inside it.',
    subtitle: <>Same contribution, same return, three legal envelopes. The gap at year 30 is sometimes more than your principal.</>,
    explainerSummary: 'How the three account types differ — full explanation',
    explainer: (
      <>
        <p>The fund inside the account is identical. The <em>wrapper</em> around it changes when the government takes its cut, and that timing difference can be worth tens of thousands of dollars over a career.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-ink">Taxable brokerage:</strong> every dividend and every realized gain gets taxed the year it happens. Compounding still works, but on a slightly slimmer balance.</li>
          <li><strong className="text-ink">Traditional / RRSP:</strong> you contribute <em>pre-tax</em> dollars, so the account balance is bigger from day one — but every dollar you withdraw later is taxed as income.</li>
          <li><strong className="text-ink">Roth / TFSA:</strong> you contribute <em>after-tax</em> dollars (smaller starting balance), and then everything — growth and withdrawals — is tax-free forever.</li>
        </ul>
        <p><strong>Rule of thumb:</strong> if your tax rate today is higher than it'll be in retirement → Traditional/RRSP usually wins. If today's rate is the same or lower → Roth/TFSA wins. Taxable accounts lose to both whenever there's a real-money sheltered option available.</p>
      </>
    ),
    presetsTitle: 'Try a saver profile',
    heroRoth: 'Roth / TFSA (after-tax)',
    heroTrad: 'Traditional / RRSP (after-tax)',
    heroTaxable: 'Taxable brokerage (after-tax)',
    callout: (winner) => (
      <>
        <strong className="text-ink">{winner}</strong> wins this scenario. The Traditional/RRSP line is highest pre-tax because the government temporarily owns some of it. Roth/TFSA usually wins when your future tax bracket is equal-or-higher than today's.
      </>
    ),
    plainEnglish: ({ winner, rothAfterTax, taxableAfterTax, gap }) => (
      <>
        With these inputs, <strong className="text-ink">{winner}</strong> wins. The sheltered Roth/TFSA ends with <strong className="text-gain">{rothAfterTax}</strong> after tax, while the same contributions in a plain taxable brokerage end with only <strong className="text-loss">{taxableAfterTax}</strong> after tax — a gap of <strong>{gap}</strong>. That gap is what the tax wrapper saves you for doing nothing different except picking the right account type.
      </>
    ),
    accountNames: {
      roth: 'Roth/TFSA',
      traditional: 'Traditional/RRSP',
      taxable: 'Taxable',
    },
  },
  montecarlo: {
    eyebrow: 'Mode 05 · Monte Carlo',
    titleAccum: 'A fan of futures, not a forecast.',
    titleWithdraw: 'Will the money last?',
    subtitleAccum: <>A single "average return" projection is a lie. The honest answer is a probability distribution.</>,
    subtitleWithdraw: <>Run thousands of randomized return paths. Survival rate is the fraction of those paths where the portfolio reaches the finish line above zero.</>,
    explainerSummary: 'What Monte Carlo actually does — full explanation',
    explainer: (
      <>
        <p>A single "average return" calculator says: "you'll have $1.2M at retirement." Reassuring — and a lie. Markets don't deliver the average every year; they deliver +24%, -18%, +9%, +1%, and so on. The order of those years matters.</p>
        <p><strong className="text-ink">Monte Carlo</strong> replaces the lie with thousands of randomly-rolled return sequences. Each sequence is a possible future. We sort the ending balances and ask: what does the <em>middle</em> path look like? The lucky 10%? The unlucky 10%?</p>
        <p>The shaded band on the chart is the middle 80% of outcomes. The dashed line is the bad-luck case. If that line dips toward zero in withdrawal mode, you're staring at a real <strong>sequence-of-returns risk</strong> — early losses combined with withdrawals can blow up a portfolio even when the long-term average is fine.</p>
        <p>Two knobs to play with: <strong>expected return</strong> (where the average lives) and <strong>volatility</strong> (how wide the fan opens). Crank either up and watch how much the 10th percentile suffers compared to the median.</p>
      </>
    ),
    presetsTitle: 'Try a life scenario',
    heroSurvival: 'Survival rate',
    heroSurvivalSub: (s, t) => `${s} of ${t} runs ended ≥ $0`,
    heroMedian: 'Median outcome',
    heroMedianSub: '50% of paths land above this',
    hero10: '10th percentile',
    hero10Sub: 'Bad-luck case',
    hero90: '90th percentile',
    hero90Sub: 'Good-luck case',
    seriesP90: '90th percentile',
    seriesMedian: 'Median (50th)',
    seriesP10: '10th percentile',
    warningUnsustainableTitle: (r) => `Your withdrawal rate is ${r}/yr — not sustainable.`,
    warningUnsustainableBody: ({ annual, balance, rate }) => (
      <>
        You're trying to pull <strong className="text-ink">{annual}/year</strong> out of a <strong className="text-ink">{balance}</strong> balance. The conventional safe rate is ~4%/yr (the "4% rule"). At {rate}, the money runs out almost no matter what the market does — that's why you're seeing 0% survival. Try the <strong>"Standard retirement"</strong> preset above to see a realistic scenario.
      </>
    ),
    warningAggressiveTitle: (r) => `Your withdrawal rate is ${r}/yr — aggressive.`,
    warningAggressiveBody: (
      <>
        Pulling more than 5%/yr historically ran out in bad sequences. The classic "4% rule" exists because higher rates fail in real-world sequences (oil-shock decade, lost decade, etc.). Watch the 10th-percentile line below — that's the bad-luck case you'd need to survive.
      </>
    ),
    plainEnglishWithdraw: ({ iterations, balance, withdrawal, survivalPct, years, tone }) => (
      <>
        Out of <strong>{iterations}</strong> randomly-rolled futures starting with <strong className="text-ink">{balance}</strong> and pulling <strong className="text-ink">{withdrawal}/mo</strong>,{' '}
        <strong className={tone === 'strong' ? 'text-gain' : tone === 'failing' ? 'text-loss' : 'text-ink'}>{survivalPct}%</strong> made it to year {years} with money left.{' '}
        {tone === 'strong'
          ? "That's a strong cushion — the math works in most sequences of returns."
          : tone === 'okay'
            ? "That's decent, but 1-in-4 paths fail — bad early returns can still wipe you out."
            : tone === 'risky'
              ? 'Roughly a coin flip. Sequence-of-returns risk is real here — lower the withdrawal or extend the saving years.'
              : 'Very likely to run out. Drop the withdrawal, grow the balance, or shorten the horizon.'}
      </>
    ),
    plainEnglishAccum: ({ iterations, balance, contribution, years, median, p10, p90 }) => (
      <>
        Across <strong>{iterations}</strong> randomly-rolled futures (starting <strong className="text-ink">{balance}</strong>, adding <strong className="text-ink">{contribution}/mo</strong> for {years} years), the middle path lands at <strong className="text-gain">{median}</strong>. Unlucky paths end near <strong className="text-loss">{p10}</strong>; lucky ones near <strong>{p90}</strong>. The wide gap is volatility doing its work — same average return, very different lives.
      </>
    ),
    callout: (
      <>
        The shaded band is the middle 80% of possible futures. If the 10th-percentile line dips toward zero, the "average" projection is hiding a real risk of ruin — especially in withdrawal mode, where early losses compound against you (sequence-of-returns risk).
      </>
    ),
  },
  presets: {
    inflation: {
      title: 'Try an inflation regime',
      items: {
        longRun: { label: 'Long-run US (3%)', blurb: 'The post-WWII US average. The "default" backdrop most modern advice assumes.' },
        stagflation: { label: '1970s stagflation (7%)', blurb: 'Oil shocks + loose monetary policy = a decade where inflation chewed through savings.' },
        warEra: { label: 'War-era spike (10%)', blurb: 'Big-war or supply-shock regimes (post-WWII 1946, 1979 oil crisis). Double-digit price growth.' },
        covid: { label: '2021–2023 surge (5%)', blurb: 'Post-COVID inflation peak. Felt mild on paper, painful at the checkout.' },
        japanDefl: { label: 'Japan deflation (0%)', blurb: '1990s–2010s Japan: prices flat or falling. Cash gains value just by sitting still.' },
      },
    },
    dca: {
      title: 'Try a market window',
      items: {
        standard: { label: 'Standard 30yr (S&P 1990–2020)', blurb: 'The "if you just held the S&P 500" baseline. Lump sum usually wins.' },
        dotcomTop: { label: 'Bought at the top (dot-com)', blurb: 'You deploy everything in early 2000. The next 3 years are brutal.' },
        crisis2008: { label: '2008 crash window', blurb: 'Mid-2007 to early 2009 — a -55% drawdown in 17 months. DCA earns its keep here.' },
        japan: { label: 'Japan lost decades', blurb: 'The counterexample. 1990–2010: stocks went sideways/down for 20 years.' },
      },
    },
    debt: {
      title: 'Try a debt scenario',
      items: {
        ccTrap: { label: 'Credit card minimum trap', blurb: 'A $10k balance at 24% APR with 2% minimum payments. Decades to clear, more interest than principal.' },
        mortgage: { label: 'Mortgage (6%)', blurb: 'A $300k mortgage at 6% with a typical $1,800/mo payment over 30 years.' },
        student: { label: 'Student loan (7%)', blurb: '$30k federal-loan-style balance at 7%, $350/mo payment — about 10 years to clear.' },
        aggressive: { label: 'Aggressive payoff', blurb: '$25k at 12% paid off at $1,000/mo. Watch how fast the balance falls.' },
        car: { label: 'Car loan (5yr)', blurb: '$28k auto loan at 8%, ~$570/mo for 60 months.' },
      },
    },
    tax: {
      title: 'Try a saver profile',
      items: {
        young: { label: 'Young investor', blurb: 'Starting from $0, $500/mo, low income (22% marginal rate). 30 years to retirement.' },
        peak: { label: 'Peak earner', blurb: 'High-income professional: $50k starting, $2,000/mo, 37% marginal rate. Pre-tax shelters shine.' },
        rothMax: { label: 'Roth IRA max-out', blurb: 'Maxing the $7k/yr Roth limit (~$583/mo) for 35 years at moderate tax rate.' },
        midCareer: { label: 'Mid-career catch-up', blurb: 'Started late: $100k saved, $1,500/mo for 20 years. 28% rate.' },
      },
    },
    monteCarlo: {
      title: 'Try a life scenario',
      items: {
        building: { label: 'Building wealth (30yr)', blurb: '$50k saved, $1,000/mo for 30 years. Classic accumulation Monte Carlo.' },
        standardRetire: { label: 'Standard retirement', blurb: '$1M at 65, withdrawing $4k/mo for 30 years. The classic "4% rule" test.' },
        fire: { label: 'FIRE / early retire', blurb: '$1.5M at 45, withdrawing $5k/mo for 40 years. Sequence risk is brutal here.' },
        conservative: { label: 'Conservative retire', blurb: '$1.5M, $4k/mo for 30 years. Roomier than 4% — watch the survival rate climb.' },
        stress: { label: 'Stress test', blurb: '$500k, $3k/mo withdrawal, 25% volatility. Realistic worst-case shock scenario.' },
      },
    },
  },
  historicalSeries: {
    'sp500-1990-2020': { label: 'S&P 500 · 1990–2020', description: 'Long, mostly favorable 30-year window — but includes the dot-com crash and 2008.', group: 'US broad market' },
    'sp500-2000-2020': { label: 'S&P 500 · 2000–2020 (the "lost decade" start)', description: 'Starting right before the dot-com bust punishes lump-sum investors. ~6% CAGR.', group: 'US broad market' },
    'sp500-2009-2019': { label: 'S&P 500 · 2009–2019 (post-GFC bull)', description: 'The decade after the 2008 crash. Lump sum runs away from DCA.', group: 'US broad market' },
    'djia-1990-2020': { label: 'Dow Jones (DJIA) · 1990–2020', description: 'The 30-stock Dow. Similar shape to S&P 500 — slightly lower CAGR, lower volatility.', group: 'US broad market' },
    'dotcom-2000-2003': { label: 'Dot-com crash · 2000–2003', description: 'Three years that vaporized half of the NASDAQ. ~-14% CAGR over the window.', group: 'Crisis windows' },
    'crisis-2007-2009': { label: 'Global Financial Crisis · 2007–2009', description: 'The 2008 crash. S&P 500 lost ~55% peak-to-trough in 17 months.', group: 'Crisis windows' },
    'great-depression': { label: 'Great Depression · 1929–1939', description: 'The worst US equity decade on record. ~-5% CAGR over ten years.', group: 'Crisis windows' },
    'eurostoxx-2000-2020': { label: 'Euro Stoxx 50 · 2000–2020', description: 'Blue-chip Eurozone index. Two crashes in two decades — modest long-run CAGR.', group: 'Europe' },
    'ibex-1995-2020': { label: 'IBEX 35 (Spain) · 1995–2020', description: 'Spanish large-cap index. Strong 90s/00s run, brutal 2008–2012 sovereign-debt era.', group: 'Europe' },
    'nikkei-1990-2010': { label: 'Nikkei 225 (Japan) · 1990–2010', description: 'The original "lost decades." 1989 peak, ~20 years of negative CAGR.', group: 'Asia' },
    'nikkei-2012-2022': { label: 'Nikkei 225 (Japan) · 2012–2022', description: 'After two decades of decline, Japan finally trends up. ~8% CAGR over the window.', group: 'Asia' },
  },
  cookieNotice: {
    body: (
      <>
        This site stores your inputs in your browser (localStorage) so refreshing doesn't reset them. It doesn't track you, doesn't log anything to a server, and uses no third-party cookies.
      </>
    ),
    accept: 'Got it',
    learnMore: 'Cookie policy',
  },
  legal: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Summary in one sentence',
          body: (
            <p>
              TrueCompound is a client-side calculator. It does not collect, transmit, or share any personal data with anyone. Your inputs stay in your browser.
            </p>
          ),
        },
        {
          heading: 'Who runs this site',
          body: (
            <p>
              The site is operated as a personal, non-commercial educational project by {OWNER}. You can reach the operator at <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a> or via the project's GitHub at <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a>.
            </p>
          ),
        },
        {
          heading: 'What data we process',
          body: (
            <>
              <p>The site processes the following data, all of it locally in your own browser:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>The numeric inputs you type into the calculators (starting balance, monthly contribution, return rate, etc.).</li>
                <li>Your language preference (English or Spanish).</li>
                <li>Whether you've dismissed the cookie/storage notice.</li>
              </ul>
              <p className="mt-3">
                This data is stored in <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> under the keys <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-v1</code>, <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-lang</code>, and <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-cookie-ack</code>. None of it leaves your device.
              </p>
            </>
          ),
        },
        {
          heading: 'Legal basis for processing (GDPR Art. 6)',
          body: (
            <p>
              We rely on Art. 6(1)(b) GDPR — processing necessary for the performance of the service you requested (running the calculators with persistent inputs). For the language preference and the dismissed-notice flag, the lawful basis is your implicit instruction to the application.
            </p>
          ),
        },
        {
          heading: 'Cookies and tracking',
          body: (
            <>
              <p>
                <strong>We do not use cookies for tracking, analytics, or advertising.</strong> We do not embed any third-party trackers, no Google Analytics, no Facebook pixel, no advertising network, no fingerprinting.
              </p>
              <p className="mt-3">
                We use the browser's <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> as described above. localStorage entries are not transmitted to any server. You can clear them at any time from your browser's "site data" settings.
              </p>
            </>
          ),
        },
        {
          heading: 'External services',
          body: (
            <>
              <p>The site loads the following external resources:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Google Fonts</strong> (fonts.googleapis.com / fonts.gstatic.com) — to load the Inter and JetBrains Mono fonts. Google may receive your IP address as part of this request. See Google's privacy policy.</li>
                <li><strong>Netlify</strong> (or similar static host) — the site's CDN. Standard request logs (IP, user-agent, request path) may be retained by the host for operational and security reasons. We don't access those logs.</li>
              </ul>
              <p className="mt-3">
                We do not embed iframes, social-media widgets, or comment systems.
              </p>
            </>
          ),
        },
        {
          heading: 'Your rights (GDPR Arts. 15–22)',
          body: (
            <>
              <p>Because we don't hold any of your data on our servers, most GDPR rights are easy to exercise yourself:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Access:</strong> open your browser's developer tools → Application → Local Storage. The keys listed above contain everything we "have" about you.</li>
                <li><strong>Deletion / right to be forgotten:</strong> clear the site's localStorage entries (browser settings → "Clear site data").</li>
                <li><strong>Portability:</strong> the scenario URL (Share button) encodes your inputs as query parameters — that is your portable copy.</li>
                <li><strong>Object / restrict:</strong> stop using the site.</li>
              </ul>
              <p className="mt-3">
                If you believe your rights have been infringed, you have the right to lodge a complaint with your national data protection authority.
              </p>
            </>
          ),
        },
        {
          heading: 'Children',
          body: <p>The site is not directed at children under 16 and does not knowingly process any data about them.</p>,
        },
        {
          heading: 'Changes to this policy',
          body: (
            <p>
              We may update this policy from time to time. The "Last updated" date at the top of this page tracks the latest version. Material changes will be announced via a banner on the site.
            </p>
          ),
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Acceptance',
          body: (
            <p>By using TrueCompound, you agree to these Terms. If you don't agree, please don't use the site.</p>
          ),
        },
        {
          heading: 'Not financial advice',
          body: (
            <>
              <p>
                <strong>TrueCompound is an educational tool. Nothing on this site is financial, investment, tax, or legal advice.</strong> The calculators illustrate compound-interest and probability concepts using simplified models. They are not a recommendation to buy, hold, or sell any security, contract, or financial product, and they are not a substitute for advice from a qualified, licensed professional who knows your individual circumstances.
              </p>
              <p className="mt-3">
                Historical return series shown in the app are <em>shape-faithful</em> illustrative paths — they match published period CAGR and volatility figures but are deterministically generated from a seeded random process, not raw index data. Do not use them for portfolio backtests.
              </p>
            </>
          ),
        },
        {
          heading: 'No warranty',
          body: (
            <p>
              The site is provided "as is" and "as available" without any warranty of any kind, express or implied. We do not warrant that the calculations are free of bugs, that the inputs/outputs match any specific financial product, or that the site will be available at any particular time.
            </p>
          ),
        },
        {
          heading: 'Limitation of liability',
          body: (
            <p>
              To the maximum extent permitted by applicable law, the site operator is not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the site — including any financial decision you make based on output from the calculators. <strong>Talk to a licensed advisor before acting on anything you saw here.</strong> Nothing in this section limits liability for fraud, gross negligence, or any other liability that cannot be limited under EU consumer law.
            </p>
          ),
        },
        {
          heading: 'Your responsibilities',
          body: (
            <>
              <p>When using the site you agree:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Not to attempt to attack, deface, scrape at abusive rates, or otherwise interfere with the site or its hosting infrastructure.</li>
                <li>Not to reverse-engineer the site for the purpose of building a competing product that misrepresents it.</li>
                <li>To use the calculators only for personal, non-commercial educational purposes (commercial / embedding use requires written permission from the operator).</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Intellectual property',
          body: (
            <p>
              The site's source code is published on GitHub at <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a> under the licence in that repository. The site name "TrueCompound," its logo, and the curated copy/text on the site remain the property of {OWNER}, all rights reserved unless explicitly granted by the source-code licence.
            </p>
          ),
        },
        {
          heading: 'EU consumer rights',
          body: (
            <p>
              Nothing in these Terms limits your statutory rights as a consumer under EU law or the law of your country of residence. If any provision of these Terms is unenforceable under applicable consumer-protection law, that provision will be modified to the minimum extent necessary; the remaining Terms stay in effect.
            </p>
          ),
        },
        {
          heading: 'Governing law',
          body: (
            <p>
              These Terms are governed by the laws of the operator's country of residence, without prejudice to mandatory consumer-protection rules of the country where you, the user, reside.
            </p>
          ),
        },
        {
          heading: 'Changes',
          body: (
            <p>
              We may revise these Terms at any time. The "Last updated" date tracks the latest version. Material changes will be announced via a banner on the site. Continued use after a change constitutes acceptance.
            </p>
          ),
        },
        {
          heading: 'Contact',
          body: (
            <p>
              For questions about these Terms: <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a>.
            </p>
          ),
        },
      ],
    },
    cookies: {
      title: 'Cookie & Local-Storage Policy',
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
      sections: [
        {
          heading: "What we use",
          body: (
            <p>
              TrueCompound does <strong>not</strong> use HTTP cookies. It uses your browser's <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> to remember three things: your calculator inputs, your language preference, and whether you've dismissed the storage notice.
            </p>
          ),
        },
        {
          heading: 'Categories',
          body: (
            <>
              <p className="mb-2">Under the EU ePrivacy Directive's cookie taxonomy, our storage falls into one category:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Strictly necessary / functional:</strong> the localStorage entries are required to deliver the service you requested (a calculator that remembers your scenario). They do not require prior consent under Art. 5(3) of the ePrivacy Directive.</li>
              </ul>
              <p className="mt-3">We do <strong>not</strong> use:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Analytics cookies / storage (no Google Analytics, no Plausible, no Matomo).</li>
                <li>Advertising cookies / pixels.</li>
                <li>Social-media tracking cookies.</li>
                <li>Cross-site / third-party cookies.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Storage keys we set',
          body: (
            <>
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="py-2 pr-3 font-semibold">Key</th>
                    <th className="py-2 pr-3 font-semibold">Purpose</th>
                    <th className="py-2 font-semibold">Lifetime</th>
                  </tr>
                </thead>
                <tbody className="text-ink-dim">
                  <tr className="border-b border-border">
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-v1</td>
                    <td className="py-2 pr-3">Saves the numeric inputs of every calculator so refreshing the page doesn't reset them.</td>
                    <td className="py-2">Until you clear browser storage</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-lang</td>
                    <td className="py-2 pr-3">Remembers your language choice (English / Spanish).</td>
                    <td className="py-2">Until you clear browser storage</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-cookie-ack</td>
                    <td className="py-2 pr-3">Records that you've dismissed the storage notice, so we don't show it on every page load.</td>
                    <td className="py-2">Until you clear browser storage</td>
                  </tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          heading: 'How to clear',
          body: (
            <>
              <p>You can delete all TrueCompound storage at any time:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Chrome / Edge:</strong> Settings → Privacy & Security → Site Settings → View permissions and data → search "whatifmoney" → Delete.</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data → Manage Data → search "whatifmoney" → Remove.</li>
                <li><strong>Safari:</strong> Settings → Advanced → "Show develop menu" → Develop → Empty Caches; or Settings → Privacy → Manage Website Data.</li>
              </ul>
              <p className="mt-3">Clearing storage will reset your saved scenarios.</p>
            </>
          ),
        },
        {
          heading: 'Third-party fonts',
          body: (
            <p>
              The site loads two fonts (Inter and JetBrains Mono) from <strong>Google Fonts</strong>. This is a network request to <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">fonts.googleapis.com</code> and <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">fonts.gstatic.com</code>; Google may log your IP address as part of the request. Google Fonts does not set cookies. If you'd prefer not to use Google Fonts, the site falls back gracefully to your system's default sans-serif and monospace fonts when blocked.
            </p>
          ),
        },
      ],
    },
    imprint: {
      title: 'Imprint / Legal Notice',
      lastUpdated: `Last updated: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Operator of this website',
          body: (
            <div className="space-y-1.5">
              <p><strong className="text-ink">{OWNER}</strong></p>
              <p>Email: <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a></p>
              <p>GitHub: <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a></p>
            </div>
          ),
        },
        {
          heading: 'Nature of the service',
          body: (
            <p>
              TrueCompound is a free, non-commercial, educational web application about compound interest. It is operated by a private individual; there is no company, no employees, and no commercial activity. No fees are charged and no goods or services are sold via this website.
            </p>
          ),
        },
        {
          heading: 'Responsibility for content (§ 7 TMG / equivalent)',
          body: (
            <p>
              The operator is responsible for the content of this site as a content provider. We continuously check and update the content, but cannot guarantee that all information is at all times complete, accurate, or up-to-date. As a service provider we are not, under §§ 8–10 of the German Telemediengesetz (TMG) or equivalent EU norms, obliged to monitor third-party information submitted or stored on this site.
            </p>
          ),
        },
        {
          heading: 'Liability for links',
          body: (
            <p>
              The site links to external websites (GitHub, fonts.googleapis.com, etc.) over which the operator has no control. We accept no liability for the content of linked sites. The operators of the linked pages are solely responsible for their content.
            </p>
          ),
        },
        {
          heading: 'Copyright',
          body: (
            <p>
              The site's source code is published openly at <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a>. Copyright in the curated text and visual design remains with the operator unless otherwise indicated. Any reproduction, distribution, or commercial use beyond what the source-code licence permits requires the operator's written consent.
            </p>
          ),
        },
        {
          heading: 'Online dispute resolution',
          body: (
            <p>
              The European Commission provides an online dispute-resolution platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">ec.europa.eu/consumers/odr</a>. Because TrueCompound is a non-commercial educational project that does not sell goods or services, we are neither obliged to nor willing to participate in dispute-resolution proceedings before a consumer arbitration board.
            </p>
          ),
        },
      ],
    },
  },
};

// ── Spanish (ES) ─────────────────────────────────────────────────────────────

const es: Dictionary = {
  common: {
    appName: 'TrueCompound',
    notFinancialAdvice: 'No es asesoría financiera.',
    builtBy: 'Hecho por',
    backHome: 'Volver al inicio',
    loading: 'Cargando…',
    aboutThisProject: 'Sobre este proyecto',
    learnMore: 'Saber más',
    gotIt: 'Entendido',
    dismiss: 'Cerrar',
  },
  nav: {
    inflation: 'Inflación',
    dca: 'DCA',
    debt: 'Deuda',
    tax: 'Impuestos',
    monteCarlo: 'Monte Carlo',
    about: 'Acerca de',
    privacy: 'Privacidad',
    terms: 'Términos',
    cookies: 'Cookies',
    legal: 'Aviso legal',
  },
  landing: {
    eyebrow: 'Una suite de interés compuesto',
    titleLine1: 'La mayoría de calculadoras',
    titleLine2Prefix: 'mienten por ',
    titleLine2Highlight: 'omisión',
    titleLine2Suffix: '.',
    intro:
      'Te enseñan el número nominal y esconden la inflación. Te enseñan el promedio y esconden la varianza. Ignoran impuestos, comisiones y el momento de entrada. TrueCompound muestra el valor real detrás del número — para que veas cómo se ve realmente el crecimiento compuesto.',
    ctaPrimary: 'Empieza con la inflación',
    ctaSecondary: 'O salta a Monte Carlo',
    pitches: {
      inflation: {
        title: 'Inflación',
        pitch: 'Mira la diferencia entre el número que "tienes" en pantalla y lo que realmente compra.',
      },
      dca: {
        title: 'Tiro Único vs DCA',
        pitch: 'Mismo capital, mismo mercado — dos estrategias contra regímenes históricos reales.',
      },
      debt: {
        title: 'Espejo de Deuda',
        pitch: 'El interés compuesto funciona en ambos sentidos. La misma ecuación construye riqueza o te tritura.',
      },
      tax: {
        title: 'Refugio Fiscal',
        pitch: 'Mismo fondo, tres envoltorios legales. El sobre a veces vale más que su contenido.',
      },
      monteCarlo: {
        title: 'Monte Carlo',
        pitch: 'Cambia la mentira cómoda del "retorno promedio" por un abanico honesto de probabilidades.',
      },
    },
    footnoteTitle: 'Hecho para ser útil, no para vender nada.',
    footnoteBody:
      'Todo corre en tu navegador. No se registra nada, no se vende nada, no es "gratis durante 14 días". Tus datos persisten localmente para que recargar no los borre, y cada escenario tiene una URL que puedes compartir.',
    footnoteLink: 'Más sobre el proyecto',
  },
  about: {
    eyebrow: 'Acerca de',
    title: 'Por qué existe este proyecto.',
    intro:
      'La mayoría de calculadoras de jubilación las construye gente que intenta venderte algo — normalmente un fondo, un asesor o ambos. La matemática que muestran no es errónea, pero deja cosas fuera: inflación, impuestos, riesgo de secuencia de retornos, el camino que tus dólares concretos siguieron a través del mercado. El resultado es un número limpio que parece tranquilizador y no lo es.',
    bullets: {
      inflation: (
        <>
          <strong className="text-ink">Inflación</strong> — muestra crecimiento nominal vs. real (dólares de hoy) en el mismo eje.
        </>
      ),
      dca: (
        <>
          <strong className="text-ink">Tiro Único vs DCA</strong> — corre ambas estrategias contra regímenes históricos reales (favorable, década perdida, post-crisis).
        </>
      ),
      debt: (
        <>
          <strong className="text-ink">Espejo de Deuda</strong> — pone una inversión y una deuda a la misma tasa lado a lado, para que veas que el interés compuesto funciona en los dos sentidos.
        </>
      ),
      tax: (
        <>
          <strong className="text-ink">Refugio Fiscal</strong> — compara cuentas gravables, Roth/TFSA y Tradicional/RRSP después de impuestos. El envoltorio importa más que el fondo.
        </>
      ),
      monteCarlo: (
        <>
          <strong className="text-ink">Monte Carlo</strong> — sustituye un único punto-estimación por un abanico de bandas de probabilidad, incluyendo tasa de supervivencia en modo retiro.
        </>
      ),
    },
    listIntro: 'TrueCompound reúne cinco pequeñas herramientas, cada una apuntada a una de esas omisiones:',
    howItWorks: {
      title: 'Cómo funciona.',
      body: (
        <>
          Cada modo importa del mismo motor de cálculo — funciones de TypeScript puras, totalmente testeables. Sin backend, sin analítica, sin tracking. Tus datos persisten en <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code>; cada escenario tiene una URL que puedes compartir y que codifica los datos como parámetros de consulta.
        </>
      ),
    },
    whatItIsNot: {
      title: 'Lo que esto NO es.',
      body: (
        <>
          No es asesoría financiera. No es una recomendación. Las series históricas de retorno aquí son <em>fieles a su forma</em> en CAGR y volatilidad del período, pero se generan determinísticamente, no son datos brutos de índice — sirven para enseñar intuición sobre dependencia del camino, no para hacer backtesting de estrategias. Habla con un fiduciario real antes de hacer cualquier cosa irreversible con dinero.
        </>
      ),
    },
    sig: `Hecho por ${OWNER}`,
  },
  inputs: {
    inputsLabel: 'Variables',
    startingPrincipal: 'Capital inicial',
    monthlyContribution: 'Aporte mensual',
    annualReturn: 'Retorno anual',
    inflationRate: 'Tasa de inflación',
    years: 'Años',
    yrsSuffix: ' años',
    balance: 'Saldo',
    apr: 'Tasa de interés (TAE)',
    monthlyPayment: 'Pago mensual',
    timeAxisMax: 'Eje de tiempo (máx.)',
    totalCapital: 'Capital total',
    deploymentWindow: 'Ventana de despliegue DCA',
    months: ' meses',
    historicalSeries: 'Serie histórica de retornos',
    marginalTaxRate: 'Tasa marginal',
    capitalGainsRate: 'Tasa de ganancias de capital',
    startingBalance: 'Saldo inicial',
    monthlyWithdrawal: 'Retiro mensual',
    expectedReturn: 'Retorno esperado',
    volatility: 'Volatilidad (σ anual)',
    iterations: 'Iteraciones',
    accumulation: 'Acumulación',
    withdrawal: 'Retiro',
    accumulationHint: 'Estás construyendo riqueza — añadiendo dinero cada mes, sin retirar nada.',
    withdrawalHint: 'Estás en la jubilación — sacando dinero cada mes, ya no aportas.',
    sharescenario: 'Compartir escenario',
    copied: '¡Copiado!',
  },
  hints: {
    inflationRateGeneric: 'La media de EE. UU. a largo plazo es ~3%. Usa los chips arriba para regímenes históricos.',
    annualReturnGeneric: 'Cuánto crecen tus inversiones, antes de inflación.',
    deploymentWindow: 'En cuántos meses DCA reparte las compras. 1 = equivale a tiro único.',
    totalCapital: 'La pila de dinero que estás decidiendo cómo desplegar.',
    debtBalance: 'Cuánto debes actualmente.',
    debtRate: 'Hipotecas: 3–7%. Préstamos estudiantiles: 5–8%. Tarjetas de crédito: 18–30%.',
    debtPayment: 'Pon 0 para usar el mínimo del 2% de tarjeta de crédito.',
    marginalTaxBrackets: 'Tramos EE. UU.: 22% (~$45k), 32% (~$190k), 37% (~$580k).',
    capitalGainsBrackets: 'EE. UU. largo plazo: 0%, 15% o 20% según ingresos.',
    monteCarloBalanceWithdraw: 'Tu nido de jubilación el día uno.',
    monteCarloBalanceAccum: 'Lo que has ahorrado hasta ahora.',
    monteCarloContribution: 'Lo que añades al portafolio cada mes.',
    monteCarloWithdrawal: 'Lo que retiras para gastos de vida cada mes.',
    monteCarloExpectedReturn: 'El S&P 500 a largo plazo es ~7% real (10% nominal).',
    monteCarloVolatility: 'S&P 500 ≈ 15%. Bonos ≈ 5%. Cripto ≈ 70%+.',
    monteCarloIterations: 'Cuántos futuros aleatorios simular. Más = bandas más suaves, más lento.',
  },
  inflation: {
    eyebrow: 'Modo 01 · Inflación',
    title: 'El número que ves no es el número que gastarás.',
    subtitle: <>Un 7% de retorno nominal con 3% de inflación es en realidad 4%. Mira cómo se abre la brecha.</>,
    explainerSummary: "Qué significa realmente el 'lastre de la inflación' — explicación completa",
    explainer: (
      <>
        <p>
          Cada año que tu dinero está parado, pasan dos cosas a la vez: tu saldo crece (retornos), y los precios suben (inflación). El retorno titular — digamos 8% — es el número <strong>nominal</strong>. Réstale la inflación, y obtienes el retorno <strong>real</strong> — lo que realmente compran tus dólares.
        </p>
        <p>
          Ejemplo: tienes $100 ganando 8% en un año; los precios suben 3%. Al final del año tienes $108 nominales, pero una canasta de cosas que costaba $100 ahora cuesta $103. Así que tu ganancia real es aproximadamente $108 ÷ $103 ≈ <strong>+4.8%</strong>, no +8%.
        </p>
        <p>
          La mayoría de calculadoras solo muestran la línea nominal. La zona sombreada roja en el gráfico de abajo es el poder adquisitivo que pierdes silenciosamente — y como tanto el crecimiento como la inflación se componen, la brecha se ensancha exponencialmente. Después de ~15 años la diferencia entre "lo que dice la pantalla" y "lo que puedes gastar" deja de ser un error de redondeo.
        </p>
      </>
    ),
    presetsTitle: 'Prueba un régimen de inflación',
    heroNominal: 'Saldo nominal',
    heroReal: 'Real (en $ de hoy)',
    heroRealSub: 'Lo que realmente compra',
    heroDrag: 'Lastre por inflación',
    heroDragOfNominal: (pct) => `${pct} del nominal perdido`,
    heroNominalSub: 'Lo que dice el banco',
    plainEnglish: ({ years, nominal, real, gap, realReturn, annualReturn }) => (
      <>
        Después de <strong>{years} años</strong>, tu saldo <em>se verá como</em>{' '}
        <strong className="text-ink">{nominal}</strong> — pero en poder adquisitivo de hoy, realmente vale{' '}
        <strong className="text-emerald">{real}</strong>. La inflación silenciosamente se llevó{' '}
        <strong className="text-loss">{gap}</strong>. Tu retorno <em>real</em> — el que de verdad aumenta tu poder de compra — es{' '}
        <strong className="text-ink">{realReturn}/año</strong>, no el {annualReturn} titular.
      </>
    ),
    callout: (real) => (
      <>
        En dólares de hoy, realmente tendrás <strong className="text-ink">{real}</strong>. La brecha sombreada es poder adquisitivo que tu yo futuro pierde silenciosamente por la inflación — se ensancha exponencialmente después del año 15.
      </>
    ),
    warningTitle: 'Tu retorno real es negativo.',
    warningBody: ({ nominal, inflation, net }) => (
      <>
        Tus inversiones crecen al <strong className="text-ink">{nominal}</strong>, pero la inflación crece al <strong className="text-ink">{inflation}</strong>. Efecto neto: estás <em>perdiendo</em> aproximadamente <strong className="text-loss">{net}/año</strong> de poder adquisitivo. La línea nominal sigue subiendo — la línea real baja despacio.
      </>
    ),
  },
  dca: {
    eyebrow: 'Modo 02 · Tiro Único vs DCA',
    title: 'El camino importa tanto como el destino.',
    subtitle: <>Mismo capital, mismo mercado, dos estrategias. El régimen del mercado decide el ganador.</>,
    explainerSummary: 'Tiro único vs DCA — explicación completa',
    explainer: (
      <>
        <p>Tienes una pila de efectivo que quieres invertir. Dos opciones:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-ink">Tiro único:</strong> despliega todo el día uno. Estás 100% expuesto inmediatamente — a ganancias <em>y</em> a pérdidas.</li>
          <li><strong className="text-ink">DCA (promedio del costo en dólares):</strong> divídelo en compras mensuales iguales durante N meses. Promedias tu precio de entrada; si el mercado cae durante la ventana de despliegue, tus compras posteriores son más baratas.</li>
        </ul>
        <p>
          Históricamente, en mercados <strong>al alza</strong> — que son la mayoría — el tiro único gana cerca de dos tercios de las veces, porque el efectivo esperando en la banca no gana nada mientras el mercado sube. DCA solo gana cuando la ventana de despliegue cruza una caída relevante.
        </p>
        <p>
          ¿Entonces por qué hacer DCA? <strong>Comportamiento.</strong> El verdadero riesgo no es si el tiro único o DCA te dan 1.4% más — es si vendes por pánico la mañana siguiente a un día rojo del 10%. DCA te compra un viaje emocional más suave a un pequeño costo esperado.
        </p>
        <p className="text-muted text-xs mt-3">
          Prueba los chips <em>"Comprado en la cima (dot-com)"</em> o <em>"Décadas perdidas de Japón"</em> arriba para ver escenarios donde DCA realmente gana.
        </p>
      </>
    ),
    presetsTitle: 'Prueba una ventana de mercado',
    heroLump: 'Final tiro único',
    heroDCA: 'Final DCA',
    heroWinsBy: (w) => `${w} gana por`,
    heroSubLump: 'Tiempo en el mercado venció al timing',
    heroSubDCA: 'DCA evitó una mala entrada',
    lumpSumLabel: 'Tiro único (despliegue el día uno)',
    dcaLineLabel: (m) => `DCA durante ${m} meses`,
    winnerLump: 'Tiro único',
    winnerDCA: 'DCA',
    plainEnglish: ({ capital, presetLabel, finalLump, finalDCA, deployMonths, winnerLabel, diff, lumpWins }) => (
      <>
        Empezaste con <strong>{capital}</strong> y lo pasaste por <strong className="text-ink">{presetLabel}</strong>. El comprador de tiro único terminó con <strong className="text-emerald">{finalLump}</strong>; el de DCA (repartiendo compras en {deployMonths} meses) terminó con <strong className="text-emerald">{finalDCA}</strong>. <strong>{winnerLabel}</strong> ganó por <strong className={lumpWins ? 'text-gain' : 'text-loss'}>{diff}</strong>.{' '}
        {lumpWins
          ? 'El tiro único suele ganar cuando el mercado sube durante la ventana de despliegue — el tiempo en el mercado vence al timing.'
          : 'DCA gana aquí porque meter todo de golpe atrapó el inicio de una caída; repartir las compras promedió hacia precios más bajos.'}
      </>
    ),
    callout: (
      <>
        En mercados al alza, el tiro único gana ~dos tercios de los períodos históricos porque el efectivo en la banca no gana nada. El valor de DCA no son los retornos — es la protección contra tu propio pánico cuando el primer mes sale rojo.
      </>
    ),
  },
  debt: {
    eyebrow: 'Modo 03 · Espejo de Deuda',
    title: 'La misma matemática corre en ambos sentidos.',
    subtitle: <>El interés compuesto es simétrico. El gráfico de inversión y el de deuda son la misma ecuación con el signo invertido.</>,
    explainerSummary: 'El espejo de la deuda — explicación completa',
    explainer: (
      <>
        <p>
          El interés compuesto se suele vender como un milagro. Lo es — pero solo cuando estás del lado correcto de la ecuación. Un saldo creciendo al 7% anual y una deuda creciendo al 7% anual siguen la misma curva exponencial. Uno termina con riqueza; el otro termina contigo trabajando para alimentar el principal.
        </p>
        <p>
          La versión más extrema es la <strong>trampa del pago mínimo de la tarjeta de crédito</strong>. Un mínimo mensual del 2% sobre una tarjeta al 24% TAE apenas cubre los intereses. Cada mes, el principal se mueve un milímetro mientras el interés avanza un kilómetro. Un saldo de $10,000 puede tardar <em>décadas</em> en saldarse y costar más intereses que el saldo original.
        </p>
        <p>
          Conclusión práctica: un dólar usado para matar deuda al 7% vale exactamente lo mismo que un dólar ganando 7% en el mercado — salvo que es <strong>garantizado</strong>, libre de impuestos y libre de riesgo. Por eso "paga primero la deuda de alto interés" supera a casi cualquier estrategia de inversión hasta que la deuda cara se acaba.
        </p>
      </>
    ),
    presetsTitle: 'Prueba un escenario de deuda',
    heroInvestmentBecomes: 'La inversión se vuelve',
    heroInvestmentBecomesSub: (r) => `Al ${r}, sin aportes`,
    heroDebtCosts: 'La deuda cuesta',
    heroDebtCostsSub: 'Intereses totales pagados',
    heroTime: 'Tiempo hasta saldar',
    heroTimeSubNeverPaid: 'Pago demasiado bajo — la deuda crece',
    asInvestment: 'Como inversión',
    asDebt: 'Como deuda',
    debtBalance: 'Saldo de deuda',
    investmentBalance: 'Saldo de inversión',
    callout: (
      <>
        La forma es la misma — exponencial. La trampa del pago mínimo es lo que pasa cuando tu pago está apenas por encima de la línea de intereses. El principal se mueve un milímetro mientras el tiempo se mueve un kilómetro.
      </>
    ),
    warningTitle: 'Tu pago no cubre los intereses.',
    warningBody: ({ rate, balance, interest, payment }) => (
      <>
        A {rate} TAE sobre {balance}, el interés mensual es <strong className="text-loss">{interest}</strong>. Con un pago de {payment}, el saldo <em>crece cada mes</em>. Prueba un pago más alto, o ponlo en <strong>0</strong> para ver el patrón de la trampa del mínimo.
      </>
    ),
    plainEnglish: ({ balance, ratePct, payment, paidOff, timeText, interest, investmentEnd }) => (
      <>
        Si <em>debes</em> <strong>{balance}</strong> al {ratePct} TAE y pagas <strong>{payment}/mes</strong>,{' '}
        {paidOff ? (
          <>
            lo saldarás en <strong className="text-ink">{timeText}</strong> y pagarás <strong className="text-loss">{interest}</strong> en intereses por el camino.
          </>
        ) : (
          <>
            <strong className="text-loss">nunca lo saldarás</strong> con este nivel de pago — el interés supera al pago.
          </>
        )}{' '}
        El mismo saldo <em>invertido</em> al mismo retorno (sin más aportes) se convertiría en <strong className="text-gain">{investmentEnd}</strong> en la misma ventana. Al interés compuesto no le importa en qué dirección funciona.
      </>
    ),
  },
  tax: {
    eyebrow: 'Modo 04 · Refugio Fiscal',
    title: 'El envoltorio de la cuenta vale más que el fondo dentro.',
    subtitle: <>Mismo aporte, mismo retorno, tres sobres legales. La brecha al año 30 es a veces más que tu principal.</>,
    explainerSummary: 'Cómo se diferencian los tres tipos de cuenta — explicación completa',
    explainer: (
      <>
        <p>El fondo dentro de la cuenta es idéntico. El <em>envoltorio</em> que lo rodea cambia cuándo el gobierno cobra su parte, y esa diferencia de timing puede valer decenas de miles de dólares a lo largo de una carrera.</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-ink">Cuenta gravable:</strong> cada dividendo y cada ganancia realizada se grava el año que pasa. El interés compuesto sigue funcionando, pero sobre un saldo un poco más flaco.</li>
          <li><strong className="text-ink">Tradicional / RRSP:</strong> aportas dólares <em>antes de impuestos</em>, así que el saldo de la cuenta es más grande desde el día uno — pero cada dólar que retires luego se grava como ingreso.</li>
          <li><strong className="text-ink">Roth / TFSA:</strong> aportas dólares <em>después de impuestos</em> (saldo inicial más pequeño), y entonces todo — crecimiento y retiros — queda libre de impuestos para siempre.</li>
        </ul>
        <p><strong>Regla práctica:</strong> si tu tasa de hoy es más alta que la que tendrás en jubilación → Tradicional/RRSP suele ganar. Si la tasa de hoy es igual o menor → Roth/TFSA gana. Las cuentas gravables pierden contra ambas siempre que haya una opción protegida real disponible.</p>
      </>
    ),
    presetsTitle: 'Prueba un perfil de ahorrador',
    heroRoth: 'Roth / TFSA (después de impuestos)',
    heroTrad: 'Tradicional / RRSP (después de impuestos)',
    heroTaxable: 'Cuenta gravable (después de impuestos)',
    callout: (winner) => (
      <>
        <strong className="text-ink">{winner}</strong> gana este escenario. La línea Tradicional/RRSP es la más alta antes de impuestos porque el gobierno temporalmente posee una parte. Roth/TFSA suele ganar cuando tu tramo fiscal futuro es igual o más alto que el de hoy.
      </>
    ),
    plainEnglish: ({ winner, rothAfterTax, taxableAfterTax, gap }) => (
      <>
        Con estos datos, <strong className="text-ink">{winner}</strong> gana. La Roth/TFSA protegida termina con <strong className="text-gain">{rothAfterTax}</strong> después de impuestos, mientras que los mismos aportes en una cuenta gravable normal terminan con solo <strong className="text-loss">{taxableAfterTax}</strong> después de impuestos — una brecha de <strong>{gap}</strong>. Esa brecha es lo que el envoltorio fiscal te ahorra por no hacer nada diferente excepto elegir el tipo de cuenta correcto.
      </>
    ),
    accountNames: {
      roth: 'Roth/TFSA',
      traditional: 'Tradicional/RRSP',
      taxable: 'Gravable',
    },
  },
  montecarlo: {
    eyebrow: 'Modo 05 · Monte Carlo',
    titleAccum: 'Un abanico de futuros, no un pronóstico.',
    titleWithdraw: '¿Durará el dinero?',
    subtitleAccum: <>Una proyección de un único "retorno promedio" es una mentira. La respuesta honesta es una distribución de probabilidad.</>,
    subtitleWithdraw: <>Corre miles de caminos de retorno aleatorios. La tasa de supervivencia es la fracción de esos caminos donde el portafolio llega a la meta por encima de cero.</>,
    explainerSummary: 'Qué hace realmente Monte Carlo — explicación completa',
    explainer: (
      <>
        <p>Una calculadora de "retorno promedio" único dice: "tendrás $1.2M en la jubilación". Tranquilizador — y mentira. Los mercados no entregan el promedio cada año; entregan +24%, -18%, +9%, +1%, etcétera. El orden de esos años importa.</p>
        <p><strong className="text-ink">Monte Carlo</strong> sustituye la mentira con miles de secuencias de retornos lanzadas al azar. Cada secuencia es un futuro posible. Ordenamos los saldos finales y preguntamos: ¿cómo se ve el camino del <em>medio</em>? ¿El 10% afortunado? ¿El 10% desafortunado?</p>
        <p>La banda sombreada en el gráfico es el 80% central de resultados. La línea discontinua es el caso de mala suerte. Si esa línea baja hacia cero en modo retiro, estás mirando un verdadero <strong>riesgo de secuencia de retornos</strong> — pérdidas tempranas combinadas con retiros pueden volar un portafolio incluso cuando el promedio a largo plazo está bien.</p>
        <p>Dos perillas para jugar: <strong>retorno esperado</strong> (dónde vive el promedio) y <strong>volatilidad</strong> (cómo de ancho se abre el abanico). Sube cualquiera y mira cuánto sufre el percentil 10 frente a la mediana.</p>
      </>
    ),
    presetsTitle: 'Prueba un escenario de vida',
    heroSurvival: 'Tasa de supervivencia',
    heroSurvivalSub: (s, t) => `${s} de ${t} corridas terminaron ≥ $0`,
    heroMedian: 'Resultado mediano',
    heroMedianSub: '50% de caminos terminan por encima',
    hero10: 'Percentil 10',
    hero10Sub: 'Caso de mala suerte',
    hero90: 'Percentil 90',
    hero90Sub: 'Caso de buena suerte',
    seriesP90: 'Percentil 90',
    seriesMedian: 'Mediana (50)',
    seriesP10: 'Percentil 10',
    warningUnsustainableTitle: (r) => `Tu tasa de retiro es ${r}/año — no sostenible.`,
    warningUnsustainableBody: ({ annual, balance, rate }) => (
      <>
        Estás intentando sacar <strong className="text-ink">{annual}/año</strong> de un saldo de <strong className="text-ink">{balance}</strong>. La tasa segura convencional es ~4%/año (la "regla del 4%"). A {rate}, el dinero se acaba casi sin importar lo que haga el mercado — por eso ves 0% de supervivencia. Prueba el preset <strong>"Jubilación estándar"</strong> de arriba para ver un escenario realista.
      </>
    ),
    warningAggressiveTitle: (r) => `Tu tasa de retiro es ${r}/año — agresiva.`,
    warningAggressiveBody: (
      <>
        Sacar más del 5%/año históricamente se quedaba sin fondos en malas secuencias. La clásica "regla del 4%" existe porque tasas más altas fallan en secuencias del mundo real (década del shock del petróleo, década perdida, etc.). Mira la línea del percentil 10 abajo — ese es el caso de mala suerte que tendrías que sobrevivir.
      </>
    ),
    plainEnglishWithdraw: ({ iterations, balance, withdrawal, survivalPct, years, tone }) => (
      <>
        De <strong>{iterations}</strong> futuros aleatorios empezando con <strong className="text-ink">{balance}</strong> y sacando <strong className="text-ink">{withdrawal}/mes</strong>,{' '}
        <strong className={tone === 'strong' ? 'text-gain' : tone === 'failing' ? 'text-loss' : 'text-ink'}>{survivalPct}%</strong> llegaron al año {years} con dinero todavía.{' '}
        {tone === 'strong'
          ? 'Es un colchón fuerte — la matemática funciona en la mayoría de secuencias de retornos.'
          : tone === 'okay'
            ? 'Decente, pero 1 de cada 4 caminos falla — malos retornos tempranos aún pueden arruinarte.'
            : tone === 'risky'
              ? 'Cerca de cara o cruz. El riesgo de secuencia de retornos es real aquí — baja el retiro o alarga los años de ahorro.'
              : 'Muy probable que se acabe. Baja el retiro, aumenta el saldo, o acorta el horizonte.'}
      </>
    ),
    plainEnglishAccum: ({ iterations, balance, contribution, years, median, p10, p90 }) => (
      <>
        Entre <strong>{iterations}</strong> futuros aleatorios (empezando <strong className="text-ink">{balance}</strong>, añadiendo <strong className="text-ink">{contribution}/mes</strong> durante {years} años), el camino del medio aterriza en <strong className="text-gain">{median}</strong>. Los caminos desafortunados terminan cerca de <strong className="text-loss">{p10}</strong>; los afortunados cerca de <strong>{p90}</strong>. La brecha ancha es la volatilidad haciendo su trabajo — mismo retorno promedio, vidas muy diferentes.
      </>
    ),
    callout: (
      <>
        La banda sombreada es el 80% central de posibles futuros. Si la línea del percentil 10 baja hacia cero, la proyección "promedio" está ocultando un riesgo real de ruina — especialmente en modo retiro, donde las pérdidas tempranas se componen contra ti (riesgo de secuencia de retornos).
      </>
    ),
  },
  presets: {
    inflation: {
      title: 'Prueba un régimen de inflación',
      items: {
        longRun: { label: 'EE. UU. largo plazo (3%)', blurb: 'La media de EE. UU. post-WWII. El telón de fondo "por defecto" que asume la mayoría de consejos modernos.' },
        stagflation: { label: 'Estanflación años 70 (7%)', blurb: 'Shocks del petróleo + política monetaria laxa = una década donde la inflación masticó los ahorros.' },
        warEra: { label: 'Pico de guerra (10%)', blurb: 'Regímenes de guerra grande o shock de oferta (post-WWII 1946, crisis del petróleo 1979). Crecimiento de precios de doble dígito.' },
        covid: { label: 'Pico 2021–2023 (5%)', blurb: 'Pico de inflación post-COVID. Suave en el papel, doloroso en la caja registradora.' },
        japanDefl: { label: 'Deflación de Japón (0%)', blurb: 'Japón 1990s–2010s: precios planos o cayendo. El efectivo gana valor solo por estar quieto.' },
      },
    },
    dca: {
      title: 'Prueba una ventana de mercado',
      items: {
        standard: { label: '30 años estándar (S&P 1990–2020)', blurb: 'La referencia "si solo hubieras mantenido el S&P 500". El tiro único suele ganar.' },
        dotcomTop: { label: 'Comprado en la cima (dot-com)', blurb: 'Despliegas todo a principios de 2000. Los siguientes 3 años son brutales.' },
        crisis2008: { label: 'Ventana del crash de 2008', blurb: 'Mid-2007 a inicios de 2009 — un -55% de caída en 17 meses. Aquí DCA gana su sueldo.' },
        japan: { label: 'Décadas perdidas de Japón', blurb: 'El contraejemplo. 1990–2010: las acciones fueron de lado/hacia abajo durante 20 años.' },
      },
    },
    debt: {
      title: 'Prueba un escenario de deuda',
      items: {
        ccTrap: { label: 'Trampa del mínimo de tarjeta', blurb: '$10k de saldo al 24% TAE con pagos mínimos del 2%. Décadas para saldarla, más intereses que principal.' },
        mortgage: { label: 'Hipoteca (6%)', blurb: 'Una hipoteca de $300k al 6% con un pago típico de $1,800/mes durante 30 años.' },
        student: { label: 'Préstamo estudiantil (7%)', blurb: '$30k tipo préstamo federal al 7%, $350/mes — unos 10 años para saldarlo.' },
        aggressive: { label: 'Pago agresivo', blurb: '$25k al 12% saldado a $1,000/mes. Mira qué rápido cae el saldo.' },
        car: { label: 'Préstamo de auto (5 años)', blurb: '$28k de préstamo de auto al 8%, ~$570/mes durante 60 meses.' },
      },
    },
    tax: {
      title: 'Prueba un perfil de ahorrador',
      items: {
        young: { label: 'Inversor joven', blurb: 'Empezando desde $0, $500/mes, ingresos bajos (tasa marginal 22%). 30 años hasta la jubilación.' },
        peak: { label: 'Pico de ingresos', blurb: 'Profesional de altos ingresos: $50k inicial, $2,000/mes, tasa marginal 37%. Los refugios pre-impuesto brillan.' },
        rothMax: { label: 'Máximo Roth IRA', blurb: 'Llenando el tope Roth de $7k/año (~$583/mes) durante 35 años a tasa moderada.' },
        midCareer: { label: 'Recuperación mitad de carrera', blurb: 'Empezó tarde: $100k ahorrado, $1,500/mes durante 20 años. Tasa 28%.' },
      },
    },
    monteCarlo: {
      title: 'Prueba un escenario de vida',
      items: {
        building: { label: 'Construyendo riqueza (30 años)', blurb: '$50k ahorrado, $1,000/mes durante 30 años. Monte Carlo clásico de acumulación.' },
        standardRetire: { label: 'Jubilación estándar', blurb: '$1M a los 65, retirando $4k/mes durante 30 años. La clásica prueba de la "regla del 4%".' },
        fire: { label: 'FIRE / jubilación temprana', blurb: '$1.5M a los 45, retirando $5k/mes durante 40 años. El riesgo de secuencia es brutal aquí.' },
        conservative: { label: 'Jubilación conservadora', blurb: '$1.5M, $4k/mes durante 30 años. Más holgado que el 4% — mira cómo sube la supervivencia.' },
        stress: { label: 'Prueba de estrés', blurb: '$500k, retiro de $3k/mes, 25% de volatilidad. Escenario realista de peor caso.' },
      },
    },
  },
  historicalSeries: {
    'sp500-1990-2020': { label: 'S&P 500 · 1990–2020', description: 'Ventana larga de 30 años, mayormente favorable — pero incluye el crash de las dot-com y 2008.', group: 'Mercado amplio EE. UU.' },
    'sp500-2000-2020': { label: 'S&P 500 · 2000–2020 (inicio de la "década perdida")', description: 'Empezar justo antes del estallido de las dot-com castiga al inversor de tiro único. ~6% CAGR.', group: 'Mercado amplio EE. UU.' },
    'sp500-2009-2019': { label: 'S&P 500 · 2009–2019 (toro post-GFC)', description: 'La década después del crash de 2008. El tiro único se aleja del DCA.', group: 'Mercado amplio EE. UU.' },
    'djia-1990-2020': { label: 'Dow Jones (DJIA) · 1990–2020', description: 'El Dow de 30 acciones. Forma similar al S&P 500 — CAGR ligeramente menor, menos volatilidad.', group: 'Mercado amplio EE. UU.' },
    'dotcom-2000-2003': { label: 'Crash dot-com · 2000–2003', description: 'Tres años que vaporizaron la mitad del NASDAQ. ~-14% CAGR en la ventana.', group: 'Ventanas de crisis' },
    'crisis-2007-2009': { label: 'Crisis Financiera Global · 2007–2009', description: 'El crash de 2008. El S&P 500 perdió ~55% de pico a valle en 17 meses.', group: 'Ventanas de crisis' },
    'great-depression': { label: 'Gran Depresión · 1929–1939', description: 'La peor década de equities de EE. UU. en récord. ~-5% CAGR en diez años.', group: 'Ventanas de crisis' },
    'eurostoxx-2000-2020': { label: 'Euro Stoxx 50 · 2000–2020', description: 'Índice azul de la Eurozona. Dos crashes en dos décadas — CAGR moderado a largo plazo.', group: 'Europa' },
    'ibex-1995-2020': { label: 'IBEX 35 (España) · 1995–2020', description: 'Índice large-cap español. Fuerte corrida 90s/00s, brutal era 2008–2012 de deuda soberana.', group: 'Europa' },
    'nikkei-1990-2010': { label: 'Nikkei 225 (Japón) · 1990–2010', description: 'Las "décadas perdidas" originales. Pico 1989, ~20 años de CAGR negativo.', group: 'Asia' },
    'nikkei-2012-2022': { label: 'Nikkei 225 (Japón) · 2012–2022', description: 'Tras dos décadas de declive, Japón finalmente sube. ~8% CAGR en la ventana.', group: 'Asia' },
  },
  cookieNotice: {
    body: (
      <>
        Este sitio guarda tus datos en tu navegador (localStorage) para que recargar no los borre. No te rastrea, no registra nada en un servidor, y no usa cookies de terceros.
      </>
    ),
    accept: 'Entendido',
    learnMore: 'Política de cookies',
  },
  legal: {
    privacy: {
      title: 'Política de Privacidad',
      lastUpdated: `Última actualización: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Resumen en una frase',
          body: (
            <p>
              TrueCompound es una calculadora del lado del cliente. No recopila, transmite ni comparte ningún dato personal con nadie. Tus datos se quedan en tu navegador.
            </p>
          ),
        },
        {
          heading: 'Quién opera este sitio',
          body: (
            <p>
              El sitio lo opera como proyecto educativo personal y no comercial {OWNER}. Puedes contactar al operador en <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a> o vía el GitHub del proyecto en <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a>.
            </p>
          ),
        },
        {
          heading: 'Qué datos procesamos',
          body: (
            <>
              <p>El sitio procesa los siguientes datos, todos localmente en tu propio navegador:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>Los datos numéricos que escribes en las calculadoras (saldo inicial, aporte mensual, tasa de retorno, etc.).</li>
                <li>Tu preferencia de idioma (inglés o español).</li>
                <li>Si has cerrado el aviso de cookies/almacenamiento.</li>
              </ul>
              <p className="mt-3">
                Estos datos se guardan en <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> bajo las claves <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-v1</code>, <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-lang</code>, y <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">whatifmoney-cookie-ack</code>. Nada de eso sale de tu dispositivo.
              </p>
            </>
          ),
        },
        {
          heading: 'Base legal del tratamiento (RGPD Art. 6)',
          body: (
            <p>
              Nos basamos en el Art. 6(1)(b) del RGPD — tratamiento necesario para la ejecución del servicio que has solicitado (ejecutar las calculadoras con datos persistentes). Para la preferencia de idioma y el indicador de aviso cerrado, la base legal es tu instrucción implícita a la aplicación.
            </p>
          ),
        },
        {
          heading: 'Cookies y tracking',
          body: (
            <>
              <p>
                <strong>No usamos cookies para tracking, analítica ni publicidad.</strong> No incrustamos ningún tracker de terceros, sin Google Analytics, sin píxel de Facebook, sin redes publicitarias, sin fingerprinting.
              </p>
              <p className="mt-3">
                Usamos el <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> del navegador como se describe arriba. Las entradas de localStorage no se transmiten a ningún servidor. Puedes borrarlas en cualquier momento desde la configuración de "datos del sitio" de tu navegador.
              </p>
            </>
          ),
        },
        {
          heading: 'Servicios externos',
          body: (
            <>
              <p>El sitio carga los siguientes recursos externos:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Google Fonts</strong> (fonts.googleapis.com / fonts.gstatic.com) — para cargar las fuentes Inter y JetBrains Mono. Google puede recibir tu dirección IP como parte de esa petición. Consulta la política de privacidad de Google.</li>
                <li><strong>Netlify</strong> (o similar) — el CDN del sitio. El host puede retener logs estándar de peticiones (IP, user-agent, ruta) por motivos operativos y de seguridad. No accedemos a esos logs.</li>
              </ul>
              <p className="mt-3">
                No incrustamos iframes, widgets de redes sociales ni sistemas de comentarios.
              </p>
            </>
          ),
        },
        {
          heading: 'Tus derechos (RGPD Arts. 15–22)',
          body: (
            <>
              <p>Como no guardamos ninguno de tus datos en nuestros servidores, la mayoría de derechos del RGPD son fáciles de ejercer tú mismo:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Acceso:</strong> abre las herramientas de desarrollo del navegador → Aplicación → Local Storage. Las claves listadas arriba contienen todo lo que "tenemos" sobre ti.</li>
                <li><strong>Supresión / derecho al olvido:</strong> borra las entradas de localStorage del sitio (configuración del navegador → "Borrar datos del sitio").</li>
                <li><strong>Portabilidad:</strong> la URL del escenario (botón Compartir) codifica tus datos como parámetros de consulta — esa es tu copia portable.</li>
                <li><strong>Oposición / restricción:</strong> deja de usar el sitio.</li>
              </ul>
              <p className="mt-3">
                Si crees que tus derechos han sido vulnerados, tienes derecho a presentar una reclamación ante tu autoridad nacional de protección de datos.
              </p>
            </>
          ),
        },
        {
          heading: 'Niños',
          body: <p>El sitio no está dirigido a niños menores de 16 años y no procesa conscientemente ningún dato sobre ellos.</p>,
        },
        {
          heading: 'Cambios en esta política',
          body: (
            <p>
              Podemos actualizar esta política de vez en cuando. La fecha de "Última actualización" arriba de esta página rastrea la versión más reciente. Los cambios materiales se anunciarán mediante un banner en el sitio.
            </p>
          ),
        },
      ],
    },
    terms: {
      title: 'Términos y Condiciones',
      lastUpdated: `Última actualización: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Aceptación',
          body: <p>Al usar TrueCompound aceptas estos Términos. Si no estás de acuerdo, por favor no uses el sitio.</p>,
        },
        {
          heading: 'No es asesoría financiera',
          body: (
            <>
              <p>
                <strong>TrueCompound es una herramienta educativa. Nada en este sitio constituye asesoría financiera, de inversión, fiscal o legal.</strong> Las calculadoras ilustran conceptos de interés compuesto y probabilidad usando modelos simplificados. No son una recomendación de comprar, mantener o vender ningún valor, contrato o producto financiero, y no sustituyen al consejo de un profesional cualificado, autorizado y conocedor de tus circunstancias individuales.
              </p>
              <p className="mt-3">
                Las series históricas de retornos mostradas en la app son caminos ilustrativos <em>fieles a su forma</em> — coinciden con cifras publicadas de CAGR y volatilidad del período pero se generan determinísticamente desde un proceso aleatorio semilla, no son datos brutos del índice. No los uses para backtests de portafolio.
              </p>
            </>
          ),
        },
        {
          heading: 'Sin garantía',
          body: (
            <p>
              El sitio se proporciona "tal cual" y "según disponibilidad" sin garantía de ningún tipo, expresa o implícita. No garantizamos que los cálculos estén libres de errores, que las entradas/salidas coincidan con ningún producto financiero concreto, o que el sitio esté disponible en un momento determinado.
            </p>
          ),
        },
        {
          heading: 'Limitación de responsabilidad',
          body: (
            <p>
              En la medida máxima permitida por la legislación aplicable, el operador del sitio no es responsable de daños directos, indirectos, incidentales, consecuentes o punitivos derivados de tu uso, o incapacidad de usar, el sitio — incluyendo cualquier decisión financiera que tomes basándote en la salida de las calculadoras. <strong>Habla con un asesor autorizado antes de actuar sobre lo que viste aquí.</strong> Nada en esta sección limita la responsabilidad por fraude, negligencia grave o cualquier otra responsabilidad que no pueda limitarse bajo la ley de consumo de la UE.
            </p>
          ),
        },
        {
          heading: 'Tus responsabilidades',
          body: (
            <>
              <p>Al usar el sitio aceptas:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>No intentar atacar, desfigurar, hacer scraping abusivo o interferir de cualquier modo con el sitio o su infraestructura de hosting.</li>
                <li>No hacer ingeniería inversa del sitio con el propósito de construir un producto competidor que lo tergiverse.</li>
                <li>Usar las calculadoras solo con fines educativos personales y no comerciales (uso comercial / embebido requiere permiso escrito del operador).</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Propiedad intelectual',
          body: (
            <p>
              El código fuente del sitio se publica en GitHub en <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a> bajo la licencia en ese repositorio. El nombre del sitio "TrueCompound", su logo, y el texto/copy curado del sitio siguen siendo propiedad de {OWNER}, todos los derechos reservados salvo lo que la licencia del código fuente conceda explícitamente.
            </p>
          ),
        },
        {
          heading: 'Derechos del consumidor en la UE',
          body: (
            <p>
              Nada en estos Términos limita tus derechos legales como consumidor bajo la ley de la UE o la ley de tu país de residencia. Si alguna disposición de estos Términos no es ejecutable bajo la ley aplicable de protección al consumidor, esa disposición se modificará al mínimo necesario; los Términos restantes permanecen en vigor.
            </p>
          ),
        },
        {
          heading: 'Ley aplicable',
          body: (
            <p>
              Estos Términos se rigen por las leyes del país de residencia del operador, sin perjuicio de las normas obligatorias de protección al consumidor del país donde tú, el usuario, resides.
            </p>
          ),
        },
        {
          heading: 'Cambios',
          body: (
            <p>
              Podemos revisar estos Términos en cualquier momento. La fecha de "Última actualización" rastrea la versión más reciente. Los cambios materiales se anunciarán mediante un banner en el sitio. El uso continuado tras un cambio constituye aceptación.
            </p>
          ),
        },
        {
          heading: 'Contacto',
          body: (
            <p>
              Para preguntas sobre estos Términos: <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a>.
            </p>
          ),
        },
      ],
    },
    cookies: {
      title: 'Política de Cookies y Almacenamiento Local',
      lastUpdated: `Última actualización: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Qué usamos',
          body: (
            <p>
              TrueCompound <strong>no</strong> usa cookies HTTP. Usa el <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">localStorage</code> de tu navegador para recordar tres cosas: los datos de tus calculadoras, tu preferencia de idioma, y si has cerrado el aviso de almacenamiento.
            </p>
          ),
        },
        {
          heading: 'Categorías',
          body: (
            <>
              <p className="mb-2">Bajo la taxonomía de cookies de la Directiva ePrivacy de la UE, nuestro almacenamiento entra en una categoría:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Estrictamente necesarias / funcionales:</strong> las entradas de localStorage son requeridas para entregar el servicio que solicitaste (una calculadora que recuerda tu escenario). No requieren consentimiento previo bajo el Art. 5(3) de la Directiva ePrivacy.</li>
              </ul>
              <p className="mt-3">No usamos:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Cookies / almacenamiento de analítica (sin Google Analytics, sin Plausible, sin Matomo).</li>
                <li>Cookies / píxeles de publicidad.</li>
                <li>Cookies de tracking de redes sociales.</li>
                <li>Cookies cross-site / de terceros.</li>
              </ul>
            </>
          ),
        },
        {
          heading: 'Claves de almacenamiento que ponemos',
          body: (
            <>
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="py-2 pr-3 font-semibold">Clave</th>
                    <th className="py-2 pr-3 font-semibold">Propósito</th>
                    <th className="py-2 font-semibold">Duración</th>
                  </tr>
                </thead>
                <tbody className="text-ink-dim">
                  <tr className="border-b border-border">
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-v1</td>
                    <td className="py-2 pr-3">Guarda los datos numéricos de cada calculadora para que recargar la página no los borre.</td>
                    <td className="py-2">Hasta que borres el almacenamiento del navegador</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-lang</td>
                    <td className="py-2 pr-3">Recuerda tu elección de idioma (inglés / español).</td>
                    <td className="py-2">Hasta que borres el almacenamiento del navegador</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 mono text-xs">whatifmoney-cookie-ack</td>
                    <td className="py-2 pr-3">Registra que has cerrado el aviso de almacenamiento, para no mostrarlo en cada carga.</td>
                    <td className="py-2">Hasta que borres el almacenamiento del navegador</td>
                  </tr>
                </tbody>
              </table>
            </>
          ),
        },
        {
          heading: 'Cómo borrarlo',
          body: (
            <>
              <p>Puedes borrar todo el almacenamiento de TrueCompound en cualquier momento:</p>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li><strong>Chrome / Edge:</strong> Configuración → Privacidad y Seguridad → Configuración del sitio → Ver permisos y datos → buscar "whatifmoney" → Eliminar.</li>
                <li><strong>Firefox:</strong> Configuración → Privacidad y Seguridad → Cookies y Datos del Sitio → Administrar datos → buscar "whatifmoney" → Eliminar.</li>
                <li><strong>Safari:</strong> Configuración → Avanzado → "Mostrar menú desarrollador" → Desarrollador → Vaciar Cachés; o Configuración → Privacidad → Administrar datos del sitio web.</li>
              </ul>
              <p className="mt-3">Borrar el almacenamiento reiniciará tus escenarios guardados.</p>
            </>
          ),
        },
        {
          heading: 'Fuentes de terceros',
          body: (
            <p>
              El sitio carga dos fuentes (Inter y JetBrains Mono) desde <strong>Google Fonts</strong>. Es una petición de red a <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">fonts.googleapis.com</code> y <code className="px-1.5 py-0.5 rounded bg-surface-2 border border-border text-ink-dim text-sm">fonts.gstatic.com</code>; Google puede registrar tu dirección IP como parte de la petición. Google Fonts no pone cookies. Si prefieres no usar Google Fonts, el sitio cae elegantemente a las fuentes sans-serif y monoespaciada por defecto de tu sistema cuando se bloquean.
            </p>
          ),
        },
      ],
    },
    imprint: {
      title: 'Aviso Legal',
      lastUpdated: `Última actualización: ${LAST_UPDATED}`,
      sections: [
        {
          heading: 'Operador de este sitio web',
          body: (
            <div className="space-y-1.5">
              <p><strong className="text-ink">{OWNER}</strong></p>
              <p>Email: <a href={`mailto:${OWNER_EMAIL}`} className="text-emerald hover:text-emerald-light">{OWNER_EMAIL}</a></p>
              <p>GitHub: <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a></p>
            </div>
          ),
        },
        {
          heading: 'Naturaleza del servicio',
          body: (
            <p>
              TrueCompound es una aplicación web gratuita, no comercial y educativa sobre interés compuesto. La opera un particular; no hay empresa, ni empleados, ni actividad comercial. No se cobran tarifas ni se venden bienes o servicios a través de este sitio web.
            </p>
          ),
        },
        {
          heading: 'Responsabilidad por el contenido (§ 7 TMG / equivalente)',
          body: (
            <p>
              El operador es responsable del contenido de este sitio como proveedor de contenido. Revisamos y actualizamos el contenido continuamente, pero no podemos garantizar que toda la información esté en todo momento completa, exacta o al día. Como proveedor de servicios no estamos obligados, bajo los §§ 8–10 de la Telemediengesetz alemana (TMG) o normas equivalentes de la UE, a monitorear información de terceros enviada o almacenada en este sitio.
            </p>
          ),
        },
        {
          heading: 'Responsabilidad por enlaces',
          body: (
            <p>
              El sitio enlaza a sitios externos (GitHub, fonts.googleapis.com, etc.) sobre los cuales el operador no tiene control. No aceptamos responsabilidad por el contenido de sitios enlazados. Los operadores de las páginas enlazadas son los únicos responsables de su contenido.
            </p>
          ),
        },
        {
          heading: 'Copyright',
          body: (
            <p>
              El código fuente del sitio se publica abiertamente en <a href={OWNER_GITHUB} target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">{OWNER_GITHUB}</a>. El copyright del texto curado y diseño visual permanece con el operador salvo indicación contraria. Cualquier reproducción, distribución o uso comercial más allá de lo que permite la licencia del código fuente requiere el consentimiento escrito del operador.
            </p>
          ),
        },
        {
          heading: 'Resolución de litigios en línea',
          body: (
            <p>
              La Comisión Europea proporciona una plataforma de resolución de litigios en línea en <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-emerald hover:text-emerald-light">ec.europa.eu/consumers/odr</a>. Como TrueCompound es un proyecto educativo no comercial que no vende bienes ni servicios, no estamos obligados ni dispuestos a participar en procedimientos de resolución de litigios ante una junta de arbitraje de consumo.
            </p>
          ),
        },
      ],
    },
  },
};

export const dictionaries: Record<Lang, Dictionary> = { en, es };
