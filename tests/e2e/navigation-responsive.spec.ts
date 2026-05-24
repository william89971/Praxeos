import { expect, test } from "@playwright/test";

test("desktop header exposes the primary learning routes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const label of [
    "Start Here",
    "Practice",
    "Words",
    "Thinkers",
    "Old Stuff",
    "Why This Exists",
  ]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
});

test("tablet header stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  const fitsViewport = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(fitsViewport).toBe(true);

  const headerBox = await page.locator("header").first().boundingBox();
  expect(headerBox).not.toBeNull();
  expect((headerBox?.x ?? 0) + (headerBox?.width ?? 0)).toBeLessThanOrEqual(820);
});

test("mobile menu navigates to cases and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile primary" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: "Practice" }).click();

  await expect(page).toHaveURL(/\/cases$/);
  await expect(
    page.getByRole("heading", { name: "Practice without a lecture." }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile primary" })).toHaveCount(0);
});
