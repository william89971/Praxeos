# src/ — Code Conventions

This file scopes rules that apply to anything under `/src`. Read `/CLAUDE.md` at the repo root first.

## Path aliases

Use aliases. Never `../../../` relative paths across domain boundaries.

```ts
import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { findModule } from "@/modules/registry";
import type { Module, Source } from "@/types/module";
import { cn } from "@/lib/utils/cn";
```

Full alias map in `/tsconfig.json`.

## Server vs. client components

- Everything defaults to **server components**.
- Reach for `"use client"` only when the component genuinely needs client state (refs, DOM, animation, user input). Push the client boundary as deep as possible.
- A client island in a server route is fine. A whole route marked client "to simplify" is a smell.
- `ThemeProvider` and `Crosshair` are client. `ModuleLayout` and all typography primitives are server.
- Sketches are always client (`"use client"` + `next/dynamic` with `ssr: false`).

## Styling

- No inline `<style>` strings in high-traffic components unless truly local. Use `/src/styles/*.css` for shared rules; Tailwind utilities for one-offs.
- Every color comes from a token var (`var(--paper)`, `var(--ink-primary)`). No `#hex` literals in JSX unless inside a shader string or an OG image (Edge runtime — see `/src/modules/_template/og.tsx`).
- Transitions must reference a token curve (`var(--ease-organic)`, `var(--ease-slack)`, etc.). Never `ease` / `ease-in-out`.

## TypeScript

- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` — all on.
- No `any`. No `@ts-ignore`. Use `as unknown as` only at true boundaries.
- Prefer `readonly` arrays and objects. Discriminated unions over booleans-with-payloads.
- Each module's `metadata.ts` must satisfy `ModuleMetadata` from `@/types/module`.

## React

- Avoid `useEffect` when derived state will do.
- Prefer Server Actions for mutations inside the site (e.g. newsletter signup). Client-only fetches go in `useEffect` — and must handle unmount cleanup.
- For components that mount heavy subtrees (sketches), gate with `IntersectionObserver`.

## Imports

Biome sorts imports deterministically. Run `npm run lint:fix` to normalize. Groups: node builtins → external packages → alias imports → relative imports.

## Files not to touch

- `/src/modules/_template/` — the canonical module. Changes here propagate to every new module scaffold. Edit consciously.
- `/mdx-components.tsx` at the repo root — @next/mdx contract; touch only when the MDX components set changes.
