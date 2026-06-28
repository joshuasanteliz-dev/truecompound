# WhatIfMoney Landing Redesign Contract

## 1. Chosen Design Direction

Name: The Layer Peel.

The landing page should reveal the difference between a normal calculator's clean fantasy number and WhatIfMoney's hidden-layer result. The hero should make the product thesis visible: ordinary calculators show one reassuring number, while WhatIfMoney peels back the omitted layers that change what the number really means.

## 2. Target User

Primary user: a smart everyday person trying to understand real compounding without needing expert finance knowledge.

Secondary audience: portfolio and recruiter viewers evaluating product thinking, interface craft, visual direction, and implementation restraint.

This is not primarily for technical finance experts.

## 3. Primary User Action

The primary CTA remains "Start with Inflation" because inflation is the clearest first example of the missing-layer thesis.

The secondary action should help users explore all five tools and hidden layers without competing with the primary CTA.

## 4. Emotional Promise

The user should feel: "The number I thought mattered is not the real number."

The design should feel serious, useful, financially trustworthy, premium, slightly provocative, and memorable.

## 5. Page Structure Rules

- Hero proves the thesis.
- Next, the page explains the five hidden layers.
- Then, the page builds trust: local, private, no account, no sales funnel, and not financial advice.
- The page should not become a generic SaaS card grid.
- Each section should have one clear job.

## 6. Hero Rules

- The staged object is the calculation reveal itself.
- Do not use phone mockups, laptop mockups, fake banking UI, fake dashboards, crypto aesthetics, cards, accounts, transaction lists, or AI fintech language.
- The hero should show a controlled illustrative example, clearly labeled as an example scenario.
- The example should contrast:
  - normal calculator / nominal fantasy number
  - WhatIfMoney / real purchasing power or revealed result
  - hidden layers: inflation, taxes/fees, timing, debt, and uncertainty

## 7. Typography Rules

- Use strong, confident sans typography for main copy and interface text.
- Use mono or tabular numerals for money values, percentages, and ledger-like rows.
- Optional accent/display treatment may be used very sparingly for conceptual words such as "omission", "real", "hidden", or "time".
- Do not overuse decorative type.

## 8. Color Rules

- Near-black and dark backgrounds remain core.
- Green means revealed truth, real value, money signal, and primary action.
- Muted gray means assumptions, hidden layers, and secondary information.
- Red or amber may be used sparingly for erosion, debt, tax drag, or loss.
- Avoid random gradients, purple AI aesthetics, glassmorphism without reason, and decorative blobs.

## 9. Layout And Spacing Rules

- Use premium negative space.
- Make the hero feel staged, not merely stacked.
- Use fewer, stronger modules.
- Avoid making the page busier just to make it feel designed.
- Avoid nested cards and generic card-grid dominance.

## 10. Motion Rules

- Motion must explain the product thesis.
- Allowed motion: reveal hidden layers, draw or peel a chart, compare nominal vs real value, show erosion, and transition between layer states.
- Forbidden motion: random floating cards, decorative parallax, bouncing numbers, constant background movement, and excessive scroll hijacking.
- Respect `prefers-reduced-motion`.
- Keep motion performant and CSS/SVG-first unless there is a strong reason otherwise.

## 11. Mobile-Specific Rules

- Mobile is not a shrunken desktop.
- The hero should become a vertical reveal story.
- The result comparison must be readable without tiny charts.
- CTAs must be thumb-friendly.
- Mode choices should become clear tappable sections.
- Avoid horizontal overflow and fragile perspective effects.
- Motion should be simpler on mobile.

## 12. Accessibility Requirements

- Maintain keyboard navigation.
- Preserve visible focus states.
- Maintain semantic headings.
- Ensure color contrast.
- Do not rely on color alone to communicate losses, gains, or layers.
- Respect reduced motion.
- Keep links and buttons accessible.

## 13. Implementation Boundaries For Later

- Work on a copied landing page, likely `LandingMissingLayer.tsx`.
- Keep `/` pointed to the current landing until the redesign is approved.
- Add a temporary preview route only after approval.
- Copy landing-specific preview/card components only if necessary.
- Preserve all current mode links and bilingual behavior.
- Do not touch math, store, engine, calculator modes, GrowthChart, package files, deployment files, legal pages, or the global Layout without explicit approval.

## 14. What Not To Do

- Do not copy Stellar directly.
- Do not mimic Wise's banking dashboard.
- Do not create fake fintech screens.
- Do not make it look like crypto.
- Do not overpromise financial advice.
- Do not make animation the product.
- Do not sacrifice clarity for portfolio spectacle.
- Do not remove existing functionality.

## Implementation Preview Plan

Likely later copies:

- `src/pages/Landing.tsx` -> `src/pages/LandingMissingLayer.tsx`
- `src/pages/landingPreviews.tsx` -> copied only if the hero or mode chooser needs landing-specific reveal visuals
- `src/components/ModeCard.tsx` -> copied only if the five-layer chooser needs a new landing-specific component

Likely later touches, after approval:

- `src/App.tsx` only to add a temporary preview route
- `src/i18n/translations.tsx` only to add bilingual landing-preview copy
- Possibly a landing-scoped style approach inside the copied page, avoiding global style churn unless clearly necessary

Verification later should include:

- desktop and mobile visual review
- keyboard/focus review
- reduced-motion review
- bilingual EN/ES content pass
- build check
