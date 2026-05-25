import { type Locator, expect, test } from "@playwright/test";

const STORAGE_KEY = "praxeos.learning.v1";

test("daily cases complete through analyzer work and save to the journal panel", async ({
  page,
}) => {
  await page.goto("/cases");

  await expect(
    page.getByRole("heading", { name: "Practice without a lecture." }),
  ).toBeVisible();
  await expect(page.getByAltText(/Illustrated table/i)).toBeVisible();
  await expect(page.getByAltText(/quieter alternatives/i)).toBeVisible();
  await expect(page.getByText("Practice spotting the trade.")).toBeVisible();
  await expect(page.getByText("Chosen")).toBeVisible();
  await expect(page.getByText("Given up")).toBeVisible();
  const firstCase = page.locator("article#procrastination-revealed");
  await expect(
    firstCase.getByRole("heading", { name: "The procrastination trade" }),
  ).toBeVisible();

  const analyzer = page.locator(
    '[aria-labelledby="case-procrastination-revealed-heading"]',
  );
  await expect(analyzer.getByText("Practice box")).toBeVisible();
  await expect(analyzer.getByRole("button", { name: "Save my note" })).toBeDisabled();

  const journal = page.locator('[aria-labelledby="action-journal-heading"]');
  await expect(journal.getByRole("heading", { name: "My saved notes" })).toBeVisible();

  await fillAnalyzer(analyzer);
  await analyzer.getByRole("button", { name: "Check my read" }).click();
  await expect(analyzer.getByText("Nice. You just did praxeology.")).toBeVisible();

  const learning = await page.evaluate((storageKey) => {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_KEY);
  expect(learning.completedCases["procrastination-revealed"]).toBeTruthy();

  await analyzer.getByRole("button", { name: "Save my note" }).click();
  await expect(
    journal.getByRole("heading", { name: "The procrastination trade" }),
  ).toBeVisible();
});

async function fillAnalyzer(analyzer: Locator) {
  await analyzer.getByLabel("Actor").fill("The learner avoiding study");
  await analyzer.getByLabel("End").fill("Get relief after work");
  await analyzer.getByLabel("Means").fill("Choose entertainment");
  await analyzer.getByLabel("Constraint").fill("Limited energy and evening attention");
  await analyzer
    .getByLabel("Tradeoff")
    .fill("Comfort now instead of credential progress");
  await analyzer
    .getByLabel("Opportunity cost")
    .fill("Study time and future career optionality");
  await analyzer
    .getByLabel("Revealed preference")
    .fill("Immediate relief ranks above studying tonight");
}
