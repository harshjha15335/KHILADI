"""Verify the exact published final delivery; run before rebasing metadata."""
from pathlib import Path
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[2]
manifest=json.loads((ROOT/'film/delivery/ASSET_MANIFEST_FINAL.json').read_text());errors=[]
for row in manifest['files']:
 p=ROOT/row['path']
 if not p.is_file():errors.append(f"Missing: {row['path']}");continue
 actual=hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
 if actual!=row['sha256'] or p.stat().st_size!=row['bytes']:errors.append(f"Changed: {row['path']}")
print(json.dumps({'checked':len(manifest['files']),'errors':errors,'expected_frames':5992,'duration_seconds':199.733333},indent=2));sys.exit(bool(errors))
