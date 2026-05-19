import { THINKERS } from "@/lib/thinkers";
import Link from "next/link";

export function ThinkerFooterSection() {
  return (
    <section
      aria-labelledby="people-behind-method"
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 0.9)",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "end",
          }}
        >
          <div>
            <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
              People Behind the Method
            </p>
            <h2 id="people-behind-method" style={{ marginBlock: "0.35rem 0" }}>
              The lineage Praxeos renders.
            </h2>
          </div>
          <Link href="/thinkers" className="label-mono">
            View all thinkers →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
            gap: "0.75rem",
          }}
        >
          {THINKERS.map((thinker) => (
            <Link
              key={thinker.slug}
              href={`/thinkers/${thinker.slug}`}
              style={{
                display: "grid",
                gap: "0.45rem",
                minHeight: "10rem",
                padding: "0.9rem",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius-sm)",
                background: "var(--paper-elevated)",
                textDecoration: "none",
              }}
            >
              <span className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
                {thinker.group} · {thinker.dates}
              </span>
              <strong
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step-0)",
                  color: "var(--ink-primary)",
                }}
              >
                {thinker.name}
              </strong>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "var(--step--1)",
                  lineHeight: 1.45,
                  color: "var(--ink-secondary)",
                }}
              >
                {thinker.praxeosRelevance}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
