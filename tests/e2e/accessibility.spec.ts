import { expect, test } from "@playwright/test";

test("keyboard navigation reaches the primary action", async ({ page }) => {
  test.skip(
    test.info().project.name === "desktop-webkit",
    "Playwright WebKit on Windows does not synthesize full-keyboard-access Tab focus.",
  );
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  for (let index = 0; index < 10; index += 1) {
    if (
      await page
        .getByRole("link", { name: "Begin 8-minute journey" })
        .evaluate((element) => element === document.activeElement)
    )
      break;
    await page.keyboard.press("Tab");
  }
  await expect(
    page.getByRole("link", { name: "Begin 8-minute journey" }),
  ).toBeFocused();
});

test("reduced motion keeps full lab controls and readable state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/labs/calculation-labyrinth?priced=1&challenge=1");
  await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
  await expect(page.getByAltText(/Calculation Labyrinth poster/i)).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Prices", exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /North|East|South|West/i }).first(),
  ).toBeVisible();
  await expect(page.getByText(/Waste 0/i)).toBeVisible();
});

test("mobile flagship controls meet the touch target floor", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium", "Mobile project only");
  await page.goto("/journey/calculation-labyrinth");
  const box = await page
    .getByRole("button", { name: "Identify the choice" })
    .boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(
    page.getByRole("heading", { name: "The Calculation Labyrinth" }),
  ).toBeVisible();
});

test("advanced lab progress is persisted without a render loop", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/labs/calculation-labyrinth");
  await expect(page.getByText("Your task")).toBeVisible();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const raw = window.localStorage.getItem("praxeos.learning.v2");
          if (!raw) return false;
          const store = JSON.parse(raw) as {
            labProgress?: Record<string, { visited?: boolean }>;
          };
          return store.labProgress?.["calculation-labyrinth"]?.visited === true;
        }),
      { timeout: 3_000 },
    )
    .toBe(true);
  expect(
    consoleErrors.filter((message) => message.includes("Maximum update depth")),
  ).toEqual([]);
});
