# CLAUDE.md — Praxeos

> *Homo agit.* — Man acts.

This file is the operating manual for anyone (human or agent) extending Praxeos. Read it top to bottom before the first edit. Treat every non-negotiable below as a hard rule.

---

## What Praxeos is

Praxeos is an open-source cultural artifact disguised as a website: a library of interactive, generative, philosophically rigorous **explorable explanations** of Austrian economics and praxeology. Every module pairs a generative/interactive piece with a primary-source-backed essay. Modules are small monuments; the site is its own argument.

Reference craft level: Bret Victor, Nicky Case, Bartosz Ciechanowski, The Pudding, Stripe Press microsites, Tufte. If a change to this repo would not belong on that shortlist, do not ship it.

Full architectural context: `/docs/ARCHITECTURE.md`. Design philosophy: `/docs/AESTHETIC.md`. Editorial voice: `/docs/VOICE.md`. Approved plan: `~/.claude/plans/you-are-helping-me-witty-kernighan.md`.

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
