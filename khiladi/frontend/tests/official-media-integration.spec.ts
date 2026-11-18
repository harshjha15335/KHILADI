import { expect, test } from "@playwright/test";

test("homepage shows an official click-to-play Royals video when no cleared montage exists", async ({
  page,
}) => {
  await page.goto("/#home");
  const count = await page.locator(".official-royals-video").count();
  if (count !== 1) {
    const parents = await page.locator(".official-royals-video").evaluateAll(
      (elements) => elements.map((node) => {
        let current: Element | null = node;
        const names: string[] = [];
        for (let index = 0; index < 7 && current; index++) {
          names.push(current.tagName.toLowerCase() + "#" + current.id + "." + current.className);
          current = current.parentElement;
        }
        return names.join(" > ");
      }),
    );
    console.log("KHILADI_DUPLICATE_VIDEO_DEBUG " + JSON.stringify({ count, parents }));
  }
  expect(count).toBe(1);
  const button = page.getByRole("button", {
    name: "Play Rajasthan Royals official team video",
  });
  await expect(button).toBeVisible();
  await expect(page.locator(".official-royals-video iframe")).toHaveCount(0);
  await button.click();
  const frame = page.locator(".official-royals-video iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/kYym8oJ0Dvg/,
  );
  await expect(frame).toHaveAttribute("title", /Rajasthan Royals/);
  await expect(
    page.getByRole("link", { name: /Watch on the official source/ }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=kYym8oJ0Dvg");
});

test("private portrait mapping resolves correct canonical identities only in review mode", async ({
  page,
}) => {
  await page.goto("/#database");
  const result = await page.evaluate(async () => {
    const { officialPortrait } = await import(
      "/src/components/player-cards/portraitSource.ts"
    );
    const { playerImage } = await import("/src/utils/media.ts");
    const manifest = (await import(
      "/src/components/player-cards/official-portraits.json"
    )).default as Record<string, {name:string,url:string,source:string}>;
    return {
      mapped: Object.keys(manifest).length,
      buttler: officialPortrait(813)?.name,
      missing: officialPortrait(999999) === null,
      url: playerImage({ player_id: 813, player_name: "Jos Buttler" }),
    };
  });
  expect(result.mapped).toBeGreaterThanOrEqual(58);
  expect(result.buttler).toBe("Jos Buttler");
  expect(result.missing).toBe(true);
  expect(result.url).toMatch(/^https:\/\/www\.iplt20\.com\//);
});
