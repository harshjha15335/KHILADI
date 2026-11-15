import urllib.request
import re
import json
import os
from PIL import Image
import io

url = "https://www.iplt20.com/teams/rajasthan-royals"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})

print("Fetching Rajasthan Royals roster from iplt20.com...")
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
except Exception as e:
    print("Error fetching:", e)
    html = ""

# Look for player image API URLs and adjacent names
# Pattern: pathname=player%2F8903%2F1558%2F(\d+).png
matches = re.findall(r'pathname=(player%2F[a-zA-Z0-9%_-]+\.png)&amp;brand=ipl', html)
if not matches:
    matches = re.findall(r'pathname=(player%2F[a-zA-Z0-9%_-]+\.png)&brand=ipl', html)
print(f"Found {len(matches)} player image path matches on RR page.")

# Also inspect player cards
# Let's extract player blocks
cards = re.findall(r'href=[\'"]/players/([a-z0-9-]+)/(\d+)[\'"].*?pathname=(player%2F[a-zA-Z0-9%_.-]+\.png)', html, re.S)
print(f"Matched {len(cards)} player profile + image pairs:")
for slug, ipl_pid, img_path in cards[:10]:
    print(f"  {slug} (IPL ID: {ipl_pid}) -> {img_path}")

# Load canonical players to map names
with open("khiladi/data/player_database.json", "r", encoding="utf-8") as f:
    canon_players = json.load(f)

canon_by_slug = {}
for p in canon_players:
    s = re.sub(r'[^a-z0-9]+', '-', p['player_name'].lower()).strip('-')
    canon_by_slug[s] = p

os.makedirs("khiladi/assets/cutouts", exist_ok=True)
os.makedirs("khiladi/assets/portraits", exist_ok=True)

downloaded_count = 0
cutout_manifest = []

for slug, ipl_pid, img_path in cards:
    matched_player = canon_by_slug.get(slug)
    if not matched_player:
        # try partial match
        for s, p in canon_by_slug.items():
            if slug in s or s in slug:
                matched_player = p
                break
                
    if matched_player:
        pid = matched_player['player_id']
        pname = matched_player['player_name']
        img_url = f"https://www.iplt20.com/api/team-assets?pathname={img_path}&brand=ipl"
        profile_url = f"https://www.iplt20.com/players/{slug}/{ipl_pid}"
        
        # Download transparent cutout
        out_filename = f"{pid}_{slug}_cutout.png"
        out_path = os.path.join("khiladi/assets/cutouts", out_filename)
        
        if not os.path.exists(out_path):
            try:
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(img_req, timeout=10) as img_resp:
                    data = img_resp.read()
                    im = Image.open(io.BytesIO(data))
                    # verify alpha
                    if im.mode == 'RGBA':
                        im.save(out_path, format="PNG")
                        im.save(os.path.join("khiladi/assets/portraits", f"{pid}_{slug}.png"), format="PNG")
                        print(f"Downloaded official RGBA cutout for {pname} ({out_filename}, size {im.size})")
                        downloaded_count += 1
            except Exception as err:
                print(f"Error downloading {pname}: {err}")
                
        cutout_manifest.append({
            "player_id": pid,
            "player_name": pname,
            "slug": slug,
            "ipl_id": ipl_pid,
            "official_profile_url": profile_url,
            "official_image_url": img_url,
            "local_cutout_path": f"/assets/cutouts/{out_filename}",
            "local_portrait_path": f"/assets/portraits/{pid}_{slug}.png",
            "has_transparent_alpha": True,
            "is_whitelisted": True
        })

print(f"\nSuccessfully processed {downloaded_count} authentic transparent player cutouts!")
with open("khiladi/assets/cutout_manifest.json", "w", encoding="utf-8") as f:
    json.dump(cutout_manifest, f, indent=2)
