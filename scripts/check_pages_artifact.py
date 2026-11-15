"""Fail publication if the build contains raw source data, review media or reports."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1];dist=r/'khiladi/frontend/dist'
allowed_data={'player_database.json','rr_squad_2026.json','sample_match_replay.json','top_10_batters.csv','top_10_batters.json','top_10_bowlers.csv','top_10_bowlers.json','quiz_recommendations.json'}
for p in dist.rglob('*'):
 if not p.is_file():continue
 parts=p.relative_to(dist).parts
 assert not set(parts)&{'Data Pack','portraits','cutouts','archival','media-review','__review-media','.git','node_modules'},p
 assert p.suffix.lower() not in {'.pdf','.zip','.webm','.mp4','.jpg','.jpeg','.png'},p
 assert not p.name.startswith('.env'),p
 if parts[0]=='data':assert p.name in allowed_data,p
 if p.suffix=='.csv':assert p.name in {'top_10_batters.csv','top_10_bowlers.csv'},p
assert len(json.loads((dist/'data/player_database.json').read_text()))==1217
assert len(json.loads((dist/'data/quiz_recommendations.json').read_text()))==9
assert '/KHILADI/assets/' in (dist/'index.html').read_text()
print('Pages artifact audit passed: aggregate exports only; no raw pack, protected images, review recordings, reports or env files.')
