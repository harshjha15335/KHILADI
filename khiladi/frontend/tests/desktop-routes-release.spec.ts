import { expect, test } from "@playwright/test";

/**
 * Public-shell smoke tests: no private D20 credential is loaded or requested.
 * These check that the complete hash-routed desktop experience remains reachable
 * while the user-facing research and publication gates are still unresolved.
 */
const ROUTES = [
  "home",
  "database",
  "rankings",
  "pressure-lab",
  "comparison",
  "war-room",
  "batting-intel",
  "bowling-intel",
  "command-centre",
  "methodology",
] as const;

for (const route of ROUTES) {
  test(`desktop route #${route} mounts meaningful content without a fatal browser exception`, async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`/#${route}`);
    await expect(page.locator("#main-content")).toBeVisible();
    const content = (await page.locator("#main-content").innerText()).trim();
    expect(content.length, `#${route} rendered no meaningful content`).toBeGreaterThan(60);
    expect(pageErrors, `#${route} raised an uncaught exception`).toEqual([]);
  });
}

test("unknown hash route falls back to the existing frozen homepage", async ({
  page,
}) => {
  await page.goto("/#not-a-real-khiladi-route");
  await expect(page.locator(".cinematic-home")).toBeVisible();
  await expect(page.locator("#main-content")).toBeVisible();
});

test("public rankings never silently substitute legacy metrics for locked D20", async ({
  page,
}) => {
  await page.goto("/#rankings");
  await expect(page.locator("#main-content")).toBeVisible();
  await expect(page.locator("#d20-token")).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Babar Azam #1");
});
