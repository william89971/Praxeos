# COMPONENTS — The Library

Every component, its purpose, and its contract. Kept in sync with `/src/components/` by `bun run docs:components` (script to be implemented).

## Layout

### `ModuleLayout` (`src/components/layout/ModuleLayout.tsx`)

Orchestrates the 9-section module page. Server component.

```tsx
<ModuleLayout
  metadata={moduleMetadata}
  sources={sources}
  sketch={<MySketch />}
  sketchCaption="1–2 sentence description"
>
  <EssayMDX />
</ModuleLayout>
```

| Prop | Type | Notes |
|---|---|---|
| `metadata` | `ModuleMetadata` | Drives hero title, meta line, thinkers list, discussion prompt. |
| `sources` | `readonly Source[]` | Rendered as structured citation list in §5. |
| `sketch` | `ReactNode` | Full-bleed canvas; typically a client island. |
| `sketchCaption` | `string` | Displayed beneath the canvas, center-aligned small caps. |
| `children` | `ReactNode` | Essay body; wrapped in `--measure-prose`. |

### `EssayLayout` (planned)

For longform essays not tied to an interactive.

### `Header` / `Footer` / `ReadingProgress` (planned)

## Typography

### `DisplayTitle`

Module hero title in Fraunces opsz 144. Never use outside module/essay heroes.

### `Fleuron`

Typographic ornament for section breaks. Variants: `"fleuron"` (❧, default), `"asterism"` (⁂), `"dots"` (· · ·), `"rule"` (thin centered rule).

### `PullQuote`

Italic Fraunces pull quote with oxblood rule. Pass `cite` for attribution.

### `Marginalia`

Tufte-style side note. Floats into the right gutter ≥1280px; inline below.

### `Citation`

Superscript citation reference. Pass `n={number}` and optional children for hover title.

### `Footnote`

Inline footnote. Renders a ✦ glyph; the body floats to the gutter.

### `SmallCaps`

OpenType small-caps span. Use for author names and abbreviations.

## Sketch wrappers

### `PosterFallback`

Static pre-rendered image shown under `prefers-reduced-motion` or before a sketch initializes.

### `Sketch` (planned — p5 wrapper)

Bulletproof p5 wrapper: SSR-safe, IntersectionObserver pause, cleanup.

### `ReglSketch` (planned)

Wrapper around regl for instanced WebGL2 rendering.

### `ThreeSketch` (planned)

Wrapper around @react-three/fiber (not used in Fascicle I).

### `ShaderSketch` (planned)

Wrapper around a raw fragment shader, for paper-grain and ink-diffusion effects.

### `SketchControls` (planned)

Standard chrome for slider/toggle panels attached to a sketch.

## Primitives (planned — Radix-under)

`Button`, `Slider`, `Toggle`, `Tooltip`, `VisuallyHidden` — restyled Radix primitives for accessible interactive chrome inside sketches.

## Cursor

### `Crosshair` (`src/components/cursor/Crosshair.tsx`)

Custom desktop cursor. Automatically hidden on touch devices. Strokes change to oxblood on interactive elements.

## Nav

### `ModuleNav` (planned)

Prev/next within a fascicle. Used by `ModuleLayout`.

### `CommandPalette` (planned)

⌘-K command palette — jump to any module, thinker, concept, or glossary entry.

## MDX

### `MDXComponents.tsx`

The canonical essay component set. Imported in two places:

1. `/mdx-components.tsx` (repo root) — required by @next/mdx for MDX page extensions.
2. Individual module `index.tsx` files where MDX is rendered via `<Essay />`.

Components exposed to MDX: `Citation`, `Marginalia`, `PullQuote`, `Footnote`, `SmallCaps`, and styled `h1`/`h2`/`h3`/`p`/`blockquote`/`hr`.

## When to add a new component

- The functionality genuinely cannot be expressed as a composition of existing components.
- It will be used in ≥2 places OR it embodies a shared design decision.
- It has an obvious name and a single job.

Otherwise: inline the JSX, move on.
