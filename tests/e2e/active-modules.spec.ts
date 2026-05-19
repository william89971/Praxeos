import { type Locator, type Page, expect, test } from "@playwright/test";

test.describe("active module interactives", () => {
  test("Monetary Garden hydrates query state and exposes controls", async ({
    page,
  }) => {
    await page.goto(
      "/modules/monetary-garden?credit=0.82&savings=0.21&phase=correction",
    );

    await expect(
      page.getByRole("heading", { name: /The Monetary Garden/i }),
    ).toBeVisible();
    await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
    await waitForInteractiveHydration(page);
    await expect(moduleStage(page)).toBeVisible();
    await expectVisualSurface(page);
    await expect(page.getByText("Your task").first()).toBeVisible();

    const credit = page.getByRole("slider", { name: "Credit expansion" });
    const savings = page.getByRole("slider", { name: "Savings backing" });
    await expect(credit).toHaveValue("0.82");
    await expect(savings).toHaveValue("0.21");
    await expect(
      page.getByRole("button", { name: "Correction revealed" }),
    ).toHaveAttribute("aria-pressed", "true");

    await setRangeValue(credit, "0.64");
    await expect(page).toHaveURL(/credit=0\.64/);
  });

  test("Signal Orchard hydrates mode/action and logs actions", async ({ page }) => {
    await page.goto("/modules/signal-orchard?mode=explore&action=sell");

    await expect(
      page.getByRole("heading", { name: /The Signal Orchard/i }),
    ).toBeVisible();
    await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
    await waitForInteractiveHydration(page);
    await expect(moduleStage(page)).toBeVisible();
    await expectVisualSurface(page);
    await expect(page.getByText("Your task").first()).toBeVisible();

    await expect(page.getByRole("button", { name: "Explore" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("button", { name: "Sell" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: "Discover" }).click();
    await expect(page).toHaveURL(/action=discover/);
  });

  test("Signal Orchard action selector exits guided mode in shared URL", async ({
    page,
  }) => {
    await page.goto("/modules/signal-orchard?mode=guided&action=buy");

    await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
    await waitForInteractiveHydration(page);
    await page.getByRole("button", { name: "Discover" }).click();

    await expect(page).toHaveURL(/mode=explore/);
    await expect(page).toHaveURL(/action=discover/);
  });

  test("Calculation Labyrinth hydrates query state and movement controls", async ({
    page,
  }) => {
    await page.goto("/modules/calculation-labyrinth?priced=0&challenge=3");

    await expect(
      page.getByRole("heading", { name: /The Calculation Labyrinth/i }),
    ).toBeVisible();
    await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
    await waitForInteractiveHydration(page);
    await expect(moduleStage(page)).toBeVisible();
    await expectVisualSurface(page);
    await expect(page.getByText("Your task").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "No prices" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByText(/Waste 0/i)).toBeVisible();

    await page.getByRole("button", { name: "Prices", exact: true }).click();
    await expect(page).toHaveURL(/priced=1/);
  });

  test("Coordination Engine hydrates query state and exposes synchrony controls", async ({
    page,
  }) => {
    await page.goto(
      "/modules/coordination-engine?mode=explore&reliability=0.35&latency=0.7",
    );

    await expect(
      page.getByRole("heading", { name: /The Coordination Engine/i }),
    ).toBeVisible();
    await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
    await waitForInteractiveHydration(page);
    await expect(moduleStage(page)).toBeVisible();
    await expectVisualSurface(page);
    await expect(page.getByText("Your task").first()).toBeVisible();

    const reliability = page.getByRole("slider", { name: "Signal reliability" });
    const latency = page.getByRole("slider", { name: "Latency" });
    await expect(reliability).toHaveValue("0.35");
    await expect(latency).toHaveValue("0.7");

    await page.getByRole("button", { name: "Inject shock" }).click();
    await expect(page).toHaveURL(/mode=explore/);
  });
});

test.describe("mobile module layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const slug of [
    "monetary-garden",
    "signal-orchard",
    "calculation-labyrinth",
    "coordination-engine",
  ]) {
    test(`${slug} stacks scene and controls on mobile`, async ({ page }) => {
      await page.goto(`/modules/${slug}`);

      await page.getByLabel("Opening interactive").scrollIntoViewIfNeeded();
      await waitForInteractiveHydration(page);
      await expect(page.getByLabel("Module interactive")).toBeVisible();
      await expect(page.getByText("Continue reading").first()).toBeVisible();
      await expect(page.getByRole("link", { name: /Continue reading/i })).toBeVisible();
      await expect(page.getByRole("link", { name: "Task" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Essay" })).toBeVisible();
    });
  }
});

function moduleStage(page: Page): Locator {
  return page.getByLabel("Module hero").or(page.getByLabel("Module interactive"));
}

async function expectVisualSurface(page: Page) {
  await expect(
    page.locator(
      '[aria-label="Module hero"] canvas, [aria-label="Module interactive"] canvas, [aria-label="Module hero"] img, [aria-label="Module interactive"] img',
    ),
  ).toBeVisible();
}

async function setRangeValue(locator: Locator, value: string) {
  await locator.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, nextValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function waitForInteractiveHydration(page: Page) {
  await page.waitForFunction(
    () => document.querySelectorAll("[data-interactive]").length > 0,
  );
  await page.waitForTimeout(300);
}
