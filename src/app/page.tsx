import { SiteChrome } from "@/components/layout/SiteChrome";
import { WebsiteJsonLd } from "@/components/seo/JsonLd";
import { DAILY_CASES } from "@/lib/praxeology";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const day = Math.floor(Date.now() / 86_400_000);
  const dailyCase = DAILY_CASES[day % DAILY_CASES.length];
  return (
    <SiteChrome>
      <WebsiteJsonLd />
      <main>
        <section className="editorial-hero">
          <div className="editorial-hero__copy">
            <p className="label-mono">Interactive learning laboratory</p>
            <h1>See the structure inside every choice.</h1>
            <p>
              Learn to notice actors, ends, means, tradeoffs, prices, and scattered
              knowledge through short cases, deterministic simulations, source-grounded
              guidance, and reflection.
            </p>
            <div className="editorial-actions">
              <Link href="/labs/market-without-a-manager?mode=guided">
                Begin 8-minute journey
              </Link>
              <Link href="/labs">Explore labs</Link>
            </div>
          </div>
          <aside className="editorial-hero__aside">
            <Image
              className="editorial-hero__image"
              src="/images/editorial/home-hero.webp"
              width={1600}
              height={900}
              sizes="(max-width: 760px) 100vw, 34vw"
              priority
              alt="Tactile illustrated desk with a notebook branching into everyday choices among time, study, health, relationships, and groceries."
            />
            <p className="label-mono">Market Without a Manager</p>
            <strong>
              5 people
              <br />6 goods
              <br />
              no director
            </strong>
            <p>
              Make and reject offers, watch prices emerge from completed trades, then
              test what changes when information is incomplete or a ceiling binds.
            </p>
          </aside>
        </section>
        <section className="editorial-grid" aria-label="Ways to learn">
          <Link className="editorial-card" href="/learn">
            <small>01 · Learn</small>
            <div>
              <h2>Eleven focused lessons</h2>
              <p>
                One concept, one practical activity, and one lab connection at a time.
              </p>
            </div>
          </Link>
          <Link className="editorial-card" href={`/practice#${dailyCase?.slug ?? ""}`}>
            <small>02 · Try this today</small>
            <div>
              <h2>{dailyCase?.title ?? "A daily choice"}</h2>
              <p>{dailyCase?.scenario}</p>
            </div>
          </Link>
          <Link className="editorial-card" href="/notebook">
            <small>03 · Notebook</small>
            <div>
              <h2>Reasoning that changes</h2>
              <p>
                Keep the first interpretation, feedback, revision, citations, and final
                reflection together.
              </p>
            </div>
          </Link>
        </section>
      </main>
    </SiteChrome>
  );
}
