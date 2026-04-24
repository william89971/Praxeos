import { SiteChrome } from "@/components/layout/SiteChrome";
import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { ManifestoJsonLd } from "@/components/seo/JsonLd";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import Manifesto from "@/content/manifesto.mdx";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ends and Means — The Praxeos Manifesto",
  description:
    "Why Praxeos exists: a manifesto on explorable explanations, the Austrian tradition, and the craft of teaching ideas seriously.",
  openGraph: {
    title: "Ends and Means — The Praxeos Manifesto",
    description:
      "Why Praxeos exists: a manifesto on explorable explanations, the Austrian tradition, and the craft of teaching ideas seriously.",
    type: "article",
  },
};

export default function ManifestoPage() {
  return (
    <SiteChrome>
      <ManifestoJsonLd />
      <article>
        {/* Hero */}
        <header
          style={{
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "var(--gutter-block)",
            maxWidth: "var(--measure-wide)",
            marginInline: "auto",
          }}
        >
          <p className="label-mono" style={{ marginBottom: "1rem" }}>
            Praxeos · § 0
          </p>
          <DisplayTitle subtitle="The Praxeos manifesto — written April 2026.">
            Ends and Means
          </DisplayTitle>
          <p className="label-mono" style={{ marginTop: "1rem" }}>
            <Link href="/manifesto-print">Open the print edition</Link>
          </p>
        </header>

        <Fleuron />

        {/* Essay body */}
        <section
          className="module-essay drop-cap"
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
          }}
        >
          <Manifesto components={essayMDXComponents} />
        </section>

        <Fleuron variant="rule" />

        <footer
          style={{
            maxWidth: "var(--measure-prose)",
            marginInline: "auto",
            paddingInline: "var(--gutter-inline)",
            paddingBlock: "0 var(--gutter-block)",
            textAlign: "center",
          }}
        >
          <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
            Written by William Menjivar — Praxeos, Fascicle I.
          </p>
        </footer>
      </article>
    </SiteChrome>
  );
}
