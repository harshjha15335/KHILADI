import urllib.request
import re

url = "https://www.iplt20.com/teams/rajasthan-royals"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Search for Samson
pos = html.find("Samson")
print("Samson found at:", pos)
if pos != -1:
    print("Context around Samson:\n", html[max(0, pos-400):min(len(html), pos+600)])

pos_jaiswal = html.find("Jaiswal")
print("Jaiswal found at:", pos_jaiswal)
if pos_jaiswal != -1:
    print("Context around Jaiswal:\n", html[max(0, pos_jaiswal-400):min(len(html), pos_jaiswal+600)])
