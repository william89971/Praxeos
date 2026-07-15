"use client";

import { SiteChrome } from "@/components/layout/SiteChrome";
import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { OptionalGuide } from "@/labs/components/OptionalGuide";
import { evaluateSelfReview } from "@/labs/feedback";
import { decodeShareEnvelope, encodeShareEnvelope } from "@/labs/share";
import type { LabMode, RubricFeedback } from "@/labs/types";
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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_MARKET_ASSUMPTIONS,
  MARKET_EXPLORE_ACTIONS,
  MARKET_GUIDED_ACTIONS,
  type MarketAction,
  type MarketAssumptions,
  type MarketEvent,
  type MarketState,
  marketActionById,
  marketEngine,
  replayMarket,
} from "./engine";

const LAB_SLUG = "market-without-a-manager" as const;
const SEED = "market-2026";

const STAGES = [
  {
    question: "Who is here—and what does each person control?",
    action: "Meet the participants",
    why: "Coordination begins from separate people, goods, and plans.",
  },
  {
    question: "Do their first priorities line up?",
    action: "Inspect ranked priorities",
    why: "A trade needs more than goods; it needs compatible rankings at that moment.",
  },
  {
    question: "Can Ada barter directly for cloth?",
    action: "Attempt the barter",
    why: "Direct exchange can stall when the other person does not want what is offered.",
  },
  {
    question: "What changes if a widely accepted middle good appears?",
    action: "Introduce money",
    why: "Indirect exchange can separate selling from buying.",
  },
  {
    question: "Does any monetary offer become a price?",
    action: "Offer 2 tokens for bread",
    why: "An unaccepted offer is information, but it is not a completed-trade price.",
  },
  {
    question: "What records the first bread price?",
    action: "Offer 4 tokens for bread",
    why: "Only a completed monetary exchange enters the displayed price record.",
  },
  {
    question: "What if a useful partner never sees the offer?",
    action: "Limit information",
    why: "A possible trade can remain missed even when it would have improved both plans.",
  },
  {
    question: "What changes when bread becomes scarcer?",
    action: "Remove one loaf",
    why: "Supply, remaining wants, and acceptable offers change together.",
  },
  {
    question: "Can a price ceiling create the missing loaf?",
    action: "Set a 2-token ceiling",
    why: "The rule changes transactions, while the remaining inventory stays scarce.",
  },
  {
    question: "What coordinated—and what remained unresolved?",
    action: "Open interpretation",
    why: "The event record supports several defensible interpretations and explicit limits.",
  },
] as const;

const ASSUMPTIONS = [
  {
    id: "five-participants",
    label: "Only five participants and five goods exist in this model.",
  },
  {
    id: "ranked-priorities",
    label:
      "Priorities are ordinal, momentary, and change only through programmed actions.",
  },
  {
    id: "fixed-reserves",
    label:
      "Minimum acceptable offers are simplified participant rules, not measured values.",
  },
  {
    id: "full-ceiling-enforcement",
    label:
      "The ceiling is fully enforced; queues, quality changes, and evasion are omitted.",
  },
] as const;

const SELF_REVIEW_CHECKS = [
  {
    id: "compare-responses",
    label: "I compared the initial response with the revision or confirmation.",
  },
  {
    id: "trace-evidence",
    label: "I can point to the selected event that most affected my comparison.",
  },
  {
    id: "state-limit",
    label: "I named at least one assumption that limits what the simulation can show.",
  },
] as const;

