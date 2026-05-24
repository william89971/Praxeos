import Link from "next/link";
import { ThinkerFooterSection } from "./ThinkerFooterSection";

export function Footer() {
  return (
    <footer
      style={{
        borderBlockStart: "1px solid var(--rule)",
        background: "var(--paper-elevated)",
        marginBlockStart: "auto",
      }}
    >
      <ThinkerFooterSection />
      <div
        style={{
          maxWidth: "var(--measure-wide)",
          marginInline: "auto",
          paddingInline: "var(--gutter-inline)",
          paddingBlock: "var(--gutter-block)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "var(--step-1)",
              color: "var(--ink-primary)",
              marginBlock: 0,
              marginBlockEnd: "0.5rem",
            }}
          >
            Homo agit.
          </p>
          <p
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
          >
            A practical training ground for seeing human action clearly. Written and
            built by William Menjivar.
          </p>
        </div>

        <nav
          aria-label="Footer"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "end",
          }}
        >
          <Link href="/learn/praxeology-101" className="label-mono">
            Praxeology 101
          </Link>
          <Link href="/cases" className="label-mono">
            Daily Cases
          </Link>
          <Link href="/manifesto" className="label-mono">
            Manifesto
          </Link>
          <Link href="/colophon" className="label-mono">
            Colophon
          </Link>
          <Link href="/rss.xml" className="label-mono">
            RSS
          </Link>
          <a
            href="https://github.com/william89971/praxeos"
            className="label-mono"
            rel="noopener"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
