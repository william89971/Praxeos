"use client";

import type { GlossaryEntry } from "@/content/glossary";
import Link from "next/link";
import { useMemo, useState } from "react";

export function GlossaryIndex({ entries }: { entries: readonly GlossaryEntry[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      entries.filter((entry) => {
        if (!normalized) return true;
        return (
          entry.headword.toLowerCase().includes(normalized) ||
          entry.definition.toLowerCase().includes(normalized) ||
          entry.sortKey.includes(normalized)
        );
      }),
    [entries, normalized],
  );
  const letters = [
    ...new Set(entries.map((entry) => entry.headword[0]?.toUpperCase())),
  ].filter((letter): letter is string => Boolean(letter));
  const firstOfLetter = new Map<string, string>();
  for (const entry of visible) {
    const letter = entry.headword[0]?.toUpperCase() ?? "";
    if (letter && !firstOfLetter.has(letter)) firstOfLetter.set(letter, entry.slug);
  }

  return (
    <>
      <div className="glossary-tools">
        <label>
          <span className="label-mono">Search the glossary</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Say’s law, action, or price"
          />
        </label>
        <nav aria-label="Glossary letters">
          {letters.map((letter) => (
            <a key={letter} href={`#glossary-${letter}`}>
              {letter}
            </a>
          ))}
        </nav>
      </div>
      {visible.length === 0 ? (
        <p>No glossary entry matches that search.</p>
      ) : (
        <section className="page-section content-grid">
          {visible.map((entry) => {
            const letter = entry.headword[0]?.toUpperCase() ?? "";
            const sourceHref = entry.sourceIds?.[0]
              ? `/sources#${entry.sourceIds[0]}`
              : "/sources";
            return (
              <article className="content-card" id={entry.slug} key={entry.slug}>
                <small
                  id={
                    firstOfLetter.get(letter) === entry.slug
                      ? `glossary-${letter}`
                      : undefined
                  }
                >
                  {entry.status === "framework"
                    ? "Framework claim"
                    : entry.status === "contested"
                      ? "Contested claim"
                      : entry.status === "interpretation"
                        ? "An argument in this tradition"
                        : "Definition"}
                  {entry.thinkers.length ? ` · ${entry.thinkers.join(" · ")}` : ""}
                </small>
                <div>
                  <h2>{entry.headword}</h2>
                  <p>{entry.definition}</p>
                </div>
                <Link href={sourceHref}>Trace sources →</Link>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
