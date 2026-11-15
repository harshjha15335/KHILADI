import asyncio
import os
import json
import time
from playwright.async_api import async_playwright
from PIL import Image, ImageChops

EVIDENCE_DIR = 'docs/qa_evidence'
SCREENSHOTS_DIR = os.path.join(EVIDENCE_DIR, 'screenshots')
RECORDINGS_DIR = os.path.join(EVIDENCE_DIR, 'recordings')
OVERLAYS_DIR = os.path.join(EVIDENCE_DIR, 'overlays')

for d in [EVIDENCE_DIR, SCREENSHOTS_DIR, RECORDINGS_DIR, OVERLAYS_DIR]:
    os.makedirs(d, exist_ok=True)

# Also ensure artifact screenshots directory exists
ARTIFACT_DIR = r'C:\Users\ranja\.gemini\antigravity\brain\a4dc25d9-3c68-43dc-a4fb-48a212dde8f1\screenshots'
os.makedirs(ARTIFACT_DIR, exist_ok=True)

async def capture_all():
    print("=== LAUNCHING REBUILD PLAYWRIGHT VALIDATION & RECORDING ===")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        # 1. Video Recording Context
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 900},
            record_video_dir=RECORDINGS_DIR,
            record_video_size={'width': 1440, 'height': 900}
        )
        
        page = await context.new_page()
        
        # Performance trace logging
        fps_samples = []
        page.on('console', lambda msg: None)
        
        print("Navigating to http://127.0.0.1:3000...")
        t0 = time.time()
        await page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
        load_time = time.time() - t0
        print(f"Loaded in {load_time:.2f}s")
        
        # Preloader zoom-in sequence
        await page.wait_for_timeout(2000)
        
        # Section 1: Hero Viewport
        print("Capturing 01_hero_light...")
        hero_path = os.path.join(SCREENSHOTS_DIR, '01_hero_light.png')
        await page.screenshot(path=hero_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '01_hero_light.png'))
        
        # Measure Hero FPS
        fps_hero = await page.evaluate('''() => {
            return new Promise(resolve => {
                let frames = 0;
                let start = performance.now();
                function check() {
                    frames++;
                    if (performance.now() - start > 1000) {
                        resolve(frames);
                    } else {
                        requestAnimationFrame(check);
                    }
                }
                requestAnimationFrame(check);
            });
        }''')
        print(f"Hero Frame Rate: {fps_hero} FPS")
        
        # Section 2: Squad Parade Marquee
        print("Scrolling to Chapter 2: Squad Parade...")
        await page.evaluate("window.scrollTo({top: 920, behavior: 'smooth'})")
        await page.wait_for_timeout(1800)
        squad_path = os.path.join(SCREENSHOTS_DIR, '02_squad_parade_light.png')
        await page.screenshot(path=squad_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '02_squad_parade_light.png'))
        
        # Section 3: Editorial Manifesto
        print("Scrolling to Chapter 3: Editorial Manifesto...")
        await page.evaluate("window.scrollTo({top: 1550, behavior: 'smooth'})")
        await page.wait_for_timeout(1500)
        manifesto_path = os.path.join(SCREENSHOTS_DIR, '03_manifesto_light.png')
        await page.screenshot(path=manifesto_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '03_manifesto_light.png'))
        
        # Section 4: 2008 Trophy Archival Museum
        print("Scrolling to Chapter 4: 2008 Trophy Museum...")
        await page.evaluate("window.scrollTo({top: 2350, behavior: 'smooth'})")
        await page.wait_for_timeout(1500)
        trophy_path = os.path.join(SCREENSHOTS_DIR, '04_trophy_museum_light.png')
        await page.screenshot(path=trophy_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '04_trophy_museum_light.png'))
        
        # Section 5: Orbiting Player Quiz
        print("Scrolling to Chapter 5: Orbiting Player Quiz...")
        await page.evaluate("window.scrollTo({top: 3200, behavior: 'smooth'})")
        await page.wait_for_timeout(2000)
        quiz_path = os.path.join(SCREENSHOTS_DIR, '05_orbiting_quiz_light.png')
        await page.screenshot(path=quiz_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '05_orbiting_quiz_light.png'))
        
        # Trigger Quiz recommendation
        try:
            print("Triggering quiz recommendation...")
            await page.click("button:has-text('Discover Recommended Khiladis')")
            await page.wait_for_timeout(1200)
            await page.screenshot(path=os.path.join(SCREENSHOTS_DIR, '05b_quiz_results_light.png'))
            await page.screenshot(path=os.path.join(ARTIFACT_DIR, '05b_quiz_results_light.png'))
        except Exception as e:
            print(f"Quiz click exception: {e}")
            
        # Section 6: Pressure Taxonomy Chapters
        print("Scrolling to Chapter 6: Pressure Taxonomy...")
        await page.evaluate("window.scrollTo({top: 4100, behavior: 'smooth'})")
        await page.wait_for_timeout(1500)
        chapters_path = os.path.join(SCREENSHOTS_DIR, '06_pressure_taxonomy_light.png')
        await page.screenshot(path=chapters_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '06_pressure_taxonomy_light.png'))
        
        # Section 7: Cyera Layered Player Profile Reveal
        print("Testing Cyera Player Profile Reveal modal...")
        await page.evaluate("window.scrollTo({top: 920, behavior: 'instant'})")
        await page.wait_for_timeout(1000)
        
        # Click on first marquee card directly via evaluate
        await page.evaluate('''() => {
            const firstCard = document.querySelector('.animate-marquee > div');
            if (firstCard) firstCard.click();
        }''')
        await page.wait_for_timeout(1200)
        profile_path = os.path.join(SCREENSHOTS_DIR, '07_cyera_profile_reveal_light.png')
        await page.screenshot(path=profile_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '07_cyera_profile_reveal_light.png'))
        
        # Close profile with ESC key
        await page.keyboard.press('Escape')
        await page.wait_for_timeout(600)
        
        # Section 8: Rankings Page (Light Theme)
        print("Navigating to Rankings Page...")
        await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('nav button'));
            const rBtn = btns.find(b => b.innerText.includes('Rankings'));
            if (rBtn) rBtn.click();
        }''')
        await page.wait_for_timeout(2000)
        rankings_path = os.path.join(SCREENSHOTS_DIR, '08_rankings_page_light.png')
        await page.screenshot(path=rankings_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '08_rankings_page_light.png'))
        
        # Section 9: Player Database Page (Light Theme)
        print("Navigating to Player Database...")
        await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('nav button'));
            const pBtn = btns.find(b => b.innerText.includes('Players'));
            if (pBtn) pBtn.click();
        }''')
        await page.wait_for_timeout(2000)
        database_path = os.path.join(SCREENSHOTS_DIR, '09_database_page_light.png')
        await page.screenshot(path=database_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '09_database_page_light.png'))
        
        # Section 10: Pressure Lab Page (Light Theme)
        print("Navigating to Pressure Lab...")
        await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('nav button'));
            const plBtn = btns.find(b => b.innerText.includes('Pressure Lab'));
            if (plBtn) plBtn.click();
        }''')
        await page.wait_for_timeout(2000)
        lab_path = os.path.join(SCREENSHOTS_DIR, '10_pressure_lab_light.png')
        await page.screenshot(path=lab_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '10_pressure_lab_light.png'))
        
        # Section 11: Mobile Responsive Viewport (390x844)
        print("Testing Mobile Responsive Viewport...")
        await page.set_viewport_size({'width': 390, 'height': 844})
        await page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)
        mobile_path = os.path.join(SCREENSHOTS_DIR, '11_mobile_hero_light.png')
        await page.screenshot(path=mobile_path)
        await page.screenshot(path=os.path.join(ARTIFACT_DIR, '11_mobile_hero_light.png'))
        
        # Close context to finalize video recordings
        await context.close()
        await browser.close()
        
    print("=== PLAYWRIGHT CAPTURE & RECORDINGS COMPLETE ===")
    
    # 2. Side-by-Side Comparison Generator
    generate_comparisons()

def generate_comparisons():
    print("Generating Delta vs KHILADI side-by-side overlays...")
    delta_ref_path = 'docs/delta_full_reference_1440.png'
    khiladi_hero_path = os.path.join(SCREENSHOTS_DIR, '01_hero_light.png')
    
    if os.path.exists(delta_ref_path) and os.path.exists(khiladi_hero_path):
        try:
            delta_img = Image.open(delta_ref_path)
            # Crop first 900px
            delta_hero = delta_img.crop((0, 0, 1440, 900))
            khiladi_hero = Image.open(khiladi_hero_path).resize((1440, 900))
            
            # Side by side canvas (2880 x 900)
            comparison = Image.new('RGB', (2880, 900))
            comparison.paste(delta_hero, (0, 0))
            comparison.paste(khiladi_hero, (1440, 0))
            
            out_cmp = os.path.join(OVERLAYS_DIR, 'delta_vs_khiladi_hero_comparison.png')
            comparison.save(out_cmp)
            comparison.save(os.path.join(ARTIFACT_DIR, 'delta_vs_khiladi_hero_comparison.png'))
            print(f"Created {out_cmp} (2880x900 side-by-side)")
        except Exception as e:
            print("Comparison generation error:", e)

if __name__ == '__main__':
    asyncio.run(capture_all())
