import { test, expect } from "@playwright/test";
test("loader uses blue white and pink on first open and refresh", async ({
  page,
}) => {
  for (let i = 0; i < 2; i++) {
    if (i) await page.reload();
    else await page.goto("/");
    await expect(page.locator(".intro-curtain")).toHaveCSS(
      "background-color",
      "rgb(36, 80, 184)",
    );
    await expect(page.locator(".intro-curtain")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
    await expect(
      page.locator(".intro-symbol .khiladi-logo--white"),
    ).toBeVisible();
    await expect(page.locator(".intro-root")).toHaveCount(0, { timeout: 7000 });
  }
});
test("branding leaves the center, stays white on blue, and exits before heritage and discovery", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".site-header")).toHaveAttribute(
    "data-brand-placement",
    "hero",
  );
  await expect(page.locator(".site-wordmark .khiladi-logo")).toHaveClass(
    /khiladi-logo--white/,
  );
  for (const [section, placement] of [
    [".editorial-chapter", "compact"],
    [".heritage-chapter", "hidden"],
    [".journey-chapter", "hidden"],
    [".quiz-chapter", "hidden"],
  ]) {
    await page
      .locator(section)
      .evaluate((e) =>
        scrollTo(0, e.getBoundingClientRect().top + scrollY + 10),
      );
    await expect(page.locator(".site-header")).toHaveAttribute(
      "data-brand-placement",
      placement,
    );
    if (placement === "hidden")
      await expect(page.locator(".site-wordmark")).not.toBeVisible();
  }
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await expect(
    page.locator(".navigation-dialog .khiladi-logo--original"),
  ).toBeVisible();
});
test("image displacement responds to X and Y, keeps text stable and resets on exit", async ({
  page,
}) => {
  await page.goto("/#database");
  await page.locator(".intro-root").waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("searchbox").fill("Jofra Archer");
  const surface = page.locator(".discovery-photo");
  await surface.scrollIntoViewIfNeeded();
  const bounds = await surface.boundingBox();
  const snapshot = () =>
    surface.evaluate((e) => ({
      x: Number(e.querySelector("feImage")?.getAttribute("x")),
      y: Number(e.querySelector("feImage")?.getAttribute("y")),
      scale: Number(
        e.querySelector("feDisplacementMap")?.getAttribute("scale"),
      ),
      filter: (e.querySelector("img") as HTMLImageElement).style.filter,
    }));
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.2,
    bounds!.y + bounds!.height * 0.5,
    { steps: 12 },
  );
  await page.waitForTimeout(300);
  const horizontal = await snapshot();
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.2,
    bounds!.y + bounds!.height * 0.8,
    { steps: 12 },
  );
  await page.waitForTimeout(300);
  const vertical = await snapshot();
  expect(Math.abs(vertical.y - horizontal.y)).toBeGreaterThan(20);
  expect(Math.abs(vertical.x - horizontal.x)).toBeLessThan(4);
  expect(vertical.scale).toBeGreaterThan(5);
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.8,
    bounds!.y + bounds!.height * 0.2,
    { steps: 15 },
  );
  await page.waitForTimeout(300);
  const diagonal = await snapshot();
  expect(Math.abs(diagonal.x - vertical.x)).toBeGreaterThan(30);
  expect(diagonal.filter).toContain("khiladi-warp");
  await expect(page.locator(".discovery-open strong")).toHaveCSS(
    "filter",
    "none",
  );
  await page.mouse.move(1, 1);
  await expect.poll(async () => (await snapshot()).filter).toBe("");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await surface.hover();
  await expect.poll(async () => (await snapshot()).filter).toBe("");
});
