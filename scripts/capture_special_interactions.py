import asyncio
import os
from playwright.async_api import async_playwright

async def capture_crl_and_cyera():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # 1. CRL capture with wait_until='commit' or 'load'
        print("Capturing CRL...")
        ctx_crl = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page_crl = await ctx_crl.new_page()
        try:
            await page_crl.goto("https://crl-2026.webflow.io/", wait_until="commit", timeout=20000)
            await page_crl.wait_for_timeout(4000)
            os.makedirs("docs/reference-audit/evidence/crl", exist_ok=True)
            await page_crl.screenshot(path="docs/reference-audit/evidence/crl/01_initial_hero_1920.png")
            
            # Scroll down
            await page_crl.evaluate("window.scrollTo({ top: 800, behavior: 'smooth' })")
            await page_crl.wait_for_timeout(1500)
            await page_crl.screenshot(path="docs/reference-audit/evidence/crl/02_scroll_grid_view.png")
            
            await page_crl.evaluate("window.scrollTo({ top: 1800, behavior: 'smooth' })")
            await page_crl.wait_for_timeout(1500)
            await page_crl.screenshot(path="docs/reference-audit/evidence/crl/02_scroll_footer.png")
            
            # Hover over cards/entries
            links = await page_crl.query_selector_all("a, .entry, .card, [role='button']")
            if links:
                for idx, l in enumerate(links[:4]):
                    try:
                        if await l.is_visible():
                            await l.hover()
                            await page_crl.wait_for_timeout(400)
                            await page_crl.screenshot(path=f"docs/reference-audit/evidence/crl/04_hover_entry_{idx+1}.png")
                    except Exception:
                        pass
                        
            # Mobile 390
            ctx_crl_m = await browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
            p_m = await ctx_crl_m.new_page()
            await p_m.goto("https://crl-2026.webflow.io/", wait_until="commit", timeout=20000)
            await p_m.wait_for_timeout(3000)
            await p_m.screenshot(path="docs/reference-audit/evidence/crl/06_responsive_mobile_390.png")
            await ctx_crl_m.close()
            print("CRL captured successfully.")
        except Exception as e:
            print(f"CRL capture error: {e}")
        finally:
            await ctx_crl.close()

        # 2. Cyera Interactive Canvas inspection
        print("Capturing Cyera Interactive Canvas...")
        ctx_cyera = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page_cyera = await ctx_cyera.new_page()
        try:
            await page_cyera.goto("https://secure-the-unknown.cyera.com/", wait_until="commit", timeout=25000)
            await page_cyera.wait_for_timeout(5000)
            os.makedirs("docs/reference-audit/evidence/cyera", exist_ok=True)
            await page_cyera.screenshot(path="docs/reference-audit/evidence/cyera/01_hero_canvas_loaded.png")
            
            # Move mouse across canvas to trigger particle/3D reaction
            await page_cyera.mouse.move(500, 500)
            await page_cyera.wait_for_timeout(1000)
            await page_cyera.mouse.move(960, 540)
            await page_cyera.wait_for_timeout(1000)
            await page_cyera.screenshot(path="docs/reference-audit/evidence/cyera/02_canvas_interactive_mouse.png")
            
            # Scroll progression in Cyera
            await page_cyera.mouse.wheel(0, 1000)
            await page_cyera.wait_for_timeout(2000)
            await page_cyera.screenshot(path="docs/reference-audit/evidence/cyera/03_scroll_scene_1.png")
            
            await page_cyera.mouse.wheel(0, 2000)
            await page_cyera.wait_for_timeout(2000)
            await page_cyera.screenshot(path="docs/reference-audit/evidence/cyera/04_scroll_scene_2.png")
            print("Cyera captured successfully.")
        except Exception as e:
            print(f"Cyera capture error: {e}")
        finally:
            await ctx_cyera.close()

        # 3. AUGE Experience project transitions
        print("Capturing AUGE Projects...")
        ctx_auge = await browser.new_context(viewport={"width": 1920, "height": 1080})
        page_auge = await ctx_auge.new_page()
        try:
            await page_auge.goto("https://auge-xp.com/", wait_until="commit", timeout=25000)
            await page_auge.wait_for_timeout(5000)
            os.makedirs("docs/reference-audit/evidence/auge", exist_ok=True)
            await page_auge.screenshot(path="docs/reference-audit/evidence/auge/01_hero_canvas_steady.png")
            
            # Mouse move across WebGL canvas
            await page_auge.mouse.move(300, 400)
            await page_auge.wait_for_timeout(1000)
            await page_auge.mouse.move(960, 540)
            await page_auge.wait_for_timeout(1000)
            await page_auge.screenshot(path="docs/reference-audit/evidence/auge/02_canvas_hover_distortion.png")
            
            # Project click or drag
            await page_auge.mouse.wheel(0, 800)
            await page_auge.wait_for_timeout(2000)
            await page_auge.screenshot(path="docs/reference-audit/evidence/auge/03_scroll_project_carousel.png")
            print("AUGE captured successfully.")
        except Exception as e:
            print(f"AUGE capture error: {e}")
        finally:
            await ctx_auge.close()

        await browser.close()

asyncio.run(capture_crl_and_cyera())
