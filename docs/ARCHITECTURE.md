# Architecture

Praxeos is a local-first Next.js learning application. Its four Labs are deterministic, replayable HTML/SVG simulations; the optional Claude Guide is the only semantic feedback path.

## Runtime topology

```text
Next.js 16.2.10 on Vercel
├─ server routes: metadata, content, and POST /api/guide
├─ client Lab shell: guided/explore UI and structured evidence
├─ pure Lab engines: seed + assumptions + action log -> state + metrics
├─ local-first v3 store: sessions, Notebook records, progress, migrations
└─ optional services
   ├─ Anthropic: one source-grounded Socratic Guide question
   └─ Upstash: hashed rate-limit identifiers, never learner text
```

There are no accounts, permanent AI transcripts, learner-text telemetry, payments, or application database.

## Lab data flow

```text
/labs/[slug]
  -> four-entry Lab registry
  -> lazy Lab implementation
  -> deterministic engine.create(seed, assumptions)
  -> engine.reduce(state, action)
  -> engine.derive(state) + describeChange(...)
  -> visible observation and event records
  -> learner explicitly selects evidence and assumptions
  -> transparent checklist or optional Claude Guide
  -> versioned local Notebook record and bounded export/share state
```

The four canonical Labs are The Choice Machine, Market Without a Manager, The Entrepreneur's Discovery, and The Money Time Machine. `Market Without a Manager` is the flagship.

## Deterministic boundary

Engines are pure and rendering-independent. Replaying the same seed, assumptions, and action log produces the same result. Deterministic feedback can inspect completion, explicitly selected simulation evidence, acknowledged assumptions, self-review completion, and whether reasoning was revised. It does not search prose for keywords or claim semantic correctness.

The no-AI path compares initial and revised writing beside the learner's selected evidence and assumptions. Semantic distinctions belong only to the optional Guide.

## Persistence and sharing

The v3 browser store supports multiple Lab sessions, lesson progress, Notebook records, Guide turns, citations, and completion. A migration preserves earlier Calculation Labyrinth writing as a read-only `Earlier Praxeos record`; its runtime is retired.

Share envelopes contain only the Lab slug, seed, mode, bounded assumption IDs, and bounded action IDs. Learner prose, Guide output, Notebook history, and network identifiers are excluded. Malformed, oversized, unknown-version, and cross-Lab payloads produce an explanation and a fresh deterministic session.

## Guide boundary

`POST /api/guide` accepts a Lab slug, bounded reasoning, and explicit observation/action/assumption IDs. The server chooses allowlisted source packets. The provider adapter validates exactly one question and citations for factual source notes, caps input and history, returns `no-store`, avoids text logging, supports cancellation, and falls back to a non-semantic self-review question.

When configured, Upstash limits use a hashed network identifier. Redis never receives learner text. `ANTHROPIC_API_KEY` is server-only.

## Accessibility and rendering

Labs use semantic HTML and code-native SVG. The same complete interaction remains available for keyboard, touch, reduced motion, increased contrast, screen readers, and structured non-canvas inspection. Mobile uses a vertical action/consequence sequence. Generated editorial images are atmospheric only; important information remains in code and text.

## Verification

Vitest covers engine invariants, replay, store migration, shares, exports, feedback boundaries, Guide validation, and adversarial inputs. Playwright covers Chromium, Firefox, WebKit, desktop, tablet, mobile portrait/landscape, reduced motion, 200% zoom, forced colors, refresh/resume, offline fallback, redirects, and visual stability. Asset, link, build, and Lighthouse checks run separately.

The current observed results and unresolved release gates live in `docs/BUILD_REPORT.md`. Targets are never reported as passing before they are rerun against the current four-Lab build.

## Deployment and release

Pull requests create previews; production remains outside this branch. The canonical origin is `https://praxeos.vercel.app` until a custom domain is verified. The draft PR cannot become a v1.0 release until five real beginners complete all four Labs, one evidence-based revision is committed, the full suite is rerun, and William explicitly approves the release.
