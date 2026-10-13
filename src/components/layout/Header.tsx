"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS: Array<{ href: string; label: string }> = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/labs", label: "Labs" },
  { href: "/notebook", label: "Notebook" },
  { href: "/sources", label: "Sources" },
  { href: "/built", label: "How It Was Built" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(mobileOpen);

  // Close on Escape; return focus to button when closing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (prevOpenRef.current && !mobileOpen) {
      menuBtnRef.current?.focus();
    }
    prevOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          href="/"
          prefetch={false}
          aria-label="Praxeos home"
          style={{
            textDecoration: "none",
            fontFamily: "var(--font-serif)",
            fontVariationSettings: '"opsz" 36',
            fontWeight: 500,
            fontSize: "var(--step-1)",
            letterSpacing: "-0.01em",
            color: "var(--ink-primary)",
          }}
        >
          Praxeos<span style={{ color: "var(--ink-tertiary)" }}>.</span>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="only-desktop"
          style={{ flex: "1 1 auto", minWidth: 0 }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              gap: "0.75rem 1rem",
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className={
                    link.href === "/built" ? "label-mono nav-meta" : "label-mono"
                  }
                  aria-current={current(link.href) ? "page" : undefined}
                  style={{ textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>

        {/* Mobile controls */}
        <div
          className="only-mobile"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <ThemeToggle />
          <button
            ref={menuBtnRef}
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              padding: "0.5rem",
              cursor: "pointer",
              color: "var(--ink-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile primary"
          className="only-mobile"
          style={{
            marginBlockStart: "1rem",
            paddingBlockStart: "1rem",
            borderBlockStart: "1px solid var(--rule)",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className={
                    link.href === "/built" ? "label-mono nav-meta" : "label-mono"
                  }
                  aria-current={current(link.href) ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: "none",
                    color: "var(--ink-secondary)",
                    display: "block",
                    paddingBlock: "0.35rem",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      aria-hidden="true"
      style={{
        transition: "transform var(--dur-micro) var(--ease-organic)",
      }}
    >
      {open ? (
        <>
          <path
            d="M2 2 L20 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 14 L20 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="M1 2 L21 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 8 L21 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M1 14 L21 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
