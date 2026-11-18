import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const tokenFile = process.env.KHILADI_TEST_TOKEN_FILE;
test.skip(
  !tokenFile,
  "Set KHILADI_TEST_TOKEN_FILE for private integration tests.",
);
const key = () => fs.readFileSync(tokenFile!, "utf8").trim();
async function acceptedRating(page) {
  const response = await page.request.get(
    "/api/v2/rankings/batting?scenario=primary",
    { headers: { Authorization: `Bearer ${key()}` } },
  );
  if (!response.ok()) throw new Error("Private source fixture unavailable");
  return (await response.json()).rankings
    .find((row) => row.player_id === 6819)
    .rating.toFixed(3);
}
async function database(page) {
  await page.goto("/#database");
  await page.waitForTimeout(500);
  await expect(page.getByPlaceholder("Search player name or ID")).toBeVisible();
}
async function unlock(page) {
  await page.locator("#d20-token").fill(key());
  await page.getByRole("button", { name: "Unlock D20", exact: true }).click();
  await expect(page.locator(".pc-access")).toContainText("Private D20 session");
  await expect(page.locator(".pc-access")).not.toContainText(
    "Loading verified",
  );
}
async function find(page, id) {
  await page.getByPlaceholder("Search player name or ID").fill(String(id));
  await expect(page.locator(".discovery-grid .pc-preview")).toHaveCount(1);
}
test("all 1217 canonical identities have a lightweight card, with no fabricated D20 or WebGL grid", async ({
  page,
}) => {
  await database(page);
  const result = await page.evaluate(async () => {
    const [
      { default: React },
      { default: ReactDOM },
      { RoyalIdentityPreview },
    ] = await Promise.all([
      import("/node_modules/.vite/deps/react.js"),
      import("/node_modules/.vite/deps/react-dom_client.js"),
      import("/src/components/player-cards/RoyalIdentityPreview.tsx"),
    ]);
    const players = await (await fetch("/data/player_database.json")).json();
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = ReactDOM.createRoot(host);
    root.render(
      React.createElement(
        "div",
        {},
        players.map((p) =>
          React.createElement(RoyalIdentityPreview, {
            key: p.player_id,
            player: p,
          }),
        ),
      ),
    );
    await new Promise((r) => setTimeout(r, 500));
    const cards = Array.from(host.querySelectorAll(".pc-preview"));
    const out = {
      canonical: players.length,
      cards: cards.length,
      unique: new Set(cards.map((e) => e.getAttribute("data-player-id"))).size,
      canvases: host.querySelectorAll("canvas").length,
      unavailable:
        host.querySelectorAll(".pc-preview-rating b").length ===
          players.length &&
        Array.from(host.querySelectorAll(".pc-preview-rating b")).every(
          (e) => e.textContent === "Unavailable",
        ),
    };
    root.unmount();
    host.remove();
    return out;
  });
  expect(result).toEqual({
    canonical: 1217,
    cards: 1217,
    unique: 1217,
    canvases: 0,
    unavailable: true,
  });
});
test("directory, full card, role switch, evidence link, focus and API privacy", async ({
  page,
}) => {
  await database(page);
  await unlock(page);
  await find(page, 6819);
  await expect(page.locator(".discovery-grid .pc-preview-rating b")).toHaveText(
    await acceptedRating(page),
  );
  const open = page.getByRole("button", {
    name: "Inspect Yashasvi Jaiswal",
    exact: true,
  });
  await open.click();
  await expect(page.locator(".royal-dialog[open]")).toBeVisible();
  await expect(page.getByTestId("front-rating")).toHaveText(
    await acceptedRating(page),
  );
  await page.getByRole("link", { name: "Full analysis" }).click();
  await expect(page).toHaveURL(/#database$/);
  await expect(page.locator(".pc-profile-evidence")).toBeFocused();
  await page
    .getByRole("button", { name: "Bowling analysis", exact: true })
    .click();
  await expect(page.getByTestId("front-rating")).toHaveText("—");
  await expect(page.locator(".pc-profile-evidence")).toContainText(
    "unavailable",
  );
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.locator(".pc-card-unavailable")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".royal-dialog")).toHaveCount(0);
  await expect(open).toBeFocused();
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
});
test("rankings retain all accepted rows and selected-player role; compare carries canonical identity", async ({
  page,
}) => {
  await database(page);
  await unlock(page);
  await page.goto("/#rankings");
  await expect(page.locator("tbody tr")).toHaveCount(10);
  await page
    .getByRole("button", { name: "Yashasvi Jaiswal", exact: true })
    .click();
  await expect(page.locator(".pc-ranking-preview")).toContainText(
    "Yashasvi Jaiswal",
  );
  await page.getByRole("button", { name: "Open full player card" }).click();
  await expect(page.getByTestId("front-rating")).toHaveText(
    await acceptedRating(page),
  );
  await page
    .getByRole("button", { name: "Compare player", exact: true })
    .click();
  await expect(page.getByLabel("Select player A", { exact: true })).toHaveValue(
    "6819",
  );
  await expect(
    page.locator(".pc-comparison-previews .pc-preview").first(),
  ).toContainText(await acceptedRating(page));
  await page.goto("/#rankings");
  await page.getByRole("button", { name: "Top 10 bowlers" }).click();
  await page.getByRole("button", { name: "Open full player card" }).click();
  await expect(page.locator("#royal-profile-title")).toHaveText(
    "Jasprit Bumrah",
  );
  await expect(page.locator(".rc-role")).toHaveText("BOWLER");
});
test("squad action and hypothetical bids still work; locks clear every card", async ({
  page,
}) => {
  await database(page);
  await unlock(page);
  await find(page, 6819);
  await page
    .getByRole("button", { name: "Inspect Yashasvi Jaiswal", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add to my squad", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Added to your squad" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Close profile" }).click();
  await page.goto("/#war-room");
  await expect(page.locator(".pc-war-preview")).toContainText(
    "Yashasvi Jaiswal",
  );
  await page.getByLabel("Planning bid for Yashasvi Jaiswal").fill("5");
  await expect(page.getByRole("status")).toContainText("₹5.00");
  await page.getByRole("button", { name: "Lock results", exact: true }).click();
  await expect(page.locator(".pc-war-preview .pc-preview-rating b")).toHaveText(
    "Unavailable",
  );
  await page.getByRole("button", { name: "Remove Yashasvi Jaiswal" }).click();
  await expect(page.locator(".pc-war-preview")).toHaveCount(0);
});
test("unknown accepted record stays unavailable, mobile fits, keyboard dialog remains accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await database(page);
  await unlock(page);
  const players = await (
    await page.request.get("/data/player_database.json")
  ).json();
  const accepted = await page.evaluate(async () => {
    const response = await fetch("/data/player_database.json");
    return (await response.json()).map((p) => ({
      id: p.player_id,
      name: p.player_name,
    }));
  });
  expect(accepted.length).toBe(1217);
  const outside = players.find((p) => p.player_id === 3297);
  await find(page, outside.player_id);
  await page
    .getByRole("button", {
      name: `Inspect ${outside.player_name}`,
      exact: true,
    })
    .click();
  await expect(page.getByTestId("front-rating")).toHaveText("—");
  expect(
    await page
      .locator(".royal-dialog")
      .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.locator(".pc-card-unavailable")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".royal-dialog")).toHaveCount(0);
});
test("returning home clears private access and leaves frozen homepage without card code or canvases", async ({
  page,
}) => {
  await database(page);
  await unlock(page);
  await page.goto("/#home");
  await expect(page.locator(".cinematic-home")).toBeVisible();
  await expect(page.locator(".pc-access,.rc-card,canvas")).toHaveCount(0);
  await page.goto("/#database");
  await expect(page.locator("#d20-token")).toBeVisible();
  await expect(page.locator(".pc-preview-rating b").first()).toHaveText(
    "Unavailable",
  );
});
test("inner dialog has no serious accessibility violations", async ({
  page,
}) => {
  await database(page);
  await find(page, 6819);
  await page
    .getByRole("button", { name: "Inspect Yashasvi Jaiswal", exact: true })
    .click();
  await expect(page.locator(".royal-dialog[open]")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include(".royal-dialog")
    .analyze();
  expect(
    result.violations
      .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
      .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
});
