import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        borderBlockStart: "1px solid var(--rule)",
        background: "var(--paper-elevated)",
        marginBlockStart: "auto",
      }}
    >
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
            Keep noticing choices.
          </p>
          <p
            className="label-mono"
            style={{ color: "var(--ink-tertiary)", maxWidth: "60ch" }}
          >
            A student-friendly place to learn praxeology through ordinary life. Written
            and built by William Menjivar.
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
          <Link href="/learn" className="label-mono">
            Learn
          </Link>
          <Link href="/practice" className="label-mono">
            Practice
          </Link>
          <Link href="/labs" className="label-mono">
            Labs
          </Link>
          <Link href="/sources" className="label-mono">
            Sources
          </Link>
          <Link href="/built" className="label-mono">
            How It Was Built
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
