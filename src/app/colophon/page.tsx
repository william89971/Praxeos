import { SiteChrome } from "@/components/layout/SiteChrome";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Colophon",
  description:
    "Tools, typography, philosophical influences, credits, and license for Praxeos.",
};

export default function ColophonPage() {
  return (
    <SiteChrome>
      <article
        className="mx-auto px-[var(--gutter-inline)] py-[var(--gutter-block)]"
        style={{ maxWidth: "var(--measure-prose)" }}
      >
        <p className="label-mono" style={{ marginBottom: "1rem" }}>
          Praxeos · Colophon
        </p>
        <h1 style={{ marginBottom: "1rem" }}>Homo agit.</h1>
        <p
          className="italic"
          style={{
            fontSize: "var(--step-1)",
            color: "var(--ink-secondary)",
            marginBottom: "3rem",
          }}
        >
          Tools, typography, philosophical influences, credits.
        </p>

        <section style={{ marginBottom: "3rem" }}>
          <h3>Typography</h3>
          <p>
            Set in <em>Fraunces</em> (display and body, opsz + wght axes),{" "}
            <em>Inter</em> (interface), and <em>JetBrains Mono</em> (data and code). All
            three are variable, self-hosted, preloaded, and licensed under the SIL Open
            Font License.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h3>Lineage</h3>
          <p>
            Praxeos is a child of a lineage of explorable explanations. It owes a debt
            to Bret Victor, Nicky Case, Bartosz Ciechanowski, Edward Tufte, Stripe
            Press, The Pudding, and the Observable notebook community. If it falls short
            of their craft, the failure is ours; where it succeeds, the credit is
            shared.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h3>Ideas</h3>
          <p>
            The ideas rendered here are not ours — they belong to <em>Carl Menger</em>,{" "}
            <em>Eugen von Böhm-Bawerk</em>, <em>Ludwig von Mises</em>,{" "}
            <em>F. A. Hayek</em>, <em>Murray Rothbard</em>, <em>Israel Kirzner</em>,{" "}
            <em>Ludwig Lachmann</em>, <em>Hans-Hermann Hoppe</em>,{" "}
            <em>Joseph Salerno</em>, and <em>Saifedean Ammous</em>, among others. Every
            module attempts to cite a primary source rather than paraphrase one.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h3>License</h3>
          <p>
            Code is released under the <code>MIT License</code>. Essays, modules, and
            generated artworks are released under{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
            Translate, remix, quote, classroom-use freely — with attribution.
          </p>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h3>Author</h3>
          <p>
            Praxeos is written and built by <em>William Menjivar</em>. Feedback,
            corrections, and module proposals are welcomed.
          </p>
        </section>

        <hr />

        <p
          className="label-mono"
          style={{
            textAlign: "center",
            marginTop: "3rem",
            color: "var(--ink-tertiary)",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            ← Return
          </Link>
        </p>
      </article>
    </SiteChrome>
  );
}
