import { expect, test } from "@playwright/test";

for (const route of [
  "/",
  "/labs",
  "/labs/choice-machine",
  "/labs/market-without-a-manager",
  "/labs/entrepreneurs-discovery",
  "/labs/money-time-machine",
]) {
  test(`${route} avoids page-level horizontal overflow`, async ({ page }) => {
    await page.goto(route);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.locator("canvas")).toHaveCount(0);
  });
}

test("200 percent layout equivalent keeps the flagship action usable", async ({
  page,
}) => {
  test.skip(test.info().project.name !== "desktop-chromium", "One zoom layout project");
  await page.setViewportSize({ width: 720, height: 540 });
  await page.goto("/labs/market-without-a-manager?mode=guided");
  await expect(
    page.getByRole("button", { name: "Meet the participants" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("forced colors preserves semantic controls and structured state", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "desktop-chromium",
    "One forced-colors project",
  );
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/labs/choice-machine?mode=guided");
  await expect(page.getByRole("button", { name: "Inspect the limits" })).toBeVisible();
  await expect(page.getByText(/Read the structured simulation record/i)).toBeVisible();
});
