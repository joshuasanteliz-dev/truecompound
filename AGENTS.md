# AGENTS.md

## Working rules

- Do not edit original production pages when asked to redesign; create a copy first.
- Do not commit, push, deploy, or delete files without explicit approval.
- Do not touch unrelated files.
- Do not add production dependencies without explaining the need, tradeoffs, and alternatives.
- Preserve existing functionality, routing, forms, links, CMS behavior, and deployment assumptions.
- Never expose secrets, .env values, API keys, tokens, Stripe keys, Sanity tokens, or deployment credentials.
- For UI redesign work, inspect first, ask questions, propose directions, and create a design contract before coding.
- Mobile must be designed intentionally, not merely responsive.
- Motion must be purposeful, accessible, and performant.
- Prefer small, reviewable diffs.
- After changes, summarize files touched, what changed, why it changed, how to test, and what needs manual review.

## Definition of done for UI/UX work

A redesign is not done until it has passed:
- visual hierarchy review
- psychological UX review
- accessibility review
- mobile review
- performance sanity check
- portfolio-quality explanation