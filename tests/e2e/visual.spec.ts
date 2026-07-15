import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Page, expect, test } from "@playwright/test";

const snapshotFontFiles = new Map([
  [
    "fraunces.woff2",
    readFileSync(
      resolve(
        "node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2",
      ),
    ),
  ],
  [
    "inter.woff2",
    readFileSync(
      resolve(
        "node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
      ),
    ),
  ],
  [
    "jetbrains-mono.woff2",
    readFileSync(
      resolve(
        "node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
      ),
    ),
  ],
]);

const snapshotFonts = `
  @font-face {
    font-family: "Praxeos Snapshot Serif";
    src: url("/__snapshot-fonts/fraunces.woff2") format("woff2");
    font-style: normal;
    font-weight: 100 900;
  }
  @font-face {
    font-family: "Praxeos Snapshot Sans";
    src: url("/__snapshot-fonts/inter.woff2") format("woff2");
    font-style: normal;
    font-weight: 100 900;
  }
  @font-face {
    font-family: "Praxeos Snapshot Mono";
    src: url("/__snapshot-fonts/jetbrains-mono.woff2") format("woff2");
    font-style: normal;
    font-weight: 100 800;
  }
  :root {
    --font-serif: "Praxeos Snapshot Serif", serif !important;
    --font-sans: "Praxeos Snapshot Sans", sans-serif !important;
    --font-mono: "Praxeos Snapshot Mono", monospace !important;
  }
`;

const snapshotTolerance = process.env.CI
  ? { maxDiffPixelRatio: 0.04 }
  : { maxDiffPixels: 50 };

async function prepareSnapshot(page: Page, route: string) {
  await page.goto(route);
  await page.addStyleTag({ content: snapshotFonts });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function routeSnapshotFonts(page: Page) {
  await page.route("**/__snapshot-fonts/*.woff2", async (route) => {
    const filename = new URL(route.request().url()).pathname.split("/").at(-1);
    const body = filename ? snapshotFontFiles.get(filename) : undefined;
    if (!body) {
      await route.abort();
      return;
    }
    await route.fulfill({ body, contentType: "font/woff2" });
  });
}

const visualLabs = [
  "choice-machine",
  "market-without-a-manager",
  "entrepreneurs-discovery",
  "money-time-machine",
] as const;

test("flagship visual surfaces stay stable", async ({ page }) => {
  test.skip(
    !["desktop-chromium", "mobile-chromium", "reduced-motion"].includes(
      test.info().project.name,
    ),
    "Snapshot projects only",
  );
  await routeSnapshotFonts(page);
  await prepareSnapshot(page, "/");
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    animations: "disabled",
    ...snapshotTolerance,
  });
  await prepareSnapshot(page, "/labs/market-without-a-manager?mode=guided");
  await expect(page).toHaveScreenshot("market-guided.png", {
    fullPage: true,
    animations: "disabled",
    ...snapshotTolerance,
  });
  await prepareSnapshot(page, "/labs");
  await expect(page).toHaveScreenshot("labs-index.png", {
    fullPage: true,
    animations: "disabled",
    ...snapshotTolerance,
  });

  for (const slug of visualLabs) {
    await prepareSnapshot(page, `/labs/${slug}?mode=guided`);
    await expect(page).toHaveScreenshot(`lab-cover-${slug}.png`, {
      fullPage: false,
      animations: "disabled",
      ...snapshotTolerance,
    });
  }

  await prepareSnapshot(page, "/labs/market-without-a-manager?mode=guided");
  await page.getByRole("button", { name: "Meet the participants" }).click();
  await expect(page).toHaveScreenshot("market-first-consequence.png", {
    fullPage: false,
    animations: "disabled",
    ...snapshotTolerance,
  });

  await prepareSnapshot(page, "/labs");
  await page.getByRole("button", { name: /^Theme: Auto/ }).click();
  await page.getByRole("button", { name: /^Theme: Light/ }).click();
  await expect(page).toHaveScreenshot("labs-index-dark.png", {
    fullPage: false,
    animations: "disabled",
    ...snapshotTolerance,
  });
});
