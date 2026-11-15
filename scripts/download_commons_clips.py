import urllib.request
import json
import os
import subprocess

os.makedirs('sourced_cricket_clips', exist_ok=True)

titles = [
    'File:Aythorpe Roding CC v Terling CC, Essex, England Video 1 batsman clean bowled out.webm',
    'File:Aythorpe Roding CC v Terling CC, Essex, England Video 2 batsman hits cover drives.webm',
    'File:Aythorpe Roding CC v Terling CC, Essex, England Video 4 bowler hit for six.webm',
    'File:Spectator at Sylhet International Stadium on March 2023.webm'
]

pipe_titles = '|'.join([t.replace(' ', '_') for t in titles])
url = f'https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|mime|size&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    pages = data.get('query', {}).get('pages', {})
    for pid, pinfo in pages.items():
        title = pinfo.get('title')
        ii = pinfo.get('imageinfo', [{}])[0]
        file_url = ii.get('url')
        size_mb = ii.get('size', 0) / (1024 * 1024)
        print(f"Downloading {title} ({size_mb:.2f} MB)...")
        filename = file_url.split('?')[0].split('/')[-1]
        filename = urllib.parse.unquote(filename).replace(',', '').replace(' ', '_')
        local_path = os.path.join('sourced_cricket_clips', filename)
        
        # Download file
        req2 = urllib.request.Request(file_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req2) as resp2, open(local_path, 'wb') as out_f:
            out_f.write(resp2.read())
        print(f"Saved {local_path} ({os.path.getsize(local_path) / (1024*1024):.2f} MB)")

print("All cricket clips downloaded successfully!")
