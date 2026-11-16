import { test, expect } from "@playwright/test";
const skip = async (page: import("@playwright/test").Page, route = "/") => {
  await page.goto(route);
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro-root")).toHaveCount(0);
};
test("chapters change editorial copy and active thumbnails without creating unavailable films", async ({
  page,
}) => {
  await skip(page);
  const chapters = page.locator(".hero-chapters button");
  await chapters.nth(1).click();
  await expect(chapters.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#hero-heading")).toContainText("Make it count.");
  await chapters.nth(2).click();
  await expect(page.locator("#hero-heading")).toContainText(
    "Every possibility.",
  );
  await chapters.first().click();
  await expect(page.locator("#hero-heading")).toContainText("Great players.");
  await expect(
    page.locator(".site-header--home .khiladi-logo img"),
  ).toHaveAttribute("src", /khiladi-symbol\.svg$/);
  await expect(page.locator(".cinematic-home .warp-surface")).toHaveCount(0);
});
test("journey hotspots work by keyboard and portraits open the selected canonical player", async ({
  page,
}) => {
  await skip(page);
  const topic = page.getByRole("button", {
    name: "Your next choice",
    exact: false,
  });
  await topic.focus();
  await page.keyboard.press("Enter");
  await expect(topic).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".journey-copy")).toContainText(
    "Your next decision starts with the evidence.",
  );
  const portrait = page.locator(".home-portrait").first();
  const name = await portrait.innerText();
  await portrait.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#player-profile-title")).toHaveText(
    name.replace(" ↗", ""),
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".profile-dialog")).not.toBeVisible();
  await expect(portrait).toBeFocused();
});
test("profile passes through a thin surface before its tall content and restores scroll/focus", async ({
  page,
}) => {
  await skip(page, "/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  const card = page.locator(".discovery-open");
  await card.focus();
  const scroll = await page.evaluate(() => scrollY);
  await page.keyboard.press("Enter");
  const sheet = page.locator(".profile-sheet");
  await expect(sheet).toBeAttached();
  const early = await sheet.evaluate((e) => ({
    clip: getComputedStyle(e).clipPath,
    width: e.getBoundingClientRect().width,
  }));
  expect(early.clip).not.toBe("none");
  expect(early.width).toBeLessThanOrEqual(421);
  expect(await page.locator(".profile-summary .chapter-button").evaluate(e => Number(getComputedStyle(e).opacity))).toBeLessThan(1);
  await expect(page.locator(".profile-summary h2")).toHaveCSS("opacity", "1");
  const size = await sheet.boundingBox();
  expect(size!.height).toBeGreaterThan(size!.width);
  await expect(page.locator(".profile-evidence")).not.toHaveAttribute("open");
  await page.keyboard.press("Escape");
  await expect(page.locator(".profile-dialog")).toHaveCount(0);
  await expect(card).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
});
test("rapid close during the opening sequence leaves no modal or body lock", async ({
  page,
}) => {
  await skip(page, "/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  for (let i = 0; i < 3; i++) {
    await page.locator(".discovery-open").click();
    await page.keyboard.press("Escape");
    await expect(page.locator(".profile-dialog")).toHaveCount(0);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("profile-is-open"),
      ),
    ).toBe(false);
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      "hidden",
    );
  }
});
test("pointer image/label reset and route changes release track motion", async ({
  page,
}) => {
  await skip(page, "/#database");
  await expect(page.locator(".editorial-player-track")).toBeVisible();
  await page.locator(".kinetic-text").hover();
  await expect(page.locator(".kinetic-preview")).toHaveCSS("opacity", "1");
  const movingImage = await page.locator(".editorial-player img").nth(1).boundingBox();
  await page.mouse.move(movingImage!.x + movingImage!.width / 2, movingImage!.y + movingImage!.height / 2);
  await expect(page.locator("#khiladi-cursor-label")).toHaveText(
    "Explore player",
  );
  await expect(page.locator("#khiladi-cursor-label")).toHaveCSS("opacity", "1");
  await page.mouse.move(1, 1);
  await expect(page.locator("#khiladi-cursor-label")).toHaveCSS("opacity", "0");
  await page.goto("/#home");
  await expect(page.locator(".editorial-player-track")).toHaveCount(0);
  await expect(page.locator("#khiladi-diamond-cursor")).toHaveCount(1);
  await expect(page.locator(".kinetic-preview")).toHaveCount(0);
});
test("touch and reduced motion keep portrait browsing and profile controls usable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  await page.locator(".discovery-open").tap();
  await expect(page.locator("#player-profile-title")).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Close profile" }).tap();
  await expect(page.locator(".profile-dialog")).toHaveCount(0);
  await expect(page.locator("#khiladi-cursor-label")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await context.close();
});
