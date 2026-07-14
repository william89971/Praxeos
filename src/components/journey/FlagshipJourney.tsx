"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import type { GuideTurn } from "@/lib/guide/types";
import {
  type JourneyRecord,
  type LabState,
  journeyToMarkdown,
  serializeShareState,
} from "@/lib/learning-store";
import {
  type ReasoningField,
  evaluateReasoning,
  evaluateReasoningSet,
} from "@/lib/reasoning-rubric";
import { useEffect, useMemo, useRef, useState } from "react";

const STAGES = [
  "Brief",
  "Structure",
  "Tradeoff",
  "With prices",
  "Without prices",
  "Revise",
  "Reflect",
];

const PRICED_OPTIONS = [
  {
    id: "hall",
    label: "Use the school hall",
    detail: "$250 · 2 volunteer-hours",
    waste: 8,
  },
  {
    id: "gym",
    label: "Use the larger gym",
    detail: "$540 · 5 volunteer-hours",
    waste: 18,
  },
  {
    id: "field",
    label: "Use the outdoor field",
    detail: "$120 · 7 volunteer-hours",
    waste: 12,
  },
  {
    id: "local-food",
    label: "Book local food carts",
    detail: "$430 · 3 volunteer-hours",
    waste: 9,
  },
  {
    id: "caterer",
    label: "Book a full caterer",
    detail: "$790 · 2 volunteer-hours",
    waste: 29,
  },
  {
    id: "student-stalls",
    label: "Run student food stalls",
    detail: "$260 · 9 volunteer-hours",
    waste: 13,
  },
] as const;

const UNPRICED_OPTIONS = PRICED_OPTIONS.map(({ id, label, waste }) => ({
  id,
  label,
  waste,
}));

