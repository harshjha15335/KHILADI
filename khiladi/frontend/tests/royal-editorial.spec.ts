import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

// This suite records actual Chromium interactions, not synthetic mock footage.
// Videos are Playwright artifacts; screenshots are checked into CI artifacts only.
test.use({ video: "on", trace: "retain-on-failure" });
const evidenceDir = join(process.cwd(), "visual-review-output", "royal-editorial");
const ensureEvidence = () => mkdir(evidenceDir, { recursive: true });

test("1440 desktop: accessible memory ribbon, real photography and scroll-safe hero", async ({ page }) => {
  await ensureEvidence();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#home");
  await page.keyboard.press("Escape");
  const ribbon = page.getByTestId("cinematic-memory-ribbon");
  await expect(ribbon).toBeVisible();
  await expect(page.getByRole("heading", { name: /Find the players/ })).toBeVisible();
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("01 / 05");
  await page.waitForTimeout(1650); // Capture the settled GSAP heading and glass material, not a blur-in frame.
  await page.screenshot({ path: join(evidenceDir, "hero-desktop-1440.png"), animations: "disabled" });

  const canvas = ribbon.locator("canvas");
  const rect = await canvas.boundingBox();
  if (rect && await canvas.evaluate(el => getComputedStyle(el).display !== "none")) {
    await page.mouse.move(rect.x + rect.width * .25, rect.y + rect.height * .45, { steps: 16 });
    await page.mouse.move(rect.x + rect.width * .74, rect.y + rect.height * .56, { steps: 16 });
  }
  await ribbon.getByRole("button", { name: "Next cricket photograph" }).click();
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("02 / 05");
  await page.screenshot({ path: join(evidenceDir, "gallery-next-1440.png"), animations: "disabled" });
  await page.evaluate(() => window.scrollBy(0, Math.round(innerHeight * .72)));
  await page.waitForTimeout(450);
  await page.screenshot({ path: join(evidenceDir, "hero-scroll-1440.png"), animations: "disabled" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
});

test("mobile: gallery buttons remain usable without WebGL or hover", async ({ page }) => {
  await ensureEvidence();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#home");
  const ribbon = page.getByTestId("cinematic-memory-ribbon");
  await expect(ribbon).toBeVisible();
  await expect(ribbon.locator(".memory-ribbon__still--1 img")).toHaveAttribute("src", /trophy-celebration[.]webp/);
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("01 / 05");
  await ribbon.getByRole("button", { name: "Next cricket photograph" }).click();
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("02 / 05");
  await ribbon.getByRole("button", { name: "Previous cricket photograph" }).click();
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("01 / 05");
  // Touch devices can swipe without requiring a hover target.
  const photo = ribbon.locator(".memory-ribbon__fallback");
  await photo.evaluate(el => {
    const bounds = el.getBoundingClientRect();
    const dispatch = (name: string, property: string, x: number, y: number) => {
      const event = new Event(name, { bubbles: true });
      Object.defineProperty(event, property, {
        value: [{ clientX: x, clientY: y }],
      });
      el.dispatchEvent(event);
    };
    dispatch("touchstart", "touches", bounds.x + bounds.width * .72, bounds.y + bounds.height * .45);
    dispatch("touchend", "changedTouches", bounds.x + bounds.width * .25, bounds.y + bounds.height * .46);
  });
  await expect(ribbon.locator(".memory-ribbon__count")).toHaveText("02 / 05");
  await ribbon.getByRole("button", { name: "Previous cricket photograph" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 4)).toBe(true);
  await page.screenshot({ path: join(evidenceDir, "hero-mobile-390.png"), animations: "disabled" });
  await page.evaluate(() => scrollBy(0, 450));
  await page.screenshot({ path: join(evidenceDir, "mobile-scroll-390.png"), animations: "disabled" });
});

test("Royal Editorial tokens and typography stay consistent without repainting the original vortex", async ({ page }) => {
  await ensureEvidence();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#home");
  const tokens = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    const heading = getComputedStyle(document.querySelector(".hero-chapter-heading")!);
    const eyebrow = getComputedStyle(document.querySelector(".hero-copy .eyebrow")!);
    return {
      ivory: css.getPropertyValue("--royal-ivory").trim(),
      ink: css.getPropertyValue("--royal-ink").trim(),
      rose: css.getPropertyValue("--royal-rose").trim(),
      headingFont: heading.fontFamily,
      eyebrowFont: eyebrow.fontFamily,
    };
  });
  expect(tokens).toMatchObject({ ivory: "#FAF8F5", ink: "#17171B", rose: "#C43670" });
  expect(tokens.headingFont).toContain("Barlow Condensed");
  expect(tokens.eyebrowFont).toContain("Barlow Condensed");

  const cta = page.getByRole("button", { name: /Find my player/ }).first();
  await expect(cta).toHaveClass(/iridescent-glass--garnet/);
  await cta.hover();
  await expect.poll(() => cta.evaluate(el => (el as HTMLElement).style.getPropertyValue("--gl-x"))).not.toBe("");
  await page.goto("/#rankings");
  const vortex = page.locator(".metric-vortex-scene").first();
  await expect(vortex.locator(".typography-vortex-component canvas")).toHaveCount(1);
  const bg = await vortex.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgb(11, 11, 11)");
  await expect(vortex.locator(".iridescent-glass--graphite")).toHaveCount(1);
  await page.screenshot({ path: join(evidenceDir, "vortex-preserved-1440.png"), animations: "disabled" });
});

