import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()
        
        errors = []
        page.on('console', lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
        page.on('pageerror', lambda err: print(f"PAGEERROR: {err}"))
        
        try:
            res = await page.goto('http://127.0.0.1:3000', wait_until='networkidle', timeout=10000)
            print(f"Status: {res.status}")
        except Exception as e:
            print(f"Goto error: {e}")
            
        await page.wait_for_timeout(3000)
        
        root_html = await page.evaluate("() => document.getElementById('root')?.innerHTML || ''")
        print(f"ROOT HTML LENGTH: {len(root_html)}")
        print(f"ROOT FIRST 300 CHARS:\n{root_html[:300]}")
        
        body_bg = await page.evaluate("() => window.getComputedStyle(document.body).backgroundColor")
        print(f"BODY BG: {body_bg}")
        
        await page.screenshot(path='test_live_state.png', full_page=False)
        print("Screenshot saved to test_live_state.png")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
