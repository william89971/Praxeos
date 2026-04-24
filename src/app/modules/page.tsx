import { SiteChrome } from "@/components/layout/SiteChrome";
import { MODULE_REGISTRY } from "@/modules/registry";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Every Praxeos module — explorable explanations of Austrian economics and praxeology.",
};

export default async function ModulesIndexPage() {
  const modules = await Promise.all(
    MODULE_REGISTRY.map(async (entry) => {
      const mod = await entry.load();
      return { entry, meta: mod.metadata };
    }),
  );

  return (
    <SiteChrome>
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
        }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Modules
        </p>
        <h1 style={{ marginBottom: "1rem" }}>The library.</h1>
        <p
          className="italic"
          style={{
            fontSize: "var(--step-1)",
            color: "var(--ink-secondary)",
            marginBottom: "3rem",
            maxWidth: "52ch",
          }}
        >
          Each module pairs an interactive or generative piece with a
          primary-source-backed essay. They can be read in any order; Fascicle I is
          intended to be read together.
        </p>

        {modules.length === 0 ? (
          <p
            style={{
              color: "var(--ink-tertiary)",
              fontStyle: "italic",
              fontSize: "var(--step-1)",
              maxWidth: "48ch",
            }}
          >
            Fascicle I is in preparation. Return soon.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gap: "2.5rem",
            }}
          >
            {modules.map(({ entry, meta }) => (
              <li
                key={entry.slug}
                style={{
                  borderBlockStart: "1px solid var(--rule)",
                  paddingBlockStart: "2rem",
                }}
              >
                <Link
                  href={`/modules/${entry.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <p className="label-mono" style={{ marginBottom: "0.5rem" }}>
                    Fascicle {toRoman(meta.fascicle)} · Module {meta.moduleNumber}
                  </p>
                  <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>{meta.title}</h2>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: "var(--step-1)",
                      color: "var(--ink-secondary)",
                      margin: 0,
                    }}
                  >
                    {meta.subtitle}
                  </p>
                  <p
                    className="label-mono"
                    style={{
                      color: "var(--ink-tertiary)",
                      marginTop: "1rem",
                    }}
                  >
                    {meta.readingTimeMin}-min read · Complexity{" "}
                    {"◆".repeat(meta.complexity)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SiteChrome>
  );
}

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  let r = n;
  for (const [v, g] of map) {
    while (r >= v) {
      out += g;
      r -= v;
    }
  }
  return out || "I";
}
