"""Silent opening hero clips, corrected reverse geography and physical hand continuity.
Only A/B/F/I. Existing V3/V4 sprites and approved classroom; no narrator/full reel.
"""
from pathlib import Path
import argparse,json,math,subprocess,hashlib
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/opening-v3-hero';OUT=ROOT/'outputs/opening-v3-hero';OUT.mkdir(exist_ok=True)
W,H,FPS=1080,1920,30
BG=Image.open(ROOT/'work/geography-review/classroom-reverse-background.png').convert('RGBA').resize((W,H),Image.Resampling.LANCZOS)
OLD=ROOT/'work/opening_v2/puppet';NEW=WORK/'puppet';NOTE=ROOT/'outputs/opening-v3-notebook'
PUP={p.stem:Image.open(p).convert('RGBA') for p in [*OLD.glob('*.png'),*NEW.glob('*.png')]}
TEX={kind:Image.open(NOTE/name).convert('RGBA') for kind,name in [('clean','NOTEBOOK_CRICKET_CLEAN.png'),('selected','NOTEBOOK_CRICKET_SELECTED.png'),('maths','NOTEBOOK_MATHS.png')]}
QUAD=[(315,1494),(860,1488),(930,1655),(240,1660)]
INK=(28,22,19,255);BLUE=(35,62,112,255)
CLIPS={'A':('A_seated_writing',42),'B':('B_reverse_classroom_context',27),'F':('F_front_teacher_glance_conceal',48),'I':('I_wry_recovery',30)}
def ease(x):x=max(0,min(1,x));return x*x*(3-2*x)
def lerp(a,b,t):return a+(b-a)*t

def homography(src,dst):
 a=[];b=[]
 for (x,y),(u,v) in zip(src,dst):a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
 return np.append(np.linalg.solve(a,b),1).reshape(3,3)
PERSPECTIVE=homography([(0,0),(1200,0),(1200,900),(0,900)],QUAD)
def book_point(x,y):
 # Pupil reads original texture. C1 is opposite side, so 180° rotation,
 # never a mirror: pupil RIGHT cricket page becomes C1 screen-LEFT.
 p=PERSPECTIVE@np.array([1200-x,900-y,1]);return p[:2]/p[2]
def warp(texture,quad):
 h=homography(quad,[(0,0),(texture.width,0),(texture.width,texture.height),(0,texture.height)])
 return texture.transform((W,H),Image.Transform.PERSPECTIVE,tuple(h.flatten()[:8]),Image.Resampling.BICUBIC)
def rotate_point(p,angle,center=(450,1030)):
 a=-math.radians(angle);x,y=p[0]-center[0],p[1]-center[1]
 return np.array([center[0]+x*math.cos(a)-y*math.sin(a),center[1]+x*math.sin(a)+y*math.cos(a)])
def arm_elbow(shoulder,hand,L1=230,L2=220,outward=-1):
 s=np.asarray(shoulder,float);h=np.asarray(hand,float);v=h-s;d=np.linalg.norm(v);d=max(.001,min(d,L1+L2-.001));axis=v/max(np.linalg.norm(v),.001);along=(L1*L1-L2*L2+d*d)/(2*d);height=math.sqrt(max(0,L1*L1-along*along));normal=np.array([-axis[1],axis[0]])
 return s+axis*along+normal*height*outward

def draw_arm(layer,shoulder,hand,outward):
 # Curved ink limb with a stable elbow, following hand/shoulder anchors.
 e=arm_elbow(shoulder,hand,outward=outward);s=np.asarray(shoulder);h=np.asarray(hand);points=[]
 for t in np.linspace(0,1,24):
  # Two near-rigid segments with small round corner, no unattached hand.
  p=s+(e-s)*(t*2) if t<.5 else e+(h-e)*((t-.5)*2)
  points.append(tuple(p))
 d=ImageDraw.Draw(layer);d.line(points,fill=INK,width=9,joint='curve');d.ellipse((e[0]-4,e[1]-4,e[0]+4,e[1]+4),fill=INK)

def draw_pencil(im,tip,grip=None,angle=-.42,length=150,hand=True):
 tip=np.asarray(tip);v=np.array([math.sin(angle),-math.cos(angle)]);end=tip+v*length;grip=tip+v*length*.43 if grip is None else np.asarray(grip)
 d=ImageDraw.Draw(im);d.line([tuple(tip),tuple(end)],fill=(51,37,23,255),width=14);d.line([tuple(tip+v*20),tuple(end)],fill=(229,174,43,255),width=10);d.line([tuple(tip),tuple(tip+v*22)],fill=(224,192,145,255),width=7);d.ellipse((tip[0]-3,tip[1]-3,tip[0]+3,tip[1]+3),fill=INK)
 if hand:d.ellipse((grip[0]-17,grip[1]-15,grip[0]+17,grip[1]+15),fill=INK)
 return grip

def setup(kind,t,duration):
 u=t/duration
 if kind in ['A','B']:
  state='write2' if .31<u<.64 else 'write1';root=np.array([65+5*math.sin(u*math.pi*2),470+2*math.sin(u*math.pi*4)]);roll=.45*math.sin(u*math.pi*2)
 elif kind=='F':
  state='write1' if t<.17 else 'hesitate' if t<.25 else 'front_left_near' if t<.34 else 'front_left_far'
  recoil=ease((t-.19)/.14)-.65*ease((t-.42)/.27);root=np.array([65-6*recoil,470-10*recoil]);roll=-.7*recoil
 else:
  state='recover' if t<.16 else 'wry_neutral' if t<.65 else 'write2';bob=5*math.sin(t*9)*math.exp(-t*3);root=np.array([65,470+bob]);roll=.8*math.sin(t*6)*math.exp(-t*3)
 sprite=PUP[state].rotate(roll,resample=Image.Resampling.BICUBIC,center=(450,1030))
 # Screen-left is hero's RIGHT hand in this frontal reverse view.
 shoulders=[rotate_point(p,roll)+root for p in [(353.45,706.46),(546.55,706.46)]]
 return state,root,roll,sprite,shoulders