export default function MarketLab() {
  const searchParams = useSearchParams();
  const { store, update, hydrated } = usePraxeosStore();
  const initialized = useRef(false);
  const [mode, setMode] = useState<LabMode>(
    searchParams.get("mode") === "explore" ? "explore" : "guided",
  );
  const [state, setState] = useState<MarketState>(() =>
    marketEngine.create(SEED, DEFAULT_MARKET_ASSUMPTIONS),
  );
  const [session, setSession] = useState<StoredLabSession | null>(null);
  const [change, setChange] = useState<MarketEvent | null>(null);
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
      const decoded = decodeShareEnvelope(shared, LAB_SLUG);
      if (decoded.ok) {
        const actions = decoded.envelope.actionIds.flatMap((id) => {
          const action = marketActionById(id);
          return action ? [action] : [];
        });
        const restored = replayMarket(
          decoded.envelope.seed,
          DEFAULT_MARKET_ASSUMPTIONS,
          actions,
        );
        const fresh = sessionFromState(restored, actions, decoded.envelope.mode);
        setState(restored);
        setSession(fresh);
        setMode(decoded.envelope.mode);
        setChange(restored.events.at(-1) ?? null);
        setNotice(
          "Shared simulation state restored. No learner writing was in the link.",
        );
        return;
      }
      setNotice(
        `That share link was ${decoded.reason}. A fresh deterministic session is ready.`,
      );
      return;
    }
    const stored = activeLabSession(store, LAB_SLUG);
    if (stored) {
      const actions = stored.actionLog.flatMap((entry) => {
        const action = marketActionById(String(entry.id ?? ""));
        return action ? [action] : [];
      });
      const assumptions = normalizeAssumptions(stored.assumptions);
      const restored = replayMarket(stored.seed, assumptions, actions);
      setState(restored);
      setSession({
        ...stored,
        state: asRecord(restored),
        guidedStep: restored.guidedStep,
      });
      setMode(stored.mode);
      setFeedback(stored.feedback);
      setChange(restored.events.at(-1) ?? null);
      setNotice("Saved Lab restored from this browser.");
      return;
    }
    setNotice(
      "Fresh guided session ready. Your first action will create a local record.",
    );
  }, [hydrated, searchParams, store]);

  const metrics = useMemo(() => marketEngine.derive(state), [state]);
  const nextGuidedAction = MARKET_GUIDED_ACTIONS[state.guidedStep];
  const stage = STAGES[Math.min(state.guidedStep, STAGES.length - 1)];
  const exploreUnlocked = state.guidedStep >= 3;

  const persist = useCallback(
    (patch: Partial<StoredLabSession>) => {
      setSession((current) => {
        const base =
          current ?? emptyLabSession(LAB_SLUG, new Date().toISOString(), state.seed);
        const next: StoredLabSession = {
          ...base,
          ...patch,
          labSlug: LAB_SLUG,
          version: 3,
          updatedAt: new Date().toISOString(),
        };
        update((currentStore) => upsertLabSession(currentStore, next));
        return next;
      });
      setNotice(online ? "Saved in this browser." : "Saved locally while offline.");
    },
    [online, state.seed, update],
  );

  const dispatch = (action: MarketAction) => {
    const previous = state;
    const next = marketEngine.reduce(previous, action);
    if (next === previous) {
      setNotice(
        "That action is unavailable under the current inventory or assumptions.",
      );
      return;
    }
    const nextActionLog = [...(session?.actionLog ?? []), asRecord(action)];
    setState(next);
    setChange(next.events.at(-1) ?? null);
    persist({
      mode,
      guidedStep: next.guidedStep,
      assumptions: asRecord(next.assumptions),
      actionLog: nextActionLog,
      state: asRecord(next),
    });
  };

  const switchMode = (nextMode: LabMode) => {
    if (nextMode === "explore" && !exploreUnlocked) return;
    setMode(nextMode);
    persist({ mode: nextMode });
  };

  const setReasoning = (
    field: "initialReasoning" | "revision" | "reflection",
    value: string,
  ) => {
    persist({ [field]: value });
  };

  const toggleEvidence = (id: string) => {
    const current = session?.selectedEvidenceIds ?? [];
    persist({
      selectedEvidenceIds: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const toggleAssumption = (id: string) => {
    const current = session?.acknowledgedAssumptionIds ?? [];
    persist({
      acknowledgedAssumptionIds: current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    });
  };

  const toggleSelfReview = (id: string) => {
    const current = session?.selfReviewChecks ?? [];
    persist({
      selfReviewChecks: current.includes(id)
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

  const complete = () => {
    persist({
      completedAt: new Date().toISOString(),
      reflection: session?.reflection ?? "",
    });
    setNotice("Completed and saved locally. You can still revise or explore.");
  };

  const reset = () => {
    if (
      !window.confirm(
        "Reset this Lab simulation? Saved writing will start a new local session.",
      )
    )
      return;
    const freshState = marketEngine.create(SEED, DEFAULT_MARKET_ASSUMPTIONS);
    const freshSession = sessionFromState(freshState, [], "guided");
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
      labSlug: LAB_SLUG,
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

  const exportMarkdown = () => {
    if (!session) return;
    downloadFile(
      "praxeos-market-without-a-manager.md",
      labSessionToMarkdown(session),
      "text/markdown",
    );
  };

  const exportCard = () => {
    if (!session) return;
    const text = escapeXml(
      session.revision ||
        session.initialReasoning ||
        "A market is a record of separate plans meeting.",
    );
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f5f0e6"/><rect x="40" y="40" width="1120" height="550" fill="none" stroke="#b8ad97"/><text x="85" y="115" fill="#8b3a3a" font-family="monospace" font-size="20" letter-spacing="3">PRAXEOS · MARKET WITHOUT A MANAGER</text><foreignObject x="85" y="165" width="1000" height="310"><div xmlns="http://www.w3.org/1999/xhtml" style="font: 52px/1.12 Georgia,serif;color:#1c1814">${text}</div></foreignObject><text x="85" y="540" fill="#5c5348" font-family="monospace" font-size="18">Selected evidence: ${session.selectedEvidenceIds.length} · assumptions: ${session.acknowledgedAssumptionIds.length} · no semantic score</text></svg>`;
    downloadFile("praxeos-market-reflection.svg", svg, "image/svg+xml");
  };

  const guideTurn = session?.guideTurn ?? null;
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
  const activeEventIds = state.events.slice(-6).map((event) => event.id);

  return (
    <SiteChrome>
      <main className="market-lab">
        <header className="lab-editorial-header">
          <div>
            <p className="label-mono">Flagship · 8–10 minutes · Lab 2 of 4</p>
            <h1>Market Without a Manager</h1>
            <p className="lab-editorial-header__question">
              How can strangers coordinate without one person directing them?
            </p>
          </div>
          <div className="lab-header-tools">
            <figure className="lab-header-cover">
              <Image
                src="/images/labs/market-without-a-manager.webp"
                width={1200}
                height={675}
                sizes="(max-width: 700px) 100vw, 22rem"
                alt="Cut-paper market with five participants exchanging bread, apples, tea, cloth, and a tool along completed and incomplete paths."
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
          <section className="lab-simulation" aria-labelledby="current-market-question">
            <div className="lab-stage-heading">
              <div>
                <p className="label-mono">
                  {mode === "guided"
                    ? `Stage ${Math.min(state.guidedStep + 1, 10)} of 10`
                    : "Explore the same market"}
                </p>
                <h2 id="current-market-question">
                  {mode === "guided"
                    ? stage?.question
                    : "Which change alters the event record?"}
                </h2>
              </div>
              <LabProgress step={state.guidedStep} />
            </div>

            <div className="lab-action-dock">
              <div>
                <p className="label-mono">Current action</p>
                <p>
                  {mode === "guided"
                    ? stage?.why
                    : "Explore actions reuse the same participant rules and inventory."}
                </p>
              </div>
              {mode === "guided" ? (
                nextGuidedAction ? (
                  <button
                    type="button"
                    className="button-primary"
                    onClick={() => dispatch(nextGuidedAction)}
                  >
                    {stage?.action} <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <a className="button-primary" href="#interpretation">
                    Review your interpretation
                  </a>
                )
              ) : (
                <div className="explore-actions">
                  {MARKET_EXPLORE_ACTIONS.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="button-secondary"
                      onClick={() => dispatch(action)}
                    >
                      {exploreActionLabel(action)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <MarketNetwork state={state} />

            <div className="market-mobile-focus">
              <MobileParticipantFocus state={state} />
            </div>

            <details className="structured-market-record">
              <summary>Read the structured market record</summary>
              <ol>
                {state.events.length ? (
                  state.events.map((event) => (
                    <li key={event.id}>
                      <strong>{event.title}.</strong> {event.detail}
                    </li>
                  ))
                ) : (
                  <li>No market event has occurred yet.</li>
                )}
              </ol>
            </details>
          </section>

          <aside className="lab-evidence-rail" aria-label="Evidence and change summary">
            <section aria-live="polite" className="what-changed">
              <p className="evidence-kind">simulation observation</p>
              <h2>What changed</h2>
              <p>
                {change?.detail ??
                  "Nothing yet. Meet the participants to create the first visible observation."}
              </p>
            </section>
            <section className="market-metrics" aria-label="Market metrics">
              <Metric label="Trades" value={metrics.completedTrades} />
              <Metric label="Rejected" value={metrics.rejectedOffers} />
              <Metric label="Blocked" value={metrics.blockedOffers} />
              <Metric label="Unmet first wants" value={metrics.unmetFirstPriorities} />
            </section>
            <section>
              <p className="evidence-kind">simulation observation</p>
              <h3>Displayed prices</h3>
              {Object.keys(metrics.displayedPrices).length ? (
                <ul className="price-list">
                  {Object.entries(metrics.displayedPrices).map(([good, price]) => (
                    <li key={good}>
                      <span>{good}</span>
                      <strong>{price} tokens</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No completed monetary trade has created a displayed price.</p>
              )}
            </section>
            <section>
              <p className="evidence-kind">source claim</p>
              <p>
                Hayek describes prices as communicating some dispersed information—not
                all knowledge and not a command.{" "}
                <a href="https://www.econlib.org/library/Essays/hykKnw.html">
                  Read the locator
                </a>
                .
              </p>
            </section>
            <section>
              <p className="evidence-kind">credible counterargument</p>
              <p>
                Real market outcomes also depend on bargaining, market power,
                institutions, enforcement, quality, and time. This five-person model
                omits most of them.
              </p>
            </section>
          </aside>
        </div>

        <section id="interpretation" className="lab-interpretation">
          <header>
            <p className="label-mono">Interpret · select · compare</p>
            <h2>What do the events support—and what can’t this model settle?</h2>
            <p>
              Praxeos checks only whether you completed the record, selected visible
              evidence, acknowledged assumptions, and revised or confirmed your
              response. It does not grade the meaning of your conclusion.
            </p>
          </header>
          <div className="lab-reasoning-grid">
            <label>
              <span>Initial interpretation</span>
              <textarea
                value={session?.initialReasoning ?? ""}
                onChange={(event) =>
                  setReasoning("initialReasoning", event.target.value)
                }
                placeholder="What seems to coordinate the participants? What remains unresolved?"
              />
            </label>
            <fieldset>
              <legend>Select visible simulation evidence</legend>
              {state.events.slice(-6).map((event) => (
                <label key={event.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={(session?.selectedEvidenceIds ?? []).includes(event.id)}
                    onChange={() => toggleEvidence(event.id)}
                  />
                  <span>
                    <strong>{event.title}</strong>
                    {event.detail}
                  </span>
                </label>
              ))}
              {state.events.length === 0 ? (
                <p>Complete a market action first.</p>
              ) : null}
            </fieldset>
            <fieldset>
              <legend>Acknowledge model assumptions</legend>
              {ASSUMPTIONS.map((assumption) => (
                <label key={assumption.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={(session?.acknowledgedAssumptionIds ?? []).includes(
                      assumption.id,
                    )}
                    onChange={() => toggleAssumption(assumption.id)}
                  />
                  <span>{assumption.label}</span>
                </label>
              ))}
            </fieldset>
            <label>
              <span>Revision or explicit confirmation</span>
              <textarea
                value={session?.revision ?? ""}
                onChange={(event) => setReasoning("revision", event.target.value)}
                placeholder="After reviewing the selected evidence and assumptions, what changes—or stays the same?"
              />
            </label>
            <fieldset>
              <legend>Transparent self-review checklist</legend>
              {SELF_REVIEW_CHECKS.map((check) => (
                <label key={check.id} className="lab-check-row">
                  <input
                    type="checkbox"
                    checked={(session?.selfReviewChecks ?? []).includes(check.id)}
                    onChange={() => toggleSelfReview(check.id)}
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
            labSlug={LAB_SLUG}
            reasoning={session?.revision || session?.initialReasoning || ""}
            observationIds={session?.selectedEvidenceIds ?? activeEventIds}
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
                onChange={(event) => setReasoning("reflection", event.target.value)}
                placeholder="What would you test next in this market?"
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

function MarketNetwork({ state }: { state: MarketState }) {
  const positions = [
    [350, 72],
    [574, 225],
    [488, 430],
    [212, 430],
    [126, 225],
  ] as const;
  return (
    <div className="market-network-wrap">
      <svg
        className="market-network"
        viewBox="0 0 700 510"
        role="img"
        aria-labelledby="market-network-title market-network-description"
      >
        <title id="market-network-title">Participant exchange network</title>
        <desc id="market-network-description">
          Five participants arranged around a market record. Lines show offers; solid
          lines are completed trades, dashed lines are rejected or blocked offers.
        </desc>
        <circle cx="350" cy="255" r="128" className="market-ring" />
        {state.offers.map((offer, index) => {
          const fromIndex = state.participants.findIndex(
            (item) => item.id === offer.from,
          );
          const toIndex = state.participants.findIndex((item) => item.id === offer.to);
          const from = positions[fromIndex];
          const to = positions[toIndex];
          if (!from || !to) return null;
          return (
            <g key={offer.id}>
              <line
                x1={from[0]}
                y1={from[1]}
                x2={to[0]}
                y2={to[1]}
                className={`market-offer-line market-offer-line--${offer.status}`}
              />
              <text
                x={(from[0] + to[0]) / 2}
                y={(from[1] + to[1]) / 2 - 8 - index * 4}
                className="market-offer-label"
              >
                {offer.offeredMoney
                  ? `${offer.offeredMoney} tokens → ${offer.requestedGood}`
                  : `${offer.offeredGood} → ${offer.requestedGood}`}
              </text>
            </g>
          );
        })}
        <g className="market-center-record">
          <circle cx="350" cy="255" r="74" />
          <text x="350" y="240">
            MARKET
          </text>
          <text x="350" y="270">
            {state.trades.length} completed trades
          </text>
          <text x="350" y="294">
            {state.offers.length} offers recorded
          </text>
        </g>
        {state.participants.map((participant, index) => {
          const position = positions[index];
          if (!position) return null;
          const inventory = Object.entries(participant.inventory).find(
            ([, quantity]) => quantity > 0,
          );
          return (
            <g
              key={participant.id}
              className="market-participant"
              transform={`translate(${position[0]} ${position[1]})`}
            >
              <circle r="57" />
              <text y="-11" className="market-participant__name">
                {participant.name}
              </text>
              <text y="12">wants {participant.priorities[0]}</text>
              <text y="32">
                {inventory ? `${inventory[1]} ${inventory[0]}` : "inventory changed"} ·{" "}
                {participant.money}t
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MobileParticipantFocus({ state }: { state: MarketState }) {
  const activeId = state.events.at(-1)?.participantIds[0] ?? state.participants[0]?.id;
  const participant = state.participants.find((item) => item.id === activeId);
  if (!participant) return null;
  return (
    <article>
      <p className="label-mono">Current participant</p>
      <h3>{participant.name}</h3>
      <p>{participant.role}</p>
      <p>
        First priority: <strong>{participant.priorities[0]}</strong> · Money:{" "}
        {participant.money} tokens
      </p>
      <ul>
        {Object.entries(participant.inventory)
          .filter(([, quantity]) => quantity > 0)
          .map(([good, quantity]) => (
            <li key={good}>
              {quantity} {good}
            </li>
          ))}
      </ul>
    </article>
  );
}

function LabProgress({ step }: { step: number }) {
  return (
    <ol
      className="lab-step-progress"
      aria-label={`Guided progress: ${Math.min(step, 10)} of 10`}
    >
      {STAGES.map((stage, index) => (
        <li
          key={stage.action}
          aria-current={index === step ? "step" : undefined}
          data-complete={index < step ? "true" : "false"}
        >
          <span className="sr-only">Stage {index + 1}</span>
        </li>
      ))}
    </ol>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function sessionFromState(
  state: MarketState,
  actions: readonly MarketAction[],
  mode: LabMode,
): StoredLabSession {
  return {
    ...emptyLabSession(LAB_SLUG, new Date().toISOString(), state.seed),
    mode,
    guidedStep: state.guidedStep,
    assumptions: asRecord(state.assumptions),
    actionLog: actions.map(asRecord),
    state: asRecord(state),
  };
}

function normalizeAssumptions(value: Record<string, unknown>): MarketAssumptions {
  return {
    participantCount: value.participantCount === 4 ? 4 : 5,
    initialInformation: value.initialInformation === "limited" ? "limited" : "full",
    allowMoney: value.allowMoney !== false,
  };
}

function asRecord(value: object): Record<string, unknown> {
  return value as unknown as Record<string, unknown>;
}

function exploreActionLabel(action: MarketAction): string {
  if (action.type === "money-offer")
    return `Offer ${action.amount}t for ${action.requestedGood}`;
  if (action.type === "barter-offer")
    return `Barter ${action.offeredGood} for ${action.requestedGood}`;
  return action.id;
}

function downloadFile(filename: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
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
