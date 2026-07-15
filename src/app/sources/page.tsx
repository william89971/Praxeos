import { SiteChrome } from "@/components/layout/SiteChrome";
import { SOURCE_PACKETS } from "@/lib/source-packets";
import { THINKERS } from "@/lib/thinkers";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sources",
  description:
    "Primary sources, stable locators, thinkers, glossary, and the project manifesto.",
};
export default function SourcesPage() {
  return (
    <SiteChrome>
      <main className="page-shell">
        <header className="page-section content-header content-header--illustrated">
          <div>
            <p className="label-mono">Sources · inspect the grounding</p>
            <h1 className="editorial-heading">Read past the interface.</h1>
            <p>
              Guide explanations are limited to allowlisted packets that show the claim,
              stable URL, and locator. The source itself—not an AI summary—remains the
              place to verify an argument.
            </p>
            <div className="editorial-actions">
              <Link href="/sources/glossary">Open glossary</Link>
              <Link href="#thinkers">Browse thinkers</Link>
            </div>
          </div>
          <figure className="transition-figure">
            <Image
              src="/images/labs/market-without-a-manager.webp"
              alt="Cut-paper market with five participants exchanging goods around a shared record."
              width={1200}
              height={675}
              sizes="(max-width: 760px) 100vw, 38vw"
            />
          </figure>
        </header>
        <section className="page-section content-grid">
          {SOURCE_PACKETS.map((packet) => (
            <a
              className="content-card"
              href={packet.url}
              target="_blank"
              rel="noreferrer"
              key={packet.id}
            >
              <small>
                {packet.kind} · {packet.author} · {packet.locator}
              </small>
              <div>
                <h2>{packet.title}</h2>
                <p>{packet.claims.join(" ")}</p>
                <p className="source-verification-note">{packet.verificationNote}</p>
              </div>
              <span>Open primary source ↗</span>
            </a>
          ))}
        </section>
        <header id="thinkers" className="page-section content-header">
          <p className="label-mono">Thinkers</p>
          <h2 className="editorial-heading">Arguments in context.</h2>
        </header>
        <section className="page-section content-grid">
          {THINKERS.map((thinker) => (
            <Link
              className="content-card"
              href={`/sources/thinkers/${thinker.slug}`}
              key={thinker.slug}
            >
              <small>
                {thinker.dates} · {thinker.group}
              </small>
              <div>
                <h2>{thinker.name}</h2>
                <p>{thinker.contribution}</p>
              </div>
            </Link>
          ))}
        </section>
        <section id="manifesto" className="page-section content-header">
          <p className="label-mono">Manifesto · migrated</p>
          <h2 className="editorial-heading">
            The interaction must carry the argument.
          </h2>
          <p>
            Praxeos exists to make difficult economic distinctions inspectable without
            turning them into spectacle or claiming that a simulation settles a moral or
            empirical debate. Sources stay visible; uncertainty stays visible; the
            learner keeps the final judgment.
          </p>
        </section>
      </main>
    </SiteChrome>
  );
}
