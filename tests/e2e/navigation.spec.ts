import { expect, test } from "@playwright/test";

const redirects = [
  ["/learn/praxeology-101", "/learn"],
  ["/cases", "/practice"],
  ["/modules", "/labs"],
  ["/modules/calculation-labyrinth", "/labs/calculation-labyrinth"],
  ["/glossary", "/sources/glossary"],
  ["/thinkers/mises", "/sources/thinkers/mises"],
  ["/manifesto", "/sources#manifesto"],
  ["/colophon", "/built"],
] as const;

for (const [from, to] of redirects)
  test(`${from} permanently resolves to ${to}`, async ({ page }) => {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });

test("all primary routes load without an application error", async ({ page }) => {
  for (const route of [
    "/learn",
    "/practice",
    "/journey/calculation-labyrinth",
    "/labs",
    "/notebook",
    "/sources",
    "/sources/glossary",
    "/built",
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("body")).not.toContainText("Application error");
  }
});
