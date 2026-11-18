import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const NAME = "Yashasvi Jaiswal";
const ID = 6819;

async function openWarRoom(page: Page) {
  await page.goto("/#war-room");
  await expect(
    page.getByRole("button", { name: "Save plan locally" }),
  ).toBeEnabled();
}
async function addPlayer(page: Page) {
  await page.getByRole("searchbox", { name: "Find a player" }).fill(NAME);
  await page.getByRole("button", { name: new RegExp(NAME) }).click();
  await expect(page.getByLabel(`Planning bid for ${NAME}`)).toBeVisible();
}
async function importReference(page: Page, name: string, value: unknown) {
  await page.getByLabel("Choose reference plan").setInputFiles({
    name,
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(value)),
  });
}

test("compares independent hypothetical plans without replacing the active squad", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await page.getByLabel("Your planning budget (₹ crore)").fill("50");
  await page.getByLabel(`Planning bid for ${NAME}`).fill("5.5");

  await importReference(page, "alternative.json", {
    version: 1,
    budgetCr: 60,
    players: [{ playerId: 813, bidCr: 7 }],
  });
  const compare = page.getByRole("region", {
    name: "Compare two squad plans.",
  });
  await expect(compare).toContainText("Reference loaded: alternative.json");
  await expect(compare).toContainText("₹50.00 cr");
  await expect(compare).toContainText("₹60.00 cr");
  await expect(compare).toContainText("Current only");
  await expect(compare).toContainText("Reference only");
  await expect(page.getByLabel(`Planning bid for ${NAME}`)).toHaveValue(
    "5.5",
  );
  await expect(page.getByLabel("Your planning budget (₹ crore)")).toHaveValue(
    "50",
  );
  await compare.getByRole("button", { name: "Clear reference" }).click();
  await expect(compare).toContainText("No reference loaded.");
});

test("rejects malformed reference without replacing the previous comparison or squad", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await importReference(page, "valid.json", {
    version: 1,
    budgetCr: 40,
    players: [{ playerId: ID, bidCr: 0 }],
  });
  const compare = page.getByRole("region", {
    name: "Compare two squad plans.",
  });
  await expect(compare).toContainText("Reference loaded: valid.json");

  await importReference(page, "duplicate.json", {
    version: 1,
    budgetCr: 10,
    players: [{ playerId: ID }, { playerId: ID }],
  });
  await expect(compare.getByRole("alert")).toContainText(
    "unknown or duplicate player",
  );
  await expect(compare).toContainText("Reference loaded: valid.json");
  await expect(page.getByLabel(`Planning bid for ${NAME}`)).toBeVisible();
});

test("explicit zero reference bid is distinct from missing bid and unselected", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await importReference(page, "zero-and-unpriced.json", {
    version: 1,
    budgetCr: 32,
    players: [
      { playerId: ID, bidCr: 0 },
      { playerId: 813 },
    ],
  });
  const compare = page.getByRole("region", {
    name: "Compare two squad plans.",
  });
  await expect(compare).toContainText("₹0.00 cr");
  await expect(compare).toContainText("No bid entered");
  await expect(compare).toContainText("Unpriced players are excluded");
  await expect(compare).toContainText("Not selected");
});
