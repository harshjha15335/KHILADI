import asyncio
import os
from playwright.async_api import async_playwright

async def capture_delta_responsive():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        viewports = [
            {"name": "desktop_1440", "w": 1440, "h": 900},
            {"name": "tablet_landscape_1024", "w": 1024, "h": 768},
            {"name": "tablet_portrait_768", "w": 768, "h": 1024},
            {"name": "mobile_390", "w": 390, "h": 844, "is_mobile": True}
        ]
        for vp in viewports:
            try:
                ctx = await browser.new_context(viewport={"width": vp["w"], "height": vp["h"]}, is_mobile=vp.get("is_mobile", False))
                page = await ctx.new_page()
                await page.goto("https://deltacafes.com/en", wait_until="commit", timeout=15000)
                await page.wait_for_timeout(3000)
                await page.screenshot(path=f"docs/reference-audit/evidence/delta/06_responsive_{vp['name']}.png")
                await ctx.close()
                print(f"Captured Delta {vp['name']}")
            except Exception as e:
                print(f"Error Delta {vp['name']}: {e}")
                
        # Reduced motion
        try:
            rm_ctx = await browser.new_context(viewport={"width": 1920, "height": 1080}, reduced_motion="reduce")
            rm_p = await rm_ctx.new_page()
            await rm_p.goto("https://deltacafes.com/en", wait_until="commit", timeout=15000)
            await rm_p.wait_for_timeout(3000)
            await rm_p.screenshot(path="docs/reference-audit/evidence/delta/07_reduced_motion.png")
            await rm_ctx.close()
            print("Captured Delta reduced motion")
        except Exception as e:
            print(f"Error Delta reduced motion: {e}")
            
        await browser.close()

asyncio.run(capture_delta_responsive())
