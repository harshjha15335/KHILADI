import json

with open('docs/delta_geometry.json', 'r', encoding='utf-8') as f:
    sections = json.load(f)

md = []
md.append("# DELTA CAFÉS — EXACT HOMEPAGE SECTION MAP & KHILADI BLUEPRINT\n")
md.append("Captured directly from live inspection of `https://deltacafes.com/en` at 1440×900 viewport.\n")
md.append("| # | Reference Section | Top (px) | Height (px) | Delta Background | Delta Key Heading & Text | Buttons & Controls | KHILADI Light Rajasthan Royals Equivalent |")
md.append("|---|---|---|---|---|---|---|---|")

mapping = [
    ("Hero / Delta Aperture", "Full viewport video background, central large logo mark, minimal headline 'Delta, coffee with heart', oval CTA with animated arrow", "Explore Delta [oval pill, animated arrow]", "Hero with authentic RR cricket footage montage, large authorized RR crest mark, headline 'WHEN PRESSURE RISES, ROYALTY RESPONDS', Delta-geometry oval CTA"),
    ("Product Parade / Band", "Colourful scrolling horizontal conveyor belt with product packs against alternating vibrant color panels", "Scroll left/right controls", "Rajasthan Royals Squad Parade: large transparent IPL player cutouts against alternating vibrant panels (#FFEAF2, #F22E83, #F2EBFF, #2549BD, #EAF5FF, #FFFDF8)"),
    ("Editorial / Origins & Stories", "Light cream/ivory background, large dark-ink serif/grotesk headline 'SINCE 1961, COFFEE THAT AWAKENS STORIES', narrative copy, archival imagery", "Discover History [pill outline]", "Editorial Statement: 'FIND THE PLAYER BUILT FOR YOUR MOMENT' on warm ivory (#FFFDF8), dark-ink typography, Rajasthan Royals franchise origins"),
    ("Historical Trophy / Archival Museum", "Archival photographic composition, central historic centerpiece surrounded by victory moments and stories", "Read Story / Explore Moments", "2008 Trophy Archival Museum: central authentic photograph of RR lifting 2008 IPL trophy, surrounded by Shane Warne, Sohail Tanvir, Yusuf Pathan moments"),
    ("Coffee Journey / Chapters", "Four interactive narrative pillars: Origins, Roast, Blend, Tasting with smooth tab/chapter transitions", "Origins / Roast / Blend / Tasting tabs", "Cricket Pressure Anatomy: 4 chapters (Powerplay Siege, Middle-Overs Squeeze, Death-Over Crucible, Chase Deficit)"),
    ("Delta Quiz / Profile Matcher", "Large revolving coffee-bean cutouts on cream canvas orbiting around central question 'What is your coffee profile?'", "Start Quiz / Select Profile", "Orbiting Player Quiz: 10 large background-free IPL cutouts orbiting on warm ivory (#FFFDF8) canvas around role/pressure selector"),
    ("Culture & Digital Magazine (DDD)", "Editorial grid showcasing lifestyle stories, rituals and magazine articles", "Read Stories / View Articles", "Match Winners & Iconic Spells: editorial showcase of historic RR performances with clean cards on pure white (#FFFFFF)"),
    ("Sustainability & Mission", "Light editorial closing section with environmental & community commitment", "Learn More", "KHILADI Methodology & Royal Mission: scientific pressure index, Empirical Bayes, player whitelist integrity"),
    ("Delta Footer", "Subtle ivory/grey background, brand mark, clean column links, copyright & language switcher", "Newsletter / Links", "KHILADI Brand Footer: clean minimal links, data pack attribution, copyright, sound toggle")
]

for i, s in enumerate(sections):
    ref_name, ref_desc, ref_btns, khiladi_equiv = mapping[min(i, len(mapping)-1)]
    h_text = s['headings'][0]['text'] if s['headings'] else 'N/A'
    h_text = h_text[:40].replace('|', '-')
    bg = s['backgroundColor']
    top = int(s['rect']['top'])
    height = int(s['rect']['height'])
    md.append(f"| {i+1} | **{ref_name}** | {top} | {height} | `{bg}` | {h_text} | {ref_btns} | **{khiladi_equiv}** |")

md.append("\n## Measured Geometry & Visual Tokens from Delta Reference\n")
md.append("- **Viewport Tested:** 1440px × 900px\n")
md.append("- **Section Height Proportions:** Hero: ~974px (108vh), History: ~1356px (150vh), Journey: ~1002px (111vh), Quiz: ~1548px (172vh)\n")
md.append("- **Button Geometry:** Height: 44px–52px, Padding: 14px 28px, Border-radius: 9999px (full pill), animated fill sliding from bottom on hover\n")
md.append("- **Orbiting Canvas:** Radius 240px–420px, central interactive card width 480px, circular trajectory with z-depth layering\n")

with open('docs/DELTA_EXACT_SECTION_MAP.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(md))

print("Created docs/DELTA_EXACT_SECTION_MAP.md successfully!")
