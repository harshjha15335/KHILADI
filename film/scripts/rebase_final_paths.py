"""Rebase only final production metadata after cloning/extracting elsewhere."""
from pathlib import Path
import argparse,json
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--apply',action='store_true');a=p.parse_args()
folders=['work/full-film-v3','work/film-v3-assembly','outputs/opening-v3-hero','outputs/opening-v3-notebook','outputs/qualified-report-reveal','outputs/website-capture']
files=[q for name in folders for q in (ROOT/name).glob('*.json') if 'manifest' not in q.name.lower()]
old='/workspace/KHILADI-film/film';changed=[]
for path in files:
 text=path.read_text();new=text.replace(old,str(ROOT).replace('\\','/'))
 if new!=text:
  changed.append(str(path.relative_to(ROOT)))
  if a.apply:path.write_text(new)
print(json.dumps({'apply':a.apply,'root':str(ROOT),'changed':changed},indent=2))
