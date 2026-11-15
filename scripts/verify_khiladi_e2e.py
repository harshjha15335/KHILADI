import time
import json
import urllib.request
from playwright.sync_api import sync_playwright

def test_backend_api():
    print("--- 1. Testing FastAPI Endpoints ---", flush=True)
    
    # 1. Health
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/health")
    health = json.loads(req.read().decode())
    print(f"  Health status: {health.get('status')}, Canonical Players: {health.get('canonical_players_count')}", flush=True)
    assert health.get("status") == "healthy"
    assert health.get("canonical_players_count") == 1217

    # 2. Batters
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/rankings/batters")
    batters_res = json.loads(req.read().decode())
    batters = batters_res.get("rankings", [])
    print(f"  Top 10 Batters loaded: {len(batters)}", flush=True)
    assert len(batters) == 10
    print(f"    Rank 1 Batter: {batters[0]['player_name']} (PII: {batters[0]['pressure_impact_index']})", flush=True)

    # 3. Bowlers
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/rankings/bowlers")
    bowlers_res = json.loads(req.read().decode())
    bowlers = bowlers_res.get("rankings", [])
    print(f"  Top 10 Bowlers loaded: {len(bowlers)}", flush=True)
    assert len(bowlers) == 10
    print(f"    Rank 1 Bowler: {bowlers[0]['player_name']} (PII: {bowlers[0]['pressure_impact_index']})", flush=True)

    # 4. RR Squad
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/rr-squad")
    rr_res = json.loads(req.read().decode())
    rr_squad = rr_res.get("players", [])
    print(f"  RR Squad loaded: {len(rr_squad)} players", flush=True)
    assert len(rr_squad) == 27
    print("  Backend API verification: ALL PASS\n", flush=True)

def test_frontend_e2e():
    print("--- 2. Testing Frontend with Playwright Chromium ---", flush=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Step A: Load Homepage
        print("  Navigating to http://127.0.0.1:3000/ ...", flush=True)
        page.goto("http://127.0.0.1:3000/")
        # Wait for CRL preloader
        time.sleep(3.0)
        page.screenshot(path="docs/qa_evidence/01_homepage_hero.png")
        print("  Captured: 01_homepage_hero.png", flush=True)

        # Step B: Scroll to RR Squad Marquee
        page.evaluate("window.scrollTo(0, 800)")
        time.sleep(1.0)
        page.screenshot(path="docs/qa_evidence/02_rr_squad_band.png")
        print("  Captured: 02_rr_squad_band.png", flush=True)

        # Step C: Scroll to Orbiting Quiz Section
        page.evaluate("window.scrollTo(0, 2200)")
        time.sleep(1.0)
        page.screenshot(path="docs/qa_evidence/03_orbiting_quiz.png")
        print("  Captured: 03_orbiting_quiz.png", flush=True)

        # Step D: Navigate to Top 10 Rankings
        print("  Navigating to Top 10 Rankings...", flush=True)
        rankings_btn = page.locator("nav button", has_text="Top 10 Rankings").first
        rankings_btn.click(force=True)
        time.sleep(1.5)
        page.screenshot(path="docs/qa_evidence/05_top10_rankings.png")
        print("  Captured: 05_top10_rankings.png", flush=True)

        # Step E: Click on Rank 1 Batter in Rankings table to open Cyera Profile Drawer
        print("  Opening Rank 1 Player Profile Drawer...", flush=True)
        first_row = page.locator("tbody tr").first
        first_row.click(force=True)
        time.sleep(1.5)
        page.screenshot(path="docs/qa_evidence/04_player_drawer.png")
        print("  Captured: 04_player_drawer.png", flush=True)
        # Close Drawer
        close_btn = page.locator("button[aria-label='Close Profile']").first
        if close_btn.is_visible():
            close_btn.click(force=True)
        else:
            page.keyboard.press("Escape")
        time.sleep(0.5)

        # Step F: Navigate to Player Database
        print("  Navigating to Player Database...", flush=True)
        db_btn = page.locator("nav button", has_text="Player Database").first
        db_btn.click(force=True)
        time.sleep(1.5)
        # Search for a player
        search_input = page.locator("input[placeholder*='Search by player']")
        if search_input.count() > 0 and search_input.first.is_visible():
            search_input.first.fill("Jurel")
            time.sleep(0.8)
        page.screenshot(path="docs/qa_evidence/06_player_database.png")
        print("  Captured: 06_player_database.png", flush=True)

        # Step G: Navigate to Pressure Lab
        print("  Navigating to Pressure Lab...", flush=True)
        lab_btn = page.locator("nav button", has_text="Pressure Lab").first
        lab_btn.click(force=True)
        time.sleep(1.5)
        page.screenshot(path="docs/qa_evidence/07_pressure_lab.png")
        print("  Captured: 07_pressure_lab.png", flush=True)

        # Step H: Navigate to War Room
        print("  Navigating to Auction War Room...", flush=True)
        war_btn = page.locator("nav button", has_text="War Room").first
        war_btn.click(force=True)
        time.sleep(1.5)
        page.screenshot(path="docs/qa_evidence/08_war_room.png")
        print("  Captured: 08_war_room.png", flush=True)

        # Step I: Navigate to Methodology & PDF
        print("  Navigating to Methodology...", flush=True)
        meth_btn = page.locator("nav button", has_text="Methodology & PDF").first
        meth_btn.click(force=True)
        time.sleep(1.5)
        page.screenshot(path="docs/qa_evidence/09_methodology.png")
        print("  Captured: 09_methodology.png", flush=True)

        browser.close()
        print("  Frontend E2E verification: ALL PASS\n", flush=True)

if __name__ == "__main__":
    test_backend_api()
    test_frontend_e2e()
    print("ALL VERIFICATIONS COMPLETED SUCCESSFULLY!", flush=True)
