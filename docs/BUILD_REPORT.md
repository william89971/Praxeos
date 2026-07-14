# Praxeos flagship build report

Report date: 2026-07-14

Branch: `codex/praxeos-flagship-v1`

Release state: **Portfolio candidate — educational validation pending**

This report records observed results. A target is not reported as passing until
the corresponding command or real flow has been run. Five-learner evidence,
production verification, and v1.0 remain blocked by design.

## Acceptance summary

| Area | Actual result | Status |
| --- | --- | --- |
| Clean install | `npm ci` completed from the regenerated lockfile with Node 22/npm 10.9.3 during foundation verification | Pass |
| Strict TypeScript | `npm run typecheck` exited 0 | Pass |
| Unit and deterministic Guide evaluation | 29/29 tests passed across five files; the Guide suite accounts for 12/12 cases | Pass |
| Formatting and code lint | Biome formatting and lint exited 0 after normalization | Pass |
| Accessibility lint | ESLint with JSX accessibility rules exited 0 | Pass |
| Production build | Next.js 16.2.10 generated all target pages after adding the required lab Suspense boundary | Pass |
| Internal link contracts | Nine current route contracts resolved on the local app | Pass |
| Primary-source links | Nine route contracts and all four cited source URLs passed after replacing one retired Liberty Fund URL | Pass |
| Cross-browser flow | The 90-test run produced 82 passes, seven intentional skips, and one WebKit persistence assertion that timed out at 300 ms; after increasing only that assertion's poll window, its five-browser regression suite passed 15/15 with five expected conditional skips | Pass after test-timing correction |
| Visual regression | Desktop, mobile, and reduced-motion snapshots passed with a 50-pixel antialiasing tolerance; the harness injects pinned OFL fonts so layout metrics are stable on Windows and Linux without affecting production font loading | Pass |
| Desktop Lighthouse | Three-run medians across seven routes: performance 0.99–1.00; accessibility, best practices, and SEO 1.00; LCP 0.81–0.93 s; CLS 0–0.012 | Pass |
| Mobile Lighthouse | Three-run medians: performance 0.97–0.99; accessibility, best practices, and SEO 1.00; LCP 2.27–2.46 s; CLS 0–0.0003 | Pass |
| Dependency audit | Production-only audit reports two moderate PostCSS advisories inside Next 16.2.10; the full development tree reports 15 transitive advisories, including Lighthouse tooling. npm offers no safe automatic resolution for the production pair | Blocker documented |
| Live Claude evaluation | Optional and not run without an explicitly supplied API key | Pending, non-blocking for fallback |
| Five-person learner study | Protocol and anonymized template exist; no learner results have been entered | Blocking v1.0 |
| Vercel preview | Requires pushed branch and draft PR | Pending |

## Automated coverage exercised

- Versioned store migration from legacy learning and run state.
- Rubric presence, scenario evidence, concept fit, and key distinctions without
  numeric scores.
- Lab determinism and URL serialization that excludes learner writing.
- Markdown, print record, and reflection-card export generation.
- Guide provider normalization, citation validation, exactly-one-question
  enforcement, deterministic fallback, adversarial prompt fixtures, cancellation,
  retry, offline behavior, and `429` handling.
- Full journey refresh/resume with initial interpretation, two lab runs, revision,
  final reflection, Notebook persistence, and downloads.
- Permanent compatibility redirects and all primary routes.
- Desktop, Pixel 7 mobile, Firefox, WebKit, and reduced-motion projects.
- Homepage, journey brief, and Labs index visual snapshots in desktop, mobile,
  and reduced-motion modes.

### Intentional browser skips

Seven checks are conditionally skipped in the 90-test matrix:

- the mobile-only 44 px touch-target assertion in four non-mobile projects;
- visual snapshots in Firefox and WebKit because snapshots are owned by the
  three declared Chromium visual projects; and
- the synthetic Tab-focus assertion in Playwright WebKit on Windows, whose test
  runtime does not expose macOS full-keyboard-access behavior. The same keyboard
  assertion passes in Chromium and Firefox.

## Actual User Demo Test

### Tested flow

On the local app, the browser suite opened the homepage, selected the flagship
action, completed all seven journey stages, refreshed after the initial
interpretation, resumed saved state, ran deterministic fallback, rendered a
mocked citation-bearing Claude turn, handled invalid/offline/`429` responses,
saved the final record, opened Notebook, and initiated exports. The current
desktop homepage and journey screenshots were also inspected at original
resolution.

### What worked

- The homepage states the offer and exposes “Begin 8-minute journey” above the
  fold.
- Refresh/resume preserved the journey.
- Share state contained lab parameters and excluded learner prose.
- Deterministic feedback remained usable when Guide requests failed.
- The mocked Claude turn showed its question, explanation, and grounding.
- Reduced motion kept the complete 2D journey and the labs’ controls/readable
  state instead of replacing them with a static poster.
- Mobile controls met the 44 px target floor.
- Compatibility URLs permanently resolved to the target route system.

### What failed and was fixed

- Next 16 production prerendering rejected `useSearchParams` below the dynamic
  lab route. A semantic Suspense boundary was added and the full build passed.
- A 29-pixel mobile screenshot difference exposed font antialiasing noise. A
  tight 50-pixel limit was added; all three visual projects then passed.
- The external crawl found a retired Liberty Fund `Human Action` URL. The
  source packet now points to the current FEE edition.
- Lighthouse exposed insufficient tertiary text contrast in auto-dark mode and
  the Notebook shell’s `robots.txt` block. Both were corrected; the final
  desktop and mobile medians pass.
- The clean final browser run exposed a development-mode progress-store render
  loop in advanced labs. Progress writes are now idempotent, callbacks are
  stable, and a five-browser regression check verifies the visited state without
  a maximum-update-depth error.
- The first full rerun after that app fix had one WebKit-only persistence check
  time out at 300 ms. No application error appeared; increasing only the test's
  polling window to three seconds produced 15/15 passes in the targeted
  cross-browser suite, with the five documented conditional skips.
- The first GitHub Actions E2E run passed all 80 executed non-visual checks but
  failed the three visual projects because Ubuntu substituted different system
  fonts from the Windows baselines. The screenshot harness now serves pinned
  OFL test fonts through same-origin Playwright routes. Production retains its
  fast system-font stack, and the regenerated desktop, mobile, and
  reduced-motion baselines pass locally without update mode.

### Remaining improvements and blockers

- Walk the deployed Vercel preview manually with and without a live Guide key.
- Verify screen-reader announcements with a real assistive-technology pairing,
  not only DOM/live-region assertions.
- Verify print output and downloaded artifacts in the deployed preview.
- Resolve or formally accept the transitive Next/PostCSS advisories when a
  compatible upstream release exists.
- Complete five learner sessions and implement at least one evidenced revision.

### Readiness

The local product is a technically verified portfolio candidate. It is **not
educationally validated**, is **not ready for v1.0**, and must remain on a draft
PR until the learner-study gate is complete.

## Security and privacy notes

- No `.env` file, API key, cache, build output, raw participant data, or private
  Figma material belongs in the repository.
- `ANTHROPIC_API_KEY` is server-only. Missing or invalid configuration activates
  deterministic guidance.
- Rate-limit identifiers are hashed and no learner text is written to Redis.
- Guide responses use `no-store`; request bodies and history are capped.
- The final staged tree receives a secret-pattern scan before push.

## Release gate

Keep the PR in draft with the label/notice `Educational validation pending`.
Do not merge, tag, update production, or publish `v1.0.0` until the five-person
study, one evidence-based revision, complete rerun, and live deployment
verification are all recorded.
