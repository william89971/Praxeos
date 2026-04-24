import { expect, test } from "@playwright/test";

test("homepage exposes the core editorial surface", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Praxeos/i);
  await expect(page.getByRole("heading", { name: "PRAXEOS" })).toBeVisible();
  await expect(
    page.getByText("Explorable explanations for Austrian economics."),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Read the manifesto/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /The Halving Garden/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Time Preference Forest/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /The Calculation Problem/i }),
  ).toBeVisible();
});
