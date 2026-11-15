import requests
import json
import re

sites = {
    "extrafazant": "https://www.extrafazant.nl/",
    "crl": "https://crl-2026.webflow.io/",
    "cyera": "https://secure-the-unknown.cyera.com/",
    "auge": "https://auge-xp.com/",
    "delta": "https://deltacafes.com/en"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

results = {}

for name, url in sites.items():
    print(f"Fetching {name} ({url})...")
    try:
        r = requests.get(url, headers=headers, timeout=15)
        html = r.text
        title = re.findall(r'<title>(.*?)</title>', html, re.I | re.S)
        scripts = re.findall(r'<script[^>]*src=[\'"](.*?)[\'"]', html, re.I)
        styles = re.findall(r'<link[^>]*rel=[\'"]stylesheet[\'"][^>]*href=[\'"](.*?)[\'"]', html, re.I) + re.findall(r'<link[^>]*href=[\'"](.*?)[\'"][^>]*rel=[\'"]stylesheet[\'"]', html, re.I)
        
        # Look for GSAP, Three, Lenis, Framer, Barba, Webflow, React, Vue, Next, Nuxt, Vite, etc.
        tech_indicators = {
            "has_gsap_in_bundle": bool(re.search(r'gsap|scrolltrigger|tweenmax', html, re.I)),
            "has_three_in_bundle": bool(re.search(r'three\.js|three\.module|webgl|threejs', html, re.I)),
            "has_lenis_in_bundle": bool(re.search(r'lenis', html, re.I)),
            "has_locomotive_in_bundle": bool(re.search(r'locomotive', html, re.I)),
            "has_barba_in_bundle": bool(re.search(r'barba', html, re.I)),
            "has_webflow": bool(re.search(r'webflow', html, re.I)),
            "has_nextjs": bool(re.search(r'_next|nextjs', html, re.I)),
            "has_react": bool(re.search(r'react|react-dom', html, re.I)),
            "has_vue": bool(re.search(r'vue|nuxt', html, re.I)),
            "has_framer_motion": bool(re.search(r'framer-motion', html, re.I)),
            "has_lottie": bool(re.search(r'lottie|bodymovin', html, re.I)),
            "has_tailwind": bool(re.search(r'tailwind', html, re.I)),
            "meta_description": re.findall(r'<meta[^>]*name=[\'"]description[\'"][^>]*content=[\'"](.*?)[\'"]', html, re.I)
        }

        # Check script contents for specific signatures
        results[name] = {
            "status_code": r.status_code,
            "title": title[0].strip() if title else None,
            "html_bytes": len(html),
            "scripts_count": len(scripts),
            "scripts_sample": scripts[:10],
            "stylesheets_sample": styles[:10],
            "tech_indicators": tech_indicators
        }
    except Exception as e:
        results[name] = {"error": str(e)}

with open("docs/reference-audit/deep_tech_stack_evidence.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("Saved docs/reference-audit/deep_tech_stack_evidence.json")
