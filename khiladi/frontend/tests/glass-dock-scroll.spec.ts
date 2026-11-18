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

test("loader is a continuous KHILA-symbol-DI lockup and can be replayed",async({page})=>{
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#home");
  const intro=page.locator(".khiladi-intro");
  await expect(intro).toBeVisible();
  // Measure the settled lockup, not the first frame while the logo is scaling in.
  await page.waitForTimeout(2380);
  const gap=await page.evaluate(()=>{
    const symbol=document.querySelector(".khiladi-intro .intro-symbol");
    const right=document.querySelector(".khiladi-intro .intro-side--right");
    if(!symbol||!right)return null;
    return right.getBoundingClientRect().left-symbol.getBoundingClientRect().right;
  });
  expect(gap).not.toBeNull();
  expect(Math.abs(gap??999)).toBeLessThan(16);
  await expect(intro).toHaveCount(0,{timeout:8500});
  await page.locator(".footer-replay").click();
  await expect(intro).toBeVisible();
  await page.getByRole("button",{name:/Skip intro/}).click();
  await expect(intro).toHaveCount(0);
});

test("public portraits prioritize exact-match official IPL images",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#home");
  const urls=await page.evaluate(async()=>{
    const {playerImage}=await import("/src/utils/media.ts");
    return [playerImage({player_id:3298,player_name:"Jofra Archer"}),
      playerImage({player_id:6819,player_name:"Yashasvi Jaiswal"}),
      playerImage({player_id:3298,player_name:"Wrong Identity"})];
  });
  expect(urls[0]).toContain("www.iplt20.com/api/team-assets");
  expect(urls[1]).toContain("www.iplt20.com/api/team-assets");
  expect(urls[2] ?? "").not.toContain("www.iplt20.com");
});

test("player rail stays full-height and scrollable without pinned head-only crops",async({page})=>{
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#home");
  await page.keyboard.press("Escape");
  const showcase=page.locator(".home-player-showcase");
  await showcase.scrollIntoViewIfNeeded();
  const grid=page.locator(".home-player-grid");
  await expect(grid.locator(".home-player-item")).toHaveCount(8);
  const metrics=await page.evaluate(()=>{
    const rail=document.querySelector(".home-player-grid") as HTMLElement;
    const card=document.querySelector(".home-player-item") as HTMLElement;
    const image=card?.querySelector(".pc-preview-visual > img") as HTMLElement|null;
    const host=document.querySelector(".home-player-showcase") as HTMLElement;
    return {overflowX:getComputedStyle(rail).overflowX,
      fullCardHeight:card.getBoundingClientRect().height,
      visualHeight:card.querySelector(".pc-preview-visual")?.getBoundingClientRect().height,
      hostHeight:host.getBoundingClientRect().height,
      imageFit:image?getComputedStyle(image).objectFit:null};
  });
  expect(metrics.overflowX).toBe("auto");
  expect(metrics.fullCardHeight).toBeGreaterThan(330);
  expect(metrics.visualHeight).toBeGreaterThan(200);
  expect(metrics.hostHeight).toBeLessThan(1100);
  if(metrics.imageFit) expect(metrics.imageFit).toBe("contain");
});

test("footer is light frosted glass with no trophy image or design-study credit",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#command-centre");
  const footer=page.locator(".khiladi-glass-footer");
  await expect(footer).toBeVisible();
  const style=await footer.evaluate(el=>({image:getComputedStyle(el).backgroundImage,
    glass:getComputedStyle(el.querySelector(".footer-top")!).backdropFilter}));
  expect(style.image).not.toContain("url(");
  expect(style.glass).toMatch(/blur\(/);
  await expect(footer).not.toContainText("Design study:");
  const topCards=page.locator(".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4 > button");
  if(await topCards.count()===4) await expect(topCards.locator("svg")).toHaveCount(0);
  await expect(page.locator("#khiladi-diamond-cursor")).toHaveCount(0);
});
