# CLAUDE.md — Praxeos

> *Homo agit.* — Man acts.

This file is the operating manual for anyone (human or agent) extending Praxeos. Read it top to bottom before the first edit. Treat every non-negotiable below as a hard rule.

---

## What Praxeos is

Praxeos is an open-source cultural artifact disguised as a website: a library of interactive, generative, philosophically rigorous **explorable explanations** of Austrian economics and praxeology. Every module pairs a generative/interactive piece with a primary-source-backed essay. Modules are small monuments; the site is its own argument.

Reference craft level: Bret Victor, Nicky Case, Bartosz Ciechanowski, The Pudding, Stripe Press microsites, Tufte. If a change to this repo would not belong on that shortlist, do not ship it.

Full architectural context: `/docs/ARCHITECTURE.md`. Design philosophy: `/docs/AESTHETIC.md`. Editorial voice: `/docs/VOICE.md`. Approved plan: `~/.claude/plans/you-are-helping-me-witty-kernighan.md`.

---

## Model Routing & Token Efficiency

Praxeos is expensive to build well. Most of the cost is in taste, not
in typing. This section tells the human operator which Claude to run
Claude Code under for each kind of work, and tells any agent reading
this file whether it should be doing the work at all.

**The principle: Opus decides. Sonnet executes.**

Claude Opus 4.7 is for decisions that are hard to reverse — the
aesthetic system in `/docs/AESTHETIC.md`, the editorial voice in
`/docs/VOICE.md`, the shape of a generative sketch before a single
pixel is drawn, the load-bearing function signatures that every future
module will inherit. Claude Sonnet 4.6 is for executing work Opus has
already shaped — scaffolding files from an approved template, writing
unit tests against an engine whose invariants are already specified,
wiring a Supabase migration, fixing a lint error with an obvious patch.
Opus at max thinking holds the whole codebase's aesthetic system in
mind at once; Sonnet at low thinking lands a typo fix without spending
ten seconds on it.

### Routing table

| Task | Model | Thinking |
|---|---|---|
| Homepage *Teleology* sketch (first implementation) | Opus 4.7 | max |
| Any new generative art sketch on first implementation | Opus 4.7 | max |
| Architectural plans written in plan mode | Opus 4.7 | max |
| Writing or revising `/docs/AESTHETIC.md`, `/docs/PHILOSOPHY.md`, `/docs/VOICE.md` | Opus 4.7 | max |
| Designing the CLAUDE.md hierarchy itself | Opus 4.7 | max |
| The Calculation Problem sketch (Module 3 — most aesthetically demanding) | Opus 4.7 | max |
| Writing or revising MDX essay prose for any module | Opus 4.7 | high |
| Implementing a new module end-to-end from a spec | Opus 4.7 | high |
| Designing the module template and `ModuleLayout` component | Opus 4.7 | high |
| OG image templates (they are design artifacts, not boilerplate) | Opus 4.7 | high |
| Launch copy: Show HN, Twitter thread, outreach emails, `README.md` | Opus 4.7 | high |
| Any refactor that touches ≥ 3 files | Opus 4.7 | high |
| Debugging where the agent must form a design judgment | Opus 4.7 | high |
| Reviewing a module against `/docs/AESTHETIC.md` | Opus 4.7 | medium |
| Cross-linking modules via the concept graph | Opus 4.7 | medium |
| Writing `sources.ts` for a module (needs real scholarly judgment) | Opus 4.7 | medium |
| Scaffolding routes, layouts, `Metadata` exports | Sonnet 4.6 | medium |
| Wiring Supabase tables, migrations, types | Sonnet 4.6 | medium |
| Vitest unit tests for economic-model functions | Sonnet 4.6 | medium |
| Playwright visual-regression specs | Sonnet 4.6 | medium |
| Adding TypeScript types to existing untyped code | Sonnet 4.6 | medium |
| Biome/tsconfig/`package.json` script config | Sonnet 4.6 | medium |
| The `npm run new-module` CLI scaffolder implementation | Sonnet 4.6 | medium |
| Adding remark/rehype plugins to the MDX pipeline | Sonnet 4.6 | medium |
| Direction-set aesthetic tweaks ("tighten strokes to 0.5 px") | Sonnet 4.6 | low |
| Renames, file moves, import-path updates after a rename | Sonnet 4.6 | low |
| Adding alt text to existing images | Sonnet 4.6 | low |
| Updating sitemap or RSS after a new module lands | Sonnet 4.6 | low |
| Obvious lint / type errors | Sonnet 4.6 | low |
| Copy typos and small content edits | Sonnet 4.6 | low |

