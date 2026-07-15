import { expect, test } from "@playwright/test";

test("homepage makes the offer and flagship action clear above the fold", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Praxeos/i);
  await expect(
    page.getByRole("heading", { name: "See the structure inside every choice." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Begin 8-minute journey" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore labs" })).toBeVisible();
  const mobile = test.info().project.name === "mobile-chromium";
  if (mobile) await page.getByRole("button", { name: "Open menu" }).click();
  const navigation = page.getByRole("navigation", {
    name: mobile ? "Mobile primary" : "Primary",
  });
  for (const label of [
    "Learn",
    "Practice",
    "Labs",
    "Notebook",
    "Sources",
    "How It Was Built",
  ]) {
    await expect(
      navigation.getByRole("link", { name: label, exact: true }),
    ).toBeVisible();
  }
});
