import { test, expect } from "@playwright/test";
const ready = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await expect(page.locator(".intro-root")).toHaveCount(0, { timeout: 7000 });
  await expect(page.locator(".quiz-figure").first()).toBeVisible();
};
test("full document reload plays the complete loader five times despite old session flag", async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.addInitScript(() =>
    sessionStorage.setItem("khiladi_intro_seen", "true"),
  );
  for (let i = 0; i < 5; i++) {
    if (i === 0) await page.goto("/");
    else await page.reload();
    await expect(page.locator(".intro-root")).toBeVisible();
    await expect(page.locator(".intro-root")).toHaveCount(0, { timeout: 7000 });
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      "hidden",
    );
  }
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Explore players" })
    .click();
  await expect(page.locator(".discovery-player").first()).toBeVisible();
  await expect(page.locator(".intro-root")).toHaveCount(0);
});
test("sound stays absent and removed portrait strips do not return", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("khiladi_sound_enabled", "true"),
  );
  await ready(page);
  await expect(
    page.getByRole("button", { name: /sound|pause movement|play movement/i }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .some((e) => e.name.endsWith("/sound.ts")),
    ),
  ).toBe(false);
  await expect(
    page.locator(".site-wordmark").getByRole("img", { name: "KHILADI" }),
  ).toBeVisible();
  await expect(page.locator(".site-wordmark img")).toHaveAttribute(
    "src",
    /khiladi-symbol\.svg$/,
  );
  await expect(page.locator(".squad-controls")).toHaveCount(0);
  await expect(
    page.locator(
      ".squad-chapter, .portrait-chapter, .hero-story-cards, .editorial-bridge, .home-notes",
    ),
  ).toHaveCount(0);
});
test("button fill is rectangular, fully covers multiple widths and recovers after rapid pointer movement", async ({
  page,
}) => {
  await ready(page);
  for (const selector of [
    ".hero-copy .chapter-button",
    ".editorial-chapter .chapter-button",
    ".closing-chapter .chapter-button",
  ]) {
    const button = page.locator(selector).first();
    await button.scrollIntoViewIfNeeded();
    await button.hover();
    await page.waitForTimeout(650);
    const fill = await button.evaluate((e) => {
      const s = getComputedStyle(e, "::before");
      return {
        transform: s.transform,
        border: s.borderRadius,
        inset: s.inset,
        bg: s.backgroundColor,
      };
    });
    expect(fill.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(fill.border).not.toBe("50%");
    expect(fill.inset).toBe("-2px");
    for (let i = 0; i < 3; i++) {
      await page.mouse.move(1, 1);
      await button.hover();
    }
    await page.waitForTimeout(650);
    expect(
      await button.evaluate((e) => getComputedStyle(e, "::before").transform),
    ).toBe("matrix(1, 0, 0, 1, 0, 0)");
  }
});
test("discovery drifts continuously, reverses scroll cleanly and releases loops on navigation", async ({
  page,
}) => {
  await ready(page);
  await page
    .locator(".quiz-chapter")
    .evaluate((e) =>
      window.scrollTo(0, e.getBoundingClientRect().top + scrollY),
    );
  await page.waitForTimeout(1200);
  const figures = page.locator(".quiz-figure-drift");
  await expect(figures).toHaveCount(8);
  const transforms = () =>
    figures.evaluateAll((es) => es.map((e) => getComputedStyle(e).transform));
  const a = await transforms();
  await page.waitForTimeout(1600);
  const b = await transforms();
  expect(b.every((x, i) => x !== a[i])).toBe(true);
  await page.locator(".hero-chapter").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.locator(".quiz-chapter").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await expect(page.locator(".quiz-introduction")).toBeVisible();
  await page.goto("/#database");
  expect(
    await page.evaluate(async () => {
      const { gsap } = await import("/src/utils/motion.ts");
      return gsap.globalTimeline
        .getChildren(true, true, true)
        .filter((t) =>
          t
            .targets?.()
            .some((e: Element) => e.classList?.contains("quiz-figure-drift")),
        ).length;
    }),
  ).toBe(0);
});
test("bowling and pressure labels match preserved data definitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#bowling-intel");
  await expect(
    page.getByRole("heading", { name: "BOWLING UNDER PRESSURE" }),
  ).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Pressure Balls" }),
  ).toBeVisible();
  await expect(
    page.getByRole("columnheader", { name: "Overall Econ" }),
  ).toBeVisible();
  await page.goto("/#pressure-lab");
  await expect(page.getByText("Not estimated", { exact: true })).toBeVisible();
  await expect(page.getByText("≥ 1.80 LI", { exact: true })).toBeVisible();
  await expect(page.locator("main")).not.toContainText(
    /swings exponentially|Win Prob Swing/,
  );
});
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [768, 1024],
  [390, 844],
  [360, 800],
])
  test(`phase2 responsive ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await ready(page);
    for (const selector of [
      ".hero-chapter",
      ".heritage-composition",
      ".quiz-chapter",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
    await page.getByRole("button", { name: "Menu", exact: false }).click();
    await expect(page.locator(".navigation-dialog")).toBeVisible();
    await page.keyboard.press("Escape");
  });

test("ranking downloads, replay and changed comparison remain functional", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#rankings");
  for (const tab of ["Batters", "Bowlers"]) {
    await page
      .getByRole("button", { name: `Top 10 ${tab} Under Pressure` })
      .click();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: `Export ${tab} CSV` }).click();
    const file = await download;
    expect(file.suggestedFilename()).toContain(tab.toLowerCase());
    const stream = await file.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk);
    expect(Buffer.concat(chunks).toString().trim().split(/\r?\n/)).toHaveLength(
      11,
    );
  }
  await page.goto("/#pressure-lab");
  await page.getByRole("button", { name: "Reset to Ball 1" }).click();
  await page.getByRole("button", { name: "PLAY REPLAY", exact: true }).click();
  await expect
    .poll(async () => page.getByRole("slider").inputValue())
    .not.toBe("0");
  await page.getByRole("button", { name: "PAUSE", exact: true }).click();
  const paused = await page.getByRole("slider").inputValue();
  await page.waitForTimeout(700);
  expect(await page.getByRole("slider").inputValue()).toBe(paused);
  await page.goto("/#comparison");
  await page
    .getByRole("combobox", { name: "Select player A" })
    .selectOption("3298");
  await page
    .getByRole("combobox", { name: "Select player B" })
    .selectOption("2411");
  await expect(
    page.getByRole("heading", { name: "Jofra Archer" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sandeep Sharma" }),
  ).toBeVisible();
});
