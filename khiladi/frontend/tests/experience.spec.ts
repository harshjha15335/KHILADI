import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }, info) => {
  if (!info.title.startsWith("loader can"))
    await page.addInitScript(() =>
      sessionStorage.setItem("khiladi_intro_seen", "true"),
    );
});
test("homepage uses restrained navigation, names-only parade and settled quiz figures", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.locator(".squad-group").first().locator("button"),
  ).toHaveCount(27);
  await expect(page.locator(".site-header nav")).toHaveCount(0);
  await expect(page.locator(".squad-chapter")).not.toContainText(
    /Pressure Score|Canonical|Governance/,
  );
  await expect(page.locator("[class*=animate-orbit]")).toHaveCount(0);
  await page.locator(".quiz-chapter").scrollIntoViewIfNeeded();
  await expect(page.locator(".quiz-introduction")).toBeVisible();
  await expect(page.locator(".quiz-figure")).toHaveCount(8);
  expect(errors).toEqual([]);
});
test("native menu is keyboard trapped, routes work and browser back returns home", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Explore players" })
    .click();
  await expect(page).toHaveURL(/#database$/);
  await expect(
    page.getByRole("heading", { name: "Find your match-winner." }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.locator(".hero-chapter")).toBeVisible();
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Menu", exact: false }),
  ).toBeFocused();
});
test("quiz calls the real recommendation API and opens a canonical profile", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".quiz-introduction")
    .getByRole("button", { name: "Find my player" })
    .click();
  await page.getByRole("radio", { name: "Wickets when it matters" }).check();
  await page.getByRole("button", { name: "Next question" }).click();
  await page.getByRole("radio", { name: "The final few overs" }).check();
  const response = page.waitForResponse(
    (r) =>
      r.url().endsWith("/api/quiz/recommend") &&
      r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Show my players" }).click();
  expect((await response).status()).toBe(200);
  await expect(page.locator(".quiz-result")).toHaveCount(3);
  await page.locator(".quiz-result").first().click();
  await expect(page.locator(".profile-dialog")).toBeVisible();
  await expect(page.locator(".profile-dialog details")).not.toHaveAttribute(
    "open",
  );
  await page.getByText("See the performance evidence", { exact: true }).click();
  await expect(page.locator(".profile-dialog")).toContainText(
    "Statistical uncertainty",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator(".profile-dialog")).not.toBeVisible();
});
test("database search, real metrics and squad planning retain selected players", async ({
  page,
}) => {
  await page.goto("/#database");
  await page.getByRole("searchbox").fill("Jofra Archer");
  await expect(page.locator(".discovery-player")).toHaveCount(1);
  await page.getByRole("checkbox", { name: "Show detailed metrics" }).check();
  await expect(page.locator(".discovery-metrics")).toContainText(
    "Pressure bowling balls",
  );
  await page.locator(".discovery-open").click();
  await page.getByRole("button", { name: "Add to my squad" }).click();
  await page.getByRole("button", { name: "Close profile" }).click();
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Build your squad" })
    .click();
  await expect(page.locator("tbody")).toContainText("Jofra Archer");
  await page
    .getByRole("spinbutton", { name: "Planning bid for Jofra Archer" })
    .fill("4");
  await expect(page.getByRole("status")).toContainText("₹4.00");
});
for (const width of [360, 390, 768, 1024, 1440, 1920])
  test(`responsive layout ${width}px has no horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.locator(".squad-group").first().locator("button"),
    ).toHaveCount(27);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
    await page.goto("/#database");
    await expect(page.locator(".discovery-player").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBeTruthy();
  });
test("reduced motion bypasses intro, cursor and moving parade without hiding quiz", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".intro-root")).toHaveCount(0);
  await expect(page.locator("#khiladi-diamond-cursor")).toHaveCount(0);
  await expect(page.locator(".quiz-introduction")).toBeVisible();
  expect(
    await page
      .locator(".squad-track")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe("none");
});
test("rankings and analytic routes retain nonempty real records", async ({
  page,
}) => {
  for (const route of [
    "rankings",
    "batting-intel",
    "bowling-intel",
    "pressure-lab",
    "comparison",
    "methodology",
    "command-centre",
  ]) {
    await page.goto("/#" + route);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(
      page.getByText("Something went wrong", { exact: true }),
    ).toHaveCount(0);
    if (["rankings", "batting-intel", "bowling-intel"].includes(route))
      await expect(page.locator("tbody tr").first()).toBeVisible();
  }
});

test("loader can be skipped with Escape and never locks later navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".intro-root")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".intro-root")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.reload();
  await expect(page.locator(".intro-root")).toHaveCount(0);
});
test("route cleanup prevents duplicated cursors and scroll timelines", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".squad-player").first()).toBeVisible();
  const count = () =>
    page.evaluate(async () => {
      const motion = await import("/src/utils/motion.ts");
      return motion.ScrollTrigger.getAll().length;
    });
  const initial = await count();
  expect(initial).toBeGreaterThan(0);
  for (let i = 0; i < 3; i++) {
    await page.goto("/#database");
    await expect(page.locator(".discovery-player").first()).toBeVisible();
    expect(await count()).toBe(0);
    await page.goto("/#home");
    await expect(page.locator(".squad-player").first()).toBeVisible();
    expect(await count()).toBe(initial);
  }
  await expect(page.locator("#khiladi-diamond-cursor")).toHaveCount(1);
});

test("ranked players can open and close profiles entirely by keyboard", async ({
  page,
}) => {
  await page.goto("/#rankings");
  const player = page.locator("tbody button").first();
  await player.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".profile-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".profile-dialog")).not.toBeVisible();
  await expect(player).toBeFocused();
});
