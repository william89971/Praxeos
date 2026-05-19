import { expect, test } from "@playwright/test";

test("homepage exposes the core editorial surface", async ({ page }) => {
  test.slow();
  await page.goto("/");

  await expect(page).toHaveTitle(/Praxeos/i);
  await expect(
    page.getByRole("heading", { name: "PRAXEOS", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Four simulations · one mental model")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Begin Beginner Path/i }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Explore the four modules/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read the manifesto", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Complete four simulations").first()).toBeVisible();
  await expect(page.getByText(/Built from Mises, Hayek/i)).toBeVisible();
  await expect(
    page.locator('a[href="/modules/monetary-garden"]').first(),
  ).toBeAttached();
  await expect(
    page.locator('a[href="/modules/signal-orchard"]').first(),
  ).toBeAttached();
  await expect(
    page.locator('a[href="/modules/calculation-labyrinth"]').first(),
  ).toBeAttached();
  await expect(
    page.locator('a[href="/modules/coordination-engine"]').first(),
  ).toBeAttached();
  await expect(page.getByText("People Behind the Method")).toBeVisible();
});
