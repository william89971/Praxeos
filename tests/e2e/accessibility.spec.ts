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
  await page.goto("/labs/market-without-a-manager?mode=guided");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Meet the participants" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Meet the participants" }).click();
  await expect(
    page
      .getByRole("complementary", { name: "Evidence and change summary" })
      .getByText(/Each person arrives with different goods/),
  ).toBeVisible();
  await expect(page.getByText(/Read the structured market record/)).toBeVisible();
});

test("mobile flagship controls meet the touch target floor", async ({ page }) => {
  test.skip(test.info().project.name !== "mobile-chromium", "Mobile project only");
  await page.goto("/labs/market-without-a-manager?mode=guided");
  const box = await page
    .getByRole("button", { name: "Meet the participants" })
    .boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(
    page.getByRole("heading", { name: "Market Without a Manager" }),
  ).toBeVisible();
});

test("advanced lab progress is persisted without a render loop", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/labs/market-without-a-manager");
  await page.getByRole("button", { name: "Meet the participants" }).click();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const raw = window.localStorage.getItem("praxeos.learning.v3");
          if (!raw) return false;
          const store = JSON.parse(raw) as {
            labSessions?: Record<string, Array<{ guidedStep?: number }>>;
          };
          return store.labSessions?.["market-without-a-manager"]?.[0]?.guidedStep === 1;
        }),
      { timeout: 3_000 },
    )
    .toBe(true);
  expect(
    consoleErrors.filter((message) => message.includes("Maximum update depth")),
  ).toEqual([]);
});
