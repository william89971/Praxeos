"use client";

import { THINKERS } from "@/lib/thinkers";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"] as const;

export function Lineage() {
  const reduced = useReducedMotion();

  return (
    <section
      style={{
        borderBlockStart: "1px solid var(--rule)",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.4)",
        background: "var(--paper)",
        position: "relative",
      }}
    >
      {/* Subtle vertical spine */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "clamp(1rem, 4vw, 3rem)",
          top: "calc(var(--gutter-block) * 1.4)",
          bottom: "calc(var(--gutter-block) * 1.4)",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, var(--rule) 10%, var(--rule) 90%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBlockEnd: "3.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p className="label-mono" style={{ color: "var(--ink-tertiary)", margin: 0 }}>
            § IV — The lineage
          </p>
          <Link
            href="/thinkers"
            className="label-mono"
            style={{ textDecoration: "none" }}
          >
            Index →
          </Link>
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "var(--step-2)",
            lineHeight: 1.4,
            maxWidth: "var(--measure-prose)",
            marginBlockStart: 0,
            marginBlockEnd: "4rem",
          }}
        >
          The ideas rendered here belong to them.
        </p>

        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(2.5rem, 5vh, 4rem)",
          }}
        >
          {THINKERS.map((thinker, i) => {
            const content = (
              <Link
                href={`/thinkers/${thinker.slug}`}
                style={{
                  textDecoration: "none",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "clamp(1rem, 3vw, 2.5rem)",
                  alignItems: "baseline",
                  paddingInlineStart: "clamp(0.5rem, 2vw, 1.5rem)",
                }}
              >
                <span
                  className="label-mono"
                  style={{
                    color: "var(--ink-tertiary)",
                    fontSize: "var(--step--1)",
                    minWidth: "2.5ch",
                    textAlign: "right",
                  }}
                >
                  {ROMAN[i]}
                </span>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                      marginBlockEnd: "0.35rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-serif)",
                        fontSize: "var(--step-3)",
                        fontWeight: 480,
                        fontVariationSettings: '"opsz" 72',
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        color: "var(--ink-primary)",
                      }}
                    >
                      {thinker.name}
                    </h3>
                    <span
                      className="label-mono"
                      style={{
                        color: "var(--ink-tertiary)",
                        fontSize: "var(--step--2)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {thinker.dates}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "var(--step-0)",
                      lineHeight: 1.5,
                      color: "var(--ink-secondary)",
                      maxWidth: "var(--measure-prose)",
                    }}
                  >
                    {thinker.contribution}
                  </p>
                </div>
              </Link>
            );

            if (reduced) {
              return <li key={thinker.slug}>{content}</li>;
            }

            return (
              <motion.li
                key={thinker.slug}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {content}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
