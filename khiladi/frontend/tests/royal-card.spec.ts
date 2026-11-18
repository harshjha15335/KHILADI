import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
const tokenFile = process.env.KHILADI_TEST_TOKEN_FILE;
test.skip(!tokenFile, "Set KHILADI_TEST_TOKEN_FILE to a private token file.");
const token = () => fs.readFileSync(tokenFile!, "utf8").trim();
async function acceptedRow(page) {
  const response = await page.request.get(
    "/api/v2/rankings/batting?scenario=primary",
    { headers: { Authorization: `Bearer ${token()}` } },
  );
  if (!response.ok()) throw new Error("Private source fixture unavailable");
  return (await response.json()).rankings.find((row) => row.player_id === 6819);
}
async function unlock(page) {
  await page.goto("/royal-card-prototype.html");
  await page.locator("#rc-token").fill(token());
  await page.getByRole("button", { name: "Unlock", exact: false }).click();
  await expect(page.getByTestId("front-rating")).toBeVisible();
  await page.waitForTimeout(800);
}
test("all 20 adapters preserve exact accepted records and reject mismatched identity, role, model and intervals", async ({
  page,
  request,
}) => {
  await page.goto("/royal-card-prototype.html");
  for (const role of ["batting", "bowling"]) {
    const response = await request.get(
      `/api/v2/rankings/${role}?scenario=primary`,
      { headers: { Authorization: `Bearer ${token()}` } },
    );
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    const result = await page.evaluate(
      async ({ payload, role }) => {
        const { toCardData } =
          await import("/src/components/player-cards/cardData.ts");
        return payload.rankings.map(
          (r) =>
            toCardData(payload, r.player_id, role, payload.metadata.model_id)
              .record,
        );
      },
      { payload, role },
    );
    expect(result).toEqual(payload.rankings);
    const rejection = await page.evaluate(
      async ({ payload, role }) => {
        const { toCardData } =
          await import("/src/components/player-cards/cardData.ts");
        const id = payload.rankings[0].player_id,
          model = payload.metadata.model_id;
        const cases = [
          () => toCardData(payload, 0, role, model),
          () => toCardData(payload, id, role, "wrong"),
          () =>
            toCardData(
              payload,
              id,
              role === "batting" ? "bowling" : "batting",
              model,
            ),
          () =>
            toCardData(
              {
                ...payload,
                rankings: [
                  {
                    ...payload.rankings[0],
                    rating_interval: { lower: 5, upper: 1, level: 0.95 },
                  },
                ],
              },
              id,
              role,
              model,
            ),
        ];
        return cases.map((fn) => {
          try {
            fn();
            return false;
          } catch {
            return true;
          }
        });
      },
      { payload, role },
    );
    expect(rejection).toEqual([true, true, true, true]);
  }
});
test("actual front stats, reverse, reset and full analysis", async ({
  page,
}) => {
  await unlock(page);
  for (const [id, value] of [
    ["front-rating", (await acceptedRow(page)).rating.toFixed(3)],
    [
      "front-events",
      String((await acceptedRow(page)).exposure.pressure_events),
    ],
    [
      "front-matches",
      String((await acceptedRow(page)).exposure.pressure_matches),
    ],
    [
      "front-stability",
      `${((await acceptedRow(page)).probability_top10 * 100).toFixed(1)}%`,
    ],
  ])
    await expect(page.getByTestId(id)).toHaveText(value);
  await expect(page.locator(".rc-tier b")).toHaveText(
    (await acceptedRow(page)).evidence_tier.replace(/^./, (c) =>
      c.toUpperCase(),
    ),
  );
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "180.00",
  );
  await expect(page.locator(".rc-front")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(page.locator(".rc-back")).toBeVisible();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "0.00",
  );
  await page.getByRole("link", { name: "Full analysis" }).click();
  await expect(page).toHaveURL(/#accepted-evidence$/);
});
test("drag bounds, capture, idle frames and reset interrupted flip", async ({
  page,
}) => {
  await unlock(page);
  const card = page.getByTestId("royal-card"),
    surface = page.getByTestId("card-surface"),
    r = await surface.boundingBox();
  await page.mouse.move(r!.x + 100, r!.y + 200);
  await page.mouse.down();
  await page.mouse.move(r!.x + 320, r!.y + 290, { steps: 14 });
  expect(
    Math.abs(Number(await card.getAttribute("data-yaw"))),
  ).toBeLessThanOrEqual(32);
  await page.mouse.up();
  await page.mouse.move(20, 20);
  await expect(card).toHaveAttribute("data-motion", "idle");
  const frames = await card.getAttribute("data-frames");
  await page.waitForTimeout(600);
  expect(await card.getAttribute("data-frames")).toBe(frames);
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await page.waitForTimeout(100);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(card).toHaveAttribute("data-flip", "0.00");
});
test("keyboard controls and bounded rotation", async ({ page }) => {
  await unlock(page);
  await page.getByRole("button", { name: "Flip to evidence" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "180.00",
  );
  await page.getByRole("button", { name: "Reset", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "0.00",
  );
  const rotate = page.getByRole("button", { name: "Rotate mode", exact: true });
  await rotate.click();
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(700);
  expect(
    Number(await page.getByTestId("royal-card").getAttribute("data-yaw")),
  ).toBeLessThan(-20);
  await page.keyboard.press("Escape");
  await expect(rotate).toHaveAttribute("aria-pressed", "false");
});
test("reduced motion and explicit static mode", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await unlock(page);
  await expect(
    page.getByRole("button", { name: "Rotate mode", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "180.00",
  );
  await page.getByRole("button", { name: "Use static surface" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".rc-back")).toBeVisible();
});
test("WebGL unavailable retains semantic evidence and flip", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = () => null;
  });
  await unlock(page);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("front-events")).toHaveText(
    String((await acceptedRow(page)).exposure.pressure_events),
  );
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.locator(".rc-back")).toBeVisible();
});
test("mobile controls, scroll default, viewport and 200% zoom reflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await unlock(page);
  await page.getByTestId("card-surface").scrollIntoViewIfNeeded();
  expect(
    await page
      .getByTestId("card-surface")
      .evaluate((e) => getComputedStyle(e).touchAction),
  ).toBe("pan-y");
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "180.00",
  );
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 720, height: 500 });
  await page.evaluate(() => (document.body.style.zoom = "2"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("lock clears data, credential and GPU; ignores late results", async ({
  page,
}) => {
  await page.route(
    "**/api/v2/rankings/batting?scenario=primary",
    async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.continue();
    },
  );
  await unlock(page);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await page.getByRole("button", { name: "Lock & clear" }).click();
  await expect(page.locator(".rc-card")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#rc-token")).toHaveValue("");
  await expect(page.locator("#rc-token")).toBeFocused();
  await page.locator("#rc-token").fill(token());
  await page.getByRole("button", { name: "Unlock", exact: false }).click();
  await page.getByRole("button", { name: "Lock & clear" }).click();
  await page.waitForTimeout(900);
  await expect(page.locator(".rc-card")).toHaveCount(0);
  expect(page.url()).not.toContain(token());
});
test("one renderer, offscreen pause, 20 remounts and context loss", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).__rcEvents = [];
    window.addEventListener("royal-renderer-lifecycle", (e: any) =>
      (window as any).__rcEvents.push(e.detail),
    );
  });
  await unlock(page);
  await expect(page.locator(".rc-webgl")).toHaveAttribute(
    "data-context",
    "ready",
  );
  const initial = await page
    .locator(".rc-webgl")
    .getAttribute("data-geometries");
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-paused",
    "true",
  );
  for (let i = 0; i < 20; i++) {
    await page
      .getByRole("button", { name: "Pause card / release GPU" })
      .click();
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.getByRole("button", { name: "Resume card" }).click();
    await expect(page.locator(".rc-webgl")).toHaveAttribute(
      "data-context",
      "ready",
    );
  }
  await page.getByTestId("card-surface").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  expect(await page.locator(".rc-webgl").getAttribute("data-geometries")).toBe(
    initial,
  );
  const events = await page.evaluate(() => (window as any).__rcEvents);
  expect(Math.max(...events.map((e) => e.active))).toBeLessThanOrEqual(1);
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("front-rating")).toHaveText(
    (await acceptedRow(page)).rating.toFixed(3),
  );
});
test("front and reverse axe accessibility", async ({ page }) => {
  await unlock(page);
  let result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Flip to evidence" }).click();
  await expect(page.getByTestId("royal-card")).toHaveAttribute(
    "data-flip",
    "180.00",
  );
  result = await new AxeBuilder({ page }).analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("official IPL portrait is loaded for canonical identity, with labelled fallback on failure", async ({
  page,
}) => {
  await unlock(page);
  const photo = page.getByTestId("official-player-portrait");
  await expect(photo).toHaveAttribute("alt", /Yashasvi Jaiswal/);
  await expect
    .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth), {
      timeout: 20000,
    })
    .toBeGreaterThan(0);
  await expect(page.locator(".rc-study-caption")).toContainText(
    "OFFICIAL IPL PORTRAIT",
  );
  await page.route("https://www.iplt20.com/api/team-assets?**", (r) =>
    r.abort(),
  );
  await page.reload();
  await page.locator("#rc-token").fill(token());
  await page.getByRole("button", { name: "Unlock", exact: false }).click();
  await expect(page.locator(".rc-study-caption")).toContainText("UNAVAILABLE");
  await expect(page.locator(".rc-athlete")).toHaveAttribute(
    "aria-label",
    /non-player-specific/,
  );
  await expect(page.getByTestId("front-rating")).toHaveText(
    (await acceptedRow(page)).rating.toFixed(3),
  );
});
test("portrait, name and all front statistics stay within the card border at every supported width and tilt", async ({
  page,
}) => {
  await unlock(page);
  await expect
    .poll(
      () =>
        page
          .getByTestId("official-player-portrait")
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      { timeout: 20000 },
    )
    .toBeGreaterThan(0);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.getByTestId("card-surface").scrollIntoViewIfNeeded();
    for (const pose of ["rest", "left", "right"]) {
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await page.getByTestId("card-surface").scrollIntoViewIfNeeded();
      const r = await page.getByTestId("card-surface").boundingBox();
      if (pose !== "rest")
        await page.mouse.move(
          r!.x + (pose === "left" ? 10 : r!.width - 10),
          r!.y + 70,
        );
      else await page.mouse.move(5, 5);
      await page.waitForTimeout(750);
      const overflow = await page.evaluate(() => {
        const card = document
          .querySelector(".rc-card")!
          .getBoundingClientRect();
        return Array.from(
          document.querySelectorAll(
            ".rc-topline,.rc-rank,.rc-study-caption,.rc-player-name,.rc-stat-face,.rc-official-portrait,.rc-front-stats dt,.rc-front-stats dd",
          ),
        )
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return (
              b.left < card.left + 2 ||
              b.right > card.right - 2 ||
              b.top < card.top + 2 ||
              b.bottom > card.bottom - 2 ||
              (e as HTMLElement).scrollWidth >
                (e as HTMLElement).clientWidth + 1
            );
          })
          .map((e) => ({
            element: e.className,
            text: e.textContent?.slice(0, 50),
          }));
      });
      expect(overflow, `${width}px / ${pose}`).toEqual([]);
    }
  }
});
