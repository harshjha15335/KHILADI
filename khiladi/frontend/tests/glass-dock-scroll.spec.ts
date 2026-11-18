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

test("desktop builds the scroll-triggered hero portal and player parade", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro-root")).toHaveCount(0);
  await expect(page.locator(".hero-photo-slot")).toHaveCount(6);
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
