import asyncio
import json
import os
import re
from playwright.async_api import async_playwright

async def get_ipl_players():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        
        captured_players = []
        
        # Intercept network responses for player data
        async def on_response(response):
            if "player" in response.url.lower() and ("json" in response.url.lower() or "api" in response.url.lower()):
                try:
                    text = await response.text()
                    if "name" in text.lower() or "firstname" in text.lower():
                        print(f"Captured API response from {response.url[:80]} (len: {len(text)})")
                        with open("docs/ipl_api_sample.json", "w", encoding="utf-8") as f:
                            f.write(text)
                except Exception:
                    pass
        page.on("response", on_response)
        
        print("Navigating to https://www.iplt20.com/teams/rajasthan-royals/squad ...")
        try:
            await page.goto("https://www.iplt20.com/teams/rajasthan-royals/squad", wait_until="commit", timeout=25000)
            await page.wait_for_timeout(6000)
            
            # Query all player card images and names rendered in DOM
            cards = await page.query_selector_all("a[href*='/players/'], .ih-p-img, .player-card, img[src*='player']")
            print(f"Found {len(cards)} potential player elements.")
            
            dom_data = await page.evaluate("""() => {
                const results = [];
                // Find all player cards
                const playerLinks = document.querySelectorAll('a[href*="/players/"]');
                playerLinks.forEach(link => {
                    const nameEl = link.querySelector('h3, h4, h5, .player-name, .name') || link;
                    const imgEl = link.querySelector('img') || link.closest('.player-card')?.querySelector('img');
                    results.push({
                        href: link.href,
                        name: nameEl.innerText.trim(),
                        img: imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : null
                    });
                });
                return results;
            }""")
            print(f"Extracted {len(dom_data)} player elements from DOM.")
            for d in dom_data[:10]:
                print(d)
                
            with open("docs/ipl_scraped_players.json", "w", encoding="utf-8") as f:
                json.dump(dom_data, f, indent=2)
                
        except Exception as e:
            print("Navigation error:", e)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(get_ipl_players())
