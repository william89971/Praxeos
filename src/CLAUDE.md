# Praxeos source architecture

Praxeos uses Next.js App Router, React server components by default, and client components only for local state or direct interaction.

## Active product structure

- `app/` owns routes, metadata, redirects, feeds, and the Guide boundary.
- `labs/registry.ts` is the only active Lab registry.
- `labs/<slug>/` contains a rendering-independent deterministic engine and its 2D SVG/HTML experience.
- `labs/components/` contains shared editorial Lab UI.
- `lib/learning-store.ts` owns the versioned v3 local-first record and legacy archive migration.
- `lib/source-packets.ts` owns verified, Lab-allowlisted claims and counterarguments.
- `lib/guide/` owns the provider-neutral optional Guide.

The active Lab slugs are `choice-machine`, `market-without-a-manager`, `entrepreneurs-discovery`, and `money-time-machine`. Do not recreate the retired `src/modules` runtime or the standalone Calculation Labyrinth journey.

## Runtime rules

- Engines are pure, seeded, deterministic, replayable, and independent of React.
- Important state is represented in HTML or SVG and has a structured text equivalent.
- Reduced motion receives the same interaction with state jumps, not a poster.
- Share URLs include only a Lab slug, seed, mode, bounded assumption IDs, and bounded action IDs.
- Learner prose remains local and never enters a URL, log, Redis record, or permanent transcript.
- Deterministic feedback never parses prose for semantic correctness. It reads only completion, explicit evidence selections, explicit assumption acknowledgements, revision, and checklist state.
- Semantic guidance is optional and belongs only to the source-grounded Guide.

## Visual rules

Follow `docs/AESTHETIC.md` and `src/styles/tokens.css`. Preserve warm paper, warm ink, Fraunces-led editorial hierarchy, fine rules, and restrained oxblood, forest, and ochre accents. Do not introduce generic dashboard cards, glossy shadows, off-the-shelf icon sets, or developer-console language.
