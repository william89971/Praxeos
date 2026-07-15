# Praxeos four-Lab build report

Report date: 2026-07-14  
Branch: `codex/praxeos-flagship-v1`  
Release state: **Portfolio candidate — educational validation pending**

This report records results observed against the four-Lab replacement. No result below is an educational-impact claim.

## Current acceptance summary

| Area | Observed result | Status |
| --- | --- | --- |
| Four canonical Labs | Choice, Market, Discovery, and Money guided/explore routes build and run from the shared registry | Pass |
| Deterministic feedback boundary | Tests cover explicit completion, evidence, assumptions, revision, and self-review without keyword-based semantic grading | Pass |
| Unit and Guide evaluation | 43 automated tests pass; 10 opt-in live Claude cases are skipped without a supplied key | Pass with live evaluation pending |
| Asset manifest | Five editorial image records, derivatives, alt text, attribution/generation fields, and review flags validate | Pass |
| Cross-browser and responsive flows | Seven Playwright profiles completed: 201 passed, 23 intentional profile-specific skips, 0 failed in 2.5 minutes; the final visual-only change then passed all 3 owned snapshot profiles | Pass |
| Production build | Next.js 16.2.10 generated all 38 static pages and the current route set after final styling | Pass |
| Clean install | `npm ci` installed 815 packages from the lockfile; npm reported 15 audit advisories (7 low, 6 moderate, 2 high) | Pass with advisories recorded |
| Format, lint, accessibility lint, typecheck, links | All final checks passed across 118 formatted/linted files, the source tree, 12 route contracts, and 11 source links | Pass |
| Lighthouse | Desktop: 30/30 audits passed. Mobile route suite passed except one Chrome `NO_NAVSTART` trace interruption; the rerun for the changed flagship route passed all assertions with 2.462 s median LCP, 0.97 median performance, and 1.00 accessibility, best practices, and SEO | Pass with infrastructure interruption recorded |
| Live Claude evaluation | Requires an explicitly supplied API key and may spend provider credits | Pending, non-blocking for no-AI path |
| Vercel feature-branch preview | Must be verified after the branch is pushed and a preview becomes available | Pending external integration |
| Five-person all-four-Lab study | Protocol exists; no participant results have been entered | Blocking v1.0 |

## Browser matrix exercised

The 224-case matrix ran desktop Chromium, mobile portrait Chromium, mobile landscape Chromium, tablet Chromium, desktop Firefox, desktop WebKit, and reduced-motion Chromium. It covered:

- the homepage offer and flagship action;
- every Lab's core deterministic consequence and Notebook handoff;
- the full Market journey, refresh/resume, deterministic self-review, and exports;
- invalid share recovery and Guided/Explore state preservation;
- offline Guide fallback;
- permanent compatibility redirects and all primary routes;
- page overflow, 200% layout equivalence, forced colors, keyboard order, touch-target floors, and reduced motion; and
- current homepage, progression, Lab cover, flagship stage, mobile, dark-theme, and reduced-motion snapshots.

The 23 skips are deliberate checks that do not apply to a given profile, primarily visual ownership outside the declared Chromium snapshot projects and device-specific assertions.

## Problems found and corrected during final browser verification

- The optional Guide response was visible but its citation IDs were not copied into the saved Notebook record. Both shared and flagship save paths now persist those IDs.
- Mobile landscape placed the first flagship action below the initial viewport. A short-landscape layout compacts the cover, progress, and stage spacing while preserving the question and consequence.
- The full Market path exceeded the original 30-second test allowance once under loaded two-worker Firefox execution. The journey test now has a 60-second ceiling; its assertions and application behavior are unchanged.
- The first complete seven-profile run produced two failures from the landscape placement and Firefox allowance. Targeted regressions passed 6/6, then the complete matrix passed 201/201 executed checks.

## Internal beginner-usability review

The non-participant internal review focused on whether the first action was visible, terminology arrived after experience, the visual hierarchy separated action from evidence, cause and effect were explicit, and developer-facing language was absent. It supported continued implementation of the other three Labs; it does not count toward the five-person study.

## Remaining manual and release gates

- Walk the final local preview in the in-app browser, including the flagship first consequence.
- Walk a Vercel feature-branch preview with deterministic fallback and, when explicitly configured, a live Guide.
- Verify real screen-reader announcements, print output, and downloads on representative hardware.
- Recruit five real beginners after all four Labs are complete. Every participant evaluates every Lab without William explaining the interface.
- For each Lab, at least four of five learners must explain the question, action, change, cause, concept, and next experiment.
- Commit at least one evidence-based revision, rerun every check, and obtain William's explicit approval before considering `main` or v1.0.

## Security and privacy notes

- Environment files, keys, caches, build output, raw participant data, network identifiers, and private design material are excluded from Git.
- Learner prose remains local unless the learner explicitly invokes the Guide; Guide responses are `no-store` and text is not written to Redis.
- Share URLs exclude learner prose, Guide output, and unrelated Notebook records.
- The final staged tree receives a secret-pattern scan before push.

Until every release gate is complete, the pull request stays draft with `Educational validation pending`. Do not merge, tag, update production, or claim educational impact.
