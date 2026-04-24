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
        <DisplayTitle subtitle="The ten figures whose arguments these modules render.">
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
        }}
      >
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: "2.5rem",
          }}
        >
          {THINKERS.map((thinker) => (
            <li
              key={thinker.slug}
              style={{
                borderBlockStart: "1px solid var(--rule)",
                paddingBlockStart: "1.5rem",
              }}
            >
              <Link
                href={`/thinkers/${thinker.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBlockEnd: "0.5rem",
                  }}
                >
                  <h2 style={{ margin: 0 }}>{thinker.name}</h2>
                  <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
                    {thinker.dates}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "var(--step-1)",
                    color: "var(--ink-secondary)",
                    margin: 0,
                    maxWidth: "var(--measure-prose)",
                  }}
                >
                  {thinker.contribution}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </SiteChrome>
  );
}
