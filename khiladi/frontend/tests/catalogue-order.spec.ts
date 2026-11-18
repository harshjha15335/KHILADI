import { expect, test } from "@playwright/test";

test("player catalogue defaults to neutral name ordering rather than the legacy ranking", async ({
  page,
}) => {
  await page.goto("/#database");
  const sort = page.getByLabel("Catalogue order");
  await expect(sort).toHaveValue("name");
  const names = await page.locator(".discovery-grid .pc-preview-name").allTextContents();
  expect(names.length).toBeGreaterThan(3);
  const sorted = [...names].sort((a, b) => a.localeCompare(b));
  expect(names).toEqual(sorted);
});

test("accepted D20 ordering never invents ratings when private evidence is locked", async ({
  page,
}) => {
  await page.goto("/#database");
  const sort = page.getByLabel("Catalogue order");
  await sort.selectOption("d20-batting");
  await expect(page.getByText("Accepted D20 batting order only includes records")).toBeVisible();
  await expect(page.getByText("Accepted D20 evidence is locked or unavailable.", { exact: false })).toBeVisible();
  await expect(page.locator(".discovery-grid .pc-preview")).toHaveCount(0);
  await sort.selectOption("name");
  await expect(page.locator(".discovery-grid .pc-preview")).toHaveCount(18);
});

test("legacy sorting is explicit and retains its own clear model label", async ({
  page,
}) => {
  await page.goto("/#database");
  await page.getByLabel("Catalogue order").selectOption("legacy");
  await page.getByLabel("Show detailed metrics").check();
  await expect(page.locator(".discovery-metrics").first()).toContainText(
    "Legacy model index",
  );
});
