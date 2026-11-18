"""Hybrid opening: original V3/V4 puppet, master classroom, articulated props."""
from pathlib import Path
import argparse,json,math,subprocess
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import soundfile as sf
from scipy.signal import butter,sosfilt
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/opening_v2';OUT=ROOT/'outputs/opening-v2'
W,H,FPS=1080,1920,30;DURATION=11.2;FRAMES=336
BG=Image.open(WORK/'classroom-master.png').convert('RGBA').resize((W,H),Image.Resampling.LANCZOS)
WOOD=BG.crop((50,1500,1030,1880)).resize((W,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(2))
PUP={p.stem:Image.open(p).convert('RGBA') for p in (WORK/'puppet').glob('*.png')}
INK=(37,48,68,255);BLUE=(36,66,117,255);RED=(160,47,49,255)
SHOTS=[('A',0,38,'seated writing'),('B',38,67,'teacher and maths context'),('C',67,110,'unfinished maths macro'),('D',110,137,'page-turn reveal'),('E',137,187,'cross out selection'),('F',187,233,'glance and conceal'),('G',233,256,'sparse maths comparison'),('H',256,281,'dense cricket comparison'),('I',281,313,'mischievous reaction'),('J',313,336,'notebook match-cut')]
def font(size,hand=True):return ImageFont.truetype(str(WORK/'Kalam-Regular.ttf') if hand else str(WORK/'DejaVuSans-Bold.ttf'),size)
def text(d,xy,body,size=32,fill=INK,hand=True):d.text(xy,body,font=font(size,hand),fill=fill)
def smooth(x):x=max(0,min(1,x));return x*x*(3-2*x)
def lerp(a,b,t):return a+(b-a)*t

def notebook(kind='cricket',cross=0):
 im=Image.new('RGBA',(1200,900));d=ImageDraw.Draw(im)
 d.rounded_rectangle((4,10,1195,895),16,fill=(69,62,53,255),outline=(29,28,27,255),width=5)
 d.polygon([(20,24),(588,38),(590,870),(20,855)],fill=(241,232,203,255));d.polygon([(608,38),(1180,24),(1180,855),(608,870)],fill=(245,236,210,255))
 for y in range(145,830,55):
  d.line([(35,y),(580,y+6)],fill=(144,167,181,145),width=2);d.line([(620,y+6),(1165,y)],fill=(144,167,181,145),width=2)
 for x in [105,675]:d.line([(x,70),(x,835)],fill=(190,118,117,180),width=2)
 d.line([(599,35),(599,876)],fill=(149,135,112,255),width=6)
 for xy,body,size in [((135,65),'MATHS',47),((137,162),'1.  x² − 5x + 6 = 0',35),((140,225),'x = ...',35),((140,335),'2.  a² + b² =',35),((145,420),'3 + 4 = 7',30)]:text(d,xy,body,size)
 if kind=='maths':
  for xy,body,size in [((715,70),'EXERCISES',42),((715,165),'4. Solve for x:',36),((720,230),'2x + 5 =',36),((715,530),'Homework:',33)]:text(d,xy,body,size)
 else:
  text(d,(700,55),'MY IPL XI',52)
  names=['1. Jaiswal','2. Buttler  (c)','3. Pooran','4. David Miller','5. Daryl Mitchell','6. Tim David','7. Nabi','8. Narine','9. Bumrah','10. Kuldeep','11. Siraj']
  for i,name in enumerate(names):text(d,(700,130+47*i),name,31)
  text(d,(985,290),'Abhishek?',27,RED)
  if cross>0:
   d.line([(698,267),(698+220*min(cross*2,1),267+25*min(cross*2,1))],fill=RED,width=5)
   if cross>.5:d.line([(710,290),(710+210*(cross-.5)*2,290-25*(cross-.5)*2)],fill=RED,width=4)
  d.ellipse((973,168,1060,205),outline=RED,width=4);d.line([(1050,205),(1130,245),(1100,280)],fill=RED,width=4)
  d.ellipse((965,510,1152,690),outline=BLUE,width=3);d.rectangle((1045,560,1065,636),outline=BLUE,width=3)
  for x,y in [(1000,550),(1110,570),(1005,650),(1080,675),(1050,525)]:d.ellipse((x-5,y-5,x+5,y+5),fill=RED)
  text(d,(720,702),'death overs → Bumrah',27);text(d,(725,755),'spin? left / right mix',26);text(d,(710,814),'IMAGINARY SCHOOLBOY XI',22,RED)
 return im
MATH=notebook('maths');CRICKET=notebook('cricket',1)
def warp(image,quad):
 src=[(0,0),(image.width,0),(image.width,image.height),(0,image.height)];matrix=[];rhs=[]
 for (x,y),(u,v) in zip(quad,src):
  matrix.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);rhs.extend([u,v])
 coeff=np.linalg.solve(np.asarray(matrix,float),np.asarray(rhs,float))
 return image.transform((W,H),Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)
