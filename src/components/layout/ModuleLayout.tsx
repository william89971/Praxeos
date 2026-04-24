import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
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
};

export function ModuleLayout({
  metadata,
  sources,
  sketch,
  sketchCaption,
  children,
}: Props) {
  const { prev, next } = adjacentModules(metadata.slug);

  return (
    <article className="module-layout" data-module-slug={metadata.slug}>
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
        <MetaLine metadata={metadata} />
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

      {/* 4 · Essay column */}
      <section
        className="module-essay drop-cap"
        style={{
          maxWidth: "var(--measure-prose)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
        }}
      >
        {children}
      </section>

      <Fleuron variant="fleuron" />

      {/* 5 · Primary sources */}
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

      {/* 6 · Related modules — populated once graph exists */}
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

      {/* 7 · Discussion prompt */}
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

      {/* 8 · Signature */}
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

      {/* 9 · Prev / Next */}
      <nav
        aria-label="Module navigation"
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
          display: "flex",
          justifyContent: "space-between",
          borderBlockStart: "1px solid var(--rule)",
        }}
      >
        {prev ? (
          <Link href={`/modules/${prev.slug}`} className="label">
            ← Previous module
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/modules/${next.slug}`} className="label">
            Next module →
          </Link>
        ) : (
          <Link href="/modules" className="label">
            All modules ↑
          </Link>
        )}
      </nav>
    </article>
  );
}

function MetaLine({ metadata }: { metadata: ModuleMetadata }) {
  return (
    <p
      className="label-mono"
      style={{
        display: "flex",
        gap: "1.5rem",
        flexWrap: "wrap",
        marginBlockStart: "1.5rem",
        color: "var(--ink-tertiary)",
      }}
    >
      <span>
        {metadata.thinkers.slice(0, 3).map(formatThinker).join(" · ")}
        {metadata.thinkers.length > 3 ? " et al." : ""}
      </span>
      <span>{metadata.readingTimeMin}-min read</span>
      <span>
        {new Date(metadata.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
      <span>Complexity {"◆".repeat(metadata.complexity)}</span>
    </p>
  );
}

function formatThinker(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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
