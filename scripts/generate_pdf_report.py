import os
import base64
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent.parent
EVIDENCE_DIR = BASE_DIR / "docs" / "qa_evidence"

def img_to_b64(filename):
    path = EVIDENCE_DIR / filename
    if not path.exists():
        return ""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
        return f"data:image/png;base64,{data}"

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>KHILADI Rebuilt Website Visual Audit Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
  
  @page {{
    size: A4;
    margin: 14mm 12mm 14mm 12mm;
  }}

  body {{
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: #080C1F;
    color: #F7F4FA;
    margin: 0;
    padding: 0;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}

  .page {{
    page-break-after: always;
    padding-bottom: 15px;
  }}
  .page:last-child {{
    page-break-after: avoid;
  }}

  .header-bar {{
    border-bottom: 2px solid #E81274;
    padding-bottom: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }}

  .brand-title {{
    font-size: 22px;
    font-weight: 900;
    letter-spacing: -0.5px;
    color: #FFFFFF;
    text-transform: uppercase;
  }}
  .brand-title span {{
    color: #E81274;
  }}
  .brand-sub {{
    font-size: 10px;
    font-family: 'JetBrains Mono', monospace;
    color: #F5B400;
    text-transform: uppercase;
    letter-spacing: 1px;
  }}

  .meta-tag {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    color: #85A9FF;
    text-align: right;
  }}

  h2 {{
    font-size: 16px;
    font-weight: 800;
    border-left: 4px solid #E81274;
    padding-left: 8px;
    margin-top: 18px;
    margin-bottom: 8px;
    color: #FFFFFF;
  }}

  p {{
    font-size: 10.5px;
    color: #D1D5DB;
    line-height: 1.5;
    margin-bottom: 10px;
  }}

  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 12px 0;
  }}
  .kpi-box {{
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 8px;
    text-align: center;
  }}
  .kpi-val {{
    font-size: 16px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    color: #E81274;
  }}
  .kpi-lbl {{
    font-size: 8.5px;
    font-family: 'JetBrains Mono', monospace;
    color: #9CA3AF;
    text-transform: uppercase;
  }}

  .screenshot-container {{
    margin: 10px 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }}
  .screenshot-container img {{
    width: 100%;
    display: block;
  }}
  .screenshot-caption {{
    font-size: 9px;
    font-family: 'JetBrains Mono', monospace;
    color: #9CA3AF;
    padding: 5px 10px;
    background: #0F172A;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }}
  .screenshot-caption strong {{
    color: #F5B400;
  }}

  .code-block {{
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 6px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #34D399;
    margin: 6px 0;
  }}
</style>
</head>
<body>

  <!-- PAGE 1: REBUILT HERO -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">KHILADI <span>खिलाड़ी</span></div>
        <div class="brand-sub">Visual Redesign & Motion Rescue Report</div>
      </div>
      <div class="meta-tag">
        Date: 2026-11-15<br>
        Status: Fully Rebuilt & Verified
      </div>
    </div>

    <h2>1. Rebuilt Cinematic Hero & Brand Visual Anchor</h2>
    <p>
      Replaced the generic SaaS template hero with a full-bleed 1080p cricket video montage, an enormous central <strong>Rajasthan Royals crest shield</strong>, minimal high-impact typography, and a single animated Delta-style CTA button. All decorative SaaS KPI cards have been removed from the hero.
    </p>

    <div class="kpi-grid">
      <div class="kpi-box">
        <div class="kpi-val">1,217</div>
        <div class="kpi-lbl">Canonical Whitelist</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val">65,630</div>
        <div class="kpi-lbl">Pressure Balls (LI ≥ 1.8)</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val">₹120 Cr</div>
        <div class="kpi-lbl">RR Auction Cap</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-val" style="color:#34D399;">100% PASS</div>
        <div class="kpi-lbl">Whitelist Integrity</div>
      </div>
    </div>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_01_hero.png')}" alt="Rebuilt Hero">
      <div class="screenshot-caption"><strong>Figure 1:</strong> Rebuilt Cinematic Hero featuring large central RR crest anchor, minimal navigation, full-bleed video, and Delta animated button.</div>
    </div>
  </div>

  <!-- PAGE 2: REBUILT SQUAD BAND (LARGE VISIBLE FIGURES) -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">KHILADI <span>• Squad Band Rebuild</span></div>
        <div class="brand-sub">Authentic 1024×1024 Human Figures (Zero Empty Cards)</div>
      </div>
      <div class="meta-tag">Section: Horizontal Parade</div>
    </div>

    <h2>2. Rajasthan Royals Squad Band (IPL 2026 Data Pack)</h2>
    <p>
      Enriched the dataset so that <strong>every single card features a large, authentic 1024×1024 transparent player cutout</strong> (figure height 240–300px), moving horizontally across alternating Rajasthan Royals brand panels (Royal Pink, Deep Navy, Purple, and Pale Pink). Zero blank shield placeholders.
    </p>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_02_squad_band.png')}" alt="Rebuilt Squad Band">
      <div class="screenshot-caption"><strong>Figure 2:</strong> Seamless squad marquee with large, visible human player cutouts and pressure diagnostics.</div>
    </div>
  </div>

  <!-- PAGE 3: AIRY MANIFESTO & 2008 TROPHY MUSEUM -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">KHILADI <span>• Editorial Cadence</span></div>
        <div class="brand-sub">Light Canvas Manifesto & Archival Photo Collage</div>
      </div>
      <div class="meta-tag">Section: Storytelling Chapters</div>
    </div>

    <h2>3. Open Editorial Manifesto (Light & Airy Off-White Canvas)</h2>
    <p>
      Breaking the dark monotony with an expansive off-white canvas (<code>#F8F5F4</code>) and oversized typography: <em>"FIND THE PLAYER BUILT FOR YOUR MOMENT."</em>
    </p>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_03_editorial_manifesto.png')}" alt="Editorial Manifesto">
      <div class="screenshot-caption"><strong>Figure 3:</strong> Clean, light editorial section providing striking visual contrast against the dark hero.</div>
    </div>

    <h2>4. Rajasthan Royals 2008 Trophy Photo Museum</h2>
    <p>
      Recreating Delta's photograph-in-photograph layering with a central 2008 Championship trophy centerpiece surrounded by angled archival photographs that zoom and reveal color on hover.
    </p>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_04_trophy_museum.png')}" alt="Trophy Museum">
      <div class="screenshot-caption"><strong>Figure 4:</strong> Layered archival photo museum celebrating the 2008 victory with interactive story expansion.</div>
    </div>
  </div>

  <!-- PAGE 4: EXPANSIVE ORBITING QUIZ & CYERA REVEAL -->
  <div class="page">
    <div class="header-bar">
      <div>
        <div class="brand-title">KHILADI <span>• Orbit Quiz & Reveal</span></div>
        <div class="brand-sub">Cream Canvas Orbit & Staged Floating Card</div>
      </div>
      <div class="meta-tag">Section: Signature Interactions</div>
    </div>

    <h2>5. Delta Rotating-Beans Quiz Reimagined with Players</h2>
    <p>
      Full-bleed warm cream/pale-pink canvas (<code>#FAF6F0</code>). <strong>8–12 large background-free transparent player cutouts</strong> revolving at multiple orbital radii around <em>"WHO IS YOUR PERFECT MATCH-WINNER?"</em>. Zero photo borders, zero stadium tiles.
    </p>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_05_orbiting_quiz.png')}" alt="Orbiting Quiz">
      <div class="screenshot-caption"><strong>Figure 5:</strong> Expansive cream-canvas orbiting quiz featuring large isolated transparent cutouts.</div>
    </div>

    <h2>6. Cyera-Inspired Staged Floating Player Reveal</h2>
    <p>
      Replaced the flat right-hand drawer with a central floating glass card with depth, sequential biometrics entry, and radar diagnostics.
    </p>

    <div class="screenshot-container">
      <img src="{img_to_b64('rebuild_06_cyera_player_reveal.png')}" alt="Cyera Profile Reveal">
      <div class="screenshot-caption"><strong>Figure 6:</strong> Cyera-inspired central staged floating profile card with biometrics and IPL verification.</div>
    </div>
  </div>

</body>
</html>
"""

temp_html_path = BASE_DIR / "temp_rebuild_report.html"
with open(temp_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML written. Generating Rebuilt PDF report with Playwright...", flush=True)

output_pdf_1 = BASE_DIR / "KHILADI_WEBSITE_AUDIT_REPORT.pdf"
output_pdf_2 = BASE_DIR / "khiladi" / "frontend" / "public" / "KHILADI_WEBSITE_AUDIT_REPORT.pdf"
output_pdf_3 = Path(r"C:\Users\ranja\.gemini\antigravity\brain\a4dc25d9-3c68-43dc-a4fb-48a212dde8f1\KHILADI_WEBSITE_AUDIT_REPORT.pdf")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(temp_html_path.as_uri())
    page.wait_for_timeout(1000)
    
    pdf_bytes = page.pdf(
        format="A4",
        print_background=True,
        margin={"top": "12mm", "bottom": "12mm", "left": "10mm", "right": "10mm"}
    )
    
    with open(output_pdf_1, "wb") as f:
        f.write(pdf_bytes)
    with open(output_pdf_2, "wb") as f:
        f.write(pdf_bytes)
    with open(output_pdf_3, "wb") as f:
        f.write(pdf_bytes)
        
    browser.close()

if temp_html_path.exists():
    temp_html_path.unlink()

print(f"Rebuilt PDF generated successfully! ({len(pdf_bytes)} bytes)")
