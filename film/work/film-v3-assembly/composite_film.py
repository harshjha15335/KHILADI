"""Retained-puppet physical-evidence film compositor. Timing/audio are injectable.
Private reference media is never consumed. No voice synthesis occurs here.
"""
from pathlib import Path
import argparse,json,math,hashlib,subprocess,os
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter,ImageOps
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/film-v3-assembly';OUT=ROOT/'outputs/film-v3-assembly'
PLAN=json.loads((WORK/'visual-plan.json').read_text());FPS=30
DEJAVU=ROOT/'work/opening_v2/DejaVuSans-Bold.ttf';KALAM=ROOT/'work/opening_v2/Kalam-Regular.ttf'
INK=(31,35,40,255);PAPER=(236,224,193,255);GOLD=(224,165,52,255);PINK=(186,64,96,255);TEAL=(46,123,125,255);BLUE=(54,91,129,255)

def smooth(v):v=max(0,min(1,v));return v*v*(3-2*v)
def mix(a,b,t):return a+(b-a)*t

class Renderer:
 def __init__(self,width=540):
  self.w=width;self.h=round(width*1920/1080);self.s=width/1080;self.images={};self.fonts={};self.sprites={}
  # Texture only: preserve the source wood's aspect ratio and pixel scale.
  # Alternating tile edges are mirrored to meet continuously; the classroom,
  # characters and camera geography are never mirrored.
  with Image.open(ROOT/'work/opening_v2/classroom-master.png') as source:
   tile=source.convert('RGBA').crop((180,1320,720,1560));scale=self.w/source.width;tile=tile.resize((round(tile.width*scale),round(tile.height*scale)),Image.Resampling.LANCZOS)
  self.table=Image.new('RGBA',(self.w,self.h))
  for row in range(math.ceil(self.h/tile.height)):
   for col in range(math.ceil(self.w/tile.width)):
    patch=ImageOps.mirror(tile) if col%2 else tile
    if row%2:patch=ImageOps.flip(patch)
    self.table.alpha_composite(patch,(col*tile.width,row*tile.height))
  for p in (ROOT/'work/opening_v2/puppet').glob('*.png'):
   self.sprites[p.stem]=Image.open(p).convert('RGBA').resize((round(width*.72),round(width*.72*1200/900)),Image.Resampling.LANCZOS)
 def p(self,*values):return tuple(round(v*self.s) for v in values)
 def font(self,size,hand=False):
  key=(size,hand)
  if key not in self.fonts:self.fonts[key]=ImageFont.truetype(str(KALAM if hand else DEJAVU),max(8,round(size*self.s)))
  return self.fonts[key]
 def txt(self,im,x,y,text,size=30,color=INK,hand=False):ImageDraw.Draw(im).text(self.p(x,y),text,font=self.font(size,hand),fill=color)
 def line(self,im,points,fill=INK,width=5):ImageDraw.Draw(im).line([self.p(*p) for p in points],fill=fill,width=max(1,round(width*self.s)),joint='curve')
 def rect(self,im,box,fill,outline=INK,width=3,radius=10):ImageDraw.Draw(im).rounded_rectangle(self.p(*box),round(radius*self.s),fill=fill,outline=outline,width=max(1,round(width*self.s)))
 def ellipse(self,im,box,fill,outline=None,width=3):ImageDraw.Draw(im).ellipse(self.p(*box),fill=fill,outline=outline,width=max(1,round(width*self.s)))
 def card(self,im,box,fill=PAPER):
  x,y,r,b=box;sw,sh=self.p(r-x+40,b-y+40);shadow=Image.new('RGBA',(max(1,sw),max(1,sh)));d=ImageDraw.Draw(shadow);d.rounded_rectangle(self.p(12,14,r-x+22,b-y+24),round(10*self.s),fill=(22,15,8,85));im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(7*self.s)),self.p(x-8,y-6));self.rect(im,box,fill,outline=(82,68,48,255),width=3,radius=8)
 def load(self,path):
  key=str(path)
  if key not in self.images:
   with Image.open(path) as im:im.load();self.images[key]=im.convert('RGBA').resize((self.w,self.h),Image.Resampling.LANCZOS)
  return self.images[key]
 def background(self,scene,cut,allow=False):
  if scene['id'] in ['01_notebook','16_end']:path=ROOT/'work/geography-review/classroom-reverse-background.png'
  else:path=Path(scene['plates'][0])
  try:return self.load(path).copy(),False
  except (OSError,FileNotFoundError):
   if not allow:raise
   fallback=ROOT/'work/reel/plates/07_expected_1.png';im=self.load(fallback).copy();self.rect(im,(0,0,1080,90),(110,20,28,255),outline=None);self.txt(im,30,23,'DRAFT — NATIVE PLATE PENDING',31,(255,255,255,255));return im,True
 def hero(self,im,phase,p,action):
  # Head/torso are exact existing V3/V4 rendered geometry. The lower bean is
  # occluded by a foreground desk, so no false foot-grounding claim is made.
  sequence=['write1','hesitate','recover','settle']
  if action in ['validation','folders','sensitivity']:sequence=['recover','startle','turn1','write2']
  elif action in ['opportunity','balance','resample']:sequence=['write1','startle','recover','settle']
  elif action=='shrinkage':sequence=['grin','hesitate','turn2','write1']
  pose=sequence[min(3,int(p*4))];sprite=self.sprites[pose]
  x=round(-.08*self.w+math.sin(p*13)*3*self.s);y=round(.24*self.h+math.sin(p*17)*4*self.s)
  # Arms anticipate hand contact, then settle; they are hidden behind torso.
  shoulder1=(x/self.s+353*.864,y/self.s+706*.864);shoulder2=(x/self.s+547*.864,y/self.s+706*.864)
  target=(520+8*math.sin(p*9),1440-30*smooth((p-.4)/.3))
  desk_y=1360;left_elbow=(115,1390);right_elbow=(580,1390);left_grip=(410,1505)
  def desk_intersection(shoulder,elbow):
   ratio=(desk_y-shoulder[1])/(elbow[1]-shoulder[1]);return (shoulder[0]+ratio*(elbow[0]-shoulder[0]),desk_y)
  # Upper arm passes behind the exact torso and emerges at its outer side.
  # Only the continuously connected desk-visible segment is redrawn later.
  self.line(im,[shoulder1,left_elbow,left_grip],width=8);self.line(im,[shoulder2,right_elbow,target],width=8)
  im.alpha_composite(sprite,(x,y))
  yy=round(desk_y*self.s);im.alpha_composite(self.table.crop((0,yy,self.w,self.h)),(0,yy));self.line(im,[(0,desk_y),(1080,desk_y)],fill=(69,43,25,255),width=7)
  self.line(im,[desk_intersection(shoulder1,left_elbow),left_elbow,left_grip],width=8);self.ellipse(im,(393,1487,428,1520),INK)
  self.line(im,[desk_intersection(shoulder2,right_elbow),right_elbow,target],width=8);self.ellipse(im,(target[0]-17,target[1]-17,target[0]+17,target[1]+17),INK)
 def scene(self,scene,frame,frames,allow=False):
  p=frame/max(frames-1,1);cut=0 if p<.28 else 1 if p<.64 else 2;im,missing=self.background(scene,cut,allow)
  macro=cut==1;local=(p/.28 if cut==0 else (p-.28)/.36 if cut==1 else (p-.64)/.36)
  if macro:
   im=self.table.copy()
   # Table-edge stationery makes macro evidence a tangible desk investigation.
   self.line(im,[(70,1770),(205,1550)],fill=GOLD,width=16);self.line(im,[(70,1770),(82,1750)],fill=INK,width=5)
   self.ellipse(im,(905,-90,1195,200),(53,35,24,255),outline=PAPER,width=18)
  else:self.hero(im,cut,local,scene['action'])
  action=scene['action'];box=(65,430,1015,1630) if macro else (530,700,1035,1620)
  x,y,r,b=box;cw=r-x;ch=b-y
  def tx(px,py,v,size=28,color=INK,hand=False):self.txt(im,x+cw*px,y+ch*py,v,size*(1 if macro else .72),color,hand)
  def card(px,py,pw,ph,color=PAPER):
   bb=(x+cw*px,y+ch*py,x+cw*(px+pw),y+ch*(py+ph));self.card(im,bb,color);return bb
  # Each action manipulates physical objects, rather than a standing presenter
  # beside one fixed chart. Text and movements remain editable and source-bound.
  if action=='opportunity':
   card(.03,.10,.94,.65);tx(.10,.17,'RAJASTHAN ROYALS',42,PINK);tx(.10,.25,'SupeRR SELECTOR',44);tx(.10,.38,'YOUR NOTEBOOK',34);tx(.10,.46,'NOW NEEDS EVIDENCE',36,TEAL)
   shift=180*(1-smooth(local/.5));self.card(im,(x+shift,y+ch*.68,r+shift,y+ch*.92));tx(.12,.73,'A challenge, not a team appointment.',25)
  elif action=='sorting':
   tx(.05,.02,'RECONSTRUCT THE MATCH',38,INK,True)
   for i,(label,color) in enumerate([('RAW',PINK),('ELIGIBLE',TEAL)]):
    bx=x+cw*(.04+i*.48);self.rect(im,(bx,y+ch*.32,bx+cw*.43,y+ch*.87),color,width=4);self.txt(im,bx+20,y+ch*.78,label,30)
   for i in range(12):
    a=smooth((local-i*.025)/.65);xx=mix(x+cw*.03+(i%3)*cw*.11,x+cw*.56+(i%3)*cw*.10,a);yy=y+ch*.42+(i//3)*ch*.08;self.card(im,(xx,yy,xx+cw*.20,yy+ch*.07))
   tx(.04,.13,'200,999',44,PINK);tx(.53,.13,'194,509',44,TEAL);tx(.03,.91,'Run-outs ≠ bowler wickets',27)
  elif action=='freeze':
   card(.04,.06,.92,.73);tx(.10,.12,'BEFORE THE BALL',46,TEAL);tx(.10,.25,'28 NEEDED FROM 12',43);tx(.10,.36,'Required rate: 14',33);tx(.10,.52,'Score · wickets · balls left',31);tx(.10,.64,'No future outcome',34,PINK);tx(.10,.84,'ILLUSTRATIVE STATE',27)
   bx=x+cw*(.12+.75*min(local*1.8,.55));by=y+ch*.8;self.ellipse(im,(bx-24,by-24,bx+24,by+24),(160,35,33,255));self.line(im,[(bx-10,by-19),(bx+8,by+19)],fill=PAPER,width=3)
  elif action=='leverage':
   card(.02,.06,.96,.78);tx(.10,.12,'DIFFICULT?',44,PINK);tx(.10,.24,'39 RUNS / OVER',44);tx(.10,.40,'CONSEQUENTIAL?',38,TEAL);tx(.10,.52,'2 NEEDED OFF 1',44);tx(.10,.70,'The next ball can change it.',29);tx(.08,.91,'Illustrative states, not player results.',25)
  elif action=='balance':
   tx(.08,.03,'TWO DIFFERENT QUESTIONS',37,INK,True)
   self.line(im,[(x+cw*.5,y+ch*.72),(x+cw*.5,y+ch*.27)],width=12);tilt=(1-smooth(local))*55
   self.line(im,[(x+cw*.1,y+ch*.36+tilt),(x+cw*.9,y+ch*.36-tilt)],width=12)
   for px,label in [(.12,'A'),(.66,'B')]:
    card(px,.40,.23,.18);tx(px+.06,.44,label,47,TEAL)
   tx(.03,.68,'DIFFICULTY + WP LEVERAGE',31);tx(.03,.78,'TOP 20% WITHIN INNINGS',33,PINK);tx(.03,.89,'Not 20% in every phase.',26)
  elif action=='expectation':
   card(.02,.05,.96,.84);tx(.07,.10,'BETTER THAN WHAT?',42,INK,True)
   for i,(label,h,color) in enumerate([('ACTUAL',.40,TEAL),('EXPECTED',.30,BLUE)]):
    bx=x+cw*(.16+i*.40);self.rect(im,(bx,y+ch*(.67-h*smooth(local+.2)),bx+cw*.20,y+ch*.67),color,width=2);tx(.12+i*.40,.70,label,29)
   tx(.07,.82,'ILLUSTRATIVE · CONTEXT MATTERS',25)
  elif action=='assumptions':
   tx(.06,.03,'A DECLARED ASSUMPTION',39,INK,True)
   for i,label in enumerate(['10','15','20']):
    yy=.27-.06*math.sin(local*math.pi) if i==1 else .28;card(.03+i*.33,yy,.28,.31,GOLD if i==1 else PAPER);tx(.10+i*.33,yy+.07,label,52)
   tx(.05,.69,'RUNS PER WICKET',41);tx(.05,.82,'15 primary · 10/20 sensitivity',26)
  elif action=='shrinkage':
   tx(.04,.02,'SMALL SAMPLE. BIG CONFIDENCE.',34,INK,True)
   for i,(n,label) in enumerate([(2,'25'),(10,'400')]):
    bx=x+cw*(.10+i*.48)
    for j in range(n):self.card(im,(bx,y+ch*(.76-j*.035),bx+cw*.29,y+ch*(.79-j*.035)))
    tx(.14+i*.48,.84,label+' EVENTS',29)
   self.line(im,[(x+cw*.06,y+ch*.30),(x+cw*.92,y+ch*.30)],fill=GOLD,width=5);tx(.40,.22,'MEAN',27)
   ax=x+cw*.23;ay=y+ch*mix(.08,.30,smooth(local));self.ellipse(im,(ax-26,ay-26,ax+26,ay+26),GOLD);tx(.05,.94,'Unnamed illustrative evidence stacks.',24)
  elif action=='folders':
   for i,(label,color) in enumerate([('QUALITY',TEAL),('DELTA',PINK)]):
    card(.03+i*.48,.16,.44,.42,color);tx(.07+i*.48,.27,label,33,(248,239,213,255))
   tx(.04,.65,'Bowling delta: not validated',29,PINK);tx(.04,.76,'Batting CV gain: 0.03–0.11%',26);tx(.04,.90,'No proven psychological clutch trait.',24)
  elif action=='validation':
   # A report emerges from an envelope, then the qualified results stay visible.
   card(.02,.14,.96,.70);tx(.08,.18,'2026 HOLDOUT',43,PINK);tx(.07,.32,'Batting ρ = −0.043',34);tx(.07,.42,'No positive forward signal',27,PINK);tx(.07,.53,'Bowling ρ = +0.304',34);tx(.07,.63,'Economy advantage unestablished',24)
   if local<.30:card(.02,.58-.32*smooth(local/.3),.96,.27,BLUE)
   card(.015,.85,.97,.145);tx(.06,.865,'First-innings WP Brier:',26);tx(.06,.93,'0.2559 vs 0.2524 baseline — worse',24,(120,30,45,255))
  elif action=='resample':
   tx(.04,.03,'RESAMPLE WHOLE MATCHES',38,INK,True)
   for i in range(7):
    a=(local*4+i*.13)%1;bx=x+cw*(.04+i*.12);yy=y+ch*(.35+.10*math.sin(a*math.pi*2));self.card(im,(bx,yy,bx+cw*.17,yy+ch*.22))
   tx(.08,.66,'750 RESAMPLES',48,(24,81,83,255));card(.015,.77,.97,.225);tx(.05,.80,'Historical stability ≠ future success',28,(120,30,45,255));tx(.05,.92,'Illustrative cards; not real match rows.',24)
  elif action=='sensitivity':
   for i,label in enumerate(['D10','D20','D25']):card(.03+i*.33,.14,.28,.23,GOLD if i==1 else PAPER);tx(.08+i*.33,.21,label,37)
   card(.015,.43,.97,.565);tx(.05,.47,'D10 retains: 5/10 bat · 4/10 bowl',26);tx(.05,.57,'D25 retains: 6/10 bat · 7/10 bowl',26);tx(.05,.75,'REMOVE THE BEST SEASON',30,(120,30,45,255));tx(.05,.85,'9 names leave each top ten.',32,(120,30,45,255))
  elif action=='report':
   role='batter' if p<.5 else 'bowler';rp=ROOT/'outputs'/f'report-{role}-top10.png'
   with Image.open(rp) as report:
    # Keep all ten names/exposure rows visible; footer caveats are shown separately.
    page=report.convert('RGBA').crop((0,35,1080,1575));pw=round(self.w*.93);page=page.resize((pw,round(pw*1540/1080)),Image.Resampling.LANCZOS)
   py=round(self.h*.07);im.alpha_composite(page,(round(self.w*.035),py));self.txt(im,55,1580,'Qualified historical shortlist',29,TEAL);self.txt(im,55,1640,'T20I evidence is not automatically IPL evidence.',24,PINK)
  elif action=='replay':
   card(.02,.07,.96,.84);tx(.10,.13,'REPORT REPLAY',40,INK,True)
   for i,(label,value) in enumerate([('RANKINGS','20 / 20'),('CHECKS','41')]):
    yy=.28+i*.22;tx(.10,yy,label,27);tx(.45,yy-.02,value,43,TEAL)
    if local>.18+i*.22:self.line(im,[(x+cw*.76,y+ch*(yy+.06)),(x+cw*.81,y+ch*(yy+.10)),(x+cw*.92,y+ch*(yy-.01))],fill=TEAL,width=9)
   tx(.06,.78,'Software repeats. Limitations stay.',27,PINK);tx(.06,.95,'Report-supplied claims; analysis not rerun here.',22)
  elif action=='bookend':
   self.card(im,(490,1090,1020,1630));self.txt(im,545,1150,'KHILADI',48,TEAL);self.txt(im,530,1250,'WHAT DOES THE',29);self.txt(im,530,1300,'EVIDENCE SUPPORT?',29);self.txt(im,530,1430,'How sure should you be?',27,PINK)
   self.card(im,(70,1430,430,1660));self.txt(im,100,1480,'MY OLD IPL XI',30,INK,True);self.txt(im,100,1540,'A better question.',26,TEAL)
  elif action=='secret-writing':
   self.card(im,(180,1400,920,1670));self.txt(im,225,1450,'MATHS',35,INK,True);self.txt(im,590,1450,'MY IPL XI',35,INK,True);self.txt(im,180,100,'OPENING CLIPS PENDING',37,PINK)
  if missing:self.rect(im,(0,0,1080,90),(110,20,28,255),outline=None);self.txt(im,30,23,'DRAFT — NATIVE PLATE PENDING',31,(255,255,255,255))
  return im.convert('RGB'),missing


def read_timings(path):
 data=json.loads(Path(path).read_text());data=data['scenes'] if isinstance(data,dict) and 'scenes' in data else data
 if isinstance(data,dict):data=[dict(id=k,**v) for k,v in data.items()]
 return {r['id']:r for r in data}
def frames_for(t):
 if 'frames' in t:return int(t['frames'])
 if 'frame_count' in t:return int(t['frame_count'])
 return round(float(t['duration'])*FPS)
def fingerprint(scene,timing,width,opening=None,inserts=None):
 h=hashlib.sha256(Path(__file__).read_bytes()+(WORK/'visual-plan.json').read_bytes()+json.dumps([scene,timing,width,inserts],sort_keys=True).encode())
 paths=[Path(scene['plates'][0])]+list((ROOT/'work/opening_v2/puppet').glob('*.png'))
 if scene['id'] in ['01_notebook','16_end']:paths.append(ROOT/'work/geography-review/classroom-reverse-background.png')
 if opening:paths.append(Path(opening))
 for insert in inserts or []:paths.append(Path(insert['path']))
 for p in paths:
  h.update(str(p).encode())
  if p.exists():h.update(str((p.stat().st_size,p.stat().st_mtime_ns)).encode())
 return h.hexdigest()[:20]
def encode_scene(renderer,scene,frames,dest,allow):
 temp=dest.with_name(dest.stem+'.rendering.mp4');missing=False
 cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{renderer.w}x{renderer.h}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','2','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',str(temp)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 try:
  for frame in range(frames):
   image,pending=renderer.scene(scene,frame,frames,allow);missing|=pending;proc.stdin.write(image.tobytes())
  proc.stdin.close();code=proc.wait()
  if code:raise RuntimeError(f'FFmpeg exit{code}')
 except BaseException:
  proc.kill();proc.wait();temp.unlink(missing_ok=True);raise
 os.replace(temp,dest);return missing

def apply_inserts(dest,inserts,width,height,frames):
 if not inserts:return
 inputs=['-i',str(dest)];filters=[];pieces=[];cursor=0
 for index,insert in enumerate(sorted(inserts,key=lambda i:i['start_frame'])):
  path=Path(insert['path']);start=int(insert['start_frame']);count=int(insert['frames'])
  if '/private/' in str(path):raise ValueError('Private reference media cannot be inserted')
  if not path.exists():raise FileNotFoundError(f"Insert not ready: {path}")
  if start<cursor or start+count>frames:raise ValueError('Insert overlaps or exceeds scene')
  if start>cursor:
   label=f'b{index}';filters.append(f'[0:v]trim=start_frame={cursor}:end_frame={start},setpts=PTS-STARTPTS[{label}]');pieces.append(f'[{label}]')
  inputs+=['-i',str(path)];label=f'i{index}';filters.append(f'[{index+1}:v]fps=30,scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1,tpad=stop_mode=clone:stop_duration=30,trim=end_frame={count},setpts=PTS-STARTPTS[{label}]');pieces.append(f'[{label}]');cursor=start+count
 if cursor<frames:
  filters.append(f'[0:v]trim=start_frame={cursor}:end_frame={frames},setpts=PTS-STARTPTS[tail]');pieces.append('[tail]')
 filters.append(''.join(pieces)+f'concat=n={len(pieces)}:v=1:a=0[v]')
 temp=dest.with_name(dest.stem+'.inserting.mp4');subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex_threads','2','-filter_complex',';'.join(filters),'-map','[v]','-an','-frames:v',str(frames),'-r','30','-c:v','libx264','-threads','2','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',str(temp)],check=True);os.replace(temp,dest)

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--timing',default=str(ROOT/'work/timing.json'));ap.add_argument('--width',type=int,default=540);ap.add_argument('--scene');ap.add_argument('--stills',action='store_true');ap.add_argument('--allow-provisional',action='store_true');ap.add_argument('--opening');ap.add_argument('--audio');ap.add_argument('--captions');ap.add_argument('--inserts',default=str(WORK/'inserts.json'));args=ap.parse_args()
 OUT.mkdir(exist_ok=True);timings=read_timings(args.timing);renderer=Renderer(args.width);records=[];clips=[];insert_map=json.loads(Path(args.inserts).read_text()) if Path(args.inserts).exists() else {}
 for scene in PLAN['scenes']:
  sid=scene['id']
  if args.scene and sid not in args.scene.split(','):continue
  if sid not in timings:raise ValueError(f'No timing for{sid}')
  if sid=='01_notebook' and not args.opening and not args.allow_provisional and not args.stills:raise ValueError('Opening must be supplied via--opening')
  frames=frames_for(timings[sid]);sig=fingerprint(scene,timings[sid],args.width,args.opening if sid=='01_notebook' else None,insert_map.get(sid,[]));folder=OUT/'cache'/sig;folder.mkdir(parents=True,exist_ok=True);dest=folder/(sid+'.mp4')
  if args.stills:
   im,pending=renderer.scene(scene,round(frames*.46),frames,args.allow_provisional);im.save(OUT/(sid+'-preview.png'));records.append(dict(id=sid,pending_plate=pending,frames=frames));continue
  marker=dest.with_suffix('.complete.json')
  if marker.exists():
   record=json.loads(marker.read_text())
   if record.get('pending_plate') and not args.allow_provisional:raise ValueError(f'{sid}: provisional cached render is not final-ready')
  elif sid=='01_notebook' and args.opening:
   temp=dest.with_name(sid+'.rendering.mp4');subprocess.run(['ffmpeg','-v','error','-y','-i',args.opening,'-an','-vf',f'scale={renderer.w}:{renderer.h},setsar=1,tpad=stop_mode=clone:stop_duration=30','-frames:v',str(frames),'-r','30','-c:v','libx264','-threads','2','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',str(temp)],check=True);os.replace(temp,dest);record=dict(id=sid,frames=frames,pending_plate=False,opening_injected=True)
  else:
   if sid=='01_notebook' and not args.allow_provisional:raise ValueError('Opening must be supplied via--opening; rejected V2 is not an acceptable replacement')
   pending=encode_scene(renderer,scene,frames,dest,args.allow_provisional);apply_inserts(dest,insert_map.get(sid,[]),renderer.w,renderer.h,frames);record=dict(id=sid,frames=frames,pending_plate=pending,opening_injected=False)
  record.update(inserts=insert_map.get(sid,[]),path=str(dest),source_signature=sig,duration=frames/FPS,timing_source=str(Path(args.timing).resolve()))
  marker.write_text(json.dumps(record,indent=2));records.append(record);clips.append(dest);print('SCENE_READY',sid,frames,str(dest),flush=True)
 (OUT/'render-manifest.json').write_text(json.dumps(dict(width=renderer.w,height=renderer.h,fps=FPS,scenes=records,legacy_timing=Path(args.timing).resolve()==ROOT/'work/timing.json',audio_attached=bool(args.audio),website_footage_attached=any(i.get('kind')=='actual_website' for r in records for i in r.get('inserts',[])),complete_visual_coverage=len(records)==16 and sum(r['frames'] for r in records)==sum(frames_for(t) for t in timings.values()) and all(not r['pending_plate'] for r in records) and any(r.get('opening_injected') for r in records)),indent=2))
 if args.stills or args.scene:return
 listing=OUT/'silent-concat.txt';listing.write_text('\n'.join("file '"+str(p.resolve())+"'" for p in clips));silent=OUT/'KHILADI_VISUAL_DRAFT_SILENT.mp4';subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(silent)],check=True)
 if args.audio:
  cmd=['ffmpeg','-v','error','-y','-i',str(silent),'-i',args.audio]
  if args.captions:cmd+=['-vf',f"subtitles='{Path(args.captions).resolve()}'",'-c:v','libx264','-threads','2','-preset','veryfast','-crf','17']
  else:cmd+=['-c:v','copy']
  cmd+=['-c:a','aac','-b:a','192k','-ar','48000','-af','apad','-t',str(sum(r['frames'] for r in records)/FPS),'-movflags','+faststart',str(OUT/'KHILADI_FULL_DRAFT.mp4')];subprocess.run(cmd,check=True)
 print('VISUAL_DRAFT',silent,flush=True)
if __name__=='__main__':main()