### Budgeting rules

1. **Start every new feature in plan mode on Opus 4.7 at high or max
   thinking.** Get the plan approved before a line of code is written.
   This front-loads the expensive thinking into one well-scoped turn and
   makes the rest of the feature a Sonnet job.
2. **The moment a plan is approved and the task turns mechanical,
   switch to Sonnet.** Opus tokens burned on follow-up boilerplate
   are pure waste.
3. **Iterative aesthetic refinement belongs on Sonnet** once Opus has
   set the initial direction. "Make the halving garden's palette
   warmer" after the sketch exists is a Sonnet job. Drop back to Opus
   only if the refinement requires a new conceptual move — a new
   layout algorithm, a new rendering primitive, a new editorial claim.
4. **Never run Opus on multi-turn debugging of a localized bug.**
   Debugging is mechanical search, not taste. Use Sonnet even when the
   bug is in an Opus-authored sketch.
5. **When unsure, ask:** "If this output is wrong, is it because of
   missing taste / context, or because of a missing line of code?"
   Missing taste → Opus. Missing code → Sonnet.
6. **Long context windows are an Opus comparative advantage.** A
   cross-module refactor, a design review pass across all three
   modules, or a check against `/docs/AESTHETIC.md` for consistency —
   pay the Opus cost. Each of those genuinely needs the whole system
   held in one head.

### Context hygiene (both models)

Context is not free even when the model is. Load only what the task
requires.

- Keep the CLAUDE.md files terse and hierarchical. An agent drowning
  in generic guidance performs worse than one with less, sharper
  guidance.
- Starting work on a module? Load only the root `CLAUDE.md`, this file,
  `/src/modules/CLAUDE.md`, the specific module's directory, and
  `/docs/AESTHETIC.md`. Skip everything else.
- `/docs/MODULE_IDEAS.md` is for *creating* a new module. Do not pull
  it in to edit an existing one.
- For a bug fix, load the implicated files only — not the whole
  feature area.
