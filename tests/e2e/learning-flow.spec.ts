import { type Locator, expect, test } from "@playwright/test";

const STORAGE_KEY = "praxeos.learning.v1";
const FIRST_LESSON_ANALYZER = '[aria-labelledby="lesson-what-is-praxeology-heading"]';
const JOURNAL = '[aria-labelledby="action-journal-heading"]';

const ANALYZER_FIELDS = [
  "Actor",
  "End",
  "Means",
  "Constraint",
  "Tradeoff",
  "Opportunity cost",
  "Revealed preference",
] as const;

test("Praxeology 101 requires learner input and preserves journal entries", async ({
  page,
}) => {
  await page.goto("/learn/praxeology-101");

  await expect(
    page.getByRole("heading", { name: "The logic of action." }),
  ).toBeVisible();
  const lesson = page.locator("article#what-is-praxeology");
  await expect(
    lesson.getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();

  const analyzer = page.locator(FIRST_LESSON_ANALYZER);
  await assertAnalyzerFieldsEmpty(analyzer);

  const checkButton = analyzer.getByRole("button", { name: "Check the action" });
  await expect(checkButton).toBeDisabled();
  await analyzer.getByLabel("Actor").fill("A tired learner after dinner");
  await expect(checkButton).toBeDisabled();

  await fillAnalyzer(analyzer, "lesson");
  await expect(checkButton).toBeEnabled();
  await checkButton.click();
  await expect(analyzer.getByText("You just did praxeology.")).toBeVisible();
  await expect(page.getByText(/1\/11 complete/i)).toBeVisible();

  await analyzer.getByRole("button", { name: "Save to journal" }).click();
  const journal = page.locator(JOURNAL);
  await expect(
    journal.getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByText(/1\/11 complete/i)).toBeVisible();
  await expect(
    page.locator(JOURNAL).getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Reset learning progress" }).click();
  await expect(page.getByText(/0\/11 complete/i)).toBeVisible();
  await expect(
    page.locator(JOURNAL).getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();

  await page.locator(JOURNAL).getByRole("button", { name: "Clear" }).click();
  await expect(
    page.locator(JOURNAL).getByText(/Save an analyzer result/i),
  ).toBeVisible();
  await expect(
    page.locator(JOURNAL).getByRole("heading", { name: "What is praxeology?" }),
  ).toHaveCount(0);
});

test("blocked storage keeps the current learning session usable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.Storage.prototype, "setItem", {
      configurable: true,
      value() {
        throw new Error("Storage is blocked in this test.");
      },
    });
  });

  await page.goto("/learn/praxeology-101");

  const analyzer = page.locator(FIRST_LESSON_ANALYZER);
  await fillAnalyzer(analyzer, "blocked storage");
  await analyzer.getByRole("button", { name: "Check the action" }).click();
  await expect(analyzer.getByText("You just did praxeology.")).toBeVisible();
  await expect(page.getByText(/1\/11 complete/i)).toBeVisible();

  await analyzer.getByRole("button", { name: "Save to journal" }).click();
  await expect(
    page.locator(JOURNAL).getByRole("heading", { name: "What is praxeology?" }),
  ).toBeVisible();

  const persisted = await page.evaluate((storageKey) => {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }, STORAGE_KEY);
  expect(persisted).toBeNull();
});

async function assertAnalyzerFieldsEmpty(analyzer: Locator) {
  for (const label of ANALYZER_FIELDS) {
    await expect(analyzer.getByLabel(label)).toHaveValue("");
  }
}

async function fillAnalyzer(analyzer: Locator, prefix: string) {
  await analyzer.getByLabel("Actor").fill(`${prefix} actor`);
  await analyzer.getByLabel("End").fill(`${prefix} end`);
  await analyzer.getByLabel("Means").fill(`${prefix} means`);
  await analyzer.getByLabel("Constraint").fill(`${prefix} constraint`);
  await analyzer.getByLabel("Tradeoff").fill(`${prefix} tradeoff`);
  await analyzer.getByLabel("Opportunity cost").fill(`${prefix} opportunity cost`);
  await analyzer
    .getByLabel("Revealed preference")
    .fill(`${prefix} revealed preference`);
}