def pencil(im,tip,angle=-.42,length=190,width=14,arm_to=None,hand=True):
 d=ImageDraw.Draw(im);dx=math.sin(angle);dy=-math.cos(angle);end=(tip[0]+dx*length,tip[1]+dy*length);grip=(tip[0]+dx*length*.43,tip[1]+dy*length*.43)
 if arm_to:d.line([arm_to,grip],fill=(26,22,20,255),width=8)
 d.line([tip,end],fill=(52,37,22,255),width=width+4);d.line([(tip[0]+dx*20,tip[1]+dy*20),end],fill=(226,171,38,255),width=width)
 d.line([tip,(tip[0]+dx*23,tip[1]+dy*23)],fill=(230,197,147,255),width=max(3,width-4));d.ellipse((tip[0]-3,tip[1]-3,tip[0]+3,tip[1]+3),fill=(27,25,23,255))
 if hand:d.ellipse((grip[0]-18,grip[1]-15,grip[0]+18,grip[1]+15),fill=(24,20,18,255))
def coverbook(im,x,y,scale=1):
 layer=Image.new('RGBA',(700,450));d=ImageDraw.Draw(layer);d.rounded_rectangle((10,15,690,435),12,fill=(23,47,65,255),outline=(16,25,31,255),width=8);d.rectangle((38,28,675,418),outline=(178,142,71,255),width=3)
 text(d,(150,92),'MATHEMATICS',51,(232,221,188,255),False);text(d,(224,185),'CLASS NOTES',30,(232,221,188,255),False);d.line([(60,34),(60,410)],fill=(9,24,35,255),width=15)
 offset=x-310;dy=y-1500;im.alpha_composite(warp(layer,[(315+offset,1490+dy),(870+offset,1490+dy),(945+offset,1695+dy),(225+offset,1695+dy)]))
def main_scene(t,shot):
 im=BG.copy();state='write1';bob=math.sin(t*9)*3
 if shot=='F':
  p=t-187/FPS;state='write1' if p<.10 else 'turn1' if p<.27 else 'turn2' if p<.50 else 'startle' if p<.65 else 'turn2';bob=-10*smooth(p/.2)+8*smooth((p-.5)/.3)
 elif shot=='I':
  p=t-281/FPS;state='recover' if p<.18 else 'grin' if p<.68 else 'settle';bob=7*math.sin(p*11)*math.exp(-p*2)
 else:state='write1' if int(t*5)%3 else 'write2'
 x,y=65,470+round(bob);d=ImageDraw.Draw(im);left_el=(280,1390);right_el=(820,1385)
 d.line([(x+353,y+706),left_el,(390,1535)],fill=(30,24,20,255),width=9);d.line([(x+547,y+706),right_el],fill=(30,24,20,255),width=9)
 im.alpha_composite(PUP[state],(x,y));im.alpha_composite(BG.crop((0,1478,W,H)),(0,1478));im.alpha_composite(warp(notebook('cricket',0) if t<4.8 else CRICKET,[(315,1494),(860,1488),(944,1685),(225,1695)]))
 d=ImageDraw.Draw(im);d.line([left_el,(390,1535)],fill=(29,23,20,255),width=9);d.ellipse((373,1518,407,1549),fill=(29,23,20,255))
 tip=(734+15*math.sin(t*26),1582+7*math.sin(t*37)) if shot!='F' else (735,1580)
 if shot!='F' or t-187/FPS<.58:pencil(im,tip,length=145,width=10,arm_to=right_el)
 else:pencil(im,(930,1600),angle=1.45,length=135,width=10,hand=False)
 if shot=='F':
  p=t-187/FPS;progress=smooth((p-.58)/.33);coverbook(im,lerp(1170,310,progress),1500,.85)
  if progress>0:
   d=ImageDraw.Draw(im);hx=lerp(1030,820,progress);d.line([right_el,(hx,1530)],fill=(29,23,20,255),width=10);d.ellipse((hx-20,1510,hx+20,1548),fill=(29,23,20,255))
 return im.crop((55,300,1025,1825)).resize((W,H),Image.Resampling.LANCZOS)
