import { expect, test } from "@playwright/test";

test("reduced motion swaps immersive sketches for poster fallbacks", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/modules/halving-garden");

  await expect(page.getByAltText("The Halving Garden poster frame.")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
});
