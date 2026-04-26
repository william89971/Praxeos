import { ModuleNavigator } from "@/components/interactive/ModuleNavigator";
import { ReadingProgress } from "@/components/interactive/ReadingProgress";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { complexityToLabel, formatThinker } from "@/lib/formatters";
import { adjacentModules } from "@/modules/registry";
import type { ModuleMetadata, Source } from "@/types/module";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  metadata: ModuleMetadata;
  sources: readonly Source[];
  /** The generative/interactive component. Full-bleed. */
  sketch: ReactNode;
  /** 1–2 sentence caption describing what the reader is looking at. */
  sketchCaption: string;
  /** Module essay body (MDX content). */
  children: ReactNode;
  /** Optional content after the essay but before sources. */
  postlude?: ReactNode;
};

export function ModuleLayout({
  metadata,
  sources,
  sketch,
  sketchCaption,
  children,
  postlude,
}: Props) {
  const { prev, next } = adjacentModules(metadata.slug);

  const difficultyLabel = complexityToLabel(metadata.complexity);

  return (
    <article className="module-layout" data-module-slug={metadata.slug}>
      <ReadingProgress />

      {/* 1 · Hero */}
      <header
        style={{
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Fascicle {toRoman(metadata.fascicle)} · Module{" "}
          {metadata.moduleNumber} of ∞
        </p>
        <DisplayTitle subtitle={metadata.subtitle}>{metadata.title}</DisplayTitle>

        {/* Module intro bar */}
        <ModuleIntroBar metadata={metadata} difficultyLabel={difficultyLabel} />

        {metadata.bestOn === "desktop" ? (
          <p
            className="label-mono"
            style={{
              marginTop: "1rem",
              maxWidth: "42ch",
              color: "var(--ink-tertiary)",
            }}
          >
            Designed for a real pointer and a wider field of view. The essay still reads
            cleanly on touch.
          </p>
        ) : null}
      </header>

      {/* 2 · Opening interactive (full-bleed) */}
      <section
        aria-label="Opening interactive"
        data-interactive="true"
        style={{
          width: "100%",
          background: "var(--paper-elevated)",
          borderBlock: "1px solid var(--rule)",
        }}
      >
        {sketch}
      </section>

      {/* 3 · Caption */}
      <p
        className="label"
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "1.5rem 3rem",
          color: "var(--ink-secondary)",
          textAlign: "center",
        }}
      >
        {sketchCaption}
      </p>

      {/* 4 · What you'll learn */}
      {metadata.learningOutcomes && metadata.learningOutcomes.length > 0 ? (
        <section
          aria-labelledby="learn-heading"
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 2.5rem",
          }}
        >
          <p
            id="learn-heading"
            className="label-mono"
            style={{
              marginBlock: 0,
              marginBlockEnd: "0.75rem",
              color: "var(--ink-tertiary)",
              fontSize: "var(--step--2)",
              letterSpacing: "0.06em",
            }}
          >
            What you will understand after this
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: "0.6rem",
            }}
          >
            {metadata.learningOutcomes.map((outcome, i) => (
              <li
                key={outcome}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.75rem",
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step-0)",
                  lineHeight: 1.5,
                  color: "var(--ink-primary)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    color: "var(--accent-action)",
                    fontFamily: "var(--font-serif)",
                    fontSize: "var(--step--1)",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {toRoman(i + 1).toLowerCase()}.
                </span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 5 · Essay column */}
      <section
        id="module-essay"
        className="module-essay drop-cap"
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
          scrollMarginBlockStart: "2rem",
        }}
      >
        {children}
      </section>

      {/* 6 · Postlude (interactive demos, etc.) */}
      {postlude ? (
        <section
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
          }}
        >
          {postlude}
        </section>
      ) : null}

      <Fleuron variant="fleuron" />

      {/* 7 · Primary sources */}
      <section
        aria-labelledby="sources-heading"
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
        }}
      >
        <h3 id="sources-heading">Primary sources</h3>
        <ol
          style={{
            paddingInlineStart: "1.25rem",
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step--1)",
            lineHeight: 1.55,
          }}
        >
          {sources.map((source) => (
            <li key={source.url} style={{ marginBlock: "0.6rem" }}>
              <em>{source.author}</em>, <span>{source.title}</span>{" "}
              <span style={{ color: "var(--ink-tertiary)" }}>
                ({source.year}
                {source.publisher ? `, ${source.publisher}` : ""})
              </span>
              .{" "}
              <a href={source.url} rel="noopener">
                Read
              </a>
              {source.archiveUrl ? (
                <>
                  {" · "}
                  <a href={source.archiveUrl} rel="noopener">
                    Archive
                  </a>
                </>
              ) : null}
              {source.pages ? (
                <span style={{ color: "var(--ink-tertiary)" }}>
                  {" "}
                  pp. {source.pages}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {/* 8 · Related modules — populated once graph exists */}
      {metadata.thinkers.length > 0 ? (
        <section
          aria-labelledby="related-heading"
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
          }}
        >
          <h3 id="related-heading">Thinkers referenced</h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {metadata.thinkers.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/thinkers/${slug}`}
                  className="label-mono"
                  style={{
                    textDecoration: "none",
                    padding: "0.35rem 0.7rem",
                    border: "1px solid var(--rule)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--ink-secondary)",
                  }}
                >
                  {formatThinker(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 9 · Discussion prompt */}
      <section
        aria-label="Discussion prompt"
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
        }}
      >
        <p
          className="label-mono"
          style={{ marginBottom: "0.75rem", color: "var(--ink-tertiary)" }}
        >
          A question to sit with
        </p>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "var(--step-2)",
            color: "var(--ink-primary)",
            lineHeight: 1.5,
          }}
        >
          {metadata.discussionPrompt}
        </p>
      </section>

      <Fleuron variant="rule" />

      {/* 10 · Signature */}
      <footer
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
        }}
      >
        <p
          className="label-mono"
          style={{ color: "var(--ink-tertiary)", textAlign: "center" }}
        >
          Written and built by William Menjivar — Praxeos, Fascicle{" "}
          {toRoman(metadata.fascicle)}, Module {metadata.moduleNumber} of ∞
        </p>
      </footer>

      {/* 11 · Prev / Next */}
      <ModuleNavigator
        prev={
          prev
            ? {
                slug: prev.slug,
                title: prev.title,
                subtitle: prev.subtitle,
              }
            : null
        }
        next={
          next
            ? {
                slug: next.slug,
                title: next.title,
                subtitle: next.subtitle,
              }
            : null
        }
      />
    </article>
  );
}

/* -------------------------------------------------------------------------- */

function ModuleIntroBar({
  metadata,
  difficultyLabel,
}: {
  metadata: ModuleMetadata;
  difficultyLabel: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem 1.5rem",
        marginBlockStart: "1.5rem",
      }}
    >
      <DifficultyBadge label={difficultyLabel} complexity={metadata.complexity} />
      <MetaPill>
        <span style={{ color: "var(--ink-tertiary)" }}>Read time</span>{" "}
        <span style={{ color: "var(--ink-primary)", fontWeight: 500 }}>
          {metadata.readingTimeMin} min
        </span>
      </MetaPill>
      <MetaPill>
        <span style={{ color: "var(--ink-tertiary)" }}>Complexity</span>{" "}
        <span style={{ color: "var(--ink-primary)", fontWeight: 500 }}>
          {"◆".repeat(metadata.complexity)}
        </span>
      </MetaPill>
      <MetaPill>
        <span style={{ color: "var(--ink-tertiary)" }}>Published</span>{" "}
        <span style={{ color: "var(--ink-primary)", fontWeight: 500 }}>
          {new Date(metadata.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </MetaPill>
    </div>
  );
}

function DifficultyBadge({
  label,
  complexity,
}: {
  label: string;
  complexity: number;
}) {
  const color =
    complexity <= 2
      ? "var(--accent-capital)"
      : complexity === 3
        ? "var(--accent-bitcoin)"
        : "var(--accent-action)";

  return (
    <span
      className="label"
      style={{
        padding: "0.25rem 0.6rem",
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${color}`,
        color,
        fontWeight: 600,
        fontSize: "var(--step--2)",
        letterSpacing: "0.04em",
      }}
    >
      {label}
    </span>
  );
}

function MetaPill({ children }: { children: ReactNode }) {
  return (
    <span
      className="label"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.25rem 0.6rem",
        borderRadius: "var(--radius-sm)",
        background: "var(--paper-sunk)",
        border: "1px solid var(--rule)",
        fontSize: "var(--step--2)",
      }}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remaining = n;
  for (const [value, glyph] of map) {
    while (remaining >= value) {
      result += glyph;
      remaining -= value;
    }
  }
  return result || "I";
}
