# Praxeos Product Map board specification

This is the repository source of truth for the editable Figma draft. The connected Starter plan still permits only one variable mode, so the complete Light/Dark board specification remains here until an edit-capable plan is available.

## File and visual foundation

- Name: `Praxeos Product Map`
- Verified draft: <https://www.figma.com/design/ZiEe4IeEPtGfkMeXLwE1Zk>
- Captured current-product node: `2:2`
- Approved concept: [approved-flagship-concept.png](./assets/approved-flagship-concept.png)
- Board overview: [product-map-overview.svg](./assets/product-map-overview.svg)
- Background `#f5f0e6`; raised paper `#ede6d6`; ink `#1c1814`; secondary ink `#5c5348`; rule `#d8cfbe`
- Oxblood action `#8b3a3a`; forest capital `#3a5a4a`; ochre price/money `#e87722`
- Fraunces display/prose, Inter UI, JetBrains Mono evidence/state
- Thin rules, 2–6px radii, no glossy cards, no gradients

## Board sections

### A. Locked product decision

Show the product identity, preserved editorial system, `Begin 8-minute journey` action, and the progression:

1. The Choice Machine
2. Market Without a Manager — canonical flagship
3. The Entrepreneur’s Discovery
4. The Money Time Machine

Mark the retired Labs and standalone journey as historical inputs, not active destinations.

### B. Annotated current product

Place the captured homepage and audit screenshots. Preserve annotations for confirmed failure, unverified claim, recommendation, and existing strength. Add an annotation that the old Labs index is a flat card grid and that its WebGL/reduced-motion split conflicts with the new shared interaction contract.

### C. Current-to-target routes

Show all permanent navigation routes plus the four active Lab routes. Include the Calculation Labyrinth journey redirect, the four old Lab-slug redesign notices, and legacy `/modules/<slug>` handling.

### D. Shared Lab sequence

Show the seven-part sequence: editorial cover; Guided decision; What changed; concept reveal; interpretation/self-review/optional Guide/revision; Notebook/export; Explore. Each step includes learner action, saved state, visible evidence, accessibility equivalent, and continue condition.

### E. Four Lab storyboards

- Choice Machine: branching timeline, changed constraint, preserved forgone paths.
- Market Without a Manager: participant network, offer/trade event stream, completed-trade prices, incomplete information, shortage, and ceiling.
- Entrepreneur’s Discovery: obscured opportunity map, hypothesis, evidence, resource-limited experiment, pivot or stop.
- Money Time Machine: six participant lanes, monetary rule, time advance, comparison, assumptions, and distribution.

Create desktop and mobile frames for every Lab. Desktop uses a dominant field plus compact evidence rail. Mobile uses a vertical narrative and sequential comparisons.

### F. Feedback and Guide boundary

Show deterministic feedback as a transparent checklist driven only by explicit completion, selected observation IDs, acknowledged assumption IDs, revision, and self-review. Place a visible prohibition on semantic keyword grading.

Show Claude as the only semantic guidance path. `Allowed in` contains Lab slug, capped reasoning, and allowlisted evidence IDs. `Validated out` contains one question, cited source notes, why-this-feedback, status, and retry timing. `Never stored` contains learner prose in URLs, learner text in Redis/logs, unrelated Notebook records, and permanent transcripts.

### G. Source and viewpoint labels

Create distinct components for simulation observation, assumption, source claim, Austrian interpretation, and credible counterargument. Source packet components show claim, locator, stable URL, Lab allowlist, and verification state.

### H. Editorial image system

Place the homepage hero, four Lab covers, transition imagery, historical artifacts, and code-native diagrams. Every image callout links to its attribution-manifest entry. Generated images contain no important text.

### I. Acceptance gates

Group checks into runtime, persistence/share, feedback boundary, Guide, accessibility, cross-browser, performance, sources/assets, internal beginner review, deployment, and five-person study. Each row uses Pending, Pass, Fail, or Blocked; decorative pass states are not allowed.

The internal review follows Market Without a Manager and does not block implementation of the remaining three Labs. The five-person study covers all four completed Labs and blocks v1.0 until at least one evidence-based revision is committed.

## Component inventory

- Button: Primary and Secondary; Default, Hover, Focus, Disabled
- Annotation: Confirmed failure, Unverified claim, Recommendation, Preserve
- Route node: Current, Active target, Redirect, Historical
- Lab stage: Not started, Active, Complete, Needs review
- Evidence label: Observation, Assumption, Source, Interpretation, Counterargument
- Gate row: Pending, Pass, Fail, Blocked
- Source packet: Claim, Locator, URL, Lab allowlist, Verification

## Completion test

The board is complete only when every section A–I exists; all four Lab storyboards include desktop and mobile; route labels match production; typefaces and tokens are verified by readback; Light/Dark variables resolve without broken aliases; reusable nodes are component instances; no placeholder text remains; and screenshots show no clipping or overlap. The study section remains `Pending` until the real study is complete.
