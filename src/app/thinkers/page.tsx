import { SiteChrome } from "@/components/layout/SiteChrome";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import { THINKERS } from "@/lib/thinkers";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thinkers",
  description:
    "The ten thinkers whose ideas Praxeos renders — Menger, Böhm-Bawerk, Mises, Hayek, Rothbard, Kirzner, Lachmann, Hoppe, Salerno, Ammous.",
};

const GROUPS = [
  {
    label: "Foundations",
    note: "Value, money, capital, and time before the formal language of praxeology.",
  },
  {
    label: "Praxeology",
    note: "Human action treated as the starting point for economics and social order.",
  },
  {
    label: "Process",
    note: "Markets as discovery, expectations, local knowledge, and evolving plans.",
  },
  {
    label: "Money",
    note: "Sound money, calculation, and the modern extension of Austrian monetary theory.",
  },
] as const;

export default function ThinkersIndexPage() {
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
          Praxeos · Thinkers
        </p>
        <DisplayTitle subtitle="The figures whose arguments these modules render.">
          The tradition.
        </DisplayTitle>
      </header>

      <Fleuron />

      <section
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "0 var(--gutter-block)",
          display: "grid",
          gap: "2.25rem",
        }}
      >
        {GROUPS.map((group) => {
          const thinkers = THINKERS.filter((thinker) => thinker.group === group.label);
          return (
            <section
              key={group.label}
              aria-labelledby={`thinker-group-${group.label}`}
              style={{
                borderBlockStart: "1px solid var(--rule)",
                paddingBlockStart: "1.5rem",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 0.7fr) minmax(0, 1.3fr)",
                  gap: "clamp(1rem, 4vw, 3rem)",
                }}
              >
                <div>
                  <p
                    id={`thinker-group-${group.label}`}
                    className="label-mono"
                    style={{ color: "var(--ink-tertiary)", margin: 0 }}
                  >
                    {group.label}
                  </p>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-serif)",
                    fontSize: "var(--step-1)",
                    lineHeight: 1.45,
                    color: "var(--ink-secondary)",
                  }}
                >
                  {group.note}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
                  gap: "1rem",
                }}
              >
                {thinkers.map((thinker) => (
                  <Link
                    key={thinker.slug}
                    href={`/thinkers/${thinker.slug}`}
                    style={{
                      display: "grid",
                      gap: "0.65rem",
                      minHeight: "14rem",
                      padding: "1rem",
                      border: "1px solid var(--rule)",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--paper-elevated)",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="label-mono"
                      style={{ color: "var(--ink-tertiary)" }}
                    >
                      {thinker.dates}
                    </span>
                    <h2 style={{ margin: 0, fontSize: "var(--step-1)" }}>
                      {thinker.name}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: "var(--step-0)",
                        lineHeight: 1.45,
                        color: "var(--ink-secondary)",
                        margin: 0,
                      }}
                    >
                      {thinker.contribution}
                    </p>
                    <p
                      style={{
                        fontSize: "var(--step--1)",
                        lineHeight: 1.5,
                        color: "var(--ink-secondary)",
                        marginBlock: "auto 0",
                      }}
                    >
                      {thinker.praxeosRelevance}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </SiteChrome>
  );
}
