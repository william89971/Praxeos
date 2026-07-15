import { expect, test } from "@playwright/test";

test("lesson overview resumes local progress and names its Lab connection", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/learn");
  await expect(page.getByText("0 of 11", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Begin lesson 1" }).click();
  await expect(
    page.getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /The Choice Machine/ })).toBeVisible();
  await page.getByRole("button", { name: "Mark lesson complete" }).click();
  await expect(page.getByText(/stored only in this browser/)).toBeVisible();
  await page.goto("/learn");
  await expect(page.getByText("1 of 11", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resume lessons" })).toBeVisible();
});

test("Practice rotates a UTC case and Sources exposes evidence boundaries", async ({
  page,
}) => {
  await page.goto("/practice");
  await expect(page.getByText(/Try this today · rotates by UTC date/i)).toBeVisible();
  await expect(page.locator(".daily-case h2")).not.toBeEmpty();
  await expect(page.locator(".daily-case a")).toContainText("Continue in");
  await page.goto("/sources");
  await expect(page.getByText("Austrian interpretation").first()).toBeVisible();
  await expect(page.getByText("credible counterargument").first()).toBeVisible();
  await expect(page.locator(".source-verification-note").first()).toBeVisible();
});
