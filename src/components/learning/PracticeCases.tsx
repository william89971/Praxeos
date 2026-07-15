"use client";

import { getLab } from "@/labs/registry";
import type { PraxeologyCase } from "@/lib/praxeology";
import Link from "next/link";
import { useEffect, useState } from "react";

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
            <details>
              <summary>{today.question}</summary>
              <p>{today.applyPrompt}</p>
            </details>
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
            <details>
              <summary>{item.question}</summary>
              <p>{item.applyPrompt}</p>
            </details>
            <Link href={`/labs/${item.labSlug}`}>
              Lab connection · {getLab(item.labSlug).shortTitle} →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
