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
┌──────────────┐                              ┌──────────────────┐
│ Vercel Blob  │  tile pyramid (~10–14 GB)   │ Edge functions   │
│ WebP tiles   │  immutable, CDN cached       │ /api/blocks      │
│ /z/x/y.webp  │                              │ /api/m2          │
└──────────────┘                              │ /api/og/[slug]   │
                                              │ /api/tile/z/x/y  │
                                              └─────┬────────────┘
                                                    │
                        ┌───────────────────────────┼───────────────────────┐
                        │                           │                       │
                        ▼                           ▼                       ▼
                ┌───────────────┐           ┌──────────────┐         ┌───────────────┐
                │ mempool.space │           │  FRED API    │         │  Upstash      │
                │ REST + WS     │           │  (M2 data)   │         │  Redis cache  │
                └───────────────┘           └──────────────┘         └───────────────┘

                   Supabase (newsletter + future UGC only; NOT used by Halving Garden)
```

## What goes where

### Vercel (Next.js host)

- Every Next route: homepage, manifesto, modules, essays, thinkers, glossary, colophon.
- Static tile redirect `/api/tile/[z]/[x]/[y]` → signed Vercel Blob URL.
- Edge functions for cached data proxies and @vercel/og.
- Incremental Static Regeneration where appropriate; SSR for dynamic modules.

### Vercel Blob

- Halving Garden tile pyramid. Six zoom levels, 512px WebP tiles. Estimated 10–14 GB total.
- Cache-Control: `public, max-age=31536000, immutable`. Tiles never mutate — if geometry changes we re-bake to a new URL.
- Populated offline by `scripts/bake-tiles.ts` using skia-canvas + worker_threads.
- Incremental re-bake on every new block, triggered by Edge cron polling mempool.space every ~10 min.

### Upstash Redis

- Cache wrapper around mempool.space responses (5-minute TTL) to survive API rate limits on HN front page.
- Rate-limit `/api/tile/` requests per IP.
- Cache FRED M2 responses (15-minute TTL — FRED data does not move minute-by-minute).

### Supabase

- Newsletter signup (a single table + Resend trigger).
- Future UGC modules (e.g., hypothetical "predict the next block" game).
- **Not used by the Halving Garden.** Chain is canonical; `mempool.space` WebSocket is the fanout.

## Data flow: a new Bitcoin block arrives

```
mempool.space WS  ─► useLiveBlock hook (client)
                  ─► LiveLayer (regl) — organism fades in
                  ─► POST /api/bake-single-block (background)
                         │
                         ▼
                  skia-canvas worker — rasterize 10 tiles (z=10 + parents)
                         │
                         ▼
                  Vercel Blob — PUT tiles to immutable URLs
                         │
                         ▼
                  Next request for those tile URLs hits CDN (warm)
```

## Data flow: M2 meter

```
setInterval (5min)  ─► /api/m2 (Edge)
                    ─► Upstash Redis check (TTL 15m)
                    ├─ cache hit: return cached delta
                    └─ cache miss: fetch FRED → compute ΔM2 vs. ΔBTC → cache → return
                    ─► client updates corner widget
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
6. (If modules changed) tile-pyramid incremental bake kicks off.

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
| `FRED_API_KEY` | St. Louis Fed M2 data | yes (production) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Cache layer | yes (production) |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Newsletter | yes (production) |
| `SUPABASE_SERVICE_ROLE_KEY` | Newsletter admin actions | yes (production) |
| `BLOB_READ_WRITE_TOKEN` | Tile pyramid storage | yes (production) |

Dev-mode fallbacks: no Upstash → pass-through fetches. No Supabase → newsletter form disabled. No Blob → serve placeholder tiles.

## Testing

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `tests/unit/` |
| E2E | Playwright | `tests/e2e/` |
| Visual | Playwright screenshot diff | `tests/visual/snapshots/` |
| Type | tsc --noEmit | CI |
| Lint | Biome + ESLint-a11y | CI |

Engine tests (`calculation-problem/lib/engine.ts` in particular) exercise invariants:

- Market prices converge under fixed shocks.
- Socialist waste grows superlinearly with G.
- Both simulation panels conserve total resources.
- Same seed → identical trajectory.

## Load-bearing decisions (repeated for canonicality)

1. Halving Garden renders **tiles + live regl**, not pure three.js. See `/docs/ARCHITECTURE.md#tiles`.
2. **No Supabase in Module 1.** mempool.space is the realtime bus.
3. Module 3 engine is a **pure function**. `step(state, params): State`. Zero rendering coupling.
4. **Tokens in `/src/styles/tokens.css`**, not in Tailwind `@theme`. Data-theme switching requires `:root` and `[data-theme="dark"]` selectors that `@theme` cannot express.
5. **Fonts via `next/font/local`** pointing at `node_modules/@fontsource-variable/*/files/*.woff2`. No runtime `@fontsource` CSS imports.
