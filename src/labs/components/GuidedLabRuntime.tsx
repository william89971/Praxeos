"use client";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { LabReflection } from "@/labs/components/LabReflection";
import { evaluateSelfReview } from "@/labs/feedback";
import { decodeShareEnvelope, encodeShareEnvelope } from "@/labs/share";
import type {
  LabEngine,
  LabExplanation,
  LabMode,
  LabRegistryEntry,
  RubricFeedback,
} from "@/labs/types";
import type { LabSlug } from "@/labs/types";
import type { GuideTurn } from "@/lib/guide/types";
import { labState, lessonState, recommendNext } from "@/lib/journey";
import type { ActivityRef } from "@/lib/journey";
import {
  type StoredLabSession,
  activeLabSession,
  emptyLabSession,
  labSessionToMarkdown,
  upsertLabSession,
} from "@/lib/learning-store";
import { LOCAL_RECORD_NOTE } from "@/lib/learning-store";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const OptionalGuide = dynamic(
  () =>
    import("@/labs/components/OptionalGuide").then((module) => module.OptionalGuide),
  { ssr: false },
);

export interface GuidedState {
  seed: string;
  guidedStep: number;
  completed: boolean;
  observations: LabExplanation[];
}

export interface GuidedAction {
  id: string;
  label: string;
}

export interface GuidedMetrics {
  cards: Array<{ label: string; value: string; detail?: string }>;
  summary: string;
}

export interface GuidedStage {
  question: string;
  why: string;
  concept: string;
}

export interface AssumptionOption {
  id: string;
  label: string;
}

export interface StageOption<Action extends GuidedAction> {
  action: Action;
  label: string;
  disabled?: boolean;
  reason?: string | null;
}

export interface StageControl<Action extends GuidedAction> {
  kind: "prediction" | "choice" | "single";
  prompt: string;
  options: readonly StageOption<Action>[];
}

export interface GuidedLabDefinition<
  State extends GuidedState,
  Action extends GuidedAction,
  Assumptions extends object,
> {
  lab: LabRegistryEntry;
  seed: string;
  defaultAssumptions: Assumptions;
  engine: LabEngine<State, Action, GuidedMetrics, Assumptions>;
  guidedActions: readonly Action[];
  exploreActions: readonly Action[];
  stages: readonly GuidedStage[];
  assumptions: readonly AssumptionOption[];
  actionById: (id: string) => Action | null;
  normalizeAssumptions: (value: Record<string, unknown>) => Assumptions;
  Visual: ComponentType<{ state: State; metrics: GuidedMetrics }>;
  sourceClaim: string;
  sourceHref?: string;
  counterargument: string;
  reflectionPrompt: string;
  resolveStage?: (state: State) => StageControl<Action> | null;
  exploreLockedReason?: string;
}

const SELF_REVIEW_CHECKS = [
  {
    id: "compare-responses",
    label: "I compared my initial response with my revision or confirmation.",
  },
  {
    id: "trace-evidence",
    label: "I can point to the selected simulation observation that shaped my review.",
  },
  {
    id: "state-limit",
    label: "I named an assumption that limits what this simulation can show.",
  },
] as const;

export function GuidedLabRuntime<
  State extends GuidedState,
  Action extends GuidedAction,
  Assumptions extends object,
