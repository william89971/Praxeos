import { expect, test } from "@playwright/test";

test("flagship visual surfaces stay stable", async ({ page }) => {
  test.skip(
    !["desktop-chromium", "mobile-chromium", "reduced-motion"].includes(
      test.info().project.name,
    ),
    "Snapshot projects only",
  );
  await page.goto("/");
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixels: 50,
  });
  await page.goto("/journey/calculation-labyrinth");
  await expect(page).toHaveScreenshot("journey-brief.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixels: 50,
  });
  await page.goto("/labs");
  await expect(page).toHaveScreenshot("labs-index.png", {
    fullPage: true,
    animations: "disabled",
    maxDiffPixels: 50,
  });
});
