import time
from playwright.sync_api import sync_playwright

def capture_new_experience():
    print("Capturing rebuilt KHILADI visual experience with Playwright...", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop 1440x900 viewport
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        page.goto("http://127.0.0.1:3000/")
        # Wait for initial preloader to finish
        time.sleep(3.2)
        
        # 1. Hero with enormous RR crest and video
        page.screenshot(path="docs/qa_evidence/rebuild_01_hero.png")
        print("  1. Captured: docs/qa_evidence/rebuild_01_hero.png", flush=True)

        # 2. Scroll to Squad Band with large human figures
        page.evaluate("window.scrollTo(0, 850)")
        time.sleep(1.2)
        page.screenshot(path="docs/qa_evidence/rebuild_02_squad_band.png")
        print("  2. Captured: docs/qa_evidence/rebuild_02_squad_band.png", flush=True)

        # 3. Scroll to Light Editorial Manifesto
        page.evaluate("window.scrollTo(0, 1600)")
        time.sleep(1.0)
        page.screenshot(path="docs/qa_evidence/rebuild_03_editorial_manifesto.png")
        print("  3. Captured: docs/qa_evidence/rebuild_03_editorial_manifesto.png", flush=True)

        # 4. Scroll to 2008 Trophy Photo Museum
        page.evaluate("window.scrollTo(0, 2350)")
        time.sleep(1.0)
        page.screenshot(path="docs/qa_evidence/rebuild_04_trophy_museum.png")
        print("  4. Captured: docs/qa_evidence/rebuild_04_trophy_museum.png", flush=True)

        # 5. Scroll to Expansive Cream Orbiting Quiz
        page.evaluate("window.scrollTo(0, 3150)")
        time.sleep(1.2)
        page.screenshot(path="docs/qa_evidence/rebuild_05_orbiting_quiz.png")
        print("  5. Captured: docs/qa_evidence/rebuild_05_orbiting_quiz.png", flush=True)

        # 6. Test Cyera Floating Player Card Reveal (trigger click via JS)
        page.evaluate("window.scrollTo(0, 850)")
        time.sleep(0.5)
        page.evaluate("document.querySelectorAll('.animate-marquee > div')[2].click()")
        time.sleep(1.2)
        page.screenshot(path="docs/qa_evidence/rebuild_06_cyera_player_reveal.png")
        print("  6. Captured: docs/qa_evidence/rebuild_06_cyera_player_reveal.png", flush=True)
        # Dismiss
        close_btn = page.locator("button[aria-label='Close Profile']")
        if close_btn.count() > 0 and close_btn.first.is_visible():
            close_btn.first.click(force=True)
        else:
            page.keyboard.press("Escape")
        time.sleep(0.5)

        # 7. Test Minimal Menu Drawer
        menu_btn = page.locator("button", has_text="Menu").first
        if menu_btn.is_visible():
            menu_btn.click(force=True)
            time.sleep(0.8)
            page.screenshot(path="docs/qa_evidence/rebuild_07_editorial_menu.png")
            print("  7. Captured: docs/qa_evidence/rebuild_07_editorial_menu.png", flush=True)

        # 8. Mobile responsive check (390x844 iPhone 14)
        mobile_page = browser.new_page(viewport={"width": 390, "height": 844})
        mobile_page.goto("http://127.0.0.1:3000/")
        time.sleep(3.2)
        mobile_page.screenshot(path="docs/qa_evidence/rebuild_08_mobile_hero.png")
        print("  8. Captured: docs/qa_evidence/rebuild_08_mobile_hero.png", flush=True)

        browser.close()
        print("All rebuild visual evidence captured successfully!", flush=True)

if __name__ == "__main__":
    capture_new_experience()
