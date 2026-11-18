"""Curate only public-safe final film sources/assets; no raw reference/cache tree."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[2];F=ROOT/'film';files=set()
def add(path):
 p=ROOT/path
 if not p.is_file():raise FileNotFoundError(path)
 files.add(p)
def tree(name,extensions):
 for p in (F/name).rglob('*'):
  if p.is_file() and p.suffix.lower() in extensions and '__pycache__' not in p.parts and not any(x in ['cache','frames','model-cache'] for x in p.parts):files.add(p)
for name in ['README.md','CODEX_HANDOFF.md','film/.gitignore','film/FINAL_DELIVERY.md','film/scripts/verify_final_delivery.py','film/scripts/rebase_final_paths.py','film/scripts/build_final_manifest.py','film/data/accepted_primary_rankings.csv','film/docs/METHODOLOGY_FOR_FILM.md','film/outputs/khiladi-master-v3.blend','film/outputs/khiladi-environments.blend','film/work/v4_debug.blend','film/work/reel_sets.py','film/outputs/opening-v2/SECOND_PERSON_NARRATION_DRAFT.md','film/outputs/michael-refinement/MICHAEL_REFINEMENT.json','film/outputs/michael-refinement/MICHAEL_REFINED.wav','film/work/opening_v2/classroom-master.png','film/work/opening_v2/DejaVuSans-Bold.ttf','film/work/opening_v2/DejaVu-LICENSE.txt','film/work/opening_v2/Kalam-Regular.ttf','film/work/opening_v2/Kalam-OFL.txt','film/work/opening_v2/build_opening.py','film/work/geography-review/classroom-reverse-background.png','film/outputs/geography-review/CLASSROOM_LAYOUT.svg','film/outputs/geography-review/GEOGRAPHY_REVIEW.md']:
 add(name)
for name in ['work/full-film-v3','work/film-v3-assembly','work/opening-v3-hero','work/opening-v3-notebook','work/qualified-report-reveal']:
 tree(name,{'.py','.json','.wav','.ass','.png','.svg','.ttf','.txt','.md'})
# Select render inputs, not huge caches or superseded review exports.
for name in ['outputs/opening-v3-hero','outputs/opening-v3-notebook','outputs/qualified-report-reveal','outputs/website-capture']:
 tree(name,{'.py','.json','.md','.svg'})
for name in ['outputs/opening-v3-hero/A_seated_writing.mp4','outputs/opening-v3-hero/B_reverse_classroom_context.mp4','outputs/opening-v3-hero/F_front_teacher_glance_conceal.mp4','outputs/opening-v3-hero/I_wry_recovery.mp4','outputs/qualified-report-reveal/QUALIFIED_REPORT_REVEAL.mp4','outputs/website-capture/KHILADI_WEBSITE_INSERT_4S.mp4','outputs/film-v3-assembly/KHILADI_OPENING_V3_SILENT.mp4','outputs/film-v3-assembly/OPENING_EDIT_DECISIONS.json','outputs/film-v3-assembly/render-manifest.json','outputs/full-film-v3/MICHAEL_FULL_NARRATION.wav','outputs/full-film-v3/MICHAEL_FULL_MIX.wav','outputs/full-film-v3/FULL_CAPTIONS.ass','outputs/full-film-v3/FULL_CAPTIONS.srt','outputs/full-film-v3/AUDIO_MIX_NOTES.json','outputs/full-film-v3/CAPTION_ALIGNMENT_REPORT.json','outputs/full-film-v3/NARRATION_STATUS.json','outputs/final-review/review.md']:
 add('film/'+name)
for name in ['NOTEBOOK_CRICKET_CLEAN.png','NOTEBOOK_CRICKET_SELECTED.png','NOTEBOOK_MATHS.png']:
 add('film/outputs/opening-v3-notebook/'+name)
for name in ['qualified-batter-page.png','qualified-bowler-page.png']:
 add('film/outputs/qualified-report-reveal/'+name)
add('film/outputs/opening-v3-hero/khiladi-opening-v3-hero.blend')
for p in (F/'work/website-capture').glob('*'):
 if p.is_file() and p.suffix in ['.py','.js','.mjs','.md']:files.add(p)
# The individual source cutaways are required by assemble_opening.py.
for p in (F/'outputs/opening-v3-notebook').glob('[CDEGHJ]_*.mp4'):files.add(p)
for p in (F/'work/opening_v2/puppet').glob('*'):
 if p.suffix in ['.png','.json']:files.add(p)
for p in (F/'work/reel/plates').glob('*_1.png'):
 if p.name[:2] in [f'{n:02}' for n in range(2,16)]:files.add(p)
for name in ['batter','bowler']:
 for suffix in ['.png','.svg']:add('film/outputs/report-'+name+'-top10'+suffix)
for p in (F/'delivery').iterdir():
 if p.is_file() and p.name not in ['ASSET_MANIFEST_FINAL.json','PUBLIC_FILE_LIST.txt']:files.add(p)
for p in files:
 assert p.is_relative_to(ROOT) and 'private' not in p.relative_to(ROOT).parts,p
 assert p.stat().st_size<100*1024*1024,p
listing=F/'delivery/PUBLIC_FILE_LIST.txt';files.add(listing);listing.write_text('\n'.join(str(p.relative_to(ROOT)) for p in sorted(files))+'\n')
rows=[dict(path=str(p.relative_to(ROOT)),bytes=p.stat().st_size,sha256=hashlib.file_digest(p.open('rb'),'sha256').hexdigest()) for p in sorted(files)]
manifest=F/'delivery/ASSET_MANIFEST_FINAL.json';manifest.write_text(json.dumps(dict(description='Public-safe final reel and editable inputs; original private sources excluded',frames=5992,fps=30,files=rows),indent=2));files.add(manifest)
Path('/workspace/KHILADI-audio-lab/final-stage-paths').write_bytes(b'\0'.join(str(p.relative_to(ROOT)).encode() for p in sorted(files))+b'\0')
print(json.dumps({'files':len(files),'bytes':sum(p.stat().st_size for p in files),'largest':max((p.stat().st_size,str(p.relative_to(ROOT))) for p in files)},indent=2))
