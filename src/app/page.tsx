import { SiteChrome } from "@/components/layout/SiteChrome";
import { StartHere } from "@/components/learning/StartHere";
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
      <div>
        <section className="editorial-hero">
          <div className="editorial-hero__copy">
            <p className="label-mono">A place to learn praxeology</p>
            <h1>See the structure inside every choice.</h1>
            <p>
              Praxeology is the study of purposeful action. You will practice noticing
              who is acting, what end they are seeking, what means they use, and which
              alternative they give up.
            </p>
            <div className="editorial-actions">
              <StartHere />
              <Link href="/labs">See the four labs</Link>
            </div>
          </div>
          <aside className="editorial-hero__aside">
            <Image
              className="editorial-hero__image"
              src="/images/labs/market-without-a-manager.webp"
              width={1200}
              height={675}
              sizes="(max-width: 760px) 100vw, 34vw"
              priority
              alt="Cut-paper market with five participants exchanging bread, apples, tea, cloth, and a tool."
            />
            <p className="label-mono">Featured demonstration · 8–10 minutes</p>
            <strong>
              5 people
              <br />5 goods
              <br />
              no director
            </strong>
            <p>
              Market Without a Manager lets you watch offers, refusals, and prices among
              five people and five goods: apples, bread, cloth, tea, and tools.
            </p>
            <Link href="/labs/market-without-a-manager?mode=guided">
              Open the market demonstration
            </Link>
          </aside>
        </section>
        <section className="editorial-grid" aria-label="Ways to learn">
          <Link className="editorial-card" href="/learn">
            <small>01 · Learn</small>
            <div>
              <h2>Eleven focused lessons</h2>
              <p>
                One concept at a time, then a lab when you are ready to watch it move.
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
              <h2>A record you can resume</h2>
              <p>
                Lessons, sketches, and lab notes stay in this browser. They are not
                synced, and clearing site data removes them.
              </p>
            </div>
          </Link>
        </section>
      </div>
    </SiteChrome>
  );
}
