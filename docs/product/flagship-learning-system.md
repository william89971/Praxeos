# Praxeos four-Lab flagship learning system

**Decision date:** 2026-07-14

**Status:** Locked for implementation on `codex/praxeos-flagship-v1`. Draft PR only.

**Visual source of truth:** [approved flagship concept](./assets/approved-flagship-concept.png)

**Editable Figma evidence draft:** [Praxeos Product Map](https://www.figma.com/design/ZiEe4IeEPtGfkMeXLwE1Zk)

## Product decision

Praxeos is an interactive learning laboratory for understanding human choices and economic systems through cases, deterministic simulations, source-grounded optional Claude guidance, and reflection.

The active Lab progression is:

1. **The Choice Machine** — individual choice under changing constraints.
2. **Market Without a Manager** — exchange, prices, and coordination without a central director.
3. **The Entrepreneur’s Discovery** — action under uncertainty and learning through experiments.
4. **The Money Time Machine** — different monetary rules and consequences across people and time.

`/labs/market-without-a-manager` is the canonical flagship. New learners enter Guided mode. The homepage action remains `Begin 8-minute journey` and points directly to that route.

The former Monetary Garden, Signal Orchard, Calculation Labyrinth, Coordination Engine, and standalone Calculation Labyrinth journey are retired from the active product. Their valuable sources, citations, counterarguments, and design decisions are migrated before their runtimes are removed. Git remains the historical record.

## Visual system to preserve

The redesign changes the learning product, not Praxeos’s identity. The implementation preserves these accepted characteristics from the approved concept and current shell:

- warm paper (`#f5f0e6`) rather than white and warm ink (`#1c1814`) rather than black;
- Fraunces for editorial display and prose, Inter for controls, and JetBrains Mono for evidence and state;
- fine rules, square-to-subtle radii, asymmetric editorial grids, generous breathing room, and almost no shadow;
- oxblood for actions and friction, forest green for patient capital and continuity, and ochre/orange for money and price signals;
- a large question-led header, a dominant interactive field, and a compact evidence sidecar on desktop;
- a deliberate vertical narrative on mobile, with the current action close to the thumb and secondary evidence expandable;
- state-jump reduced motion with complete interaction parity;
- paper-and-ink illustrations with printmaking texture, cut-paper depth, restrained color, and no important generated text.

The active Lab canvases are code-native SVG and HTML. WebGL is not part of the new runtime.

## Unified navigation and routes

The permanent navigation remains Learn, Practice, Labs, Notebook, Sources, and How It Was Built.

| Route | Purpose |
| --- | --- |
| `/` | Product promise, flagship entry, daily case, Lab progression, and source integrity |
| `/learn` and `/learn/[lesson]` | Eleven focused lessons with Lab connections |
| `/practice` | Daily case and complete case library |
| `/labs` | Staggered editorial progression through the four questions |
| `/labs/choice-machine` | Choice under changing constraints |
| `/labs/market-without-a-manager` | Canonical flagship on exchange and coordination |
| `/labs/entrepreneurs-discovery` | Entrepreneurial hypothesis and experiment Lab |
| `/labs/money-time-machine` | Monetary-rule comparison across people and time |
| `/notebook` | Multiple Lab sessions, earlier records, comparisons, citations, and exports |
| `/sources` | Source standards, packets, counterarguments, and research notes |
| `/sources/glossary` | Practical concept glossary |
| `/sources/thinkers/[slug]` | Thinker profiles with stable locators |
| `/built` | Evidence-backed case study and validation status |

### Compatibility behavior

- `/journey/calculation-labyrinth` redirects permanently to `/labs/market-without-a-manager?mode=guided&from=redesign`.
- `/labs/monetary-garden`, `/labs/signal-orchard`, `/labs/calculation-labyrinth`, and `/labs/coordination-engine` redirect to `/labs?redesigned=<old-slug>`.
- Old `/modules/<slug>` routes land on the redesigned notice or the appropriate new Lab rather than a missing page.
- The Labs index reads `redesigned`, explains the replacement in one dismissible paragraph, and leaves the learner free to choose any active Lab.

Old names remain only in audit history, data migration labels, redirect tests, and the honest `/built` narrative.

## Shared Lab experience

Each Lab uses the same seven-part sequence:

1. Editorial cover with a familiar situation, central question, duration, and one obvious action.
2. Guided mode with one decision per stage, visible progress, optional hints, and immediate state feedback.
3. `What changed`, tied to explicit simulation evidence.
4. Plain-language concept reveal after the learner experiences the consequence.
5. Initial interpretation, transparent deterministic self-review, optional Claude question, and revision.
6. Notebook save plus Markdown, print, and reflection-card export.
7. Explore mode with assumptions, comparisons, replay, reset, and shareable non-sensitive state.

Explore unlocks after the first guided consequence. Mode switching never discards state. Completion prevents the tutorial from being forced again.

Every stage exposes five things without requiring inference from decoration: the question, the current action, the resulting change, why the change matters, and the next action.

The shared shell includes this viewpoint statement:

> Praxeos uses simplified deterministic models to make choices and consequences inspectable. A simulation observation is not a universal fact, an assumption is not evidence, a source claim needs a locator, an Austrian interpretation is one argument, and credible counterarguments belong beside it.

All evidence is visibly labeled as `simulation observation`, `assumption`, `source claim`, `Austrian interpretation`, or `credible counterargument`.

## Four distinct deterministic experiences

### The Choice Machine

The learner begins with limited time, money, attention, and energy; chooses one activity; sees the selected future and preserved forgone paths; changes one constraint; then interprets and revises. The visual is a branching timeline. Explore varies scenarios and constraints while warning that one choice reveals only a momentary ranking under those conditions.

### Market Without a Manager

The ten-stage flagship introduces participants and priorities, barter, money, offers, accepted and rejected exchanges, prices derived only from completed monetary trades, incomplete information, shortage, and a price ceiling. The visual is a living participant network with a chronological event stream on mobile.

Offers are accepted only when participant rules, inventories, money, and current ordinal priorities allow them. Inventories change only through completed trades. Price ceilings prevent above-limit transactions. Shortages, surpluses, missed trades, and coordination are derived from remaining inventories, unmet ranked wants, and the event log.

### The Entrepreneur’s Discovery

The learner observes behavior, forms a hypothesis, selects evidence, spends limited time or capital on a seeded experiment, observes customer action, and decides to continue, revise, pivot, or stop. The partially obscured opportunity map reveals evidence without exposing a perfect path or removing uncertainty.

### The Money Time Machine

The learner follows a worker, saver, borrower, entrepreneur, renter/buyer, and asset owner through one monetary rule, advances time, compares a second rule, and inspects distribution and assumptions. Results are explicitly illustrative and remain traceable to inspectable assumptions. The Lab does not present a forecast or an ideological answer about Bitcoin.

## Runtime contracts

Engines are pure, deterministic, rendering-independent, and replayable from seed, assumptions, and action log.

```ts
type LabSlug =
  | "choice-machine"
  | "market-without-a-manager"
  | "entrepreneurs-discovery"
  | "money-time-machine";

interface LabEngine<State, Action, Metrics, Assumptions> {
  create(seed: string, assumptions: Assumptions): State;
  reduce(state: State, action: Action): State;
  derive(state: State): Metrics;
  describeChange(
    previous: State,
    next: State,
    action: Action,
  ): LabExplanation[];
  validate(state: State): readonly string[];
}

interface LabSession<State, Action, Assumptions> {
  version: 3;
  labSlug: LabSlug;
  seed: string;
  mode: "guided" | "explore";
  guidedStep: number;
  assumptions: Assumptions;
  actionLog: Action[];
  selectedEvidenceIds: string[];
  acknowledgedAssumptionIds: string[];
  initialReasoning: string;
  feedback: RubricFeedback[];
  guideTurn: GuideTurn | null;
  revision: string;
  reflection: string;
  citationIds: string[];
  completedAt: string | null;
  updatedAt: string;
}
```

The Lab registry records each route, central question, progression position, source allowlist, lesson connections, visual asset, and lazy implementation.

## Persistence and sharing

The local-first store is version 3 and supports multiple sessions, resume state, progress, reasoning, optional Guide turns, citations, exports, and completion. Existing Calculation Labyrinth writing and citations are migrated into a read-only `Earlier Praxeos record`; its runtime and active UI do not remain.

A versioned `ShareEnvelope` contains only Lab slug, seed, mode, bounded assumption IDs, and bounded action IDs. It never contains learner prose, Guide output, network identifiers, or unrelated Notebook records. Unknown, malformed, oversized, or cross-Lab state produces a non-blocking explanation and a fresh deterministic session.

Explicit UI states cover loading, restoring, saved, offline, unavailable, invalid share, error, completed, and reset. Learner writing is never silently discarded.

## Deterministic feedback boundary

Deterministic feedback may evaluate only:

- whether required stages and writing fields were completed;
- which visible observation or event records the learner explicitly selected as evidence;
- which assumptions the learner explicitly acknowledged;
- whether the initial response was revised or explicitly confirmed;
- whether the transparent self-review checklist was completed.

It does not search prose for keywords. It does not claim to understand semantic correctness, ideological agreement, concept mastery, or interpretation quality. It never produces a numeric score or fake praise.

Allowed states are `add simulation evidence`, `acknowledge an assumption`, `revise or confirm`, and `ready for self-review`. The no-AI path places the initial and revised responses side by side with the learner’s selected evidence and assumptions, then asks explicit comparison questions. Multiple interpretations remain acceptable.

Adversarial tests must prove that keyword-filled nonsense cannot receive a semantic-correctness label because no such label exists.

## Optional Claude Guide

Semantic guidance belongs only to the optional Guide. The request is Lab-general:

```ts
interface GuideRequest {
  labSlug: LabSlug;
  reasoning: string;
  evidence: {
    observationIds: string[];
    actionIds: string[];
    assumptionIds: string[];
  };
}
```

The server selects allowlisted packets from `labSlug`; clients cannot provide source text or URLs. The response asks exactly one Socratic question, cites every factual source note, explains why the feedback was selected, and never scores conclusions or acts as an ideological authority.

When Claude is unavailable, the deterministic provider returns the transparent checklist and one explicitly non-semantic question based on selected evidence and assumptions. Request caps, cancellation, `no-store`, privacy-preserving hashed rate limits, safe retry behavior, citation validation, and no learner-text logging remain mandatory.

## Editorial image system

Generated tactile editorial illustrations are used for atmosphere and concept imagery on the homepage, Lab covers, learning transitions, and `/built`. Generated assets contain no important text. Historical identity and evidence use verified public-domain or clearly licensed portraits and artifacts. Precise diagrams and annotations stay code-native.

Every asset appears in the machine-readable attribution manifest with file, placement, alt text, creator/source/license/retrieval details or generation prompt/model/date, modifications, dimensions, and visual-review checks. Raster assets ship in responsive WebP/AVIF derivatives through `next/image`; only the actual LCP asset is prioritized.

## Implementation gates

### After Market Without a Manager

Complete automated tests and an internal beginner-usability review focused on first action, terminology order, visual hierarchy, cause-and-effect clarity, and developer-facing language. Resolve identified issues, document this as non-participant validation, and continue building the other three Labs. Real-person recruitment is not an implementation prerequisite.

### Before v1.0

After all four Labs are technically complete, five real beginners each test all four without William explaining the interfaces. For each Lab, at least four of five must correctly explain the question, action, change, cause, learned concept, and next experiment. Shared confusion requires an interaction redesign rather than longer instructions.

At least one evidence-based revision is committed and all automated and manual checks are rerun. William verifies the anonymized summary and source/image attribution checks. Raw participant records never enter Git.

Until that gate passes, the PR remains draft, study status remains `Pending`, and Praxeos makes no v1 or educational-impact claim.

## Acceptance coverage

Automated coverage includes engine determinism, replay and invariants; action rejection; assumption sensitivity; store migration; legacy archive export; share privacy; malformed state; deterministic-feedback boundaries; Guide allowlists, citations, injection, cancellation, fallback, invalid responses, offline and `429`; full Guided and Explore flows; refresh/resume; mode switching; reset; Notebook/export; redirects; keyboard, touch, zoom, reduced motion and increased contrast; visual snapshots; asset-manifest validation; links; clean install; format/lint; strict TypeScript; unit tests; Guide evaluations; production build; E2E; and three Lighthouse runs per route.

The retained performance targets are performance at least `0.95` desktop and `0.90` mobile, accessibility/best-practices/SEO at `1.0`, LCP at most `2.5s`, and CLS at most `0.1`. Results are recorded only when actually measured.
