# Component contracts

This guide describes the shared product components that carry learning state or accessibility behavior. Route-specific presentation may stay local when it has no reusable contract.

## Site shell

- `SiteHeader` and `Footer` expose Learn, Practice, Labs, Notebook, Sources, and How It Was Built.
- `ThemeProvider` and `ThemeToggle` preserve the paper-and-ink light and dark editions.
- `PageTransition` respects the user's motion preference.

## Lab foundation

### `LabFoundation`

Provides the shared editorial question header, cover artwork, duration, viewpoint statement, Guided/Explore mode control, progress, save state, source drawer, and structured status messages. It must keep loading, restoring, saved, offline, unavailable, invalid-share, error, completed, and reset states explicit.

### `GuidedLabRuntime`

Runs the shared sequence for The Choice Machine, The Entrepreneur's Discovery, and The Money Time Machine: one decision per stage, visible result, evidence selection, assumption acknowledgement, interpretation, transparent self-review, optional Guide, revision, Notebook save, and exports.

### `MarketLab`

Uses the same contracts with a specialized ten-stage participant network. Displayed prices come only from completed monetary exchanges, while rejected and missed offers remain visible evidence rather than prices.

### `OptionalGuide`

Sends only the Lab slug, bounded reasoning, and explicit evidence IDs. It renders provider mode, one question, explanation blocks, citations, why the feedback was offered, insufficiency, and retry state. The deterministic fallback must be labeled non-semantic.

### `RedesignNotice`

Explains compatibility redirects from retired Lab and module URLs. Old product names belong only in this notice, migration history, redirect tests, audits, and the honest case study.

## Learning surfaces

- `LessonIndex` lists all eleven lessons with local progress and resume state.
- `LessonCompletion` marks a lesson locally and points to its connected Lab.
- `PracticeCases` rotates the daily case by UTC date while keeping the full library available.
- Notebook components render initial and revised reasoning, selected evidence, assumptions, Guide turns, citations, reflection, and date.

## Rendering rules

- Use semantic HTML for controls and explanations.
- Use SVG for precise diagrams, with a structured text equivalent in the same state.
- Generated images contain no important text and always reserve dimensions through `next/image`.
- New interactive targets are at least 44 by 44 CSS pixels.
- Reduced motion changes transitions, not the available journey.
- A shared component is warranted when it carries a repeated contract or design decision; otherwise keep the JSX close to the route.
