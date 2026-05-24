import { expect, test } from "@playwright/test";

test("homepage exposes the praxeology practice surface", async ({ page }) => {
  test.slow();
  await page.goto("/");

  await expect(page).toHaveTitle(/Praxeos/i);
  await expect(
    page.getByRole("heading", { name: /Learn praxeology with real-life choices/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Start the intro/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Try a daily case/i })).toBeVisible();
  await expect(page.getByText("Practice box").first()).toBeVisible();
  await expect(page.getByText("Learn one choice at a time.")).toBeVisible();
  await expect(page.getByText("Try this today")).toBeVisible();
  await expect(page.getByText("My saved notes")).toBeVisible();
  await expect(page.getByText("No need to sound academic.")).toBeVisible();
  await expect(page.locator('a[href="/learn/praxeology-101"]').first()).toBeAttached();
  await expect(page.locator('a[href="/cases"]').first()).toBeAttached();
});
