import { expect, test } from "@playwright/test";

test("halving garden exposes live controls and persists audio state", async ({
  page,
}) => {
  await page.goto("/modules/halving-garden");

  await expect(
    page.getByRole("heading", { name: /The Halving Garden/i }),
  ).toBeVisible();
  await expect(page.getByText("Start here", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Guided" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Genesis/i })).toBeVisible();
  await expect(
    page.getByText(/Designed for a real pointer and a wider field of view\./i),
  ).toBeVisible();

  await page.getByRole("button", { name: /Saturation/i }).click();
  await expect(page.getByText(/Explore mode/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Restart tour/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Focus today/i })).toBeVisible();

  const audioButton = page.getByRole("button", { name: /Audio off/i });
  await audioButton.click();
  await expect(page.getByRole("button", { name: /Audio on/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await expect
    .poll(async () =>
      page.evaluate(() => window.localStorage.getItem("praxeos-halving-audio")),
    )
    .toBe("1");
});
