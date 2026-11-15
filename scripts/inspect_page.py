import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()
        
        await page.goto('http://127.0.0.1:3000', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        
        # Take full page screenshot
        await page.screenshot(path='khiladi_current_full.png', full_page=True)
        print("Full page screenshot saved to khiladi_current_full.png")
        
        # Check hero element
        hero = await page.query_selector('section')
        if hero:
            box = await hero.bounding_box()
            print("First section box:", box)
            
        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())
