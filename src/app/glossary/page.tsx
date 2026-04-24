import { SiteChrome } from "@/components/layout/SiteChrome";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { GLOSSARY } from "@/content/glossary";
import { THINKERS } from "@/lib/thinkers";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "A–Z of praxeological and Austrian-economic concepts, with primary-source links and cross-references to modules.",
};

export default function GlossaryPage() {
  const entries = [...GLOSSARY].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return (
    <SiteChrome>
      <header
        style={{
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Glossary
        </p>
        <DisplayTitle subtitle="Sixteen concepts, arranged A to Z. Each is short, cited where possible, and linked out to the essays that render it.">
          The terms.
        </DisplayTitle>
      </header>

      <Fleuron />

      <section
        aria-label="Concepts A to Z"
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
          display: "grid",
          gap: "3rem",
        }}
      >
        {entries.map((entry) => {
          const thinkers = entry.thinkers
            .map((slug) => THINKERS.find((t) => t.slug === slug))
            .filter((t): t is (typeof THINKERS)[number] => Boolean(t));

          return (
            <article
              key={entry.slug}
              id={entry.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
                gap: "clamp(1.5rem, 4vw, 3rem)",
                borderBlockStart: "1px solid var(--rule)",
                paddingBlockStart: "1.5rem",
              }}
            >
              <header>
                <h2
                  style={{
                    margin: 0,
                    marginBlockEnd: "0.75rem",
                    fontSize: "var(--step-2)",
                    letterSpacing: "-0.02em",
                    textWrap: "balance",
                  }}
                >
                  <a
                    href={`#${entry.slug}`}
                    style={{
                      textDecoration: "none",
                      color: "var(--ink-primary)",
                    }}
                  >
                    {entry.headword}
                  </a>
                </h2>
                <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
                  {entry.slug}
                </p>
              </header>

              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step-0)",
                  lineHeight: 1.6,
                  maxWidth: "var(--measure-prose)",
                }}
              >
                <p style={{ marginBlockStart: 0 }}>{entry.definition}</p>

                {thinkers.length > 0 ? (
                  <p
                    className="label-mono"
                    style={{
                      color: "var(--ink-tertiary)",
                      marginBlockStart: "0.75rem",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <span>Thinkers:</span>
                    {thinkers.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/thinkers/${t.slug}`}
                        style={{
                          textDecoration: "none",
                          color: "var(--ink-secondary)",
                        }}
                      >
                        {t.name}
                      </Link>
                    ))}
                  </p>
                ) : null}

                {entry.modules.length > 0 ? (
                  <p
                    className="label-mono"
                    style={{
                      color: "var(--ink-tertiary)",
                      marginBlockStart: "0.4rem",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <span>Modules:</span>
                    {entry.modules.map((slug) => (
                      <Link
                        key={slug}
                        href={`/modules/${slug}`}
                        style={{
                          textDecoration: "none",
                          color: "var(--accent-action)",
                        }}
                      >
                        {slug}
                      </Link>
                    ))}
                  </p>
                ) : (
                  <p
                    className="label-mono"
                    style={{
                      color: "var(--ink-tertiary)",
                      marginBlockStart: "0.4rem",
                      fontStyle: "italic",
                    }}
                  >
                    No module yet — see /docs/MODULE_IDEAS.md on GitHub.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </SiteChrome>
  );
}
