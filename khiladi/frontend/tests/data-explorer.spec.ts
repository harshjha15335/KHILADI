import { expect, test } from "@playwright/test";

test("canonical Data Explorer loads real identity counts and connected player cards", async ({
  page,
}) => {
  await page.goto("/#data-explorer");
  await expect(
    page.getByRole("heading", { name: "Know the player pool." }),
  ).toBeVisible();
  await expect(page.getByRole("status").first()).toContainText(
    "1,217 matching canonical identities",
  );
  await expect(
    page.locator(".pc-preview[data-player-id]"),
  ).toHaveCount(24);

  await page.getByPlaceholder("Name or player ID").fill("813");
  await expect(page.getByRole("status").first()).toContainText(
    "1 matching canonical identities",
  );
  await expect(page.locator('.pc-preview[data-player-id="813"]')).toHaveCount(1);
});

test("data explorer role and RR filters do not claim official 2027 eligibility", async ({
  page,
}) => {
  await page.goto("/#data-explorer");
  await expect(page.getByRole("status").first()).toContainText("1,217");
  await page.getByRole("button", { name: /Historically RR-affiliated/ }).click();
  const active = page.getByRole("button", { name: /Historically RR-affiliated/ });
  await expect(active).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Historically RR-affiliated")).toBeVisible();
  await page.getByLabel("Playing role").selectOption("Bowler");
  await expect(page.locator(".pc-preview").first()).toBeVisible();
});