- Prefer small, scoped edits ("tighten the correction cascade timing
  in Time Preference Forest from 8 s to 6 s") over open-ended requests
  ("refactor this whole component"), which balloon context for no
  taste gain.

### Self-check (run before responding)

Before starting any substantive task, the agent checks:

1. **Which model am I?** (Opus 4.7 or Sonnet 4.6.)
2. **Is this task in the right row of the routing table above?**
3. **If I am Opus and this task is mechanical:** surface that the user
   could save tokens by switching to Sonnet for this turn, and proceed
   only after acknowledging the mismatch.
4. **If I am Sonnet and this task requires taste or architectural
   judgment:** flag that the user should re-run this turn on Opus, and
   offer to do the narrow, mechanical subset that's safe to land now.

The self-check is the point. It makes the agent a participant in
routing, not just a passive executor of whichever model happens to be
loaded.

---

## Dev commands

```bash
npm run dev           # Next dev server (turbo)
npm run build         # Production build
npm run start         # Start production server
npm run typecheck     # tsc --noEmit (strict mode)
npm run lint          # Biome check
npm run lint:fix      # Biome auto-fix
npm run format        # Biome format
npm run new-module    # Scaffold a new module from _template/
```

Node ≥20. Package manager is npm at present; we plan to migrate to bun once the install path is cleared. Scripts are agnostic.

---

## Conventions

### Path aliases (tsconfig)

```
@/*              → src/*
@app/*           → src/app/*
@modules/*       → src/modules/*
@components/*    → src/components/*
@sketches/*      → src/sketches/*
@lib/*           → src/lib/*
@hooks/*         → src/hooks/*
@content/*       → src/content/*
@styles/*        → src/styles/*
@types/*         → src/types/*
```

### Naming

- Files: `kebab-case` for routes and content, `PascalCase` for React components.
- Module slugs: `kebab-case` only. No abbreviations, no clever-cute.
- Commit messages: present tense, imperative, one-line — "add halving garden baker" not "added" or "adding."

### Server vs. client components

- Default to server components.
- Client islands only where genuinely needed: sketches, interactive widgets, ThemeProvider, the custom cursor.
- Never mark a whole route as `"use client"` just to simplify. Push client boundary as deep as possible.

### Sketches

- SSR-safe: `next/dynamic` with `ssr: false` for any p5/regl/three component.
- Must clean up on unmount (return a cleanup function from the effect).
- Must pause when off-screen via `IntersectionObserver`.
- Must fall back to a poster frame under `prefers-reduced-motion`.
- Seeded RNG only — `seedrandom(block.hash)` or similar. Never `Math.random`.

---

## Aesthetic non-negotiables

1. **No default CSS ease.** Every `transition` uses `var(--ease-organic)` or another token curve. If you write `transition: ... ease;` it is a bug.
2. **No `#000` or `#fff`.** Paper is `var(--paper)`; ink is `var(--ink-primary)`. Pure black and white are forbidden.
3. **No Lucide, Heroicons, or off-the-shelf icon sets.** All icons are drawn at 1.5px stroke matching Fraunces body weight.
4. **Typography leads.** Fraunces for prose and display (opsz + wght axes), Inter for UI (tight tracking), JetBrains Mono for data and labels. Old-style figures in prose; tabular-nums only in data.
5. **Asymmetric editorial grids.** No rigid 12-column layout. CSS Grid with named areas, generous whitespace, Tufte marginalia where relevant.
6. **`prefers-reduced-motion` is respected religiously.** Reduced motion means *instant state change*, not faster animation. Use poster frames for sketches.
7. **Custom cursor on desktop.** Touch devices get the native cursor.

See `/docs/AESTHETIC.md` for the full token spec.

---

## Editorial non-negotiables

1. **Every factual claim cites a primary source.** Mises, Hayek, Rothbard, Menger, Böhm-Bawerk, Kirzner, Lachmann, Hoppe, Salerno, Ammous, etc. Link to archive.org, mises.org, or the publisher.
2. **No strawmen.** If you characterize Keynes or Lange, quote them.
3. **Voice is explicitly Austro-libertarian, not sanitized.** See `/docs/VOICE.md`. But the *interactives* are pedagogically austere — the polemic lives in the essays, not the canvases.
4. **Essays are 500–1200 words.** Longer is not braver.
5. **Latin phrases, em-dashes, semicolons are welcome.** Jargon is earned, not assumed.
6. **No "late-stage capitalism," "neoliberal," or "free market capitalism"** — just "the market" or "catallactics."

---

## Ship a new module (deterministic recipe)

```
 1. Pick a concept from /docs/MODULE_IDEAS.md
 2. npm run new-module <slug>
 3. Fill src/modules/<slug>/metadata.ts
 4. Write src/modules/<slug>/sources.ts (3–7 primary sources)
 5. Draft essay.mdx per /docs/VOICE.md
 6. Build sketch.tsx per /src/sketches/CLAUDE.md
 7. Build og.tsx for the social card
 8. Add poster frame at /public/posters/<slug>.webp
 9. npm run typecheck && npm run lint
10. Run visually on desktop + mobile + reduced-motion
11. Commit with message: "ship <slug> module"
12. Push — Vercel deploys
```

New module PRs must not regress Lighthouse scores below targets (100/100/100/100 desktop, 95+ mobile). Visual regression snapshots must pass.

---

## MVP modules (Fascicle I)

| Slug | Concept | Thinkers | Complexity |
|---|---|---|---|
| `halving-garden` | Fixed supply, sound money, Bitcoin as Mengerian regression-theorem rupture | Menger, Mises, Hayek, Ammous, Rothbard | 5 |
| `time-preference-forest` | Capital theory, ABCT, roundaboutness | Böhm-Bawerk, Mises, Rothbard, Hayek | 4 |
| `calculation-problem` | Socialist economic calculation, knowledge problem | Mises, Hayek, Lange, Salerno | 5 |

---

## Load-bearing architectural decisions

1. **Halving Garden rendering:** pre-baked WebP tile pyramid (z=0..10) on Vercel Blob + live regl layer for new blocks. Not three.js. Not p5. Live blocks fade in via mempool.space websocket, then bake into tiles within 60s.
2. **Layout algorithm:** Hilbert curve over a 2.5:1 rectangle, segmented into four halving-epoch sub-rectangles (illuminated-manuscript metaphor).
3. **No Supabase for Module 1.** The Bitcoin chain is canonical; every client derives the same state. Supabase is reserved for newsletter + future UGC modules.
4. **Calculation Problem engine** is a pure `step(state, params): State` function in `src/modules/calculation-problem/lib/engine.ts`. Zero rendering coupling. Every Misesian invariant (convergence, waste superlinearity, conservation, seed determinism) is unit-tested.
5. **Tokens + Tailwind v4:** data-theme-switching variables live in `/src/styles/tokens.css` at `:root` and `[data-theme="dark"]`. `@theme` is used only for non-switching tokens (radii, families, motion). Never put colors inside `@theme`.
6. **Fonts:** `next/font/local` pointing at `node_modules/@fontsource-variable/*/files/*.woff2`. No runtime `@fontsource` CSS imports (they cause FOUT in App Router).

---

## Critical files (current state)

```
/package.json                                       — Phase 1 deps
/tsconfig.json                                      — strict + noUncheckedIndexedAccess + eops
/next.config.mjs                                    — view transitions, headers, image domains
/postcss.config.mjs                                 — Tailwind v4 bridge
/biome.json                                         — lint + format
/src/styles/tokens.css                              — the aesthetic system
/src/styles/typography.css                          — font features, type utilities
/src/styles/print.css                               — print-ready essays
/src/app/globals.css                                — Tailwind + tokens bridge
/src/app/layout.tsx                                 — fonts, ThemeProvider, cursor, metadata
/src/app/page.tsx                                   — homepage (placeholder hero)
/src/app/colophon/page.tsx                          — tools, lineage, license, author
/src/components/ThemeProvider.tsx                   — next-themes wrapper
/src/components/cursor/Crosshair.tsx                — custom desktop cursor
/src/lib/utils/cn.ts                                — clsx + tailwind-merge

To be built next (Phase 2+):
/src/modules/_template/                             — canonical module
/scripts/new-module.ts                              — CLI scaffolder
/src/modules/calculation-problem/lib/engine.ts      — pure sim engine
/src/modules/halving-garden/lib/organism.ts         — hash→geometry
/scripts/bake-tiles.ts                              — tile pyramid baker
```

---

## When in doubt

- **The user is William Menjivar.** Byline: "Written and built by William Menjivar — Praxeos, Fascicle I, Module N of ∞."
- **Licensing:** code MIT, content CC BY 4.0. See `/LICENSE` and `/LICENSE-CONTENT.md`.
- **Domain:** `praxeos.org` (primary), `praxeos.xyz` (defensive redirect).
- **Every non-trivial change:** open a plan, verify it passes `npm run typecheck`, `npm run lint`, and visual regression before committing.
