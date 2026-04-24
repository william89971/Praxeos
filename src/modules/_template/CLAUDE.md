# _template/ — Canonical Module

This directory is copied by `scripts/new-module.ts` when scaffolding a new module. It is **not** a routable module itself; the CLI skips it, and the registry does not include it.

## Placeholders (do not edit in situ)

The CLI substitutes these string literals on scaffold:

| Placeholder | Replaced with |
|---|---|
| `__TEMPLATE_SLUG__` | new module's slug (kebab-case) |
| `__TEMPLATE_TITLE__` | Display title |
| `__TEMPLATE_SUBTITLE__` | One-italic-sentence subtitle |
| `__TEMPLATE_CONCEPT__` | Concept tag (lowercase, hyphenated) |
| `__TEMPLATE_PUBLISHED_AT__` | ISO date (YYYY-MM-DD) at scaffold time |

The CLI also rewrites numeric/array defaults in `metadata.ts` (thinkers, complexity, fascicle, moduleNumber, readingTimeMin, bestOn) to your answers. Everything else is a literal starting point — edit freely after scaffolding.

## What each file in this template teaches

- **`metadata.ts`** — shape of ModuleMetadata. Every field is required; leaving the description or discussion prompt as placeholder text is a lint failure waiting to happen.
- **`sources.ts`** — structure of a Source entry. Note: `url` is required, `archiveUrl` is strongly recommended (publisher links die), `pages` is optional but scholarly.
- **`sketch.tsx`** — shows the minimum pattern every sketch must implement: SSR guard, IntersectionObserver for activity gating, ref cleanup. Replace the placeholder render with your real canvas.
- **`essay.mdx`** — demonstrates the voice: arresting opener, three-to-five development paragraphs, one pull quote, marginalia citation, pointed close. Delete prose, keep the structure.
- **`og.tsx`** — uses Edge runtime with system-serif fonts (the Fraunces woff2 cannot be read from Edge). Override for module-specific art.
- **`index.tsx`** — wires everything into ModuleLayout. Usually needs no edits beyond adjusting the `sketchCaption`.

## When to modify _template itself

Edit this template when:

- A new field is added to `ModuleMetadata` — update `metadata.ts` here and the CLI placeholder map.
- The ModuleLayout contract changes — update `index.tsx` here.
- A new MDX component joins the canonical set — illustrate its use in `essay.mdx`.

Every change to this directory is a change to every future module. Review with that in mind.
