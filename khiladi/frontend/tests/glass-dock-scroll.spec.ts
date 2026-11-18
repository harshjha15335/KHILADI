import { expect, test } from "@playwright/test";

const pages = [
  "home", "database", "rankings", "pressure-lab", "comparison", "war-room",
  "data-explorer", "batting-intel", "bowling-intel", "command-centre", "methodology",
];

test("all routes expose a fixed frosted-glass dock with logo in the middle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of pages) {
    await page.goto("/#" + route);
    const dock = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(dock).toBeVisible();
    await expect(dock.locator(".dock-link--left")).toHaveCount(5);
    await expect(dock.locator(".dock-link--right")).toHaveCount(5);
    await expect(dock.locator(".dock-home")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /^Menu/ })).toHaveCount(0);
    const props = await dock.evaluate((el) => {
      const style = getComputedStyle(el);
      return { position: style.position, blur: style.backdropFilter || style.webkitBackdropFilter };
    });
    expect(props.position).toBe("fixed");
    const rect = await dock.boundingBox();
    expect(rect?.y ?? 9999).toBeLessThan(100);
    expect(props.blur).toMatch(/blur\(/);
  }
});

test("glass dock links navigate and reflect the current page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await nav.getByRole("link", { name: "Players" }).click();
  await expect(page).toHaveURL(/#database$/);
  await expect(nav.getByRole("link", { name: "Players" })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "Rankings" }).click();
  await expect(page).toHaveURL(/#rankings$/);
  await expect(page.locator("main")).toContainText("legacy");
  await nav.getByRole("link", { name: "KHILADI — Home" }).click();
  await expect(page).toHaveURL(/#home$/);
});

test("desktop builds the scroll-triggered trophy portal and player parade", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro-root")).toHaveCount(0);
  await expect(page.locator(".hero-photo-slot")).toHaveCount(5);
  await expect(page.locator(".hero-photo-slot--centre")).toHaveCount(1);
  await expect(page.locator(".home-player-item")).toHaveCount(8);
  const count = await page.evaluate(async () => {
    const { ScrollTrigger } = await import("/src/utils/motion.ts");
    return ScrollTrigger.getAll().length;
  });
  expect(count).toBeGreaterThan(3);
});

test("narrow touch screens retain scrollable left and right dock groups", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#database");
  const dock = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(dock).toBeVisible();
  await expect(dock.locator(".dock-home")).toBeVisible();
  const result = await dock.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { within: rect.left >= 0 && rect.right <= innerWidth + 1,
      leftScroll: node.querySelector(".dock-group--left")?.scrollWidth ?? 0,
      rightScroll: node.querySelector(".dock-group--right")?.scrollWidth ?? 0 };
  });
  expect(result.within).toBe(true);
  expect(result.leftScroll).toBeGreaterThan(0);
  expect(result.rightScroll).toBeGreaterThan(0);
});

test("public build renders uploaded trophy and four other real cricket photos", async ({page}) => {
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");
  const photos=page.locator(".hero-collage img");
  await expect(photos).toHaveCount(5);
  await expect.poll(async()=>photos.evaluateAll(imgs=>imgs.filter(i=>(i as HTMLImageElement).naturalWidth>0).length)).toBe(5);
  await expect(photos.nth(2)).toHaveAttribute("src",/trophy-celebration\.webp/);
});
test("public leaderboard and canonical player data load without private D20", async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#rankings");
  await expect(page.locator(".public-ranking-player")).toHaveCount(10);
  await expect(page.locator("main")).toContainText("Pressure index");
  await page.goto("/#database");
  await expect(page.locator(".discovery-player").first()).toBeVisible();
  await page.goto("/#home");
  await expect(page.locator(".public-data-pulse__stat")).toHaveCount(4);
  await expect(page.locator(".public-data-pulse")).toContainText("Canonical player records");
});

test("real player profile exposes public statistics without D20 credential",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  await page.getByRole("button",{name:"Inspect Jofra Archer"}).first().click();
  const dialog=page.locator(".royal-dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".pc-profile-evidence")).toContainText("Recorded batting runs");
  await expect(dialog.locator(".pc-profile-evidence")).toContainText("Pressure bowling deliveries");
  await expect(dialog.locator("[data-testid=front-rating]")).not.toHaveText("—");
  await dialog.getByRole("button",{name:"Flip to evidence"}).click();
  await expect(dialog.locator(".rc-back")).toContainText("Recorded player performance");
  await expect(dialog.locator(".rc-back")).toContainText("Pressure economy");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
test("homepage restores interactive bento and photo-led player cards",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#home");
  await expect(page.locator(".khiladi-bento .kb-card")).toHaveCount(4);
  await expect(page.locator(".home-player-item")).toHaveCount(8);
  await page.getByRole("button",{name:/02 · COMPARE/}).click();
  await expect(page).toHaveURL(/#comparison$/);
});
