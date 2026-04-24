import { expect, test } from "@playwright/test";

test("calculation problem updates complexity interactively", async ({ page }) => {
  await page.goto("/modules/calculation-problem");

  await expect(
    page.getByRole("heading", { name: /The Calculation Problem/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Two panels side by side\./i }),
  ).toBeVisible();

  const slider = page.getByRole("slider", { name: /Complexity/i });
  await slider.evaluate((element, nextValue) => {
    const input = element as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, nextValue);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, "60");

  await expect(slider).toHaveValue("60");
  await expect(page.getByText(/tick/i).last()).toBeVisible();
});
