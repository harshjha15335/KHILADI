import urllib.request
import re
import json

url = "https://www.iplt20.com/teams/rajasthan-royals"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

next_data = re.findall(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
if next_data:
    data = json.loads(next_data[0])
    print("Found __NEXT_DATA__!")
    print("Keys:", data.keys())
    page_props = data.get('props', {}).get('pageProps', {})
    print("pageProps keys:", page_props.keys())
    with open("docs/iplt20_rr_page_props.json", "w", encoding="utf-8") as f:
        json.dump(page_props, f, indent=2)
    print("Saved docs/iplt20_rr_page_props.json")
else:
    print("No __NEXT_DATA__ found. Length of html:", len(html))
