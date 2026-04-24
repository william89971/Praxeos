import { essayMDXComponents } from "@/components/mdx/MDXComponents";
import { DisplayTitle } from "@/components/typography/DisplayTitle";
import { Fleuron } from "@/components/typography/Fleuron";
import Manifesto from "@/content/manifesto.mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ends and Means — Print Edition",
  description: "Print edition of the Praxeos manifesto.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ManifestoPrintPage() {
  return (
    <main
      data-manifesto-print
      style={{
        maxWidth: "var(--measure-prose)",
        marginInline: "auto",
        paddingInline: "var(--gutter-inline)",
        paddingBlock: "calc(var(--gutter-block) * 1.2)",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Fascicle I · Print Edition
        </p>
        <DisplayTitle subtitle="Prepared for print and PDF export.">
          Ends and Means
        </DisplayTitle>
      </header>

      <Fleuron />

      <article className="module-essay drop-cap">
        <Manifesto components={essayMDXComponents} />
      </article>

      <Fleuron variant="rule" />

      <footer style={{ marginTop: "2rem", textAlign: "center" }}>
        <p className="label-mono" style={{ color: "var(--ink-tertiary)" }}>
          William Menjivar · Praxeos · April 2026
        </p>
      </footer>
    </main>
  );
}
