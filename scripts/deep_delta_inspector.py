import asyncio
import json
from playwright.async_api import async_playwright

async def inspect_delta():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Test at 1440x900
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://deltacafes.com/en', wait_until='domcontentloaded', timeout=20000)
        await page.wait_for_timeout(4000)
        
        # Take full page screenshot of Delta for reference
        await page.screenshot(path='docs/delta_full_reference_1440.png', full_page=True)
        print("Captured docs/delta_full_reference_1440.png")
        
        # Detailed DOM tree extraction
        data = await page.evaluate('''() => {
            const sections = [];
            const els = Array.from(document.querySelectorAll('header, section, footer'));
            
            for (let el of els) {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                
                // Find headings
                const headings = Array.from(el.querySelectorAll('h1, h2, h3, h4, [class*="title"], [class*="heading"]')).map(h => {
                    const hs = window.getComputedStyle(h);
                    const hr = h.getBoundingClientRect();
                    return {
                        tag: h.tagName,
                        text: h.innerText.slice(0, 100).replace(/\\n/g, ' '),
                        fontSize: hs.fontSize,
                        lineHeight: hs.lineHeight,
                        fontWeight: hs.fontWeight,
                        letterSpacing: hs.letterSpacing,
                        color: hs.color,
                        box: { x: hr.x, y: hr.y, width: hr.width, height: hr.height }
                    };
                });
                
                // Find buttons/links
                const buttons = Array.from(el.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"], a[href]')).filter(b => {
                    const text = b.innerText.trim();
                    return text.length > 0 && text.length < 50;
                }).map(b => {
                    const bs = window.getComputedStyle(b);
                    const br = b.getBoundingClientRect();
                    return {
                        text: b.innerText.replace(/\\n/g, ' ').trim(),
                        href: b.getAttribute('href'),
                        fontSize: bs.fontSize,
                        padding: bs.padding,
                        borderRadius: bs.borderRadius,
                        backgroundColor: bs.backgroundColor,
                        color: bs.color,
                        border: bs.border,
                        box: { x: br.x, y: br.y, width: br.width, height: br.height }
                    };
                });
                
                // Find images/videos
                const media = Array.from(el.querySelectorAll('img, video')).map(m => {
                    const mr = m.getBoundingClientRect();
                    return {
                        tag: m.tagName,
                        src: m.src || m.getAttribute('src'),
                        box: { x: mr.x, y: mr.y, width: mr.width, height: mr.height }
                    };
                });
                
                sections.push({
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className,
                    rect: {
                        top: rect.top + window.scrollY,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    },
                    backgroundColor: style.backgroundColor,
                    backgroundImage: style.backgroundImage,
                    headings: headings.slice(0, 6),
                    buttons: buttons.slice(0, 8),
                    mediaCount: media.length,
                    media: media.slice(0, 5)
                });
            }
            return sections;
        }''')
        
        with open('docs/delta_geometry.json', 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Saved {len(data)} sections into docs/delta_geometry.json")
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_delta())
