"use client";

import { trackInteraction } from "@/lib/telemetry";
import type { Source, ThinkerSlug } from "@/types/module";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef } from "react";

interface Props {
  readonly sources: readonly Source[];
  readonly thinkers: readonly ThinkerSlug[];
}

export function SourceDrawer({ sources, thinkers }: Props) {
  const primary = sources.slice(0, 3);
  const trackedOpenRef = useRef(false);

  const trackOpen = () => {
    if (trackedOpenRef.current) return;
    trackedOpenRef.current = true;
    trackInteraction("source_opened", {
      payload: { sourceCount: sources.length, thinkerCount: thinkers.length },
    });
  };

  return (
    <details style={drawerStyle} onToggle={trackOpen}>
      <summary className="label-mono" style={summaryStyle}>
        Built from primary sources
      </summary>
      <div style={bodyStyle}>
        {thinkers.length > 0 ? (
          <p style={introStyle}>
            Source lineage:{" "}
            {thinkers.slice(0, 4).map((thinker, index) => (
              <span key={thinker}>
                <Link href={`/sources/thinkers/${thinker}`}>{formatThinkerName(thinker)}</Link>
                {index < Math.min(thinkers.length, 4) - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        ) : null}
        <ol style={listStyle}>
          {primary.map((source) => (
            <li key={source.url}>
              <em>{source.author}</em>, {source.title} ({source.year})
            </li>
          ))}
        </ol>
        <a href="#sources-heading" className="label-mono">
          Open full source list
        </a>
      </div>
    </details>
  );
}

function formatThinkerName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const drawerStyle: CSSProperties = {
  marginBlockStart: "1.25rem",
  maxWidth: "var(--measure-prose)",
  border: "1px solid var(--rule)",
  borderRadius: "var(--radius-sm)",
  background: "var(--paper-sunk)",
};

const summaryStyle: CSSProperties = {
  padding: "0.7rem 0.85rem",
  color: "var(--ink-secondary)",
  cursor: "pointer",
};

const bodyStyle: CSSProperties = {
  padding: "0 0.85rem 0.85rem",
  display: "grid",
  gap: "0.75rem",
  color: "var(--ink-secondary)",
};

const introStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-serif)",
  lineHeight: 1.45,
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingInlineStart: "1.1rem",
  fontFamily: "var(--font-serif)",
  fontSize: "var(--step--1)",
  lineHeight: 1.5,
};