def teacher_scene(t):
 p=(t-38/FPS)/(29/FPS);im=BG.crop((210+round(8*p),90,1080,1600)).resize((W,H),Image.Resampling.LANCZOS);d=ImageDraw.Draw(im);progress=smooth((p-.2)/.5);d.line([(900,455),(900+40*progress,455-15*progress)],fill=(224,224,197,255),width=3);return im
QUAD=[(30,445),(1045,390),(1090,1510),(-20,1560)]
def book_point(x,y):
 src=[(0,0),(1200,0),(1200,900),(0,900)];a=[];b=[]
 for (sx,sy),(tx,ty) in zip(src,QUAD):
  a.extend([[sx,sy,1,0,0,0,-tx*sx,-tx*sy],[0,0,0,sx,sy,1,-ty*sx,-ty*sy]]);b.extend([tx,ty])
 h=np.append(np.linalg.solve(a,b),1).reshape((3,3));p=h@np.array([x,y,1]);return (p[0]/p[2],p[1]/p[2])
def macro_scene(t,kind,flip=False,cross=False):
 im=WOOD.copy();sh=Image.new('RGBA',(W,H));sd=ImageDraw.Draw(sh);sd.polygon([(40,465),(1050,405),(1080,1540),(0,1595)],fill=(24,14,6,100));im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(20)))
 page=notebook(kind,smooth((t-4.8)/.6) if cross else 1)
 if flip:
  p=smooth((t-110/FPS)/.64);im.alpha_composite(warp(notebook('cricket',0),QUAD));edge=lerp(1045,20,p);hump=160*math.sin(math.pi*p)
  if p<.95 and abs(edge-540)>8:im.alpha_composite(warp(MATH.crop((600,0,1200,900)),[(540,420),(edge,410-hump),(edge-10,1535-hump*.3),(535,1540)]))
  tip=(850-500*p,1130-160*math.sin(p*math.pi))
 else:
  im.alpha_composite(warp(page,QUAD))
  if kind=='maths':tip=(780+math.sin(t*8)*3,825+math.sin(t*9)*3)
  elif cross:
   c=smooth((t-4.8)/.6)
   tip=book_point(698+220*min(c*2,1),267+25*min(c*2,1)) if c<=.5 else book_point(710+210*(c-.5)*2,290-25*(c-.5)*2)
  else:tip=(810+math.sin(t*25)*25,1020+math.sin(t*33)*8)
 d=ImageDraw.Draw(im);d.line([(60,H),(190,1455),(270,1375)],fill=(30,24,20,255),width=14);d.ellipse((245,1355,295,1395),fill=(30,24,20,255));
 if flip:
  d.line([(edge+110,H),(edge+80,1500),(edge,1130-hump*.5)],fill=(30,24,20,255),width=14);d.ellipse((edge-22,1110-hump*.5,edge+22,1150-hump*.5),fill=(30,24,20,255))
 else:pencil(im,tip,angle=.45,length=235,width=16,arm_to=(1180,tip[1]+250))
 return im

