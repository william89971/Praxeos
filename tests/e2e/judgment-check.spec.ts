import { expect, test } from "@playwright/test";

const FIRST_JUDGMENT = '[aria-labelledby="judgment-what-is-praxeology-heading"]';

test("judgment checks hide feedback until a learner chooses", async ({ page }) => {
  await page.goto("/learn/praxeology-101");

  const judgment = page.locator(FIRST_JUDGMENT);
  await expect(judgment.getByText(/The phone changed the menu/i)).toHaveCount(0);
  await expect(judgment.getByText(/Strong answer/i)).toHaveCount(0);

  const wrongChoice = judgment.getByRole("button", {
    name: /The phone forced the outcome/i,
  });
  await wrongChoice.click();
  await expect(wrongChoice).toHaveAttribute("aria-pressed", "true");
  await expect(judgment.getByText(/The phone changed the menu/i)).toBeVisible();
  await expect(judgment.getByText(/Strong answer/i)).toHaveCount(0);
  await expect(judgment.getByText("Best fit")).toBeVisible();

  const strongChoice = judgment.getByRole("button", {
    name: /preferred immediate relief over the workout/i,
  });
  await strongChoice.click();
  await expect(strongChoice).toHaveAttribute("aria-pressed", "true");
  await expect(judgment.getByText(/Strong answer/i)).toBeVisible();
  await expect(judgment.getByText(/The phone changed the menu/i)).toHaveCount(0);
});

test("judgment checks can be selected with Tab, Enter, and Space", async ({ page }) => {
  await page.goto("/learn/praxeology-101");

  const judgment = page.locator(FIRST_JUDGMENT);
  const firstChoice = judgment.getByRole("button", {
    name: /The phone forced the outcome/i,
  });
  const strongChoice = judgment.getByRole("button", {
    name: /preferred immediate relief over the workout/i,
  });
  const thirdChoice = judgment.getByRole("button", {
    name: /The person has no goals/i,
  });

  await firstChoice.focus();
  await page.keyboard.press("Tab");
  await expect(strongChoice).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(strongChoice).toHaveAttribute("aria-pressed", "true");
  await expect(judgment.getByText(/Strong answer/i)).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(thirdChoice).toBeFocused();
  await page.keyboard.press("Space");
  await expect(thirdChoice).toHaveAttribute("aria-pressed", "true");
  await expect(judgment.getByText(/Even avoidance is purposeful/i)).toBeVisible();
});
