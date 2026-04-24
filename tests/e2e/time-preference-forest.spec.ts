import { expect, test } from "@playwright/test";

test("time preference forest hydrates and rewrites shareable URL state", async ({
  page,
}) => {
  await page.goto(
    "/modules/time-preference-forest?tp=0.200&cb=0.600&sv=0.700&revealed=1",
  );

  const timePreference = page.getByRole("slider", { name: "Time Preference" });
  const intervention = page.getByRole("slider", {
    name: "Central-bank intervention",
  });
  const savings = page.getByRole("slider", { name: "Savings rate" });

  await expect(timePreference).toHaveValue("0.2");
  await expect(intervention).toHaveValue("0.6");
  await expect(savings).toHaveValue("0.7");

  await intervention.evaluate((element) => {
    const input = element as HTMLInputElement;
    input.value = "0.900";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await expect(page).toHaveURL(/cb=0\.900/);
  await expect(page.getByRole("button", { name: /Market correction/i })).toBeEnabled();
});
