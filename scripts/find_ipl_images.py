import urllib.request
import re

url = "https://www.iplt20.com/teams/rajasthan-royals"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        imgs = re.findall(r'<img[^>]*src=[\'"](.*?)[\'"]', html, re.I)
        player_imgs = [i for i in imgs if 'player' in i.lower() or 'action' in i.lower() or 'headshot' in i.lower() or 'cricketer' in i.lower() or '.png' in i.lower()]
        print("Found player images on RR squad page:")
        for pi in player_imgs[:15]:
            print(" ", pi)
except Exception as e:
    print("Error:", e)
