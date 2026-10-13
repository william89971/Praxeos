"use client";

import { getLab } from "@/labs/registry";
import type { PraxeologyCase } from "@/lib/praxeology";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CasePrompt({ item }: { item: PraxeologyCase }) {
  const [response, setResponse] = useState("");
  const [open, setOpen] = useState<"answer" | "example" | "skip" | null>(null);
  return (
    <div className="case-prompt role-question">
      <p>{item.question}</p>
      <label>
        <span className="sr-only">Your response</span>
        <textarea
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="What do you notice? Answering is optional."
        />
      </label>
      <div className="lesson-pace">
        <button
          type="button"
          className="button-secondary"
          onClick={() => setOpen("answer")}
          disabled={!response.trim()}
        >
          Compare my response
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => setOpen("example")}
        >
          Show a worked example
        </button>
        <button type="button" className="text-button" onClick={() => setOpen("skip")}>
          Continue without answering
        </button>
      </div>
      {open ? (
        <div className="role-explanation">
          {open === "answer" ? (
            <p>
              Your note: {response}. The reading below is an interpretation, not a
              grade.
            </p>
          ) : (
            <p>
              This reading is open for pace. It does not record the case as finished.
            </p>
          )}
          <p>{item.insight}</p>
          <p>{item.applyPrompt}</p>
        </div>
      ) : null}
    </div>
  );
}

export function PracticeCases({ cases }: { cases: readonly PraxeologyCase[] }) {
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const utcDay = Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000,
    );
    setTodayIndex(utcDay % cases.length);
  }, [cases.length]);

  const today = todayIndex === null ? null : cases[todayIndex];

  return (
    <>
      <section className="page-section daily-case" aria-live="polite">
        <p className="label-mono">Try this today · rotates by UTC date</p>
        {today ? (
          <div>
            <small>
              {today.domain} · {today.durationMin} min
            </small>
            <h2>{today.title}</h2>
            <p>{today.scenario}</p>
            <CasePrompt item={today} />
            <Link href={`/labs/${today.labSlug}`}>
              Continue in {getLab(today.labSlug).title} →
            </Link>
          </div>
        ) : (
          <p>Choosing today’s case…</p>
        )}
      </section>
      <section className="page-section content-grid" aria-label="Practice case library">
        {cases.map((item) => (
          <article className="content-card" id={item.slug} key={item.slug}>
            <small>
              {item.domain} · {item.durationMin} min
            </small>
            <div>
              <h2>{item.title}</h2>
              <p>{item.scenario}</p>
            </div>
            <CasePrompt item={item} />
            <Link href={`/labs/${item.labSlug}`}>
              Lab connection · {getLab(item.labSlug).shortTitle} →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
