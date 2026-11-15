import asyncio
import json
import os
import time
from playwright.async_api import async_playwright

SITES = [
    {
        "id": "extrafazant",
        "name": "EXTRAF AZANT",
        "url": "https://www.extrafazant.nl/",
        "routes": ["/", "/work", "/about", "/services"]
    },
    {
        "id": "crl",
        "name": "Creative Reference Library",
        "url": "https://crl-2026.webflow.io/",
        "routes": ["/"]
    },
    {
        "id": "cyera",
        "name": "Cyera: Secure the Unknown",
        "url": "https://secure-the-unknown.cyera.com/",
        "routes": ["/"]
    },
    {
        "id": "auge",
        "name": "AUGE Experience",
        "url": "https://auge-xp.com/",
        "routes": ["/"]
    },
    {
        "id": "delta",
        "name": "Delta Cafés",
        "url": "https://deltacafes.com/en",
        "routes": ["/en"]
    }
]

DETECTION_SCRIPT = """
() => {
    const results = {
        hasGSAP: typeof window.gsap !== 'undefined',
        gsapVersion: window.gsap ? window.gsap.version : null,
        hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined' || (window.gsap && !!window.gsap.plugins && !!window.gsap.plugins.scrollTrigger),
        hasLenis: typeof window.Lenis !== 'undefined' || !!window.__lenis || !!document.querySelector('.lenis'),
        hasLocomotive: typeof window.LocomotiveScroll !== 'undefined' || !!document.querySelector('[data-scroll-container]'),
        hasThree: typeof window.THREE !== 'undefined',
        hasWebGL: (() => {
            try {
                const canvas = document.createElement('canvas');
                return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
            } catch(e) { return false; }
        })(),
        webglRenderer: (() => {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if (!gl) return null;
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Standard WebGL';
            } catch(e) { return null; }
        })(),
        hasFramerMotion: !!document.querySelector('[data-projection-id]') || !!window.__framer_motion,
        hasSwiper: typeof window.Swiper !== 'undefined' || !!document.querySelector('.swiper'),
        hasLottie: typeof window.lottie !== 'undefined' || typeof window.bodymovin !== 'undefined' || !!document.querySelector('lottie-player'),
        fontFamilies: Array.from(new Set(Array.from(document.querySelectorAll('*')).slice(0, 100).map(el => window.getComputedStyle(el).fontFamily))).filter(Boolean).slice(0, 10),
        canvasCount: document.querySelectorAll('canvas').length,
        videoCount: document.querySelectorAll('video').length,
        svgCount: document.querySelectorAll('svg').length,
        pageHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        performanceTiming: (() => {
            const timing = window.performance.timing;
            if (!timing) return {};
            return {
                loadTimeMs: timing.loadEventEnd - timing.navigationStart,
                domReadyMs: timing.domContentLoadedEventEnd - timing.navigationStart
            };
        })()
    };
    return results;
}
"""

