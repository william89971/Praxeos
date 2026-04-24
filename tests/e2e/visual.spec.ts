import { expect, test } from "@playwright/test";

test.skip(({ isMobile }) => isMobile, "Desktop snapshot only.");

test("manifesto print surface stays visually stable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/manifesto-print");

  await expect(page.locator("[data-manifesto-print]")).toHaveScreenshot(
    "manifesto-print.png",
    {
      animations: "disabled",
    },
  );
});