def frame(kind,n,frames):
 t=n/FPS;duration=frames/FPS;u=n/max(frames-1,1);im=BG.copy();state,root,roll,sprite,shoulders=setup(kind,t,duration)
 texture=TEX['clean' if kind in ['A','B'] else 'selected'].copy();td=ImageDraw.Draw(texture)
 # One purposeful writing stroke beneath the role note, tied exactly to tip.
 progress=ease(u) if kind in ['A','B'] else ease((t-.62)/.3) if kind=='I' else 0
 if progress>0:td.line([(720,803),(720+245*progress,803+3*math.sin(progress*math.pi*3))],fill=BLUE,width=3)
 tip=book_point(720+245*progress,803+3*math.sin(progress*math.pi*3));grip=tip+np.array([math.sin(-.42),-math.cos(-.42)])*150*.43
 anchor=np.array([792,1530]);cover_progress=0
 if kind=='F':
  if t<.17:tip=book_point(810+12*math.sin(t*24),803);grip=tip+np.array([math.sin(-.42),-math.cos(-.42)])*150*.43
  elif t<.52:tip=book_point(810,803);grip=tip+np.array([math.sin(-.42),-math.cos(-.42)])*150*.43
  elif t<.72:
   p=ease((t-.52)/.2);tip=(1-p)*book_point(810,803)+p*np.array([212,1583]);grip=tip+np.array([math.sin(-.42),-math.cos(-.42)])*150*.43
  else:
   cover_progress=ease((t-.72)/.4);grip=np.array([lerp(180,620,cover_progress),1540])
 arm_layer=Image.new('RGBA',(W,H));draw_arm(arm_layer,shoulders[0],grip,1);draw_arm(arm_layer,shoulders[1],anchor,-1)
 im.alpha_composite(arm_layer);im.alpha_composite(sprite,(round(root[0]),round(root[1])))
 # Forearms reach IN FRONT of the torso. Keeping the whole limb behind the
 # body would leave an apparently detached hand when the grip is raised.
 fore=Image.new('RGBA',(W,H));fd=ImageDraw.Draw(fore)
 for shoulder,hand,outward in [(shoulders[0],grip,1),(shoulders[1],anchor,-1)]:
  e=arm_elbow(shoulder,hand,outward=outward);fd.line([tuple(e),tuple(hand)],fill=INK,width=9)
 im.alpha_composite(fore)
 # Desk masks the seated lower body and upper arm portions below its edge.
 im.alpha_composite(BG.crop((0,1478,W,H)),(0,1478));im.alpha_composite(warp(texture.rotate(180),QUAD))
 im.alpha_composite(arm_layer.crop((0,1478,W,H)),(0,1478))
 d=ImageDraw.Draw(im);d.ellipse((anchor[0]-17,anchor[1]-15,anchor[0]+17,anchor[1]+15),fill=INK)
 if kind=='F' and t>=.72:
  draw_pencil(im,(212,1583),angle=-1.4,length=150,hand=False)
  dx=lerp(-440,0,cover_progress);q=[(x+dx,y) for x,y in QUAD]
  im.alpha_composite(warp(TEX['maths'].rotate(180),q))
  # Writing hand drives the open maths book from screen-left, preserving RIGHT hand.
  over=Image.new('RGBA',(W,H));draw_arm(over,shoulders[0],grip,1);im.alpha_composite(over.crop((0,1478,W,H)),(0,1478));d=ImageDraw.Draw(im);d.ellipse((grip[0]-18,grip[1]-16,grip[0]+18,grip[1]+16),fill=INK);d.ellipse((anchor[0]-17,anchor[1]-15,anchor[0]+17,anchor[1]+15),fill=INK)
 else:draw_pencil(im,tip,grip=grip)
 if kind=='B':
  # Same physical reverse camera position, wider crop/lens context only.
  return im.convert('RGB')
 return im.crop((55,300,1025,1825)).resize((W,H),Image.Resampling.LANCZOS).convert('RGB')

def render(kind):
 name,count=CLIPS[kind];dest=OUT/(name+'.mp4');temporary=OUT/(name+'.encoding.mp4')
 cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1080x1920','-r','30','-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(temporary)]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 for n in range(count):
  im=frame(kind,n,count);proc.stdin.write(im.tobytes())
  if n==count//2:im.save(OUT/(name+'-preview.png'))
 proc.stdin.close();assert proc.wait()==0
 temporary.replace(dest)
 print('COMPLETE',kind,str(dest),flush=True)
 return dest

def main():
 p=argparse.ArgumentParser();p.add_argument('--shots',default='A,B,F,I');p.add_argument('--stills',action='store_true');a=p.parse_args()
 for kind in a.shots.split(','):
  if a.stills:
   name,count=CLIPS[kind];frame(kind,count//2,count).save(OUT/(name+'-preview.png'))
  else:render(kind)
if __name__=='__main__':main()
