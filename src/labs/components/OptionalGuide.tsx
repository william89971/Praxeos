"use client";

import type { LabSlug } from "@/labs/types";
import type { GuideTurn } from "@/lib/guide/types";
import { useRef, useState } from "react";

interface OptionalGuideProps {
  labSlug: LabSlug;
  reasoning: string;
  observationIds: string[];
  actionIds: string[];
  assumptionIds: string[];
  turn: GuideTurn | null;
  onTurn: (turn: GuideTurn) => void;
}

export function OptionalGuide({
  labSlug,
  reasoning,
  observationIds,
  actionIds,
  assumptionIds,
  turn,
  onTurn,
}: OptionalGuideProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "offline" | "limited" | "error"
  >("idle");
  const controller = useRef<AbortController | null>(null);

  const ask = async () => {
    if (!navigator.onLine) {
      setStatus("offline");
      return;
    }
    controller.current?.abort();
    controller.current = new AbortController();
    setStatus("loading");
    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        signal: controller.current.signal,
        body: JSON.stringify({
          labSlug,
          reasoning,
          evidence: { observationIds, actionIds, assumptionIds },
        }),
      });
      if (response.status === 429) {
        setStatus("limited");
        return;
      }
      if (!response.ok) throw new Error(`Guide response ${response.status}`);
      onTurn((await response.json()) as GuideTurn);
      setStatus("idle");
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        setStatus("idle");
        return;
      }
      setStatus(navigator.onLine ? "error" : "offline");
    }
  };

  const cancel = () => {
    controller.current?.abort();
    controller.current = null;
  };

  return (
    <section className="guide-card lab-guide" aria-labelledby="optional-guide-heading">
      <p className="label-mono">Optional · source-grounded</p>
      <h3 id="optional-guide-heading">Ask Claude for one Socratic question</h3>
      <p>
        Semantic guidance is optional. Claude receives this Lab’s current reasoning,
        explicit evidence IDs, and server-selected source packets—never other Notebook
        entries.
      </p>
      <div className="lab-inline-actions">
        <button
          type="button"
          className="button-secondary"
          disabled={reasoning.trim().length < 12 || status === "loading"}
          onClick={ask}
        >
          Ask one question
        </button>
        {status === "loading" ? (
          <button type="button" className="text-button" onClick={cancel}>
            Cancel request
          </button>
        ) : null}
      </div>
      <p role="status" className="lab-guide__status">
        {status === "loading" ? "Asking the optional Guide…" : null}
        {status === "offline"
          ? "You are offline. The transparent self-review remains fully available."
          : null}
        {status === "limited"
          ? "The Guide is resting after its request limit. Continue with self-review."
          : null}
        {status === "error"
          ? "The Guide is unavailable. No learner writing was lost; continue with self-review."
          : null}
      </p>
      {turn ? (
        <div className="guide-result">
          <p className="guide-mode">
            {turn.providerMode === "claude" ? "Claude Guide" : "Deterministic fallback"}
          </p>
          {turn.blocks.map((block, index) => (
            <div key={`${block.category}-${index}`}>
              <p className="evidence-kind">{block.category}</p>
              <p>{block.text}</p>
              {block.citations.map((citation) => (
                <a key={`${citation.sourceId}-${citation.locator}`} href={citation.url}>
                  {citation.title} · {citation.locator}
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
      ) : null}
    </section>
  );
}
