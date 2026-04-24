#!/usr/bin/env tsx
/**
 * Capture press-kit screenshots.
 *
 * Runs a headless Chromium session against the dev server (or any URL set
 * via PRAXEOS_BASE_URL), captures each listed page at 2560 × 1440 in both
 * themes, and writes to `public/press/screenshots/{route}-{theme}.png`.
 *
 *   PRAXEOS_BASE_URL=http://localhost:3001 npm run capture:screenshots
 *
 * Requires `npx playwright install chromium` to have been run once.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL =
  process.env.PRAXEOS_BASE_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3001";

const TARGETS: Array<{ slug: string; path: string; wait?: number }> = [
  { slug: "home", path: "/", wait: 2500 },
  { slug: "halving-garden", path: "/modules/halving-garden", wait: 3500 },
  { slug: "time-preference-forest", path: "/modules/time-preference-forest", wait: 2000 },
  { slug: "calculation-problem", path: "/modules/calculation-problem", wait: 2000 },
  { slug: "manifesto", path: "/manifesto", wait: 1000 },
  { slug: "glossary", path: "/glossary", wait: 1000 },
  { slug: "thinkers", path: "/thinkers", wait: 1000 },
];

const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

const OUT_DIR = path.join(process.cwd(), "public/press/screenshots");

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const theme of THEMES) {
    const context = await browser.newContext({
      viewport: { width: 2560, height: 1440 },
      deviceScaleFactor: 1,
      colorScheme: theme === "dark" ? "dark" : "light",
      reducedMotion: "reduce", // snapshot deterministic paints, no mid-animation
    });
    // Honour the next-themes cookie/localStorage convention where possible.
    await context.addInitScript((t: Theme) => {
      try {
        window.localStorage.setItem("theme", t);
      } catch {
        /* ignore storage write failures */
      }
    }, theme);

    for (const target of TARGETS) {
      const page = await context.newPage();
      const url = `${BASE_URL}${target.path}`;
      console.log(`  → ${theme} · ${target.slug}  (${url})`);
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
      } catch (err) {
        console.warn(`     load warning: ${(err as Error).message}`);
      }
      if (target.wait) {
        await page.waitForTimeout(target.wait);
      }

      const outPath = path.join(OUT_DIR, `${target.slug}-${theme}.png`);
      await page.screenshot({ path: outPath, fullPage: false });
      await page.close();
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n  ✓ captured ${TARGETS.length * THEMES.length} screenshots → ${path.relative(process.cwd(), OUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
