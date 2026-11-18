"""Prepare explicitly permitted RR clips; never downloads broadcasts or infers a licence.
Example: python scripts/prepare_approved_rr_media.py --input /path/clip.mp4 --id rr-batting
 --source-url https://owner.example/source --permission 'Written permission ...' --caption 'RR batting, match/date'
 --target heroClips --seconds 12
Run once per licensed source; use --target moments for the post-hero sequence.
"""
import argparse,json,re,subprocess,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
 parser=argparse.ArgumentParser(description=__doc__)
 for name in ['input','id','source-url','permission','caption']:parser.add_argument('--'+name,required=True)
 parser.add_argument('--target',choices=['heroClips','moments'],default='heroClips');parser.add_argument('--start',type=float,default=0);parser.add_argument('--seconds',type=float,default=12)
 args=parser.parse_args()
 if not re.fullmatch(r'[a-z0-9][a-z0-9-]{1,49}',args.id):parser.error('id must be 2–50 lower-case letters, digits and hyphens')
 if args.seconds<=0 or args.seconds>30 or args.start<0:parser.error('Use 0–30 second excerpts and a non-negative start')
 if not args.source_url.startswith('https://') or not args.permission.strip():parser.error('An HTTPS source and documented website/editing permission are required')
 original=Path(args.input).resolve(strict=True)
 manifest=ROOT/'khiladi/frontend/src/config/approved-media.json';data=json.loads(manifest.read_text())
 out=ROOT/'khiladi/frontend/public/assets/match-moments';out.mkdir(parents=True,exist_ok=True)
 film=out/(args.id+'.mp4');poster=out/(args.id+'.jpg')
 if film.exists() or poster.exists():parser.error('This asset id already exists; use a distinct id')
 with tempfile.TemporaryDirectory(dir=out) as temporary:
  encoded=Path(temporary)/'clip.mp4';still=Path(temporary)/'poster.jpg'
  subprocess.run(['ffmpeg','-v','error','-ss',str(args.start),'-i',str(original),'-t',str(args.seconds),'-an','-vf','scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30','-c:v','libx264','-preset','medium','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart',str(encoded)],check=True)
  subprocess.run(['ffmpeg','-v','error','-i',str(encoded),'-frames:v','1','-q:v','3',str(still)],check=True)
  encoded.replace(film);still.replace(poster)
 data.setdefault(args.target,[]).append({'src':'/assets/match-moments/'+film.name,'poster':'/assets/match-moments/'+poster.name,'source':args.source_url,'permission':args.permission,'caption':args.caption})
 manifest.write_text(json.dumps(data,indent=2)+'\n');print(f'Prepared {film.name}, {poster.name}; updated {args.target}. Source rights remain the supplied documentation.')
if __name__=='__main__':main()
