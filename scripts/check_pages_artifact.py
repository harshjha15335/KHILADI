"""Fail publication if the build contains raw source data, review media or reports."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1];dist=r/'khiladi/frontend/dist'
manifest=json.loads((r/'khiladi/frontend/src/config/approved-media.json').read_text())
approved_files=set()
for item in manifest.get('heroClips',[])+manifest.get('moments',[]):
 assert all(item.get(k) for k in ['src','poster','source','permission','caption']), 'Incomplete approved media entry'
 assert item['source'].startswith('https://'), 'Media provenance must use HTTPS'
 for key in ['src','poster']:
  path=item[key]
  assert path.startswith(('https://','/assets/match-moments/')), 'Unapproved media path'
  if path.startswith('/assets/match-moments/'):
   assert '..' not in Path(path).parts
   approved_files.add(path.lstrip('/'))
allowed_data={'player_database.json','rr_squad_2026.json','sample_match_replay.json','top_10_batters.csv','top_10_batters.json','top_10_bowlers.csv','top_10_bowlers.json','quiz_recommendations.json'}
for p in dist.rglob('*'):
 if not p.is_file():continue
 parts=p.relative_to(dist).parts
 assert not set(parts)&{'Data Pack','portraits','cutouts','archival','media-review','__review-media','.git','node_modules'},p
 is_product_logo = p.relative_to(dist).as_posix() == 'assets/brand/khiladi-logo.png'
 is_approved_clip=p.relative_to(dist).as_posix() in approved_files
 assert is_product_logo or is_approved_clip or p.suffix.lower() not in {'.pdf','.zip','.webm','.mp4','.jpg','.jpeg','.png'},p
 assert not p.name.startswith('.env'),p
 if parts[0]=='data':assert p.name in allowed_data,p
 if p.suffix=='.csv':assert p.name in {'top_10_batters.csv','top_10_bowlers.csv'},p
assert len(json.loads((dist/'data/player_database.json').read_text()))==1217
assert len(json.loads((dist/'data/quiz_recommendations.json').read_text()))==9
assert '/KHILADI/assets/' in (dist/'index.html').read_text()
assert all((dist/name).is_file() for name in approved_files), 'Missing approved video/poster'
print('Pages artifact audit passed: permitted manifest media and aggregate exports only; no raw pack, private review assets, reports or env files.')
