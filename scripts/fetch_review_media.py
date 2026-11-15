"""Fetch official editorial photos for private local review only; grants no reuse rights."""
from pathlib import Path
import json,urllib.request
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'docs/qa/reference-fidelity/rr-history-sources.json'
records=json.loads(source.read_text())
items=[('trophy-story',records[1]['images'][0])]+[(f'archive-{i}',url.split('?')[0]) for i,url in enumerate(records[2]['gallery'][:6])]
output=ROOT/'docs/qa/reference-fidelity/media-review';output.mkdir(exist_ok=True)
for name,url in items:
 path=output/(name+'.jpg')
 if path.exists():continue
 with urllib.request.urlopen(url,timeout=30) as response:path.write_bytes(response.read())
 print('Fetched private-review photo',name)
print('No license granted. These files are ignored by Git and excluded from production.')
