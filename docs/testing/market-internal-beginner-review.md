# Market Without a Manager — internal beginner-usability review

**Date:** 2026-07-14

**Status:** Complete internal review. This is non-participant validation and does not count toward the five-person release study.

**Environment:** Local production build, Chromium, 1440×1000 desktop plus mobile emulation, deterministic fallback Guide, no Anthropic key.

## Review questions and evidence

| Question | Internal evidence | Result |
| --- | --- | --- |
| Is the first action identifiable without reading documentation? | `Meet the participants` is the only primary control in the opening stage and is visible in the initial desktop and mobile viewports. | Pass after revision |
| Can the first meaningful result appear within one action? | The first click changes the evidence rail and structured record to `Five plans enter one market`. | Pass structurally; not a timed human measure |
| Does terminology arrive after experience? | The sequence shows separate inventories and a failed barter before introducing indirect exchange, completed-trade prices, incomplete information, shortage, or ceiling interpretation. | Pass |
| Is cause and effect visible? | A two-token offer is rejected and produces no price; a four-token accepted offer changes inventories and creates the first displayed bread price. | Pass |
| Does the interface expose model limits? | Assumptions, a credible counterargument, and the viewpoint boundary remain visible beside the simulation and interpretation record. | Pass |
| Does the no-AI path avoid semantic pretense? | The checklist reads explicit event IDs, assumption IDs, completion, revision, and comparison checks. Keyword content does not change status. | Pass |
| Can the journey resume? | A refresh after the ceiling restored the local v3 session at `Open interpretation` with the event record intact. | Pass |

## Issues found and resolved

1. The original Lab header consumed most of the first viewport, placing the action below the fold. The header was compressed and the action dock moved above the network.
2. Progress labels were visually exposed because the wrong screen-reader utility class was used. They now use the existing `sr-only` utility.
3. The sticky header’s backdrop filter produced black GPU artifacts in browser screenshots. The opaque paper header no longer uses that filter.
4. The ceiling action appended a rule event and a blocked-offer event, advancing Guided progress twice and skipping completion. Only registered Guided action IDs now advance the stage.
5. The copy referenced a self-review checklist that did not exist. Three explicit comparison prompts were added, and `ready for self-review` now requires all three.
6. Mobile emulation placed the first action just below the initial viewport. Mobile-only title, question, save strip, and stage spacing were tightened; the full flagship flow then passed in the Pixel 7 project with the action in view.

## Automated evidence recorded in this phase

- Production build: passed on Next.js 16.2.10.
- Unit and deterministic Guide evaluations: 25 passed; 10 live Anthropic evaluations skipped because they remain opt-in.
- Desktop Chromium foundation suite: 16 passed; one mobile-only touch-target check skipped by project guard.
- Mobile Chromium: the full journey and 44-pixel touch-target check passed after the above-fold revision.
- Reduced-motion project: six passed; one mobile-only check skipped by project guard.
- Biome formatting/lint, accessibility lint, and strict TypeScript: passed.

## Remaining study gate

No real beginner participated in this review. After all four Labs are complete, five real beginners must test every Lab without interface coaching. The draft PR and study status remain pending until the study produces at least one committed evidence-based revision.
