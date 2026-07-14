import { expect, test } from "@playwright/test";

test("Choice Machine preserves alternatives, self-review, and Notebook handoff", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.goto("/labs/choice-machine?mode=guided");

  for (const action of [
    "Inspect the limits",
    "Choose the community event",
    "Reveal the paths not taken",
    "Lose two available hours",
    "Revise the choice",
    "Open interpretation",
  ]) {
    await page.getByRole("button", { name: new RegExp(action) }).click();
  }

  await expect(
    page.getByText("3 forgone paths remain visible", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Initial interpretation" })
    .fill("The first path fit four available hours, while the revised path fit two.");
  await page.getByRole("checkbox", { name: "The comparison is ready" }).check();
  await page
    .getByRole("checkbox", { name: /Only four named activities/ })
    .check();
  await page
    .getByRole("textbox", { name: /Revision or explicit/ })
    .fill("The two choices reveal rankings under different visible conditions.");
  for (const label of [
    /I compared my initial response/,
    /I can point to the selected simulation observation/,
    /I named an assumption/,
  ]) {
    await page.getByRole("checkbox", { name: label }).check();
  }
  await page.getByRole("button", { name: "Run transparent self-review" }).click();
  await expect(page.getByText("ready for self-review")).toBeVisible();

  await page
    .getByRole("textbox", { name: "Final reflection" })
    .fill("I would change attention next and avoid treating one action as a fixed trait.");
  await page.getByRole("button", { name: "Save reflection to Notebook" }).click();
  await expect(page.getByText(/Completed and saved locally/)).toBeVisible();
  await page.goto("/notebook");
  await expect(page.getByRole("heading", { name: "The Choice Machine" })).toBeVisible();
});
