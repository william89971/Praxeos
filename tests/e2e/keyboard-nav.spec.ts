import { expect, test } from "@playwright/test";

test("skip link is keyboard reachable", async ({ page }) => {
  await page.goto("/manifesto");

  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: /Skip to content/i });
  await expect(skipLink).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});