test("six viewport widths: no hero document overflow or missing navigation", async ({ page }) => {
  await ensureEvidence();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[375, 812], [390, 844], [768, 1024], [1280, 800], [1440, 900], [1920, 1080]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/#home");
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByTestId("cinematic-memory-ribbon")).toBeVisible();
    const overflowing = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowing, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(4);
    await page.screenshot({ path: join(evidenceDir, `hero-${width}x${height}.png`), animations: "disabled" });
  }
});


test("final polish: nav halves use distinct motion and deleted sections remain absent", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#home");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav.locator('[data-nav-motion="sweep"]')).toHaveCount(5);
  await expect(nav.locator('[data-nav-motion="ripple"]')).toHaveCount(5);
  await expect(page.locator(".heritage-chapter, .journey-chapter")).toHaveCount(0);
  await expect(page.locator(".matte-rise__photo")).toHaveCount(0);
  await expect(page.locator(".footer-replay")).toHaveCount(0);
  const publicActions = page.locator(".public-data-pulse__actions");
  await expect(publicActions.locator(".iridescent-glass")).toHaveCount(1);
  await expect(publicActions).not.toContainText("View the public top ten");
});

test("bento portraits open actual player cards, without layered silhouette imagery", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#home");
  const stack = page.locator(".kb-card--discover .kb-portrait-stack");
  const portrait = stack.locator('button[data-player-id]').first();
  await expect(portrait).toBeVisible();
  await expect(portrait.locator("img")).toHaveCount(1);
  await portrait.click();
  await expect(page.locator("dialog.royal-dialog[open]")).toBeVisible();
});

test("Method heading clears the fixed dock at desktop and mobile sizes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto("/#methodology");
    const heading = page.getByRole("heading", { name: "Behind the big moments." });
    await expect(heading).toBeVisible();
    const dock = page.getByRole("navigation", { name: "Primary navigation" });
    const metrics = await page.evaluate(() => {
      const nav = document.querySelector(".khiladi-top-nav")!.getBoundingClientRect();
      const h = document.querySelector(".methodology-page h1")!.getBoundingClientRect();
      return { navBottom: nav.bottom, headingTop: h.top };
    });
    expect(metrics.headingTop, `heading under dock at ${width}`).toBeGreaterThan(metrics.navBottom + 8);
  }
});


test("licensed portrait fallback uses only exact RR player IDs and preserves credits", async ({ page }) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#database");
  const results=await page.evaluate(async()=>{
    const {playerImage}=await import("/src/utils/media.ts");
    return {
      dinesh:playerImage({player_id:143,player_name:"Dinesh Karthik"}),
      surya:playerImage({player_id:1699,player_name:"Suryakumar Yadav"}),
      wrongId:playerImage({player_id:999999,player_name:"Dinesh Karthik"}),
      wrongName:playerImage({player_id:143,player_name:"Another Cricketer"}),
    };
  });
  expect(results.dinesh).toContain("upload.wikimedia.org/wikipedia/commons/");
  expect(results.surya).toContain("upload.wikimedia.org/wikipedia/commons/");
  expect(results.wrongId).toBeUndefined();
  expect(results.wrongName).toBeUndefined();
  const credits=page.locator(".khiladi-photo-credits");
  await expect(credits).toBeVisible();
  await credits.locator("summary").click();
  await expect(credits).toContainText("Dinesh Karthik");
  await expect(credits).toContainText("Suryakumar Yadav");
  await expect(credits.locator('a[href^="https://creativecommons.org/licenses/"]')).toHaveCount(2);
});
