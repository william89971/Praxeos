"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { journeyToMarkdown } from "@/lib/learning-store";
import Link from "next/link";

export function NotebookView() {
  const { store, hydrated } = usePraxeosStore();
  if (!hydrated) return <p>Opening your local notebook…</p>;
  const { journey } = store;
  if (!Object.values(journey.initial).some(Boolean) && !journey.revision) {
    return (
      <section className="guide-card">
        <p className="label-mono">No saved reasoning yet</p>
        <h2>Your first interpretation belongs here.</h2>
        <p>
          Begin the flagship journey. Praxeos will keep the initial reasoning, rubric
          feedback, optional Guide turn, revision, sources, lab state, and completion
          date in this browser.
        </p>
        <Link href="/journey/calculation-labyrinth">Begin Calculation Labyrinth →</Link>
      </section>
    );
  }
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([journeyToMarkdown(journey)], { type: "text/markdown" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "praxeos-learning-record.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="journey-copy">
      <section className="compare-panel">
        <article>
          <span>Initial interpretation</span>
          <strong>{journey.initial.interpretation || "Not recorded"}</strong>
        </article>
        <article>
          <span>Revised interpretation</span>
          <strong>{journey.revision || "Not recorded"}</strong>
        </article>
      </section>
      <section className="guide-card">
        <p className="label-mono">Deterministic rubric</p>
        {journey.feedback.map((item) => (
          <p key={item.field}>
            <strong>{item.field}</strong> · {item.status} · {item.message}
          </p>
        ))}
      </section>
      {journey.guide ? (
        <section className="guide-card">
          <p className="label-mono">
            Optional Guide turn · {journey.guide.providerMode}
          </p>
          <h2>{journey.guide.question}</h2>
          <p>{journey.guide.whyThisFeedback}</p>
          {journey.guide.citations.map((citation) => (
            <a key={citation.sourceId} href={citation.url}>
              {citation.title} · {citation.locator}
            </a>
          ))}
        </section>
      ) : null}
      <section>
        <p className="label-mono">Final reflection</p>
        <h2>{journey.finalReflection || "Not recorded yet"}</h2>
        <p>
          Completed:{" "}
          {journey.completedAt
            ? new Date(journey.completedAt).toLocaleDateString()
            : "In progress"}
        </p>
      </section>
      <button type="button" className="button-primary" onClick={download}>
        Download readable Markdown
      </button>
    </div>
  );
}
