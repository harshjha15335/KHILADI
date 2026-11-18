import { expect, test } from "@playwright/test";
import fs from "node:fs";

const PLAYER = "Yashasvi Jaiswal";
const PLAYER_ID = 6819;
const STORAGE_KEY = "khiladi-hypothetical-plan-v1";

async function openWarRoom(page: import("@playwright/test").Page) {
  await page.goto("/#war-room");
  await expect(
    page.getByRole("button", { name: "Save plan locally" }),
  ).toBeEnabled();
}

async function addPlayer(page: import("@playwright/test").Page) {
  await page.getByRole("searchbox", { name: "Find a player" }).fill(PLAYER);
  await page.getByRole("button", { name: new RegExp(PLAYER) }).click();
  await expect(page.getByLabel(`Planning bid for ${PLAYER}`)).toBeVisible();
}

test("planner schema preserves an explicit zero bid and rejects malformed or unknown IDs", async ({
  page,
}) => {
  await page.goto("/#war-room");
  const outcome = await page.evaluate(async () => {
    const { createSquadPlan, validateSquadPlan } = await import(
      "/src/utils/planner.ts"
    );
    const canonical = new Set([6819, 813]);
    const valid = validateSquadPlan(
      createSquadPlan([6819, 813], 25, { 6819: 0 }),
      canonical,
    );
    const invalid: Record<string, unknown> = {
      invalidVersion: { version: 2, budgetCr: 25, players: [] },
      unexpectedKey: {
        version: 1,
        budgetCr: 25,
        players: [],
        acceptedD20: "must never be included",
      },
      negativeBudget: { version: 1, budgetCr: -1, players: [] },
      nonFiniteBudget: { version: 1, budgetCr: Infinity, players: [] },
      wrongId: {
        version: 1,
        budgetCr: 25,
        players: [{ playerId: 999999 }],
      },
      duplicateId: {
        version: 1,
        budgetCr: 25,
        players: [{ playerId: 6819 }, { playerId: 6819 }],
      },
      invalidBid: {
        version: 1,
        budgetCr: 25,
        players: [{ playerId: 6819, bidCr: NaN }],
      },
      extraPlayerField: {
        version: 1,
        budgetCr: 25,
        players: [{ playerId: 6819, bidCr: 1, token: "forbidden" }],
      },
    };
    return {
      valid,
      rejected: Object.fromEntries(
        Object.entries(invalid).map(([name, value]) => {
          try {
            validateSquadPlan(value, canonical);
            return [name, false];
          } catch {
            return [name, true];
          }
        }),
      ),
    };
  });
  expect(outcome.valid).toEqual({
    version: 1,
    budgetCr: 25,
    players: [{ playerId: 6819, bidCr: 0 }, { playerId: 813 }],
  });
  expect(Object.values(outcome.rejected)).toEqual(Array(8).fill(true));
});

test("user-entered budget and bid persist when navigating away and back", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await page.getByLabel("Your planning budget (₹ crore)").fill("42");
  await page.getByLabel(`Planning bid for ${PLAYER}`).fill("5.5");
  await expect(page.getByRole("status").last()).toContainText("₹5.50");

  await page.evaluate(() => {
    window.location.hash = "#rankings";
  });
  await expect(page).toHaveURL(/#rankings$/);
  await page.evaluate(() => {
    window.location.hash = "#war-room";
  });
  await expect(page.getByLabel("Your planning budget (₹ crore)")).toHaveValue(
    "42",
  );
  await expect(page.getByLabel(`Planning bid for ${PLAYER}`)).toHaveValue(
    "5.5",
  );
});

test("local save/load restores only hypothetical inputs and distinguishes zero from missing bids", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await page.getByLabel("Your planning budget (₹ crore)").fill("40");
  const bid = page.getByLabel(`Planning bid for ${PLAYER}`);
  await bid.fill("0");
  await expect(page.getByRole("status").last()).not.toContainText(
    "still need a bid",
  );
  await page.getByRole("button", { name: "Save plan locally" }).click();

  const saved = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  expect(JSON.parse(saved!)).toEqual({
    version: 1,
    budgetCr: 40,
    players: [{ playerId: PLAYER_ID, bidCr: 0 }],
  });
  expect(saved).not.toMatch(/token|research|password|rating|private/i);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Load saved plan" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Load saved plan" }).click();
  await expect(page.getByLabel("Your planning budget (₹ crore)")).toHaveValue(
    "40",
  );
  await expect(page.getByLabel(`Planning bid for ${PLAYER}`)).toHaveValue(
    "0",
  );
  await page.getByLabel(`Planning bid for ${PLAYER}`).fill("");
  await expect(page.getByRole("status").last()).toContainText(
    "1 players still need a bid",
  );
});

test("invalid imported plans do not replace the current squad", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await page.getByLabel(`Planning bid for ${PLAYER}`).fill("3.25");
  const input = page.locator('.pc-plan-import input[type="file"][accept*="json"]');

  await input.setInputFiles({
    name: "duplicate.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        budgetCr: 50,
        players: [{ playerId: PLAYER_ID }, { playerId: PLAYER_ID }],
      }),
    ),
  });
  await expect(page.getByRole("alert")).toContainText(
    "unknown or duplicate player",
  );
  await expect(page.getByLabel(`Planning bid for ${PLAYER}`)).toHaveValue(
    "3.25",
  );

  await input.setInputFiles({
    name: "unknown.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        budgetCr: 50,
        players: [{ playerId: 999999 }],
      }),
    ),
  });
  await expect(page.getByRole("alert")).toContainText(
    "unknown or duplicate player",
  );
  await expect(page.getByLabel(`Planning bid for ${PLAYER}`)).toHaveValue(
    "3.25",
  );
});

test("exported plan is valid JSON containing user inputs, not analytical data", async ({
  page,
}) => {
  await openWarRoom(page);
  await addPlayer(page);
  await page.getByLabel("Your planning budget (₹ crore)").fill("35");
  await page.getByLabel(`Planning bid for ${PLAYER}`).fill("4.5");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export plan" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("khiladi-hypothetical-plan.json");
  const path = await download.path();
  expect(path).toBeTruthy();
  const exported = fs.readFileSync(path!, "utf8");
  expect(JSON.parse(exported)).toEqual({
    version: 1,
    budgetCr: 35,
    players: [{ playerId: PLAYER_ID, bidCr: 4.5 }],
  });
  expect(exported).not.toMatch(/token|research|password|rating|private/i);
});
