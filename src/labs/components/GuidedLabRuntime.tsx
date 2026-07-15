"use client";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { OptionalGuide } from "@/labs/components/OptionalGuide";
import { evaluateSelfReview } from "@/labs/feedback";
import { decodeShareEnvelope, encodeShareEnvelope } from "@/labs/share";
import type {
  LabEngine,
  LabExplanation,
  LabMode,
  LabRegistryEntry,
  RubricFeedback,
} from "@/labs/types";
import type { GuideTurn } from "@/lib/guide/types";
import {
  type StoredLabSession,
  activeLabSession,
  emptyLabSession,
  labSessionToMarkdown,
  upsertLabSession,
} from "@/lib/learning-store";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  counterargument: string;
  reflectionPrompt: string;
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
  const searchParams = useSearchParams();
  const { store, update, hydrated } = usePraxeosStore();
  const initialized = useRef(false);
  const [mode, setMode] = useState<LabMode>(
    searchParams.get("mode") === "explore" ? "explore" : "guided",
  );
  const [state, setState] = useState<State>(() =>
    definition.engine.create(definition.seed, definition.defaultAssumptions),
  );
  const [session, setSession] = useState<StoredLabSession | null>(null);
  const [change, setChange] = useState<LabExplanation | null>(null);
  const [feedback, setFeedback] = useState<RubricFeedback[]>([]);
  const [notice, setNotice] = useState("Loading your local Lab record…");
  const [online, setOnline] = useState(true);

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
    const shared = searchParams.get("share");
    if (shared) {
      const decoded = decodeShareEnvelope(shared, definition.lab.slug);
      if (!decoded.ok) {
        setNotice(
          `That share link was ${decoded.reason}. A fresh deterministic session is ready.`,
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
  }, [definition, hydrated, searchParams, store]);

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
    setNotice("Reset complete. A fresh deterministic session is ready.");
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
    setNotice("Share link copied. It contains simulation IDs only—no learner prose.");
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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f0e6"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#b8ad97"/><text x="85" y="115" fill="#8b3a3a" font-family="monospace" font-size="20" letter-spacing="3">PRAXEOS · ${title}</text><foreignObject x="85" y="165" width="1000" height="310"><div xmlns="http://www.w3.org/1999/xhtml" style="font: 48px/1.12 Georgia,serif;color:#1c1814">${text}</div></foreignObject><text x="85" y="540" fill="#5c5348" font-family="monospace" font-size="18">Evidence: ${session.selectedEvidenceIds.length} · assumptions: ${session.acknowledgedAssumptionIds.length} · no semantic score</text></svg>`;
    downloadFile(`praxeos-${definition.lab.slug}-reflection.svg`, svg, "image/svg+xml");
  };

  const Visual = definition.Visual;
  const observations = state.observations.slice(-8);
  const conceptIndex = Math.max(
    0,
    Math.min(state.guidedStep - 1, definition.stages.length - 1),
  );
  const revealedConcept = state.guidedStep > 0 ? definition.stages[conceptIndex] : null;
  const guideTurn = session?.guideTurn ?? null;
  const onGuideTurn = (turn: GuideTurn) => persist({ guideTurn: turn });

  if (!hydrated) {
    return <output className="lab-loading-state">Restoring this local Lab…</output>;
  }

  return (
    <SiteChrome>
      <main className={`guided-lab guided-lab--${definition.lab.accent}`}>
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
                onClick={() => switchMode("explore")}
              >
                Explore
              </button>
            </div>
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
                    : "Explore the same deterministic environment"}
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
              {mode === "guided" && nextGuidedAction ? (
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
            <section>
              <p className="evidence-kind">concept reveal</p>
              <h3>{revealedConcept ? revealedConcept.concept : "Experience first"}</h3>
              <p>
                {revealedConcept
                  ? revealedConcept.why
                  : "Praxeos names the concept only after the first consequence."}
              </p>
            </section>
            <section>
              <p className="evidence-kind">source claim</p>
              <p>{definition.sourceClaim}</p>
              <a href="/sources">Open the source packet →</a>
            </section>
            <section>
              <p className="evidence-kind">credible counterargument</p>
              <p>{definition.counterargument}</p>
            </section>
          </aside>
        </div>

        <section className="lab-interpretation page-section">
          <header>
            <p className="label-mono">Interpret · select · compare</p>
            <h2>What does the record support—and what can’t it settle?</h2>
            <p>
              Praxeos checks completion, explicitly selected observations, acknowledged
              assumptions, revision, and the visible checklist. It does not grade the
              meaning or ideology of your conclusion.
            </p>
          </header>

          <div className="lab-reasoning-grid">
            <label>
              <span>Initial interpretation</span>
              <textarea
                value={session?.initialReasoning ?? ""}
                onChange={(event) => setWriting("initialReasoning", event.target.value)}
                placeholder="What do you think happened, and which visible event shaped that view?"
              />
            </label>
            <fieldset>
              <legend>Select visible simulation evidence</legend>
              {observations.length ? (
                observations.map((observation) => (
                  <label key={observation.id} className="lab-check-row">
                    <input
                      type="checkbox"
                      checked={(session?.selectedEvidenceIds ?? []).includes(
                        observation.id,
                      )}
                      onChange={() => toggleList("selectedEvidenceIds", observation.id)}
                    />
                    <span>{observation.title}</span>
                  </label>
                ))
              ) : (
                <p>Complete an action before selecting evidence.</p>
              )}
            </fieldset>
            <fieldset>
              <legend>Acknowledge a model assumption</legend>
              {definition.assumptions.map((assumption) => (
                <label key={assumption.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={(session?.acknowledgedAssumptionIds ?? []).includes(
                      assumption.id,
                    )}
                    onChange={() =>
                      toggleList("acknowledgedAssumptionIds", assumption.id)
                    }
                  />
                  <span>{assumption.label}</span>
                </label>
              ))}
            </fieldset>
            <label>
              <span>Revision or explicit confirmation</span>
              <textarea
                value={session?.revision ?? ""}
                onChange={(event) => setWriting("revision", event.target.value)}
                placeholder="After reviewing evidence and assumptions, what changes—or stays the same?"
              />
            </label>
            <fieldset>
              <legend>Transparent self-review checklist</legend>
              {SELF_REVIEW_CHECKS.map((check) => (
                <label key={check.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={(session?.selfReviewChecks ?? []).includes(check.id)}
                    onChange={() => toggleList("selfReviewChecks", check.id)}
                  />
                  <span>{check.label}</span>
                </label>
              ))}
            </fieldset>
          </div>

          <div className="lab-inline-actions">
            <button type="button" className="button-primary" onClick={runSelfReview}>
              Run transparent self-review
            </button>
          </div>
          {feedback.length ? (
            <output className="self-review-results">
              {feedback.map((item) => (
                <article key={item.id}>
                  <p className="label-mono">{item.status}</p>
                  <p>{item.message}</p>
                  <small>Based on: {item.basedOn}</small>
                </article>
              ))}
            </output>
          ) : null}

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

          <div className="lab-completion-grid">
            <label>
              <span>Final reflection</span>
              <textarea
                value={session?.reflection ?? ""}
                onChange={(event) => setWriting("reflection", event.target.value)}
                placeholder={definition.reflectionPrompt}
              />
            </label>
            <div>
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
            </div>
          </div>
        </section>

        <footer className="lab-viewpoint">
          <p className="label-mono">Viewpoint boundary</p>
          <p>
            Praxeos uses simplified deterministic models to make choices and
            consequences inspectable. A simulation observation is not a universal fact,
            an assumption is not evidence, a source claim needs a locator, an Austrian
            interpretation is one argument, and credible counterarguments belong beside
            it.
          </p>
        </footer>
      </main>
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
