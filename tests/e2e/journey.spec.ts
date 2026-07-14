import { type Page, expect, test } from "@playwright/test";

async function reachRevision(page: Page) {
  await page.goto("/journey/calculation-labyrinth");
  await page.getByRole("button", { name: "Identify the choice" }).click();
  let fields = page.locator(".reasoning-field textarea");
  await fields.nth(0).fill("The student team decides how to plan the school event.");
  await fields
    .nth(1)
    .fill("The student team wants a welcoming event so that families attend.");
  await fields
    .nth(2)
    .fill("They use the $1,200 budget and 20 volunteer-hours to provide food.");
  await page.getByRole("button", { name: "Continue to tradeoffs" }).click();
  fields = page.locator(".reasoning-field textarea");
  await fields
    .nth(0)
    .fill("Only the limited $1,200 budget and 20 hours force choices.");
  await fields
    .nth(1)
    .fill(
      "They give up student food stalls instead of local carts as the next best plan.",
    );
  await fields
    .nth(2)
    .fill(
      "Price markers help compare each path and reduce resource waste and uncertainty.",
    );
  await page.getByRole("button", { name: "Enter the priced maze" }).click();
  await page.locator(".maze-cell").nth(0).click();
  await page.locator(".maze-cell").nth(3).click();
  await page.getByRole("button", { name: "Save run and remove prices" }).click();
  await page.locator(".maze-cell").nth(1).click();
  await page.locator(".maze-cell").nth(4).click();
  await page.getByRole("button", { name: "Compare both runs" }).click();
}

test("full journey persists through refresh, uses fallback, and exports", async ({
  page,
}) => {
  await reachRevision(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: /run does not grade/i }),
  ).toBeVisible();
  await page
    .locator(".reasoning-field textarea")
    .fill(
      "Price markers helped compare the hall path, reduced resource waste, and made uncertainty visible.",
    );
  await page.getByRole("button", { name: "Ask one question" }).click();
  await expect(page.getByText(/Deterministic fallback/)).toBeVisible();
  await expect(page.locator(".guide-question")).toContainText("?");
  await page.getByRole("button", { name: "Write final reflection" }).click();
  await page
    .locator(".reasoning-field textarea")
    .fill(
      "Prices can reveal comparative scarcity, but they cannot choose the school community’s ends or values.",
    );
  await page.getByRole("button", { name: "Complete journey" }).click();
  await expect(page.getByText(/Journey complete/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Download Markdown" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download reflection card" }),
  ).toBeVisible();
});

test("mocked cited Claude turn is rendered with grounding", async ({ page }) => {
  await reachRevision(page);
  await page.route("**/api/guide", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        providerMode: "claude",
        question: "Which path choice most clearly changed your uncertainty?",
        blocks: [
          {
            category: "concept",
            text: "Prices can make unlike plans comparable.",
            citations: [
              {
                sourceId: "mises",
                title: "Economic Calculation",
                url: "https://mises.org/",
                locator: "Sections II–IV",
              },
            ],
          },
        ],
        citations: [
          {
            sourceId: "mises",
            title: "Economic Calculation",
            url: "https://mises.org/",
            locator: "Sections II–IV",
          },
        ],
        whyThisFeedback: "Only the current revision and source packet were used.",
        insufficiency: "none",
        retryAfterSeconds: null,
      }),
    }),
  );
  await page
    .locator(".reasoning-field textarea")
    .fill(
      "Price markers helped compare the hall path and reduced resource waste and uncertainty.",
    );
  await page.getByRole("button", { name: "Ask one question" }).click();
  await expect(page.getByText(/Claude Sonnet 5/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Economic Calculation/ })).toBeVisible();
});

test("429 and offline failures keep deterministic rubric usable", async ({
  page,
  context,
}) => {
  await reachRevision(page);
  await page
    .locator(".reasoning-field textarea")
    .fill(
      "Price markers helped compare the hall path and reduced resource waste and uncertainty.",
    );
  await page.route("**/api/guide", (route) =>
    route.fulfill({ status: 429, headers: { "retry-after": "60" }, body: "{}" }),
  );
  await page.getByRole("button", { name: "Ask one question" }).click();
  await expect(page.getByText(/The Guide is resting/)).toBeVisible();
  await page.unroute("**/api/guide");
  await context.setOffline(true);
  await page.getByRole("button", { name: "Ask one question" }).click();
  await expect(page.getByText(/You are offline/)).toBeVisible();
  await expect(page.getByText(/ready to revise/).last()).toBeVisible();
});
