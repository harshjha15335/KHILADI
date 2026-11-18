"""Build private comparison videos from source MP4s and real browser captures.
No reference media is added to application assets. Comparisons are diagnostic,
not a claim of exact timing/content parity.
"""
from pathlib import Path
import json, subprocess
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/qa/reference-replication'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
meta=json.loads((OUT/'clip-metadata.json').read_text());sources={Path(m['name']).stem:m['source_path'] for m in meta}
def run(args):
 result=subprocess.run(args,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 if result.returncode:raise RuntimeError(result.stderr.decode(errors="replace")[-3000:])
pairs=[
 ('delta','Recording_153838_part_00',0,17.0,'matched-delta',0.5,'Media blocked; compare composition and chronology'),
 ('crl','Recording_153838_part_06',0,4.4,'matched-crl',0.0,'Sequence comparison; timings are not source-confirmed'),
 ('extrafazant','Recording_153838_part_05',0,6.0,'matched-extrafazant',0.8,'Mixed type and pointer image; different original content'),
 ('cyera','Recording_153838_part_11',8.5,5.5,'matched-cyera',1.2,'Thin surface to tall card; original player content'),
 ('auge','Recording_154049_part_00',0,6.4,'matched-auge',0.8,'Moving image strip and context label; no shader claim'),
]
timings=json.loads((OUT/"matched-events.json").read_text())
manifest=[]
for name,source,source_start,duration,capture,capture_start,note in pairs:
 capture_start=max(0,timings[name] - (0.15 if name=='cyera' else 0))
 out=OUT/(name+'-comparison.mp4')
 filters=(f'[0:v]fps=30,scale=950:414:force_original_aspect_ratio=decrease,pad=950:414:(ow-iw)/2:(oh-ih)/2:color=fffdf8,setsar=1,setpts=PTS-STARTPTS[a];'
 f'[1:v]fps=30,scale=950:414:force_original_aspect_ratio=decrease,pad=950:414:(ow-iw)/2:(oh-ih)/2:color=fffdf8,setsar=1,setpts=PTS-STARTPTS[b];'
 f'[a][b]hstack,pad=1900:480:0:42:color=fffdf8,'
 f'drawtext=fontfile={FONT}:text=REFERENCE — {name.upper()}:x=20:y=12:fontsize=16:fontcolor=182643,'
 f'drawtext=fontfile={FONT}:text=KHILADI — ORIGINAL IMPLEMENTATION:x=970:y=12:fontsize=16:fontcolor=182643,'
 f"drawtext=fontfile={FONT}:text='{note}':x=20:y=460:fontsize=12:fontcolor=182643[v]")
 run(['ffmpeg','-y','-ss',str(source_start),'-i',sources[source],'-ss',str(capture_start),'-i',str(OUT/(capture+'.webm')),
  '-filter_complex_threads','1','-filter_complex',filters,'-map','[v]','-an','-t',str(duration),'-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p',str(out)])
 # Paired still and 50% overlay: different subject matter prevents a useful pixel-difference score.
 ref=OUT/(name+'-reference-frame.png');actual=OUT/(name+'-actual-frame.png')
 run(['ffmpeg','-y','-ss',str(source_start+min(1,duration/2)),'-i',sources[source],'-frames:v','1',str(ref)])
 run(['ffmpeg','-y','-ss',str(capture_start+min(1,duration/2)),'-i',str(OUT/(capture+'.webm')),'-frames:v','1',str(actual)])
 def fit(path):
  image=Image.open(path).convert('RGB');image.thumbnail((950,414));canvas=Image.new('RGB',(950,414),'#fffdf8');canvas.paste(image,((950-image.width)//2,(414-image.height)//2));return canvas
 a,b=fit(ref),fit(actual);canvas=Image.new('RGB',(1900,455),'#fffdf8');canvas.paste(a,(0,40));canvas.paste(b,(950,40));draw=ImageDraw.Draw(canvas)
 font=ImageFont.truetype(FONT,17);draw.text((20,10),'REFERENCE — '+name.upper(),fill='#182643',font=font);draw.text((970,10),'KHILADI — PARITY STILL INCOMPLETE',fill='#182643',font=font)
 canvas.save(OUT/(name+'-side-by-side.png'));Image.blend(a,b,.5).save(OUT/(name+'-overlay.png'))
 manifest.append({'reference':source+'.mp4','sourceStartSeconds':source_start,'capture':capture+'.webm','captureStartSeconds':capture_start,'durationSeconds':duration,'comparison':out.name,'note':note,'viewportHandling':'Matched native viewport sizes: 1900×828 for Delta/CRL/Extrafazant/Cyera; 1918×896 for AUGE short clip. Source and original cricket content differ; timing alignment is approximate. No pixel parity score is meaningful with distinct content.'})
 print(name,'comparison complete',flush=True)
# Annotated native source frames, with observed geometry distinguished from inference.
annotations=[('hero','Recording_153838_part_00',0,[(5,18,'OBSERVED: independent foreground mark'),(36,55,'OBSERVED: large left headline'),(1100,120,'OBSERVED: right story cards'),(15,745,'OBSERVED: bottom chapter row')]),
 ('profile','Recording_153838_part_11',9.7,[(20,30,'OBSERVED: tall white information surface'),(20,60,'Approx. 22% viewport width; image above text'),(20,90,'INFERRED: clip/mask growth implementation')]),
 ('loader','Recording_153838_part_06',2.5,[(20,30,'OBSERVED: compact letters tip into depth'),(20,60,'UNVERIFIED: proprietary renderer and easing')])]
for name,source,t,labels in annotations:
 target=OUT/(name+'-annotated-source.png');run(['ffmpeg','-y','-ss',str(t),'-i',sources[source],'-frames:v','1',str(target)])
 image=Image.open(target).convert('RGB');draw=ImageDraw.Draw(image);font=ImageFont.truetype(FONT,20)
 for x,y,text in labels:
  box=draw.textbbox((x,y),text,font=font);draw.rectangle((box[0]-4,box[1]-3,box[2]+4,box[3]+3),fill='#fffdf8');draw.text((x,y),text,fill='#182643',font=font)
 image.save(target)
(OUT/'comparison-manifest.json').write_text(json.dumps(manifest,indent=2))
