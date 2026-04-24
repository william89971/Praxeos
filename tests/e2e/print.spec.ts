import { expect, test } from "@playwright/test";

test("print route renders a chrome-free manifesto edition", async ({ page }) => {
  await page.goto("/manifesto-print");

  await expect(page.locator("[data-manifesto-print]")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Ends and Means/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Praxeos home/i })).toHaveCount(0);
});
