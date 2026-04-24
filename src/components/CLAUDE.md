# src/components — Component Library

Four domains, ordered by reach:

1. `layout/` — page-level composers (ModuleLayout, EssayLayout, Header, Footer, ReadingProgress). Used by every route.
2. `typography/` — prose building blocks (DisplayTitle, Fleuron, Marginalia, PullQuote, Citation, Footnote, SmallCaps). Used by every essay.
3. `sketch/` — generative-content wrappers (Sketch p5 wrapper, ReglSketch, ThreeSketch, ShaderSketch, PosterFallback, SketchControls). Used by every module's canvas.
4. `primitives/` — Radix-under, restyled (Button, Slider, Toggle, Tooltip, VisuallyHidden). Used everywhere.

Plus two outliers: `cursor/Crosshair.tsx` (global desktop cursor) and `nav/` (module prev/next, command palette).

## Design contract

Every component:

1. **Is accessible by default.** Proper ARIA, keyboard nav, visible focus, color contrast ≥ AA.
2. **Respects reduced motion.** Either zero animation at all, or fallback to static.
3. **Uses tokens, not literals.** No raw colors, raw durations, raw hex. Reference `/src/styles/tokens.css`.
4. **Has a single job.** If a component does two things, split it.
5. **Is composable.** Props are orthogonal; composition beats configuration. Prefer children over prop-driven content.
6. **Is documented inline** with a short JSDoc that says WHAT the component is for and WHEN to reach for it — not WHAT it does internally.

## When to reach for Radix

For `primitives/` we lean on Radix for correct a11y/keyboard behavior and restyle heavily. Any primitive that needs focus trapping, escape handling, arrow-key navigation, or composed triggers goes through Radix. Visual chrome is 100% Praxeos.

## When NOT to add a new component

- If a tokenized className would do the job in 2 lines of JSX.
- If the only difference from an existing component is color — just pass a `tone` prop.
- If you're tempted to abstract across two usages that haven't existed for a week.

Three similar lines is better than a premature abstraction.
