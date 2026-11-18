import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Captures real public-shell screenshots for an explicit human visual
 * comparison. A screenshot passing is NOT a visual-parity verdict.
 * Do not add private D20 tokens or protected research response bodies.
 */
const OUTPUT = "visual-review-output";
const PAGES = [
  { route: "home", reference: "https://deltacafes.com/en", section: "Storytelling/hero" },
  { route: "database", reference: "https://deltacafes.com/en/products", section: "Catalogue and filtering" },
  { route: "data-explorer", reference: "https://deltacafes.com/en/products", section: "Identity catalogue/provenance" },
  { route: "rankings", reference: "https://deltacafes.com/en/products", section: "Catalogue/evidence selection" },
  { route: "pressure-lab", reference: "https://deltacafes.com/en/coffee-cycle/roast", section: "Process narrative" },
  { route: "batting-intel", reference: "https://deltacafes.com/en/coffee-cycle/blend", section: "Deep explanatory content" },
  { route: "bowling-intel", reference: "https://deltacafes.com/en/coffee-cycle/blend", section: "Deep explanatory content" },
  { route: "comparison", reference: "https://deltacafes.com/en/products/bean/signature/signature-crema", section: "Split detail composition" },
  { route: "war-room", reference: "https://deltacafes.com/en/about", section: "Editorial content hierarchy" },
  { route: "command-centre", reference: "https://deltacafes.com/en/about", section: "Overview/editorial hierarchy" },
  { route: "methodology", reference: "https://deltacafes.com/en/coffee-cycle", section: "Step-by-step story" },
] as const;

test("capture public KHILADI routes for human Delta reference comparison", async ({
  page,
}) => {
  mkdirSync(OUTPUT, { recursive: true });
  const snapshots = [];
  for (const { route, reference, section } of PAGES) {
    await page.goto(`/#${route}`);
    // Every full page load intentionally plays KHILADI's cinematic intro.
    // Never confuse a preloader screenshot with evidence of a finished page.
    const skip = page.getByRole("button", { name: /Skip introduction/ });
    if (await skip.count()) await skip.click();
    await expect(page.locator(".intro-root")).toHaveCount(0);
    await expect(page.locator("#main-content")).toBeVisible();
    await page.locator("#main-content").evaluate(() =>
      document.fonts?.ready ?? Promise.resolve(),
    );
    const image = await page.screenshot({
      path: join(OUTPUT, `khiladi-${route}.png`),
      animations: "disabled",
      fullPage: false,
    });
    // Public-shell visual evidence for source-review in a text-only connector.
    // Deliberately limited to one route; no private D20 access is used.
    if (route === "database") {
      console.log("KHILADI_DATABASE_CAPTURE_BASE64 " + image.toString("base64"));
    }
    const details = await page.locator("#main-content").evaluate((root) => ({
      heading: root.querySelector("h1")?.textContent?.trim() ?? null,
      textLength: (root.textContent ?? "").trim().length,
      imageCount: root.querySelectorAll("img").length,
      videoCount: root.querySelectorAll("video,iframe").length,
      buttonCount: root.querySelectorAll("button").length,
      background: getComputedStyle(root).backgroundColor,
    }));
    snapshots.push({ route, reference, section, ...details });
    console.log(`KHILADI_VISUAL_REVIEW ${JSON.stringify({ route, reference, section, ...details })}`);
    expect(details.textLength).toBeGreaterThan(60);
  }
  writeFileSync(join(OUTPUT, "khiladi-page-inventory.json"), JSON.stringify(snapshots, null, 2));
});

test("capture Delta reference viewports when accessible; record blockers honestly", async ({
  page,
}) => {
  test.setTimeout(180000);
  mkdirSync(OUTPUT, { recursive: true });
  const references = [...new Set(PAGES.map((entry) => entry.reference))];
  const statuses = [];
  for (const [index, reference] of references.entries()) {
    const name = `delta-${index + 1}`;
    try {
      const response = await page.goto(reference, {
        timeout: 20000,
        waitUntil: "domcontentloaded",
      });
      if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? "unknown"}`);
      // Delta also uses a branded preloader. Do not call its loading
      // curtain an inspected products page or make visual-parity claims.
      // Dismiss the actual Cookiebot consent layer when the public
      // reference presents it; otherwise the screenshot is a cookie banner,
      // not the Delta design being evaluated.
      const reject = page
        .getByRole("button", {
          name: /Rejeitar todos|Reject all|Decline all/i,
        })
        .first();
      if (await reject.isVisible().catch(() => false)) {
        await reject.click({ timeout: 3500 }).catch(() => {});
      }
      // Delta's animated opening can remain onscreen after DOMContentLoaded.
      // These captures are evidence for human review, not proof of parity.
      await page.waitForTimeout(7000);
      const substantive = await page.locator("body").evaluate((body) => ({
        text: (body.innerText ?? "").trim().length,
        media: body.querySelectorAll("img,video,canvas").length,
      }));
      if (substantive.text < 120 || substantive.media < 2) {
        throw new Error(
          `Delta page did not reach a substantive visible state (text=${substantive.text}, media=${substantive.media})`,
        );
      }
      const image = await page.screenshot({
        path: join(OUTPUT, `${name}.png`),
        animations: "disabled",
        fullPage: false,
      });
      if (reference === "https://deltacafes.com/en/products") {
        console.log("DELTA_PRODUCTS_CAPTURE_BASE64 " + image.toString("base64"));
      }
      statuses.push({ reference, screenshot: `${name}.png`, status: "captured" });
    } catch (error) {
      statuses.push({
        reference,
        status: "unavailable",
        reason: error instanceof Error ? error.message.slice(0, 400) : String(error),
      });
    }
  }
  writeFileSync(join(OUTPUT, "delta-reference-access.json"), JSON.stringify(statuses, null, 2));
  console.log(`DELTA_REFERENCE_ACCESS ${JSON.stringify(statuses)}`);
  // The reference is external and may refuse automated access. Never turn
  // that blocker into a false KHILADI failure or visual-fidelity claim.
  expect(statuses).toHaveLength(references.length);
});
