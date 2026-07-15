# Five-person four-Lab study

Status: **Pending**

Release gate: v1.0 remains blocked until five real beginners complete and
evaluate all four finished Labs, at least one evidence-based revision is
committed, and the full verification suite is rerun.

## Purpose

Determine whether a beginner can identify the question, current action,
resulting change, cause, revealed concept, and next experiment in each Lab
without William explaining the interface. This is formative product research,
not a controlled claim about educational impact.

The internal beginner-usability review completed after Market Without a Manager
was developer validation, not participant evidence. It did not block
implementation of the remaining Labs and does not count toward this study.

## Participants and privacy

William recruits five people who are not repository contributors. Record only
self-described economics familiarity (`none`, `some`, `high`) and anonymous IDs
`L01` through `L05`. Participation is voluntary and may stop at any time.

Before starting, tell each learner:

- the session tests the product, not the learner;
- on-screen work stays in that browser unless exported;
- the optional Guide sends only current reasoning, explicit evidence IDs, and
  server-selected source packets to an AI provider;
- observations will be anonymized; and
- raw notes, recordings, names, network identifiers, and private quotations
  never enter Git.

Record `consent: yes/no` outside the repository. Stop for `no`. Ask separately
for quotation or paraphrase permission.

## Setup

- Use the feature-branch Vercel preview on the learner’s preferred device.
- Clear Praxeos local storage before each participant begins.
- Do not explain praxeology, the four questions, or the interface.
- Alternate Guide availability across participants; deterministic fallback is
  a valid condition and must remain a complete path.
- Record hesitation, misclicks, misunderstood terminology, and unclear
  cause-and-effect as observed behavior—not inferred ability.

## Tasks for every participant

1. From the homepage, explain in one sentence what Praxeos offers and choose a
   starting action.
2. Complete **The Choice Machine**. Explain the selected path, one preserved
   forgone path, the changed constraint, and what one choice cannot reveal.
3. Complete **Market Without a Manager**. Explain one offer, one completed or
   missed trade, where a displayed price came from, and what the ceiling changed.
4. Complete **The Entrepreneur’s Discovery**. Explain the hypothesis, evidence
   selected, resources spent, observed customer action, uncertainty that remains,
   and the next experiment.
5. Complete **The Money Time Machine**. Compare two monetary rules, identify who
   experiences the modeled change earlier and later, and name an assumption that
   prevents treating the output as a forecast.
6. Refresh during at least one Lab and resume without losing state. Switch to
   Explore mode after it unlocks and run one comparison.
7. In every Lab, write an initial interpretation, select visible evidence,
   acknowledge an assumption, use deterministic self-review or the assigned
   Guide condition, then revise or explicitly confirm the response.
8. Open Notebook and locate the initial reasoning, revision, evidence,
   assumptions, optional Guide question, citations, reflection, and date.
9. Export Markdown or a reflection card and explain what the artifact
   communicates to someone who did not complete the Lab.

## Per-Lab comprehension record

Ask without suggesting an answer:

1. What question was this Lab asking?
2. What action did you take?
3. What changed immediately afterward?
4. What caused that change inside the simulation?
5. What concept did the experience reveal?
6. What would you try next?
7. Which assumption most limits what you can conclude?

For each Lab, at least four of five participants must explain the question,
action, change, cause, concept, and next experiment. Shared confusion requires an
interaction redesign rather than longer instructions.

## Observation record

Use `yes/no` plus a short anonymized note:

- first homepage action identified within 10 seconds;
- first meaningful Lab result reached within 30 seconds;
- guided progress and next action understood;
- cause and effect described from visible evidence;
- Explore mode found without state loss;
- refresh and resume succeeded;
- deterministic feedback understood as a checklist, not a grade;
- Notebook record found;
- export completed;
- critical keyboard, touch, motion, contrast, recovery, or comprehension issue.

## Anonymized results template

Pending until all five sessions are complete.

| Learner | Familiarity | Choice 6/6 | Market 6/6 | Discovery 6/6 | Money 6/6 | Resume | Explore | Export | Main friction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L01 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| L02 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| L03 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| L04 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |
| L05 | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Evidence-based revision log

At least one completed row is required before the draft PR can be marked ready.

| Shared learner evidence | Interaction decision | Files or behavior changed | Verification rerun | Status |
| --- | --- | --- | --- | --- |
| Pending | Pending | Pending | Pending | Blocked |

## Release decision

After the fifth session, William verifies the anonymized summary and the
primary-source/image checklist. Summarize patterns without generalizing from
five people to educational impact. Commit at least one revision directly
supported by the evidence, rerun the complete automated and manual acceptance
suite, then decide whether the draft PR is ready. Until then: `Pending`.
