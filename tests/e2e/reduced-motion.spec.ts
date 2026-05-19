import { expect, test } from "@playwright/test";

const ACTIVE_MODULES = [
  { slug: "monetary-garden", poster: /The Monetary Garden poster/i },
  { slug: "signal-orchard", poster: /The Signal Orchard poster/i },
  { slug: "calculation-labyrinth", poster: /The Calculation Labyrinth poster/i },
  { slug: "coordination-engine", poster: /The Coordination Engine poster/i },
] as const;

for (const module of ACTIVE_MODULES) {
  test(`${module.slug} reduced motion renders poster and no canvas`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/modules/${module.slug}`);

    await expect(page.getByAltText(module.poster)).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
  });
}
