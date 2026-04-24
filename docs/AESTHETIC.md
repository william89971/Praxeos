# AESTHETIC — Design Philosophy

> A screenshot of Praxeos must be instantly recognizable.

This document describes the voice. The machine-readable spec lives in `/src/styles/tokens.css`; treat this as the prose commentary.

## The voice, in one line

**Editorial brutalism with organic soul.**

It is what you would get if *The Economist* were redesigned by someone who also reads Christopher Alexander, grows bonsai, practices calligraphy, and has read Hayek in German. A 19th-century scientific journal that happens to know about CSS Container Queries and `@property`.

## What this means in practice

### Paper, not screen

Praxeos lives on **paper**. The background is warm cream (`#F5F0E6`). Never `#fff`. The ink is warm near-black (`#1C1814`). Never `#000`. Pure white and pure black are forbidden because they feel like a diagnostic display, not a publication. Paper has grain, warmth, history. Screens are cold.

### Dark mode is a parallel edition

Dark mode is not "flip the colors." It is a **parallel edition** — the same title printed on midnight-colored stock. Paper becomes `#14110D` (coffee-stain), ink becomes `#F0EADA` (bone). Accents do not invert. Bitcoin orange, oxblood, and forest-green hold their ground because they are not decorative; they carry meaning.

### Three accents, three jobs

- **Bitcoin orange** (`#E87722`) appears in the Halving Garden module and nowhere else arbitrarily. It is the color of sound-money emergence. When it appears, it means *money*.
- **Oxblood** (`#8B3A3A`) marks *action* moments — the cursor on interactive elements, the correction cascade in the Time Preference Forest, rising-price glow in the Calculation Problem.
- **Forest green** (`#3A5A4A`) marks *capital* — time preference, patient production, deep roots.

A reader who studies the site for ten minutes will learn this color grammar without being told. This is intentional.

### Typography is the protagonist

Not decoration — the **protagonist**. Three families:

- **Fraunces Variable** for prose and display. Both optical-size and weight axes are used. At display sizes (step-7, step-8), opsz is cranked to 144 and weight drops to ~420. At body sizes (step-0), opsz snaps to a reading optical size automatically via `font-optical-sizing: auto`. Italic Fraunces is one of the prettiest faces alive; use it in pull quotes and subtitles.
- **Inter Variable** for UI — tight-tracked (`letter-spacing: -0.01em`), functional, quiet.
- **JetBrains Mono Variable** for data, metadata, and monospace moments. `tabular-nums` on everything numerical.

Old-style figures (`onum`) run in prose; tabular-nums (`tnum`) run only in data tables. Small caps (`c2sc smcp`) render abbreviations and author names in running prose.

### Motion has a curve

Every transition uses `--ease-organic` (`cubic-bezier(0.65, 0, 0.35, 1)`) or one of its siblings. **Default CSS `ease` is banned.** Durations are tokenized: `--dur-micro` (300ms), `--dur-std` (600ms), `--dur-hero` (1200ms).

Motion is choreographed. Things do not move at the same time; **stagger is storytelling**. A list of six items fades in over 350ms, each item 40ms behind the last. The eye follows a movement; it does not dissolve into a pile.

Reduced motion means **state jumps**. It does not mean "faster animation." If a user opts out, they get the destination, not a sped-up journey.

### Layout: asymmetric editorial grid

No rigid 12-column grid. CSS Grid with named areas, generous whitespace, and the occasional Tufte marginalia floating into the right gutter. Essay content is bounded to `--measure-prose` (64ch). Never wider. Interactives get full-bleed width with air around them.

### Iconography

Custom. Drawn at 1.5px strokes matching Fraunces body weight. A small SVG sprite in `/public/icons.svg`. **No Lucide, no Heroicons, no off-the-shelf sets.** Icons are set in the same pen as the type; they should look like they were drawn by the same hand.

### Custom cursor (desktop only)

A 16-pixel crosshair with a lazily-trailing 4-pixel dot. On `[data-interactive="true"]`, `a`, `button`, and form controls, strokes shift to oxblood. Hidden during text selection. Touch devices get the native cursor.

## What this is NOT

- **Not Stripe Press' clone.** Stripe Press is beautiful but institutional. Praxeos is smaller, more hand-crafted, warmer.
- **Not Medium.** Medium is a format, not a voice.
- **Not Bauhaus.** Bauhaus is pristine and cold. Praxeos is pristine and warm.
- **Not "dark-mode-first."** Dark mode is an equal citizen, not a default flex.
- **Not "playful."** Playful is a euphemism for unserious. Praxeos is serious at the same scale as its subjects.

## Tokens → CSS variables

See `/src/styles/tokens.css`. Every color, space, curve, size, and radius is a CSS variable with a semantic name. Tailwind v4's `@theme` bridge exposes them as utility classes for non-switching tokens (type families, radii, motion). Colors live purely in CSS because `@theme` cannot switch by data-theme.

## When to break these rules

Never. If a new component seems to require breaking a rule, you have misunderstood the component. Rework it. If you still cannot, flag the rule in a PR and argue for a change before writing the code that violates it.
