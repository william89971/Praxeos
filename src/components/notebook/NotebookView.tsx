"use client";

import { usePraxeosStore } from "@/hooks/usePraxeosStore";
import { LAB_REGISTRY } from "@/labs/registry";
import type { EarlierPraxeosRecord, LabSlug } from "@/labs/types";
import { type StoredLabSession, labSessionToMarkdown } from "@/lib/learning-store";
import Link from "next/link";

export function NotebookView() {
  const { store, hydrated } = usePraxeosStore();
  if (!hydrated) return <output>Opening your local notebook…</output>;
  const sessions = LAB_REGISTRY.flatMap((lab) => store.labSessions[lab.slug]);
  if (sessions.length === 0 && store.earlierRecords.length === 0) {
    return (
      <section className="guide-card">
        <p className="label-mono">No saved reasoning yet</p>
        <h2>Your first interpretation belongs here.</h2>
        <p>
          Begin the flagship. Praxeos keeps your initial reasoning, explicitly selected
          evidence, acknowledged assumptions, optional Guide turn, revision, sources,
          and reflection in this browser.
        </p>
        <Link href="/labs/market-without-a-manager?mode=guided">
          Begin Market Without a Manager →
        </Link>
      </section>
    );
  }

  return (
    <div className="notebook-records">
      {sessions.map((session) => (
        <SessionRecord key={session.id} session={session} />
      ))}
      {store.earlierRecords.map((record) => (
        <EarlierRecord key={record.id} record={record} />
      ))}
    </div>
  );
}

function SessionRecord({ session }: { session: StoredLabSession }) {
  const lab = LAB_REGISTRY.find((entry) => entry.slug === session.labSlug);
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([labSessionToMarkdown(session)], { type: "text/markdown" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `praxeos-${session.labSlug}-record.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <article className="notebook-record">
      <header>
        <div>
          <p className="label-mono">
            {session.completedAt ? "Completed Lab" : "In-progress Lab"}
          </p>
          <h2>{lab?.title ?? titleFromSlug(session.labSlug)}</h2>
        </div>
        <Link href={`/labs/${session.labSlug}`}>Resume →</Link>
      </header>
      <div className="compare-panel">
        <article>
          <span>Initial interpretation</span>
          <strong>{session.initialReasoning || "Not recorded"}</strong>
        </article>
        <article>
          <span>Revised interpretation</span>
          <strong>{session.revision || "Not recorded"}</strong>
        </article>
      </div>
      <div className="notebook-record__evidence">
        <p>
          <strong>{session.selectedEvidenceIds.length}</strong> selected observations
        </p>
        <p>
          <strong>{session.acknowledgedAssumptionIds.length}</strong> acknowledged
          assumptions
        </p>
        <p className="label-mono">No semantic score assigned</p>
      </div>
      <button type="button" className="button-secondary" onClick={download}>
        Download readable Markdown
      </button>
    </article>
  );
}

function EarlierRecord({ record }: { record: EarlierPraxeosRecord }) {
  return (
    <article className="notebook-record notebook-record--earlier">
      <header>
        <div>
          <p className="label-mono">Earlier Praxeos record · read only</p>
          <h2>{record.sourceLabel}</h2>
        </div>
        <span>Migrated locally</span>
      </header>
      <div className="compare-panel">
        <article>
          <span>Earlier interpretation</span>
          <strong>{record.initialReasoning || "Not recorded"}</strong>
        </article>
        <article>
          <span>Earlier revision</span>
          <strong>{record.revision || "Not recorded"}</strong>
        </article>
      </div>
      {record.reflection ? <p>{record.reflection}</p> : null}
      <p className="label-mono">
        Preserved from the retired interface; not replayable as an active Lab.
      </p>
    </article>
  );
}

function titleFromSlug(slug: LabSlug) {
  return slug
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
