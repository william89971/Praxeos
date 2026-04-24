# src/modules — Module Authoring Guide

Every module is a directory `src/modules/<slug>/` containing the canonical six files. This guide exists so future modules look and feel like one body of work.

## The six files

| File | Contract |
|---|---|
| `metadata.ts` | Exports `metadata: ModuleMetadata`. Slug must match directory name. |
| `sources.ts` | Exports `sources: readonly Source[]` — 3–7 primary sources. Prefer archive.org / mises.org URLs. |
| `sketch.tsx` | The generative/interactive component. `"use client"`. SSR-safe. Pauses off-screen. Respects reduced motion. Seeded RNG only. |
| `essay.mdx` | 500–1200 words. One argument per paragraph. Primary-source citations for every non-trivial claim. Voice: see `/docs/VOICE.md`. |
| `og.tsx` | @vercel/og template for this module's social card. Edge runtime. System-serif metric-matched fallback. |
| `index.tsx` | Composes `ModuleLayout` with the above. Exports `metadata`, `sources`, and the default component. |

## The nine sections (in ModuleLayout order)

1. Hero — title + subtitle + metadata line.
2. Opening interactive — full-bleed, minimal chrome.
3. Caption — 1–2 sentence description beneath the canvas.
4. Essay column — `--measure-prose` width.
5. Primary sources — structured list with archive links.
6. Thinkers referenced — chips linking to `/thinkers/<slug>`.
7. Discussion prompt — one open question.
8. Signature — "Written and built by William Menjivar — Praxeos, Fascicle X, Module N of ∞".
9. Prev / Next within fascicle.

ModuleLayout handles 1, 3, 5, 6, 7, 8, 9. You supply 2 (`sketch` prop), 4 (children), and the underlying data.

## Ship a new module

```
1. Pick a concept from /docs/MODULE_IDEAS.md
2. npm run new-module <slug>
3. Drop a poster at /public/posters/<slug>.webp
4. Fill metadata.ts fields (delete placeholders)
5. Write 3–7 entries in sources.ts
6. Draft essay.mdx per /docs/VOICE.md
7. Implement sketch.tsx per /src/sketches/CLAUDE.md
8. Customize og.tsx if the default doesn't fit
9. npm run typecheck && npm run lint
10. Open /modules/<slug> and sanity-check desktop + mobile + reduced-motion
11. Commit "ship <slug> module"
```

## Non-negotiables

- Every claim in `essay.mdx` traces to a primary source in `sources.ts`.
- The sketch MUST render something meaningful in the poster frame. Never ship a module where the initial non-JS paint is blank or placeholder.
- A module must not regress Lighthouse below the project's thresholds (100/100/100/100 desktop, 95+ mobile).
- Visual regression snapshots must pass. If the sketch is non-deterministic, seed it; never add a test-only mode.

## The registry

`/src/modules/registry.ts` is the source of truth for navigation, sitemap, and prev/next. The `new-module` CLI updates it automatically. If you hand-edit, maintain the `// <-- new-module CLI inserts entries here -->` marker.

## Pattern gallery (as modules ship)

- `halving-garden/` — tile pyramid + live regl layer + WebSocket; shared helpers in `lib/`.
- `time-preference-forest/` — p5 WEBGL + L-system generator.
- `calculation-problem/` — pure engine function + zustand subscribers + typographic particles.

Copy patterns, don't invent. The site's coherence depends on it.