export function FlagshipJourney() {
  const { store, update, hydrated, resetJourney } = usePraxeosStore();
  const record = store.journey;
  const [announcement, setAnnouncement] = useState("");
  const [guideBusy, setGuideBusy] = useState(false);
  const [guideError, setGuideError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const save = (patch: Partial<JourneyRecord>) => {
    update((current) => ({
      ...current,
      journey: { ...current.journey, ...patch, updatedAt: new Date().toISOString() },
    }));
  };

  const go = (stage: number) => {
    save({ stage });
    setAnnouncement(`Stage ${stage} of 7: ${STAGES[stage - 1]}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requestGuide = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setGuideBusy(true);
    setGuideError("");
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          reasoning: record.revision || record.initial.interpretation,
          labState: record.unpricedRun ?? record.pricedRun,
        }),
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(
          response.status === 429
            ? "The Guide is resting. Try again after the shown wait."
            : "Guide request failed.",
        );
      const turn = (await response.json()) as GuideTurn;
      save({
        guide: turn,
        citations: turn.citations.map(
          (citation) => `${citation.title} — ${citation.locator} — ${citation.url}`,
        ),
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setGuideError(
          navigator.onLine
            ? (error as Error).message
            : "You are offline. Deterministic feedback remains available.",
        );
      }
    } finally {
      setGuideBusy(false);
    }
  };

  if (!hydrated)
    return <p className="journey-loading">Opening your private local notebook…</p>;

  return (
    <div className="journey-shell">
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <JourneyHeader stage={record.stage} />
      <main className="journey-stage" id="journey-stage" tabIndex={-1}>
        {record.stage === 1 ? <BriefStage onContinue={() => go(2)} /> : null}
        {record.stage === 2 ? (
          <StructureStage
            record={record}
            save={save}
            onBack={() => go(1)}
            onContinue={() => go(3)}
          />
        ) : null}
        {record.stage === 3 ? (
          <TradeoffStage
            record={record}
            save={save}
            onBack={() => go(2)}
            onContinue={() => go(4)}
          />
        ) : null}
        {record.stage === 4 ? (
          <LabStage
            priced
            record={record}
            save={save}
            onBack={() => go(3)}
            onContinue={() => go(5)}
            setAnnouncement={setAnnouncement}
          />
        ) : null}
        {record.stage === 5 ? (
          <LabStage
            priced={false}
            record={record}
            save={save}
            onBack={() => go(4)}
            onContinue={() => go(6)}
            setAnnouncement={setAnnouncement}
          />
        ) : null}
        {record.stage === 6 ? (
          <ReviseStage
            record={record}
            save={save}
            onBack={() => go(5)}
            onContinue={() => go(7)}
            requestGuide={requestGuide}
            guideBusy={guideBusy}
            guideError={guideError}
            cancelGuide={() => abortRef.current?.abort()}
          />
        ) : null}
        {record.stage === 7 ? (
          <ReflectStage
            record={record}
            save={save}
            onBack={() => go(6)}
            onContinue={() => {}}
            reset={resetJourney}
          />
        ) : null}
      </main>
    </div>
  );
}

function JourneyHeader({ stage }: { stage: number }) {
  return (
    <header className="journey-header">
      <div>
        <p className="label-mono">Flagship journey · 7–10 minutes</p>
        <h1>The Calculation Labyrinth</h1>
      </div>
      <ol aria-label="Journey progress" className="journey-progress">
        {STAGES.map((label, index) => (
          <li
            key={label}
            aria-current={stage === index + 1 ? "step" : undefined}
            data-complete={stage > index + 1}
          >
            <span>{index + 1}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>
    </header>
  );
}

function BriefStage({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="journey-copy">
      <p className="label-mono">The brief</p>
      <h2>A school event. Two scarce resources. No single correct plan.</h2>
      <p>
        Your student team is planning a welcoming evening for families. You have a{" "}
        <strong>$1,200 budget</strong> and <strong>20 volunteer-hours</strong>. Space,
        food, music, signs, and accessibility all compete for those means.
      </p>
      <aside className="scenario-ledger" aria-label="Available means">
        <div>
          <strong>$1,200</strong>
          <span>money budget</span>
        </div>
        <div>
          <strong>20 h</strong>
          <span>volunteer time</span>
        </div>
        <div>
          <strong>1 evening</strong>
          <span>shared end</span>
        </div>
      </aside>
      <p className="journey-note">
        Your writing stays in this browser. It is never placed in a share URL or sent to
        the Guide unless you explicitly ask.
      </p>
      <StageActions primary="Identify the choice" onPrimary={onContinue} />
    </section>
  );
}

function StructureStage({ record, save, onBack, onContinue }: StageProps) {
  const fields: Array<[ReasoningField, string, string]> = [
    ["actor", "Actor", "Who is choosing?"],
    ["end", "End", "What improved state are they trying to reach?"],
    ["means", "Means", "Which resources can they use?"],
  ];
  const ready = fields.every(
    ([field]) =>
      evaluateReasoning(field, record.initial[field] ?? "").status ===
      "ready to revise",
  );
  return (
    <section className="journey-copy">
      <p className="label-mono">Structure before judgment</p>
      <h2>Describe the action in your own terms.</h2>
      <p>
        Multiple interpretations can be defensible. The rubric checks for a concept and
        scenario evidence; it does not compare you with a hidden model answer.
      </p>
      <div className="reasoning-fields">
        {fields.map(([field, label, prompt]) => (
          <ReasoningFieldInput
            key={field}
            field={field}
            label={label}
            prompt={prompt}
            value={record.initial[field] ?? ""}
            onChange={(value) =>
              save({ initial: { ...record.initial, [field]: value } })
            }
          />
        ))}
      </div>
      <StageActions
        primary="Continue to tradeoffs"
        onPrimary={onContinue}
        primaryDisabled={!ready}
        onBack={onBack}
      />
    </section>
  );
}

function TradeoffStage({ record, save, onBack, onContinue }: StageProps) {
  const fields: Array<[ReasoningField, string, string]> = [
    ["constraint", "Constraint", "What limits the team’s options?"],
    ["opportunityCost", "Opportunity cost", "What is the best forgone alternative?"],
    [
      "interpretation",
      "Initial interpretation",
      "What do you expect prices to change in the maze?",
    ],
  ];
  const feedback = evaluateReasoningSet(record.initial);
  const ready = fields.every(
    ([field]) =>
      feedback.find((item) => item.field === field)?.status === "ready to revise",
  );
  return (
    <section className="journey-copy">
      <p className="label-mono">Constraint and cost</p>
      <h2>Make your prediction before the simulation.</h2>
      <div className="reasoning-fields">
        {fields.map(([field, label, prompt]) => (
          <ReasoningFieldInput
            key={field}
            field={field}
            label={label}
            prompt={prompt}
            value={record.initial[field] ?? ""}
            onChange={(value) =>
              save({ initial: { ...record.initial, [field]: value }, feedback })
            }
          />
        ))}
      </div>
      <StageActions
        primary="Enter the priced maze"
        onPrimary={() => {
          save({ feedback });
          onContinue();
        }}
        primaryDisabled={!ready}
        onBack={onBack}
      />
    </section>
  );
}

function ReasoningFieldInput({
  field,
  label,
  prompt,
  value,
  onChange,
}: {
  field: ReasoningField;
  label: string;
  prompt: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const feedback = evaluateReasoning(field, value);
  return (
    <label className="reasoning-field">
      <span>
        <strong>{label}</strong>
        <small>{prompt}</small>
      </span>
      <textarea
        rows={3}
        maxLength={600}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={`${field}-feedback`}
      />
      {value ? (
        <span
          id={`${field}-feedback`}
          className={`rubric-status rubric-${feedback.status.replaceAll(" ", "-")}`}
        >
          <strong>{feedback.status}</strong> · {feedback.message}
        </span>
      ) : null}
    </label>
  );
}

function LabStage({
  priced,
  record,
  save,
  onBack,
  onContinue,
  setAnnouncement,
}: StageProps & { priced: boolean; setAnnouncement: (value: string) => void }) {
  const saved = priced ? record.pricedRun : record.unpricedRun;
  const [selected, setSelected] = useState<string[]>(
    saved?.path ? [...saved.path] : [],
  );
  const options = priced ? PRICED_OPTIONS : UNPRICED_OPTIONS;
  const complete = selected.length === 2;
  const summary = useMemo(() => calculateRun(priced, selected), [priced, selected]);
  const choose = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : selected.length < 2
        ? [...selected, id]
        : [selected[1] ?? id, id];
    setSelected(next);
    setAnnouncement(
      `${priced ? "Priced" : "Unpriced"} plan now uses ${next.length} of 2 choices. ${calculateRun(priced, next).waste}% estimated waste.`,
    );
  };
  const commit = () => {
    const patch = priced ? { pricedRun: summary } : { unpricedRun: summary };
    save(patch);
    onContinue();
  };
  return (
    <section className="lab-stage">
      <div className="lab-brief">
        <p className="label-mono">
          {priced
            ? "Run one · price markers visible"
            : "Run two · price markers removed"}
        </p>
        <h2>
          {priced
            ? "Choose two elements while prices make tradeoffs legible."
            : "Choose again with the same resources but no price markers."}
        </h2>
        <p>
          {priced
            ? "Each marker compresses cost information into a comparable form. There is still no automatic best plan."
            : "The labels remain, but the common comparison unit is gone. Notice how you decide and how certain you feel."}
        </p>
      </div>
      <fieldset className="lab-grid">
        <legend className="sr-only">
          {priced ? "Priced plan choices" : "Unpriced plan choices"}
        </legend>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="maze-cell"
            aria-pressed={selected.includes(option.id)}
            onClick={() => choose(option.id)}
          >
            <span>{option.label}</span>
            <small>
              {"detail" in option ? option.detail : "Resource requirement unknown"}
            </small>
          </button>
        ))}
      </fieldset>
      <aside className="lab-summary" aria-live="polite">
        <div>
          <strong>{summary.waste}%</strong>
          <span>estimated waste</span>
        </div>
        <div>
          <strong>{summary.uncertainty}%</strong>
          <span>decision uncertainty</span>
        </div>
        <div>
          <strong>{selected.length}/2</strong>
          <span>path choices</span>
        </div>
      </aside>
      <details className="noncanvas-equivalent">
        <summary>Read the complete non-visual state</summary>
        <p>
          You selected{" "}
          {selected.length
            ? selected
                .map((id) => options.find((item) => item.id === id)?.label)
                .join(" and ")
            : "nothing yet"}
          . The deterministic model reports {summary.waste}% waste and{" "}
          {summary.uncertainty}% uncertainty. These values come from the same rules used
          by the visual grid.
        </p>
      </details>
      <StageActions
        primary={priced ? "Save run and remove prices" : "Compare both runs"}
        onPrimary={commit}
        primaryDisabled={!complete}
        onBack={onBack}
      />
    </section>
  );
}

function ReviseStage({
  record,
  save,
  onBack,
  onContinue,
  requestGuide,
  guideBusy,
  guideError,
  cancelGuide,
}: StageProps & {
  requestGuide: () => void;
  guideBusy: boolean;
  guideError: string;
  cancelGuide: () => void;
}) {
  const initialFeedback = evaluateReasoning(
    "interpretation",
    record.initial.interpretation ?? "",
  );
  const revisionFeedback = evaluateReasoning("interpretation", record.revision);
  return (
    <section className="journey-copy">
      <p className="label-mono">Compare and revise</p>
      <h2>
        The run does not grade your conclusion. It gives your reasoning something to
        answer to.
      </h2>
      <div className="compare-panel">
        <article>
          <span>With prices</span>
          <strong>
            {record.pricedRun?.waste ?? 0}% waste · {record.pricedRun?.uncertainty ?? 0}
            % uncertainty
          </strong>
        </article>
        <article>
          <span>Without prices</span>
          <strong>
            {record.unpricedRun?.waste ?? 0}% waste ·{" "}
            {record.unpricedRun?.uncertainty ?? 0}% uncertainty
          </strong>
        </article>
      </div>
      <blockquote className="initial-note">
        <strong>Your initial interpretation</strong>
        <p>{record.initial.interpretation}</p>
        <small>
          {initialFeedback.status} · {initialFeedback.message}
        </small>
      </blockquote>
      <label className="reasoning-field" htmlFor="journey-revision">
        <span>
          <strong>Revision</strong>
          <small>
            Use a path choice, waste comparison, or uncertainty change as evidence.
          </small>
        </span>
        <textarea
          id="journey-revision"
          rows={5}
          maxLength={1200}
          value={record.revision}
          onChange={(event) => save({ revision: event.target.value })}
        />
        <span
          className={`rubric-status rubric-${revisionFeedback.status.replaceAll(" ", "-")}`}
        >
          <strong>{revisionFeedback.status}</strong> · {revisionFeedback.message}
        </span>
      </label>
      <section className="guide-card" aria-labelledby="guide-title">
        <p className="label-mono">Optional · source-grounded</p>
        <h3 id="guide-title">Claude Guide</h3>
        <p>
          The Guide receives only this revision, normalized lab state, and three
          allowlisted source packets. Without a key—or if validation fails—the same
          button returns a deterministic Socratic prompt.
        </p>
        {record.guide ? <GuideResult turn={record.guide} /> : null}
        {guideError ? <p role="alert">{guideError}</p> : null}
        <div className="button-row">
          <button
            type="button"
            className="button-secondary"
            onClick={requestGuide}
            disabled={guideBusy || revisionFeedback.status !== "ready to revise"}
          >
            {guideBusy ? "Asking…" : record.guide ? "Ask again" : "Ask one question"}
          </button>
          {guideBusy ? (
            <button type="button" className="text-button" onClick={cancelGuide}>
              Cancel
            </button>
          ) : null}
        </div>
      </section>
      <StageActions
        primary="Write final reflection"
        onPrimary={onContinue}
        primaryDisabled={revisionFeedback.status !== "ready to revise"}
        onBack={onBack}
      />
    </section>
  );
}

function GuideResult({ turn }: { turn: GuideTurn }) {
  return (
    <div className="guide-result">
      <p className="guide-mode">
        {turn.providerMode === "claude"
          ? "Claude Sonnet 5 · citations validated"
          : "Deterministic fallback · fully available"}
      </p>
      {turn.blocks.map((block, index) => (
        <div key={`${block.category}-${index}`}>
          <strong>{block.category}</strong>
          <p>{block.text}</p>
          {block.citations.map((citation) => (
            <a
              key={citation.sourceId}
              href={citation.url}
              target="_blank"
              rel="noreferrer"
            >
              {citation.title}, {citation.locator}
            </a>
          ))}
        </div>
      ))}
      <p className="guide-question">{turn.question}</p>
      <details>
        <summary>Why this feedback?</summary>
        <p>{turn.whyThisFeedback}</p>
      </details>
    </div>
  );
}

function ReflectStage({
  record,
  save,
  onBack,
  reset,
}: StageProps & { reset: () => void }) {
  const complete = record.finalReflection.trim().length >= 24;
  const finish = () => save({ completedAt: new Date().toISOString() });
  const exportMarkdown = () =>
    downloadFile(
      "praxeos-calculation-labyrinth.md",
      journeyToMarkdown({
        ...record,
        completedAt: record.completedAt ?? new Date().toISOString(),
      }),
      "text/markdown",
    );
  const exportCard = () =>
    downloadFile(
      "praxeos-reflection-card.svg",
      reflectionCard(record.finalReflection),
      "image/svg+xml",
    );
  const share = async () => {
    const state = record.unpricedRun ?? record.pricedRun;
    if (!state) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("state", serializeShareState(state));
    await navigator.clipboard.writeText(url.href);
  };
  return (
    <section className="journey-copy print-record">
      <p className="label-mono">Final reflection</p>
      <h2>What can prices reveal—and what can they never decide for us?</h2>
      <div className="reasoning-field">
        <label htmlFor="final-reflection">
          <strong>Your reflection</strong>
          <small>Name one limit of the simulation as well as one insight.</small>
        </label>
        <textarea
          id="final-reflection"
          rows={6}
          maxLength={1600}
          value={record.finalReflection}
          onChange={(event) => save({ finalReflection: event.target.value })}
        />
      </div>
      {record.completedAt ? (
        <output className="completion-mark">
          Journey complete · saved locally{" "}
          {new Date(record.completedAt).toLocaleDateString()}
        </output>
      ) : (
        <button
          type="button"
          className="button-primary"
          disabled={!complete}
          onClick={finish}
        >
          Complete journey
        </button>
      )}
      <div className="export-grid">
        <button type="button" onClick={exportMarkdown}>
          Download Markdown
        </button>
        <button type="button" onClick={() => window.print()}>
          Print learning record
        </button>
        <button type="button" onClick={exportCard}>
          Download reflection card
        </button>
        <button type="button" onClick={share}>
          Copy non-sensitive lab link
        </button>
      </div>
      <p className="journey-note">
        The share link includes only price mode, path choices, waste, and uncertainty.
        Your writing and Guide response remain local.
      </p>
      <StageActions primary="Start a fresh attempt" onPrimary={reset} onBack={onBack} />
    </section>
  );
}

interface StageProps {
  record: JourneyRecord;
  save: (patch: Partial<JourneyRecord>) => void;
  onBack: () => void;
  onContinue: () => void;
}

function StageActions({
  primary,
  onPrimary,
  primaryDisabled,
  onBack,
}: {
  primary: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="stage-actions">
      {onBack ? (
        <button type="button" className="text-button" onClick={onBack}>
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        className="button-primary"
        onClick={onPrimary}
        disabled={primaryDisabled}
      >
        {primary}
      </button>
    </div>
  );
}

function calculateRun(priced: boolean, selected: string[]): LabState {
  const wasteBase = selected.reduce(
    (total, id) => total + (PRICED_OPTIONS.find((item) => item.id === id)?.waste ?? 0),
    0,
  );
  return {
    priced,
    path: selected,
    waste: Math.min(99, wasteBase + (priced ? 0 : 22)),
    uncertainty: Math.min(99, 16 + selected.length * 5 + (priced ? 0 : 47)),
  };
}

function downloadFile(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function reflectionCard(text: string) {
  const escaped = text
    .replace(
      /[<>&]/g,
      (character) =>
        ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[character] ?? character,
    )
    .slice(0, 420);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f0e6"/><path d="M70 90H1130M70 540H1130" stroke="#b8ad97"/><text x="70" y="62" font-family="Georgia" font-size="24" fill="#8b3a3a">PRAXEOS · CALCULATION LABYRINTH</text><foreignObject x="70" y="125" width="1060" height="380"><div xmlns="http://www.w3.org/1999/xhtml" style="font:42px/1.25 Georgia;color:#1c1814">${escaped}</div></foreignObject><text x="70" y="585" font-family="Arial" font-size="18" fill="#5c5348">A learning record, not a score.</text></svg>`;
}
