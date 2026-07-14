# Praxeos flagship learning system

**Decision date:** 2026-07-14

**Visual source of truth:** [approved flagship concept](./assets/approved-flagship-concept.png)

**Editable Figma evidence draft:** [Praxeos Product Map](https://www.figma.com/design/ZiEe4IeEPtGfkMeXLwE1Zk)

The Figma link has been verified with document metadata and contains an editable capture of the current production homepage. The connected Starter plan permits only one variable mode, so the required Light/Dark token foundation could not be created. Figma returned `Limited to 1 modes only`; the write was atomic. The complete product-map specification and assets therefore live in this directory until an edit-capable plan with multi-mode variables is available.

## Product identity

Praxeos is an interactive learning laboratory for understanding human choices and economic systems through cases, simulations, source-grounded Claude guidance, and reflection.

The interface should feel like a serious editorial study room made interactive: warm paper, ink, fine rules, restrained wine red and olive accents, Fraunces display/prose, Inter controls, and JetBrains Mono for state and evidence. It must not feel like a developer console, course marketplace, or game dashboard.

The homepage promise is:

> See the structure inside every choice.

The primary action is `Begin 8-minute journey`. The secondary action is `Explore labs`.

## Unified navigation

The permanent navigation is:

1. Learn
2. Practice
3. Labs
4. Notebook
5. Sources
6. How It Was Built

Theme selection remains a utility control rather than a top-level destination.

## Route map

| Target route | Purpose |
| --- | --- |
| `/` | Product promise, flagship action, rotating case, lab preview, source integrity |
| `/learn` | Eleven-lesson curriculum overview, progress, and resume |
| `/learn/[lesson]` | One focused concept with scenario, attempt, feedback, lab connection, and synthesis |
| `/practice` | Deterministically rotated daily case plus the complete case library |
| `/journey/calculation-labyrinth` | The seven-step flagship journey |
| `/labs` | Four Advanced Labs with shared question and interaction contract |
| `/labs/[slug]` | Guided first interaction, exploration, accessible summary, source links, reflection, and share state |
| `/notebook` | Initial reasoning, feedback, Guide turns, revisions, citations, lab state, exports |
| `/sources` | Method, source standards, primary-source index, manifesto history, and research notes |
| `/sources/glossary` | Practical concept glossary |
| `/sources/thinkers/[slug]` | Thinker profiles with stable source locators |
| `/built` | Evidence-backed portfolio case study and study status |

### Lesson routes

- `/learn/what-is-praxeology`
- `/learn/man-acts`
- `/learn/uneasiness-and-improvement`
- `/learn/ends-and-means`
- `/learn/choice-and-tradeoff`
- `/learn/opportunity-cost`
- `/learn/subjective-value`
- `/learn/time-preference`
- `/learn/exchange`
- `/learn/prices-and-knowledge`
- `/learn/apply-it-to-your-life`

### Compatibility redirects

| Current route | Permanent destination |
| --- | --- |
| `/learn/praxeology-101` | `/learn` |
| `/cases` | `/practice` |
| `/modules` | `/labs` |
| `/modules/:slug` | `/labs/:slug` |
| `/glossary` | `/sources/glossary` |
| `/thinkers` | `/sources` |
| `/thinkers/:slug` | `/sources/thinkers/:slug` |
| `/manifesto` | `/sources#manifesto` |
| `/manifesto-print` | `/sources#manifesto` |
| `/colophon` | `/built` |
| `/field-notes` and `/field-notes/:slug` | `/built#field-notes` |

Historical lab slugs that are not in the active registry redirect to `/labs`. Their meaningful decisions are preserved in Git and summarized in `/built`; their private runtimes and APIs are not shipped.

## Seven-step flagship journey

### 1. Meet the decision

A student team is planning a school event with a `$1,200` budget and `20 volunteer-hours`. The learner sees the people, desired event, options, and hard constraints without an economics lecture.

### 2. Read the action

The learner identifies the actor, end, and means in their own words. Prompts are questions, never model answers. The journey preserves the attempt through refresh.

### 3. Name scarcity

The learner identifies the binding constraint and next-best forgone alternative. The initial interpretation is saved before feedback.

### 4. Navigate with price markers

The learner moves through a deterministic two-dimensional labyrinth. Price markers make comparable uses and less-wasteful paths visible. Keyboard, touch, pointer, screen-reader, and reduced-motion users receive the same task and state.

### 5. Navigate without price markers

The maze seed and opportunities remain constant while markers disappear. The learner compares path choices, waste, and uncertainty. Non-sensitive state can be shared; learner prose cannot enter the URL.

### 6. Revise with feedback

Deterministic feedback checks presence, scenario evidence, concept fit, and key distinctions. It returns `needs evidence`, `concept mismatch`, or `ready to revise`, never a score. After an attempt, the learner may request one source-grounded Socratic Claude question. The deterministic provider is always available.

### 7. Reflect and export

The learner compares initial and revised reasoning, writes a final reflection, saves the record to the Notebook, and exports Markdown, print, or a reflection card.

## Reasoning feedback contract

Every field is evaluated independently:

- **Presence:** enough substance to inspect, with filler-only text rejected.
- **Scenario evidence:** references a person, resource, limit, action, or alternative from the prompt.
- **Concept fit:** describes the requested role rather than a different role.
- **Key distinction:** differentiates actor/end/means, constraint/tradeoff, and opportunity cost/accounting cost.

Feedback names the triggered rule in plain language, explains why it matters, and invites revision. Multiple defensible interpretations are explicitly allowed. Examples appear only after a learner attempt and are labeled examples rather than answers.

## Claude Guide boundaries

The Guide is optional, source-grounded, and review-gated.

### Context sent

- current learner reasoning, capped and normalized;
- normalized non-sensitive lab state;
- a short allowlisted source packet containing a verified claim, locator, and stable URL.

### Context never sent

- unrelated Notebook entries;
- browser storage;
- raw network identifiers;
- private environment values;
- a persistent transcript;
- text from another learner.

### Response contract

- exactly one Socratic question;
- zero or more concise explanation blocks categorized as observation, distinction, or source note;
- a citation on every factual explanation;
- a plain `why this feedback` statement;
- provider mode (`claude` or `deterministic`);
- insufficiency status and safe retry timing.

Claude uses server-only `ANTHROPIC_API_KEY`. Native citation blocks are normalized and validated rather than combined with incompatible strict structured output. Missing keys, invalid responses, offline state, cancellation, upstream `429`, or safe transient failure all return the deterministic provider or an explicit recoverable state. Learner text is treated as untrusted data and is not logged.

Privacy-preserving rate limits are six requests per minute and thirty per day. Only a salted hash of the network identifier is stored in Upstash; learner text never enters Redis.

## Labs contract

All four Advanced Labs share:

1. one driving question;
2. a guided first interaction;
3. an explicit exploration mode;
4. a live accessible change summary;
5. primary-source links;
6. a reflection prompt;
7. complete non-sensitive share state; and
8. a native non-canvas equivalent.

The four labs are Monetary Garden, Signal Orchard, Calculation Labyrinth, and Coordination Engine.

## Acceptance gates

### Automated

- clean Node 22 / npm 10.9.3 install;
- formatting/lint, strict TypeScript, accessibility lint, unit tests, Guide evaluations, production build;
- current-route E2E in Chromium, Firefox, and WebKit;
- desktop, mobile, dark, and reduced-motion visual snapshots;
- internal and primary-source link checks;
- three Lighthouse runs per route with median budgets: performance `>= 0.95` desktop and `>= 0.90` mobile, accessibility/best-practices/SEO `1.0`, LCP `<= 2.5s`, CLS `<= 0.1`.

### Manual

- homepage promise and flagship action are clear above the fold;
- journey works on the Vercel preview with and without Claude;
- refresh/resume, keyboard, screen-reader announcements, touch targets, reduced motion, print, Markdown, reflection card, redirects, offline, cancellation, invalid response, and rate-limit recovery are verified;
- only actual results are recorded; unmet targets remain blockers.

### Educational release

The pull request stays draft and the project stays a portfolio candidate until five real learners complete the consented protocol, William verifies the anonymized summary, and at least one resulting revision is committed. No `v1.0.0` tag or educational-impact claim is permitted before that gate.

## User-testing flow

1. Record consent, learner alias, device class, prior familiarity, and whether AI was enabled.
2. Ask the learner to explain the homepage offer without prompting.
3. Observe the complete flagship journey without teaching the interface.
4. Ask the learner to explain how price markers changed the task.
5. Ask which feedback changed their reasoning and which wording felt unclear.
6. Verify the saved Notebook record and one export.
7. Collect difficulty, confidence, accessibility barriers, and one suggested change.
8. Store only the anonymized summary template in the repository; never commit raw participant data.
