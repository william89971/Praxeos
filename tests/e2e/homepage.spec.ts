import { expect, test } from "@playwright/test";

test("homepage exposes the praxeology practice surface", async ({ page }) => {
  test.slow();
  await page.goto("/");

  await expect(page).toHaveTitle(/Praxeos/i);
  await expect(
    page.getByRole("heading", { name: /Learn to see human action clearly/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Start Praxeology 101/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Practice daily cases/i })).toBeVisible();
  await expect(page.getByText("Action Analyzer").first()).toBeVisible();
  await expect(page.getByText("Train the logic of action.")).toBeVisible();
  await expect(page.getByText("Today's case")).toBeVisible();
  await expect(page.getByText("Saved insights")).toBeVisible();
  await expect(page.getByText("Praxeology is not history first.")).toBeVisible();
  await expect(page.locator('a[href="/learn/praxeology-101"]').first()).toBeAttached();
  await expect(page.locator('a[href="/cases"]').first()).toBeAttached();
});
