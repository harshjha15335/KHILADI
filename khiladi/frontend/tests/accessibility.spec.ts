import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage and player dialog have no serious accessibility violations", async ({
  page,
}) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("khiladi_intro_seen", "true"),
  );
  await page.goto("/");
  await expect(page.locator(".squad-player").first()).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact || ""),
    ),
  ).toEqual([]);
  await page.goto("/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  await page.locator(".discovery-open").click();
  await expect(page.locator(".profile-dialog")).toBeVisible();
  await expect(page.locator(".profile-reveal-item").last()).toHaveCSS(
    "opacity",
    "1",
  );
  const dialog = await new AxeBuilder({ page })
    .include(".profile-dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    dialog.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact || ""),
    ),
  ).toEqual([]);
});