def transition_scene(t):
 p=(t-313/FPS)/(23/FPS);im=WOOD.copy()
 if p<.52:
  im.alpha_composite(warp(CRICKET,QUAD));a=smooth(p/.52);layer=Image.new('RGBA',(max(1,round(1060*a)),1115),(69,62,53,255));im.alpha_composite(layer,(10,415));d=ImageDraw.Draw(im);text(d,(150,680),'MY NOTEBOOK',72,(231,222,199,255))
 else:
  im=BG.crop((100,1470,980,1900)).resize((W,H),Image.Resampling.BICUBIC);d=ImageDraw.Draw(im)
  d.rounded_rectangle((500,160,1050,720),22,fill=(33,36,42,255),outline=(15,18,22,255),width=12);d.rectangle((530,195,1020,630),fill=(52,64,75,255));d.polygon([(480,715),(1070,715),(1075,850),(430,850)],fill=(130,133,133,255))
  for row in range(4):
   for col in range(10):d.rectangle((490+col*49,735+row*21,525+col*49,748+row*21),fill=(47,50,53,255))
  a=smooth((p-.52)/.48);im.alpha_composite(warp(CRICKET,[(80,800),(920,760),(1000,1610),(20,1650)]))
  if a<.9:
   d=ImageDraw.Draw(im);d.polygon([(50,810),(lerp(950,500,a),780),(lerp(1000,500,a),1620),(20,1650)],fill=(69,62,53,255))
 return im

def draw_frame(frame):
 t=frame/FPS;shot=next(s[0] for s in SHOTS if s[1]<=frame<s[2])
 if shot in ['A','F','I']:im=main_scene(t,shot)
 elif shot=='B':im=teacher_scene(t)
 elif shot in ['C','G']:im=macro_scene(t,'maths')
 elif shot=='D':im=macro_scene(t,'cricket',flip=True)
 elif shot=='E':im=macro_scene(t,'cricket',cross=True)
 elif shot=='H':im=macro_scene(t,'cricket')
 else:im=transition_scene(t)
 return im.convert('RGB')

def make_audio():
 voice,sr=sf.read(OUT/'VOICE_A_bm_george.wav');audio=np.zeros((round(DURATION*sr),2),dtype=np.float32)
 blocks=[(0,1.24,.10),(1.24,3.28,1.49),(3.28,3.96,3.65),(3.96,5.44,4.56),(5.44,6.63,6.22),(6.63,len(voice)/sr,7.76)]
 phrases=["You're in maths class.","The front of your notebook has equations.","The back?","Your IPL eleven.","And let's just say...","One side gets a lot more attention."]
 for (a,b,start),phrase in zip(blocks,phrases):
  samples=voice[round(a*sr):round(b*sr)];i=round(start*sr);audio[i:i+len(samples)]+=samples[:,None]*.86
 rng=np.random.default_rng(42);n=len(audio);room=sosfilt(butter(2,[140,1400],btype='bandpass',fs=sr,output='sos'),rng.normal(size=n))*.0017;audio+=room[:,None]
 def effect(at,duration,kind,gain=.04):
  length=round(duration*sr);time=np.arange(length)/sr;env=np.sin(np.linspace(0,np.pi,length))**1.3;noise=rng.normal(size=length)
  if kind=='pencil':wave=sosfilt(butter(2,[1800,7000],btype='bandpass',fs=sr,output='sos'),noise)*(.5+.5*np.sin(time*130))
  elif kind=='paper':wave=sosfilt(butter(2,[550,6000],btype='bandpass',fs=sr,output='sos'),noise)
  elif kind=='tap':wave=np.sin(2*np.pi*185*time)*np.exp(-time*32)
  elif kind=='close':wave=np.sin(2*np.pi*78*time)*np.exp(-time*22)+noise*.15*np.exp(-time*40)
  else:wave=(np.sin(2*np.pi*440*time)+.35*np.sin(2*np.pi*660*time))*np.exp(-time*11)
  wave=wave*env*gain;i=round(at*sr);audio[i:i+length,0]+=wave;audio[i:i+length,1]+=wave*.87
 for at in [.12,.38,.63,.86,4.75,5.02,5.34,5.63,8.65,8.91,9.63]:effect(at,.13,'pencil',.025)
 effect(3.8,.3,'paper',.045);effect(4.46,.25,'sting',.035);effect(6.42,.10,'tap',.035);effect(6.95,.22,'paper',.035);effect(10.55,.24,'close',.10);effect(10.92,.2,'paper',.045)
 sf.write(OUT/'opening-mix-raw.wav',audio,sr)
 manifest=[dict(text=p,start=st,end=st+(b-a),source_start=a,source_end=b) for (a,b,st),p in zip(blocks,phrases)];(OUT/'narration-edit.json').write_text(json.dumps(manifest,indent=2))

