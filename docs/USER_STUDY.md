# Five-person flagship study

Status: **Pending**

Release gate: v1.0 remains blocked until five learners complete this protocol
and at least one resulting revision is implemented and documented.

## Purpose

Determine whether a learner can understand the homepage offer, complete the
Calculation Labyrinth without coaching, explain what changed between the priced
and unpriced runs, and use the feedback to make a more scenario-grounded
revision. This is formative product research, not a controlled claim about
educational impact.

## Participants

William recruits five people who are not contributors to the repository. Record
their self-described familiarity with economics as `none`, `some`, or `high`,
but do not collect names in the repository. Assign IDs `L01` through `L05`.
Participation is voluntary and may stop at any time.

## Consent and data boundary

Before starting, tell each learner:

- the session tests the product, not the learner;
- their on-screen work is stored only in that browser unless they export it;
- the optional Guide sends the current reasoning and normalized lab state to an
  AI provider, with allowlisted source packets;
- observations will be anonymized; and
- no raw participant record, recording, name, network identifier, or private
  quotation will be committed to Git.

Record only `consent: yes/no`. Stop immediately for `no`. Ask separately for
permission to paraphrase or quote. Store any raw notes outside the repository;
only the anonymized summary belongs here.

## Session setup

- Use the Vercel preview on the learner’s preferred device.
- Start with cleared Praxeos local storage.
- Do not explain praxeology or the journey before the learner reads the page.
- Alternate Guide conditions: `L01`, `L03`, and `L05` may request the live
  Guide; `L02` and `L04` use deterministic fallback. If live Claude is
  unavailable, record the actual fallback and continue.
- Ask the learner to think aloud only when comfortable. The facilitator may
  remind them of the task but must not interpret the scenario for them.

## Tasks

1. From the homepage, explain in one sentence what Praxeos offers and choose
   where to begin.
2. Complete all seven stages of the Calculation Labyrinth.
3. Refresh once after saving the initial interpretation and resume.
4. Explain the most important difference between the priced and unpriced runs.
5. Read deterministic feedback; optionally request the single Guide question in
   the assigned condition; revise the interpretation.
6. Save a final reflection, open Notebook, and locate the initial reasoning,
   revision, feedback, citations, and completion date.
7. Export either Markdown or the reflection card and explain what the artifact
   communicates to someone who did not take the journey.

## Post-session questions

Use the learner’s words. Do not suggest an answer.

1. What do you think the journey was trying to teach?
2. What did price markers make easier or harder to decide?
3. What does opportunity cost mean in this event scenario?
4. Where did you feel uncertain, stuck, or surprised?
5. Did the feedback help you revise? Why or why not?
6. What would you change before another learner tried this?
7. How confident are you that you could use this lens on a different choice:
   `not yet`, `somewhat`, or `yes`? Give one example.

## Observation rubric

Record observed behavior, not inferred ability.

- Homepage offer understood without help: `yes/no`
- Flagship action found above the fold: `yes/no`
- Seven stages completed: `yes/no`
- Refresh/resume succeeded: `yes/no`
- Priced/unpriced comparison used scenario evidence: `yes/no`
- Revision changed meaningfully after feedback: `yes/no`
- Notebook record found: `yes/no`
- Export completed: `yes/no`
- Critical accessibility or recovery failure: short anonymized note or `none`

## Anonymized results

Pending until all five sessions are complete.

| Learner | Prior familiarity | Guide mode | Completed | Resume | Comparison grounded | Meaningful revision | Export | Main friction | Quote permission |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | Pending | live/fallback | Pending | Pending | Pending | Pending | Pending | Pending | yes/no |
| L02 | Pending | deterministic | Pending | Pending | Pending | Pending | Pending | Pending | yes/no |
| L03 | Pending | live/fallback | Pending | Pending | Pending | Pending | Pending | Pending | yes/no |
| L04 | Pending | deterministic | Pending | Pending | Pending | Pending | Pending | Pending | yes/no |
| L05 | Pending | live/fallback | Pending | Pending | Pending | Pending | Pending | Pending | yes/no |

## Evidence-based revision log

At least one completed row is required before the draft PR can be marked ready.

| Evidence from learner sessions | Decision | Files or behavior changed | Verification rerun | Status |
| --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Blocked |

## Release decision

After the fifth session, William verifies the anonymized table and primary-source
checklist. Summarize patterns without turning five sessions into a generalized
impact claim. Implement at least one revision directly supported by the evidence,
rerun the entire automated and manual acceptance suite, then record whether the
draft PR is ready. Until those steps are complete, the release decision is
`Pending`.
