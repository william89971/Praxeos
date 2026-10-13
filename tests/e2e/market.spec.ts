import { type Page, expect, test } from "@playwright/test";

test.describe.configure({ timeout: 60_000 });

const GUIDED_ACTIONS = [
  "Meet the participants",
  "Inspect ranked priorities",
  "Attempt the barter",
  "Introduce money",
  "Offer 2 tokens for bread",
  "Offer 4 tokens for bread",
  "Limit information",
  "Remove one loaf",
  "Set a 2-token ceiling",
  "Open interpretation",
] as const;

async function clearLocalRecord(page: Page) {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
}

async function takeGuidedStep(page: Page, label: string) {
  await page.getByRole("button", { name: "I expect a visible change" }).click();
  await page.getByRole("button", { name: label }).click();
}

async function completeGuidedMarket(page: Page) {
  await page.goto("/labs/market-without-a-manager?mode=guided");
  for (const label of GUIDED_ACTIONS) {
    await takeGuidedStep(page, label);
  }
}

test("full flagship persists, self-reviews without semantic grading, and saves to Notebook", async ({
  page,
}) => {
  await clearLocalRecord(page);
  await page.goto("/labs/market-without-a-manager?mode=guided");
  await expect(
    page.getByRole("button", { name: "I expect a visible change" }),
  ).toBeVisible();

  await takeGuidedStep(page, "Meet the participants");
  await expect(
    page
      .getByRole("complementary", { name: "Evidence and change summary" })
      .getByText(/Each person arrives with different goods/),
  ).toBeVisible();
  await takeGuidedStep(page, "Inspect ranked priorities");
  await takeGuidedStep(page, "Attempt the barter");
  await expect(page.getByRole("button", { name: "Explore" })).toBeEnabled();
  await takeGuidedStep(page, "Introduce money");
  await takeGuidedStep(page, "Offer 2 tokens for bread");
  const evidenceRail = page.getByRole("complementary", {
    name: "Evidence and change summary",
  });
  await expect(evidenceRail.getByText(/requires at least 4 tokens/)).toBeVisible();
  await expect(evidenceRail.getByText(/No completed monetary trade/)).toBeVisible();
  await takeGuidedStep(page, "Offer 4 tokens for bread");
  await expect(evidenceRail.getByText(/Ben accepts 4 tokens/)).toBeVisible();
  await expect(evidenceRail.getByText("4 tokens", { exact: true })).toBeVisible();
  for (const label of GUIDED_ACTIONS.slice(6)) {
    await takeGuidedStep(page, label);
  }

  await page
    .getByRole("textbox", { name: "Initial interpretation" })
    .fill(
      "Completed trades coordinated some plans, while rejected offers and incomplete information left other plans unresolved.",
    );
  await page.getByRole("checkbox", { name: /A 4-token price is recorded/ }).check();
  await page
    .getByRole("checkbox", { name: /Only five participants and five goods/ })
    .check();
  await page
    .getByRole("textbox", { name: /Revision or explicit/ })
    .fill(
      "The completed trade records a price, but the small model cannot settle how a larger real market would distribute goods.",
    );
  for (const label of [
    /I compared the initial response/,
    /I can point to the selected event/,
    /I named at least one assumption/,
  ]) {
    await page.getByRole("checkbox", { name: label }).check();
  }
  await page.getByRole("button", { name: "Run transparent self-review" }).click();
  await expect(page.getByText("ready for self-review")).toBeVisible();
  await expect(page.getByText(/does not grade your conclusion/)).toBeVisible();

  await page.getByRole("button", { name: "Ask one question" }).click();
  await expect(page.getByText("Using the saved sources")).toBeVisible();
  await expect(page.locator(".guide-question")).toContainText("?");

  await page
    .getByRole("textbox", { name: "Final reflection" })
    .fill(
      "I would test how different reserve rules and additional participants change missed trades.",
    );
  await page.getByRole("button", { name: "Save reflection to Notebook" }).click();
  await expect(page.getByText(/Completed and saved locally/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Download Markdown" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Download reflection card" }),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByText(/Saved Lab restored/)).toBeVisible();
  await expect(page.getByText("ready for self-review")).toBeVisible();
  await page.goto("/notebook");
  await expect(
    page.getByRole("heading", { name: "Market Without a Manager" }),
  ).toBeVisible();
  await expect(page.getByText(/1 selected observations/)).toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "Inspect evidence, assumptions, Guide, and sources" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Optional Guide turn" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Saved sources" })).toBeVisible();
});

test("invalid share state is non-blocking and Explore preserves the guided record", async ({
  page,
}) => {
  await clearLocalRecord(page);
  await page.goto("/labs/market-without-a-manager?share=not-valid");
  await expect(page.getByText(/share link was malformed/)).toBeVisible();
  await takeGuidedStep(page, "Meet the participants");
  await takeGuidedStep(page, "Inspect ranked priorities");
  await takeGuidedStep(page, "Attempt the barter");
  await page.getByRole("button", { name: "Explore" }).click();
  await page.getByRole("button", { name: "Barter bread for tea" }).click();
  await expect(
    page
      .getByRole("complementary", { name: "Evidence and change summary" })
      .getByText(/Ben offers bread for tea/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Guided" }).click();
  await page.getByRole("button", { name: "I expect a visible change" }).click();
  await expect(page.getByRole("button", { name: "Introduce money" })).toBeVisible();
});

test("offline Guide failure leaves the transparent self-review usable", async ({
  page,
  context,
}) => {
  await clearLocalRecord(page);
  await completeGuidedMarket(page);
  await page
    .getByRole("textbox", { name: "Initial interpretation" })
    .fill(
      "The accepted trade is one observation, while the ceiling is an inspectable model rule.",
    );
  await context.setOffline(true);
  await expect(
    page.getByText(/You are offline\. The self-review remains available/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Run transparent self-review" }),
  ).toBeEnabled();
});