async def audit_site(browser, site_info, base_output_dir):
    site_id = site_info["id"]
    site_url = site_info["url"]
    site_dir = os.path.join(base_output_dir, site_id)
    os.makedirs(site_dir, exist_ok=True)
    
    print(f"\n==================================================")
    print(f"STARTING AUDIT: {site_info['name']} ({site_url})")
    print(f"==================================================")

    # 1. Desktop 1920x1080 audit
    context = await browser.new_context(
        viewport={"width": 1920, "height": 1080},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    )
    page = await context.new_page()
    
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    
    metrics = {"console_logs": console_logs, "detection": {}, "viewports": {}}

    try:
        print(f"Navigating to {site_url}...")
        response = await page.goto(site_url, wait_until="domcontentloaded", timeout=45000)
        metrics["status"] = response.status if response else None
        
        # Wait a bit for initial animations / assets
        await page.wait_for_timeout(4000)
        
        # Capture initial screenshot
        await page.screenshot(path=os.path.join(site_dir, "01_initial_hero_1920.png"))
        print(f"Captured initial 1920 viewport.")

        # Run detection script
        detection = await page.evaluate(DETECTION_SCRIPT)
        metrics["detection"] = detection
        print(f"Detection results: {json.dumps(detection, indent=2)}")

        # Test scroll states (0%, 10%, 25%, 50%, 75%, 100%)
        scroll_height = await page.evaluate("() => document.documentElement.scrollHeight")
        viewport_h = 1080
        max_scroll = max(0, scroll_height - viewport_h)
        print(f"Scrollable distance: {max_scroll}px")

        scroll_points = [0.10, 0.25, 0.50, 0.75, 1.00]
        for sp in scroll_points:
            target_y = int(max_scroll * sp)
            await page.evaluate(f"window.scrollTo({{ top: {target_y}, behavior: 'smooth' }})")
            await page.wait_for_timeout(1500)
            pct_label = int(sp * 100)
            await page.screenshot(path=os.path.join(site_dir, f"02_scroll_{pct_label}pct.png"))
            print(f"Captured scroll at {pct_label}% (y={target_y})")

        # Reverse scroll back to top
        await page.evaluate("window.scrollTo({ top: 0, behavior: 'smooth' })")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=os.path.join(site_dir, "03_scroll_returned_top.png"))

        # Test hovers on interactive links / buttons / project items
        interactive_handles = await page.query_selector_all("a, button, [role='button'], nav li, .project, .card")
        print(f"Found {len(interactive_handles)} potential interactive elements.")
        
        hovered_count = 0
        for i, handle in enumerate(interactive_handles[:6]):
            try:
                is_visible = await handle.is_visible()
                if is_visible:
                    box = await handle.bounding_box()
                    if box and box["width"] > 10 and box["height"] > 10:
                        await handle.hover()
                        await page.wait_for_timeout(500)
                        await page.screenshot(path=os.path.join(site_dir, f"04_hover_element_{hovered_count+1}.png"))
                        hovered_count += 1
            except Exception as e:
                pass

        # Check menu trigger / click
        menu_triggers = await page.query_selector_all("button[aria-label*='menu' i], [class*='menu-toggle' i], [class*='burger' i], [class*='nav-toggle' i], header button")
        for mt in menu_triggers:
            if await mt.is_visible():
                try:
                    await mt.click()
                    await page.wait_for_timeout(1000)
                    await page.screenshot(path=os.path.join(site_dir, "05_menu_open_state.png"))
                    print("Captured menu open state.")
                    break
                except Exception:
                    pass

    except Exception as e:
        print(f"Error auditing desktop {site_id}: {e}")
        metrics["error"] = str(e)
    finally:
        await context.close()

    # 2. Responsive testing at 1440, 1024, 768, 390
    viewports = [
        {"name": "desktop_1440", "w": 1440, "h": 900},
        {"name": "tablet_landscape_1024", "w": 1024, "h": 768},
        {"name": "tablet_portrait_768", "w": 768, "h": 1024},
        {"name": "mobile_390", "w": 390, "h": 844, "is_mobile": True}
    ]

    for vp in viewports:
        try:
            ctx = await browser.new_context(
                viewport={"width": vp["w"], "height": vp["h"]},
                is_mobile=vp.get("is_mobile", False),
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15" if vp.get("is_mobile") else "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            )
            p = await ctx.new_page()
            await p.goto(site_url, wait_until="domcontentloaded", timeout=30000)
            await p.wait_for_timeout(3000)
            await p.screenshot(path=os.path.join(site_dir, f"06_responsive_{vp['name']}.png"))
            print(f"Captured {vp['name']} screenshot.")
            await ctx.close()
        except Exception as e:
            print(f"Error on viewport {vp['name']} for {site_id}: {e}")

    # 3. Test prefers-reduced-motion
    try:
        rm_ctx = await browser.new_context(
            viewport={"width": 1920, "height": 1080},
            reduced_motion="reduce"
        )
        rm_page = await rm_ctx.new_page()
        await rm_page.goto(site_url, wait_until="domcontentloaded", timeout=30000)
        await rm_page.wait_for_timeout(3000)
        await rm_page.screenshot(path=os.path.join(site_dir, "07_reduced_motion.png"))
        print(f"Captured reduced-motion screenshot.")
        await rm_ctx.close()
    except Exception as e:
        print(f"Error on reduced motion for {site_id}: {e}")

    # Save metrics JSON
    with open(os.path.join(site_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    print(f"Audit completed for {site_info['name']}.\n")

async def main():
    base_dir = r"docs\reference-audit\evidence"
    async with async_playwright() as p:
        print("Launching Chromium browser...")
        browser = await p.chromium.launch(headless=True)
        for s in SITES:
            await audit_site(browser, s, base_dir)
        await browser.close()
        print("ALL 5 WEBSITES AUDITED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())
