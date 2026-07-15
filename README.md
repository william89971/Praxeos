# Praxeos

> See the structure inside every choice.

[Praxeos](https://praxeos.vercel.app) is an interactive learning laboratory for
examining human choices and economic systems through cases, deterministic 2D
simulations, source-grounded Claude guidance, and reflection.

**Educational validation is pending.** The branch is a portfolio candidate,
not v1.0. Five real beginners must complete all four Labs, at least one
evidence-based revision must be implemented, and the full verification suite
must be rerun before release.

![Praxeos flagship homepage](./tests/visual/snapshots/desktop-chromium/homepage.png)

## Start with the flagship

[Market Without a Manager](https://praxeos.vercel.app/labs/market-without-a-manager)
is the canonical 8–10 minute journey. Five participants enter a small market
with different goods, money, priorities, and knowledge. The learner attempts
barter, introduces money, makes and rejects offers, derives displayed prices
only from completed trades, limits information, changes supply, tests a price
ceiling, interprets the evidence, and revises.

The complete progression is:

| Lab | Central question | Primary environment |
| --- | --- | --- |
| The Choice Machine | What does one choice reveal—and what does it leave unseen? | Branching timeline |
| Market Without a Manager | How can strangers coordinate without one person directing them? | Participant network and event record |
| The Entrepreneur’s Discovery | How do you act when the opportunity cannot be known in advance? | Seeded, partially obscured opportunity map |
| The Money Time Machine | Who experiences a monetary change first—and who experiences it later? | Multi-lane participant timeline |

Every Lab begins in Guided mode, reveals a consequence before naming the
concept, persists through refreshes, offers Explore mode without losing state,
and exports a local learning record. Share URLs contain only bounded simulation
state—never learner prose or Guide output.

## Learning system

- **Learn** — eleven focused lessons with local progress, a practical activity,
  named Lab connections, and final synthesis.
- **Practice** — an everyday case selected deterministically by UTC date plus
  the full case library.
- **Labs** — four distinct deterministic environments with guided and explore
  modes, structured non-canvas state, source links, reflection, and safe shares.
- **Notebook** — initial reasoning, selected evidence, acknowledged assumptions,
  optional Guide turn, revision, citations, reflection, and completion date.
- **Sources** — inspectable allowlisted packets, stable locators, thinker
  profiles, a glossary, counterarguments, and verification notes.
- **How It Was Built** — product decisions, abandoned approaches, architecture,
  accessibility, mistakes, measured checks, and the study gate.

The repository-owned [product map](./docs/product/assets/product-map-overview.png)
and [board specification](./docs/product/figma-board-spec.md) preserve the
four-Lab direction outside any private design tool.

## Honest feedback boundary

Deterministic feedback reads only observable record state:

- required stages and writing fields completed;
- visible simulation evidence explicitly selected;
- model assumptions explicitly acknowledged;
- initial response revised or explicitly confirmed; and
- transparent self-review prompts completed.

It does **not** search learner prose for keywords, grade semantic correctness,
declare concept mastery, score ideology, or invent praise. The no-AI path places
the initial and revised responses beside the learner’s chosen evidence and
assumptions. Multiple interpretations remain possible.

## Optional Claude Guide

Semantic guidance belongs only to the optional Guide. `POST /api/guide` accepts
the current Lab slug, bounded reasoning, and explicit evidence IDs. The server—not
the client—selects that Lab’s allowlisted source packets.

The provider adapter uses Claude Sonnet 5 native citations, requires exactly one
Socratic question, rejects uncited factual notes, treats learner text as
untrusted data, and falls back to an explicitly non-semantic question whenever
Claude is absent or invalid. Requests are `no-store`, learner text is not written
to Redis, and privacy-preserving limits apply when Upstash is configured.

## Accessibility, privacy, and visuals

The Labs use HTML and SVG instead of WebGL. Keyboard interaction, 44-pixel touch
targets, visible focus, readable event records, live change summaries, 200%
zoom, dark theme, and the full reduced-motion journey are first-class paths.
Mobile presents the current decision and consequence as a deliberate vertical
sequence rather than shrinking a desktop canvas.

Learning records stay in local browser storage. Praxeos has no accounts,
learner-text telemetry, permanent AI transcript, payment layer, social system,
or new backend database.

Atmospheric imagery is tactile editorial art; precise diagrams remain
code-native. Generation and license details live in the machine-readable
[image attribution manifest](./public/images/attribution.json).

## Architecture

- Next.js 16.2.10, React 19, TypeScript, MDX, Tailwind CSS 4
- four pure, deterministic, replayable Lab engines
- versioned local-first v3 store with legacy Calculation Labyrinth archiving
- bounded, versioned share envelopes excluding learner prose
- provider-neutral Anthropic adapter plus deterministic fallback
- optional hashed Upstash rate-limit identifiers
- Vitest, Playwright, Biome, accessibility lint, link checks, visual regression,
  and Lighthouse CI

```text
src/app/          routes, metadata, and the bounded Guide endpoint
src/labs/         shared contracts, shell, feedback, and four Lab engines
src/components/   layout, learning progress, Notebook, and reusable UI
src/lib/          curriculum, local store, sources, Guide providers, exports
src/content/      thinker and manifesto source material
tests/            engine, Guide, migration, browser, and visual coverage
docs/             audit evidence, product map, study protocol, build report
```

## Local development

Node 22 and npm 10.9.3 are pinned.

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` only for optional live Guide or Upstash
testing. Never commit environment files.

```bash
npm run format:check
npm run lint
npm run lint:a11y
npm run typecheck
npm test
npm run eval:guide
npm run check:assets
npm run build
npm run test:e2e
npm run check:links
npm run lighthouse:desktop
npm run lighthouse:mobile
```

Live Guide evaluation is opt-in so normal verification never spends provider
credits or requires a key.

## Verification and release path

Actual results, failures, and open blockers belong in
[the build report](./docs/BUILD_REPORT.md). The all-four-Lab protocol and
anonymized template are in [the study plan](./docs/USER_STUDY.md).

The release path is deliberately evidence-gated:

1. finish automated and manual verification of all four Labs;
2. review the feature-branch preview with and without the Guide;
3. let five consented beginners complete every Lab without interface coaching;
4. implement at least one revision directly supported by observed evidence;
5. rerun all checks, then request explicit approval before merging or tagging.

Until then the pull request remains draft. No v1.0 tag, production-impact claim,
or educational-impact claim is warranted.

## Authorship and collaboration

Praxeos was conceived, directed, written, and product-decided by William
Menjivar. Codex and Claude assisted with implementation, evaluation fixtures,
documentation, and verification under William’s requirements. Generated assets,
optional AI feedback, internal review, simulation output, and real learner
evidence are labeled separately.

## License

- Code: [MIT](./LICENSE)
- Original learning content: [CC BY 4.0](./LICENSE-CONTENT.md)
- Cited and third-party materials retain their own licenses.