>({ definition }: { definition: GuidedLabDefinition<State, Action, Assumptions> }) {
  const { store, update, hydrated } = usePraxeosStore();
  const initialized = useRef(false);
  const [mode, setMode] = useState<LabMode>("guided");
  const [state, setState] = useState<State>(() =>
    definition.engine.create(definition.seed, definition.defaultAssumptions),
  );
  const [session, setSession] = useState<StoredLabSession | null>(null);
  const [change, setChange] = useState<LabExplanation | null>(null);
  const [feedback, setFeedback] = useState<RubricFeedback[]>([]);
  const [notice, setNotice] = useState(
    "Fresh guided session ready. Your first action creates a local record.",
  );
  const [online, setOnline] = useState(true);
  const [skipInitial, setSkipInitial] = useState(false);
  const [skipEvidence, setSkipEvidence] = useState(false);
  const [skipLimits, setSkipLimits] = useState(false);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;
    const searchParams = new URLSearchParams(window.location.search);
    const shared = searchParams.get("share");
    if (shared) {
      const decoded = decodeShareEnvelope(shared, definition.lab.slug);
      if (!decoded.ok) {
        setNotice(
          `That share link was ${decoded.reason}. A fresh guided session is ready.`,
        );
        return;
      }
      const actions = decoded.envelope.actionIds.flatMap((id) => {
        const action = definition.actionById(id);
        return action ? [action] : [];
      });
      const restored = replay(definition, definition.defaultAssumptions, actions);
      const fresh = sessionFromState(
        definition,
        restored,
        actions,
        decoded.envelope.mode,
      );
      setState(restored);
      setSession(fresh);
      setMode(decoded.envelope.mode);
      setChange(restored.observations.at(-1) ?? null);
      setNotice("Shared simulation restored. The link contained no learner writing.");
      return;
    }

    const stored = activeLabSession(store, definition.lab.slug);
    if (stored) {
      const actions = stored.actionLog.flatMap((entry) => {
        const action = definition.actionById(String(entry.id ?? ""));
        return action ? [action] : [];
      });
      const assumptions = definition.normalizeAssumptions(stored.assumptions);
      const restored = replay(definition, assumptions, actions);
      setState(restored);
      setSession({
        ...stored,
        state: asRecord(restored),
        guidedStep: restored.guidedStep,
      });
      setMode(restored.completed || stored.completedAt ? "explore" : stored.mode);
      setFeedback(stored.feedback);
      setChange(restored.observations.at(-1) ?? null);
      setNotice("Saved Lab restored from this browser.");
      return;
    }
    setNotice("Fresh guided session ready. Your first action creates a local record.");
  }, [definition, hydrated, store]);

  const metrics = useMemo(() => definition.engine.derive(state), [definition, state]);
  const stage =
    definition.stages[Math.min(state.guidedStep, definition.stages.length - 1)];
  const nextGuidedAction = definition.guidedActions[state.guidedStep];
  const exploreUnlocked = state.guidedStep >= 1 || state.completed;

  const persist = useCallback(
    (patch: Partial<StoredLabSession>) => {
      setSession((current) => {
        const base =
          current ??
          emptyLabSession(definition.lab.slug, new Date().toISOString(), state.seed);
        const next: StoredLabSession = {
          ...base,
          ...patch,
          version: 3,
          labSlug: definition.lab.slug,
          updatedAt: new Date().toISOString(),
        };
        update((currentStore) => upsertLabSession(currentStore, next));
        return next;
      });
      setNotice(online ? "Saved in this browser." : "Saved locally while offline.");
    },
    [definition.lab.slug, online, state.seed, update],
  );

  const dispatch = (action: Action) => {
    const previous = state;
    const next = definition.engine.reduce(previous, action);
    const errors = definition.engine.validate(next);
    if (next === previous || errors.length > 0) {
      setNotice(
        errors[0] ?? "That action is unavailable under the current assumptions.",
      );
      return;
    }
    const explanations = definition.engine.describeChange(previous, next, action);
    const nextActionLog = [...(session?.actionLog ?? []), asRecord(action)];
    setState(next);
    setChange(explanations.at(-1) ?? next.observations.at(-1) ?? null);
    persist({
      mode,
      guidedStep: next.guidedStep,
      assumptions: assumptionsFromState(next, definition.defaultAssumptions),
      actionLog: nextActionLog,
      state: asRecord(next),
    });
  };

  const switchMode = (nextMode: LabMode) => {
    if (nextMode === "explore" && !exploreUnlocked) return;
    setMode(nextMode);
    persist({ mode: nextMode });
  };

  const setWriting = (
    field: "initialReasoning" | "revision" | "reflection",
    value: string,
  ) => persist({ [field]: value });

  const toggleList = (
    field: "selectedEvidenceIds" | "acknowledgedAssumptionIds" | "selfReviewChecks",
    id: string,
  ) => {
    const current = session?.[field] ?? [];
    persist({
      [field]: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const runSelfReview = () => {
    const result = evaluateSelfReview({
      guidedComplete: state.completed,
      initialReasoning: session?.initialReasoning ?? "",
      selectedEvidenceIds: session?.selectedEvidenceIds ?? [],
      acknowledgedAssumptionIds: session?.acknowledgedAssumptionIds ?? [],
      revision: session?.revision ?? "",
      selfReviewChecks: session?.selfReviewChecks ?? [],
      requiredSelfReviewChecks: SELF_REVIEW_CHECKS.length,
    });
    setFeedback(result);
    persist({ feedback: result });
  };

  const reset = () => {
    if (!window.confirm("Reset this simulation and start a new local Lab record?"))
      return;
    const freshState = definition.engine.create(
      definition.seed,
      definition.defaultAssumptions,
    );
    const freshSession = sessionFromState(definition, freshState, [], "guided");
    setState(freshState);
    setSession(freshSession);
    setMode("guided");
    setChange(null);
    setFeedback([]);
    update((currentStore) => upsertLabSession(currentStore, freshSession));
    setNotice("Reset complete. A fresh guided session is ready.");
  };

  const share = async () => {
    const encoded = encodeShareEnvelope({
      version: 1,
      labSlug: definition.lab.slug,
      seed: state.seed,
      mode,
      assumptionIds: session?.acknowledgedAssumptionIds ?? [],
      actionIds: (session?.actionLog ?? []).map((action) => String(action.id ?? "")),
    });
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("share", encoded);
    await navigator.clipboard.writeText(url.toString());
    setNotice(
      "Share link copied. It contains the simulation steps only, not your writing.",
    );
  };

  const complete = () => {
    persist({ completedAt: new Date().toISOString() });
    setNotice("Completed and saved locally. You can still revise or explore.");
  };

  const exportMarkdown = () => {
    if (!session) return;
    downloadFile(
      `praxeos-${definition.lab.slug}.md`,
      labSessionToMarkdown(session),
      "text/markdown",
    );
  };

  const exportCard = () => {
    if (!session) return;
    const text = escapeXml(
      session.revision || session.initialReasoning || definition.lab.centralQuestion,
    );
    const title = escapeXml(definition.lab.title.toUpperCase());
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f0e6"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#b8ad97"/><text x="85" y="115" fill="#8b3a3a" font-family="monospace" font-size="20" letter-spacing="3">PRAXEOS · ${title}</text><foreignObject x="85" y="165" width="1000" height="310"><div xmlns="http://www.w3.org/1999/xhtml" style="font: 48px/1.12 Georgia,serif;color:#1c1814">${text}</div></foreignObject><text x="85" y="540" fill="#5c5348" font-family="monospace" font-size="18">Evidence: ${session.selectedEvidenceIds.length} · assumptions: ${session.acknowledgedAssumptionIds.length} · not graded</text></svg>`;
    downloadFile(`praxeos-${definition.lab.slug}-reflection.svg`, svg, "image/svg+xml");
  };

  const Visual = definition.Visual;
  const observations = state.observations.slice(-8);
  const conceptIndex = Math.max(
    0,
    Math.min(state.guidedStep - 1, definition.stages.length - 1),
  );
  const stageControl =
    mode === "guided" ? (definition.resolveStage?.(state) ?? null) : null;
  const localPredictionKey = `local-predict-${state.guidedStep}-`;
  const localPredictionChosen = (session?.localPredictionIds ?? []).some((id) =>
    id.startsWith(localPredictionKey),
  );
  const needsLocalPrediction =
    mode === "guided" && !definition.resolveStage && Boolean(nextGuidedAction);
  const wroteInterpretation = Boolean(session?.initialReasoning.trim());
  const conceptOpenedEarly = Boolean(session?.conceptRevealedEarly);
  const conceptVisible =
    state.guidedStep > 0 &&
    ((wroteInterpretation && !conceptOpenedEarly) || conceptOpenedEarly);
  const revealedConcept =
    conceptVisible && state.guidedStep > 0 ? definition.stages[conceptIndex] : null;
  const showEvidence = wroteInterpretation || skipInitial;
  const showLimits =
    showEvidence && ((session?.selectedEvidenceIds.length ?? 0) > 0 || skipEvidence);
  const showRevision =
    showLimits && ((session?.acknowledgedAssumptionIds.length ?? 0) > 0 || skipLimits);
  const nextActivity = recommendNext(
    (activity: ActivityRef) => {
      if (activity.kind === "lesson") {
        return lessonState(
          store.completedLessons.includes(activity.slug),
          Boolean(store.lessonRecords[activity.slug]),
        );
      }
      if (activity.kind === "lab") {
        return labState(activeLabSession(store, activity.slug as LabSlug));
      }
      return "not-started";
    },
    { kind: "lab", slug: definition.lab.slug },
  );
  const showNext =
    Boolean(session?.completedAt) || nextActivity.state === "in-progress";
  const guideTurn = session?.guideTurn ?? null;
  const shouldRenderGuide = Boolean(
    guideTurn || session?.initialReasoning.trim() || session?.revision.trim(),
  );
  const onGuideTurn = (turn: GuideTurn) =>
    persist({
      guideTurn: turn,
      citationIds: [
        ...new Set([
          ...(session?.citationIds ?? []),
          ...turn.citations.map((citation) => citation.sourceId),
        ]),
      ],
    });

  return (
    <SiteChrome>
      <div className={`guided-lab guided-lab--${definition.lab.accent}`}>
        <header className="lab-editorial-header">
          <div>
            <p className="label-mono">
              {definition.lab.duration} · Lab {definition.lab.position} of 4
            </p>
            <h1>{definition.lab.title}</h1>
            <p className="lab-editorial-header__question">
              {definition.lab.centralQuestion}
            </p>
          </div>
          <div className="lab-header-tools">
            <figure className="lab-header-cover">
              <Image
                src={definition.lab.visualAsset}
                width={1200}
                height={675}
                sizes="(max-width: 700px) 100vw, 22rem"
                alt={definition.lab.visualAlt}
              />
            </figure>
            <div className="lab-mode-control" aria-label="Lab mode">
              <button
                type="button"
                aria-pressed={mode === "guided"}
                onClick={() => switchMode("guided")}
              >
                Guided
              </button>
              <button
                type="button"
                aria-pressed={mode === "explore"}
                disabled={!exploreUnlocked}
                aria-describedby={exploreUnlocked ? undefined : "explore-lock-reason"}
                onClick={() => switchMode("explore")}
              >
                Explore
              </button>
            </div>
            {exploreUnlocked ? null : (
              <p id="explore-lock-reason" className="explore-lock-reason">
                {definition.exploreLockedReason ??
                  "Explore opens after the first guided action. It uses the same rules and keeps this record."}
              </p>
            )}
          </div>
        </header>

        <div className="lab-save-strip">
          <output>{notice}</output>
          <span>{online ? "Local save ready" : "Offline · local save active"}</span>
        </div>

        <div className="lab-workspace">
          <section className="lab-simulation" aria-labelledby="current-guided-question">
            <div className="lab-stage-heading">
              <div>
                <p className="label-mono">
                  {mode === "guided"
                    ? `Stage ${Math.min(state.guidedStep + 1, definition.stages.length)} of ${definition.stages.length}`
                    : "Explore the same rules"}
                </p>
                <h2 id="current-guided-question">
                  {mode === "guided"
                    ? (stage?.question ?? definition.lab.centralQuestion)
                    : "Which changed condition alters the record?"}
                </h2>
              </div>
              <ol
                className="lab-step-progress"
                aria-label={`Guided progress: ${state.guidedStep} of ${definition.stages.length}`}
              >
                {definition.stages.map((item, index) => (
                  <li
                    key={item.question}
                    data-complete={index < state.guidedStep}
                    aria-current={index === state.guidedStep ? "step" : undefined}
                  >
                    <span className="sr-only">Stage {index + 1}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lab-action-dock">
              <div>
                <p className="evidence-kind">Current action</p>
                <p>
                  {mode === "guided"
                    ? (stage?.why ?? "Review the complete record.")
                    : "Explore actions preserve your guided record and use the same rules."}
                </p>
              </div>
              {mode === "guided" && stageControl ? (
                <div className="stage-options">
                  <p>{stageControl.prompt}</p>
                  {stageControl.options.map((option) => (
                    <button
                      key={option.action.id}
                      type="button"
                      className={
                        stageControl.kind === "single"
                          ? "button-primary"
                          : "button-secondary"
                      }
                      disabled={option.disabled}
                      onClick={() => dispatch(option.action)}
                    >
                      {option.label}
                      {option.disabled && option.reason ? ` — ${option.reason}` : ""}
                    </button>
                  ))}
                </div>
              ) : mode === "guided" &&
                needsLocalPrediction &&
                !localPredictionChosen ? (
                <div className="stage-options">
                  <p>Before the consequence, what do you expect?</p>
                  {[
                    ["change", "I expect a visible change"],
                    ["still", "I expect no visible change"],
                    ["unsure", "I am not sure yet"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className="button-secondary"
                      onClick={() =>
                        persist({
                          localPredictionIds: [
                            ...(session?.localPredictionIds ?? []),
                            `${localPredictionKey}${id}`,
                          ],
                        })
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : mode === "guided" && nextGuidedAction ? (
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => dispatch(nextGuidedAction)}
                >
                  {nextGuidedAction.label} →
                </button>
              ) : mode === "explore" ? (
                <div className="explore-actions">
                  {definition.exploreActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="button-secondary"
                      onClick={() => dispatch(action)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="label-mono">Guided record complete</span>
              )}
            </div>

            <Visual state={state} metrics={metrics} />
            <details className="structured-market-record">
              <summary>Read the structured simulation record</summary>
              {observations.length ? (
                <ol>
                  {observations.map((observation) => (
                    <li key={observation.id}>
                      <strong>{observation.title}.</strong> {observation.detail}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No observation yet. Use the current action to create one.</p>
              )}
            </details>
          </section>

          <aside className="lab-evidence-rail" aria-label="Evidence and change summary">
            <section>
              <p className="evidence-kind">simulation observation</p>
              <h2>What changed</h2>
              <p>
                {change?.detail ??
                  "Nothing yet. The first action creates a visible observation."}
              </p>
            </section>
            <section className="guided-metrics" aria-label="Simulation metrics">
              {metrics.cards.map((card) => (
                <div key={card.label}>
                  <span>{card.label}</span>
                  <strong>{card.value}</strong>
                  {card.detail ? <small>{card.detail}</small> : null}
                </div>
              ))}
            </section>
            <section className="role-explanation">
              <p className="evidence-kind">concept</p>
              {revealedConcept ? (
                <>
                  <h3>{revealedConcept.concept}</h3>
                  <p>{revealedConcept.why}</p>
                </>
              ) : (
                <>
                  <h3>Concept waits</h3>
                  <p>
                    The name of the concept stays hidden until you write an initial
                    interpretation, or until you ask to see it.
                  </p>
                  {state.guidedStep > 0 ? (
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        if (!wroteInterpretation)
                          persist({ conceptRevealedEarly: true });
                      }}
                    >
                      Show the concept now
                    </button>
                  ) : null}
                </>
              )}
            </section>
            <section className="role-source">
              <p className="evidence-kind">source claim</p>
              <p>{definition.sourceClaim}</p>
              <a href={definition.sourceHref ?? "/sources#mises-human-action-action"}>
                Open the source for this claim →
              </a>
            </section>
            <section>
              <p className="evidence-kind">credible counterargument</p>
              <p>{definition.counterargument}</p>
            </section>
          </aside>
        </div>

        <LabReflection
          initialReasoning={session?.initialReasoning ?? ""}
          revision={session?.revision ?? ""}
          reflection={session?.reflection ?? ""}
          evidence={observations.map((observation, index) => ({
            id: observation.id,
            title: observation.title,
            detail: observation.detail,
            latest: index === observations.length - 1,
          }))}
          selectedEvidenceIds={session?.selectedEvidenceIds ?? []}
          assumptions={definition.assumptions}
          acknowledgedAssumptionIds={session?.acknowledgedAssumptionIds ?? []}
          selfReviewChecks={session?.selfReviewChecks ?? []}
          reviewChecks={SELF_REVIEW_CHECKS}
          feedback={feedback}
          conceptVisible={conceptVisible}
          offerComparison={wroteInterpretation && !conceptOpenedEarly}
          onShowConcept={() => {
            if (!wroteInterpretation) persist({ conceptRevealedEarly: true });
          }}
          onContinueInitial={() => setSkipInitial(true)}
          onContinueEvidence={() => setSkipEvidence(true)}
          onContinueLimits={() => setSkipLimits(true)}
          showEvidence={showEvidence}
          showLimits={showLimits}
          showRevision={showRevision}
          onWriting={setWriting}
          onToggle={toggleList}
          onSelfReview={runSelfReview}
          reflectionPrompt={definition.reflectionPrompt}
          reviewOpen={state.completed || Boolean(session?.completedAt)}
          guide={
            !online && shouldRenderGuide ? (
              <section className="guide-card lab-guide" aria-live="polite">
                <p className="label-mono">Optional · unavailable offline</p>
                <h3>The optional guide is unavailable offline</h3>
                <p>
                  You are offline. The self-review remains available, and your writing
                  stays saved in this browser. {LOCAL_RECORD_NOTE}
                </p>
              </section>
            ) : shouldRenderGuide ? (
              <OptionalGuide
                labSlug={definition.lab.slug}
                reasoning={session?.revision || session?.initialReasoning || ""}
                observationIds={
                  session?.selectedEvidenceIds ?? observations.map((item) => item.id)
                }
                actionIds={(session?.actionLog ?? []).map((action) =>
                  String(action.id ?? ""),
                )}
                assumptionIds={session?.acknowledgedAssumptionIds ?? []}
                turn={guideTurn}
                onTurn={onGuideTurn}
              />
            ) : (
              <section className="guide-card lab-guide">
                <p className="label-mono">Optional · source-grounded</p>
                <h3>The optional guide waits for your first interpretation</h3>
                <p>
                  Write your own view first. The guide can ask one question from the
                  sources for this lab. It does not grade you.
                </p>
              </section>
            )
          }
          actions={
            <div className="lab-inline-actions">
              <button type="button" className="button-primary" onClick={complete}>
                Save reflection to Notebook
              </button>
              <button type="button" className="button-secondary" onClick={share}>
                Copy simulation share link
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={exportMarkdown}
                disabled={!session}
              >
                Download Markdown
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={() => window.print()}
              >
                Print learning record
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={exportCard}
                disabled={!session}
              >
                Download reflection card
              </button>
              <button type="button" className="text-button" onClick={reset}>
                Reset Lab
              </button>
              <p className="local-record-note">{LOCAL_RECORD_NOTE}</p>
            </div>
          }
          nextStep={
            showNext ? (
              <p className="next-activity">
                <Link href={nextActivity.href}>{nextActivity.label} →</Link>
              </p>
            ) : null
          }
        />

        <footer className="lab-viewpoint">
          <p className="label-mono">Viewpoint boundary</p>
          <p>
            Praxeos uses simplified models with fixed rules so choices and consequences
            can be inspected. A simulation observation is not a universal fact, an
            assumption is not evidence, a source claim needs a locator, an Austrian
            interpretation is one argument, and credible counterarguments belong beside
            it.
          </p>
        </footer>
      </div>
    </SiteChrome>
  );
}

function replay<
  State extends GuidedState,
  Action extends GuidedAction,
  Assumptions extends object,
>(
  definition: GuidedLabDefinition<State, Action, Assumptions>,
  assumptions: Assumptions,
  actions: readonly Action[],
): State {
  return actions.reduce(
    (current, action) => definition.engine.reduce(current, action),
    definition.engine.create(definition.seed, assumptions),
  );
}

function sessionFromState<
  State extends GuidedState,
  Action extends GuidedAction,
  Assumptions extends object,
>(
  definition: GuidedLabDefinition<State, Action, Assumptions>,
  state: State,
  actions: readonly Action[],
  mode: LabMode,
): StoredLabSession {
  const now = new Date().toISOString();
  return {
    ...emptyLabSession(definition.lab.slug, now, state.seed),
    mode,
    guidedStep: state.guidedStep,
    assumptions: asRecord(definition.defaultAssumptions),
    actionLog: actions.map(asRecord),
    state: asRecord(state),
  };
}

function asRecord(value: object): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function assumptionsFromState<State extends GuidedState, Assumptions extends object>(
  state: State,
  fallback: Assumptions,
) {
  const value = (state as State & { assumptions?: object }).assumptions;
  return asRecord(value ?? fallback);
}

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
