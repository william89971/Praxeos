# ARCHITECTURE

Data flow, deploy topology, and the load-bearing architectural decisions.

## Topology

```
                    ┌──────────────────────────┐
                    │   praxeos.org (Vercel)    │
                    │   Next.js 15 · React 19   │
                    └────┬────────────┬─────────┘
                         │            │
        ┌────────────────┘            └────────────────┐
        │                                              │
        ▼                                              ▼
┌──────────────────┐                         ┌──────────────────┐
│ Static content   │                         │ Client sketches  │
│ modules / essays │                         │ R3F + query state│
│ thinkers / docs  │                         │ poster fallback  │
└──────────────────┘                         └──────────────────┘

                   Supabase is reserved for newsletter / future UGC only.
```

## What goes where

### Vercel (Next.js host)

- Every Next route: homepage, manifesto, modules, essays, thinkers, glossary, colophon.
- Edge functions for cached data proxies and @vercel/og.
- Incremental Static Regeneration where appropriate; SSR for dynamic modules.

### Supabase

- Newsletter signup (a single table + Resend trigger).
- Future UGC modules (e.g., hypothetical "predict the next block" game).
- Not used by the active module sketches.

## Data flow: module route

```
/modules/[slug]  ─► MODULE_REGISTRY
                 ─► static metadata + MDX essay
                 ─► dynamic sketch component
                 ├─ prefers-reduced-motion → poster fallback, no canvas
                 └─ motion allowed → R3F scene + pure state helpers
                       └─ URL query params hydrate/share controls
```

## Data flow: homepage ambient sketch

```
"use client" · next/dynamic(ssr:false) · Teleology sketch
 ─► IntersectionObserver gate
 ─► prefers-reduced-motion → PosterFallback
 ─► otherwise: seeded p5 simulation, 30-second loop
```

## Build pipeline

1. `git push main` → GitHub.
2. GitHub Actions: Biome + ESLint-a11y + Vitest + tsc in parallel. Fail fast.
3. Visual regression (Playwright) against last-known snapshots.
4. Vercel: production deploy. Preview deploys on PR.
5. Sitemap, RSS, OG cards regenerated on every deploy.
6. (If module state changed) unit and e2e coverage verify query hydration.

## Lighthouse budgets

- Homepage: 100/100/100/100 desktop · 95+/100/100/100 mobile.
- Module routes: same. LCP < 1.8s on 4G mobile — poster frame is LCP.
- JS bundle on homepage: ≤ 100KB gzip (ambient sketch lazy-loaded).
- JS bundle on module routes: ≤ 200KB gzip (sketch lazy-loaded).

## Environment contracts

`.env.local` keys — see `.env.example`:

| Key | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Absolute URL for canonical links | yes |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Newsletter | yes (production) |
| `SUPABASE_SERVICE_ROLE_KEY` | Newsletter admin actions | yes (production) |

Dev-mode fallback: no Supabase → newsletter form disabled.

## Testing

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `tests/unit/` |
| E2E | Playwright | `tests/e2e/` |
| Visual | Playwright screenshot diff | `tests/visual/snapshots/` |
| Type | tsc --noEmit | CI |
| Lint | Biome + ESLint-a11y | CI |

Interaction tests exercise invariants:

- Monetary derived metrics respond to credit, savings, and correction.
- Signal pulses preserve action kind and propagate to neighbors.
- Labyrinth moves distinguish legal exits, wrong turns, and waste.
- Coordination parameters connect reliability and latency to coherence.

## Load-bearing decisions (repeated for canonicality)

1. The live canon is **Monetary Garden, Signal Orchard, Calculation Labyrinth, Coordination Engine**.
2. Module interaction state is **pure and testable** before it reaches React Three Fiber.
3. Reduced motion means **poster fallback and no canvas mount**.
4. **Tokens in `/src/styles/tokens.css`**, not in Tailwind `@theme`. Data-theme switching requires `:root` and `[data-theme="dark"]` selectors that `@theme` cannot express.
5. **Fonts via `next/font/local`** pointing at `node_modules/@fontsource-variable/*/files/*.woff2`. No runtime `@fontsource` CSS imports.