def ass_time(t):
 n=round(t*100);return f'{n//360000}:{n//6000%60:02}:{n//100%60:02}.{n%100:02}'
def make_captions():
 lines=[(.1,1.34,"You're in maths class.",'maths'),(1.49,2.75,'The front of your notebook','front'),(2.75,3.53,'has equations.','equations.'),(3.65,4.33,'The back?','back?'),(4.56,6.04,'Your IPL eleven.','IPL'),(6.22,7.41,"And let's just say...",'say...'),(7.76,8.83,'One side gets a lot','One'),(8.83,9.92,'more attention.','attention.')]
 header='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,DejaVu Sans,62,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,1,2,95,95,120,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
 events=[]
 for start,end,phrase,word in lines:
  rendered=phrase.replace(word,r'{\c&H00FFFF&}'+word+r'{\c&HFFFFFF&}');events.append(f'Dialogue: 0,{ass_time(start)},{ass_time(end)},Main,,0,0,0,,{rendered}')
 (OUT/'opening-captions.ass').write_text(header+'\n'.join(events)+'\n')

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--stills',action='store_true');parser.add_argument('--animatic',action='store_true');args=parser.parse_args()
 if args.stills:
  for shot,start,end,action in SHOTS:draw_frame((start+end)//2).save(OUT/f'shot-{shot}.png')
  return
 make_audio();make_captions();raw=OUT/('opening-animatic-silent.mp4' if args.animatic else 'opening-silent.mp4');width,height=(540,960) if args.animatic else (W,H)
 cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{width}x{height}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','4','-preset','fast','-crf','18','-pix_fmt','yuv420p',str(raw)];proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
 held={}
 for frame in range(FRAMES):
  if args.animatic:
   shot=next(s for s in SHOTS if s[1]<=frame<s[2])
   if shot[0] not in held:held[shot[0]]=draw_frame((shot[1]+shot[2])//2).resize((width,height),Image.Resampling.LANCZOS)
   image=held[shot[0]]
  else:image=draw_frame(frame)
  proc.stdin.write(image.tobytes())
  if frame%60==0:print('FRAME',frame,flush=True)
 proc.stdin.close();assert proc.wait()==0
 dest=OUT/('KHILADI_OPENING_V2_ANIMATIC.mp4' if args.animatic else 'KHILADI_OPENING_V2.mp4');ass=str((OUT/'opening-captions.ass').resolve())
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-i',str(OUT/'opening-mix-raw.wav'),'-vf',f"subtitles='{ass}'",'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-t',str(DURATION),'-r',str(FPS),'-c:v','libx264','-preset','fast','-crf','17','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',str(dest)],check=True)
 (OUT/'shot-list.json').write_text(json.dumps([dict(id=i,start_frame=a,end_frame=b,start=a/FPS,end=b/FPS,action=p) for i,a,b,p in SHOTS],indent=2));print(dest,flush=True)
if __name__=='__main__':main()
