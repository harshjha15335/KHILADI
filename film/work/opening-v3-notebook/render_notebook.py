"""Opening-only notebook cutaways. Original props, no private data or footage.

C3 looks from behind the RIGHT-handed pupil toward the classroom front.
Notebook print is upright to the pupil, top toward board. A frontal C1 shot
must rotate these textures 180 degrees; do not mirror them.
"""
from pathlib import Path
import argparse, json, math, hashlib, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'work/opening-v3-notebook'; OUT=ROOT/'outputs/opening-v3-notebook'
W,H,FPS=1080,1920,30
FONT=ROOT/'work/opening_v2/Kalam-Regular.ttf'
INK=(35,46,65,255); BLUE=(34,61,108,255); RED=(157,43,43,255); LIMB=(29,24,21,255)
QUAD=np.array([(15,450),(1035,385),(1110,1530),(-55,1590)],float)


def smooth(x):
 x=max(0,min(1,float(x)));return x*x*(3-2*x)
def lerp(a,b,t):return a+(b-a)*t

def text(d,xy,value,size=32,fill=BLUE):
 d.text(xy,value,font=ImageFont.truetype(str(FONT),size),fill=fill)


def texture(kind='cricket',cross=0,alternate=1,circle=1,underline=0,hesitate=0):
 im=Image.new('RGBA',(1200,900));d=ImageDraw.Draw(im)
 d.rounded_rectangle((4,10,1195,895),16,fill=(70,63,54,255),outline=(29,27,25,255),width=5)
 d.polygon([(20,24),(588,38),(590,870),(20,855)],fill=(240,231,203,255));d.polygon([(608,38),(1180,24),(1180,855),(608,870)],fill=(245,236,211,255))
 for y in range(145,830,55):
  d.line([(35,y),(580,y+6)],fill=(146,167,179,150),width=2);d.line([(620,y+6),(1165,y)],fill=(146,167,179,150),width=2)
 for x in [105,675]:d.line([(x,70),(x,835)],fill=(190,119,118,170),width=2)
 d.line([(599,35),(599,876)],fill=(150,135,111,255),width=6)
 for xy,body,size in [((135,65),'MATHS',47),((137,162),'1.  x² − 5x + 6 = 0',35),((140,225),'x = ...',35),((140,335),'2.  a² + b² =',35),((145,420),'3 + 4 = 7',30)]:text(d,xy,body,size)
 if kind=='maths':
  for xy,body,size in [((715,70),'EXERCISES',42),((715,165),'4. Solve for x:',36),((720,230),'2x + 5 =',36),((715,530),'Homework:',33)]:text(d,xy,body,size)
  if hesitate>0:
   # A tiny unfinished pencil mark, not another completed exercise.
   d.line([(940,278),(940+12*hesitate,278+3*hesitate)],fill=BLUE,width=3)
 else:
  text(d,(700,55),'MY IPL XI',52)
  names=['1. Jaiswal','2. Buttler  (c)','3. Pooran','4. David Miller','5. Daryl Mitchell','6. Tim David','7. Nabi','8. Narine','9. Bumrah','10. Kuldeep','11. Siraj']
  for i,name in enumerate(names):text(d,(700,130+47*i),name,31)
  if alternate>0:
   label=Image.new('RGBA',(190,52));ld=ImageDraw.Draw(label);text(ld,(0,0),'Abhishek?',27,RED)
   label=label.crop((0,0,max(1,round(190*alternate)),52));im.alpha_composite(label,(985,290));d=ImageDraw.Draw(im)
  if cross>0:
   d.line([(698,267),(698+220*min(cross*2,1),267+25*min(cross*2,1))],fill=RED,width=5)
   if cross>.5:d.line([(710,290),(710+210*(cross-.5)*2,290-25*(cross-.5)*2)],fill=RED,width=4)
  if underline>0:d.line([(985,331),(985+155*underline,331)],fill=RED,width=3)
  if circle>0:d.arc((973,168,1060,205),start=-90,end=-90+359*circle,fill=RED,width=4)
  d.line([(1050,205),(1130,245),(1100,280)],fill=RED,width=4)
  d.ellipse((965,510,1152,690),outline=BLUE,width=3);d.rectangle((1045,560,1065,636),outline=BLUE,width=3)
  for x,y in [(1000,550),(1110,570),(1005,650),(1080,675),(1050,525)]:d.ellipse((x-5,y-5,x+5,y+5),fill=RED)
  text(d,(720,702),'death overs → Bumrah',27);text(d,(725,755),'spin? left / right mix',26);text(d,(710,814),'IMAGINARY SCHOOLBOY XI',22,RED)
 return im


def homography(src,dst):
 a=[];b=[]
 for (x,y),(u,v) in zip(src,dst):
  a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
 return np.append(np.linalg.solve(np.asarray(a,float),np.asarray(b,float)),1).reshape(3,3)
BOOK_H=homography([(0,0),(1200,0),(1200,900),(0,900)],QUAD)
def point(x,y):
 p=BOOK_H@np.array([x,y,1]);return (float(p[0]/p[2]),float(p[1]/p[2]))

def warp_on(im,asset,quad,shadow=0):
 quad=np.asarray(quad,float)
 # Local bounding-box warps avoid rendering an entire portrait for every leaf strip.
 x0=max(0,math.floor(quad[:,0].min())-2);y0=max(0,math.floor(quad[:,1].min())-2)
 x1=min(W,math.ceil(quad[:,0].max())+2);y1=min(H,math.ceil(quad[:,1].max())+2)
 if x1<=x0 or y1<=y0:return
 local=quad-np.array([x0,y0]);src=[(0,0),(asset.width,0),(asset.width,asset.height),(0,asset.height)]
 try:inv=homography(local,src)
 except np.linalg.LinAlgError:return
 layer=asset.transform((x1-x0,y1-y0),Image.Transform.PERSPECTIVE,tuple(inv.flat[:8]),Image.Resampling.BICUBIC)
 if shadow:
  dark=Image.new('RGBA',layer.size,(0,0,0,shadow));dark.putalpha(layer.getchannel('A').point(lambda v:round(v*shadow/255)));im.alpha_composite(dark,(x0+7,y0+11))
 im.alpha_composite(layer,(x0,y0))


def wood_background():
 source=Image.open(ROOT/'work/opening_v2/classroom-master.png').convert('RGB').resize((W,H),Image.Resampling.LANCZOS)
 patch=source.crop((220,1515,780,1800)).resize((672,342),Image.Resampling.LANCZOS)
 canvas=Image.new('RGB',(W,H))
 for row,y in enumerate(range(0,H,342)):
  for col,x in enumerate(range(0,W,672)):
   tile=patch.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if (row+col)%2 else patch
   canvas.paste(tile,(x,y))
 canvas=canvas.filter(ImageFilter.GaussianBlur(2.2))
 # Soft focus/lighting fall-off keeps the physical book prominent.
 a=np.asarray(canvas).astype(np.float32);yy,xx=np.mgrid[0:H,0:W]
 shade=.94-.12*((xx-W*.38)/W)**2-.10*((yy-H*.48)/H)**2
 a=np.clip(a*shade[:,:,None],0,255).astype('uint8');return Image.fromarray(a).convert('RGBA')
BG=wood_background()
MATH=texture('maths');CRICKET=texture('cricket',cross=1)


def page_base(page):
 im=BG.copy();shadow=Image.new('RGBA',(W,H));d=ImageDraw.Draw(shadow)
 d.polygon([(x+14,y+20) for x,y in QUAD],fill=(29,18,8,115));im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(19)))
 warp_on(im,page,QUAD);return im


def arm(im,hand,side='right',page_grip=False):
 # Anatomical right enters from C3 screen-right; elbow stays below page.
 d=ImageDraw.Draw(im);hx,hy=hand
 start=(W+60,H+30) if side=='right' else (-60,H+30)
 elbow=(min(W+20,hx+180),max(1650,hy+160)) if side=='right' else (max(-20,hx-180),max(1650,hy+160))
 # Quadratic elbow path approximates retained thin dark stick limbs.
 pts=[]
 for i in range(25):
  u=i/24;pts.append(((1-u)**2*start[0]+2*(1-u)*u*elbow[0]+u*u*hx,(1-u)**2*start[1]+2*(1-u)*u*elbow[1]+u*u*hy))
 d.line(pts,fill=LIMB,width=11,joint='curve');d.ellipse((hx-19,hy-16,hx+19,hy+16),fill=LIMB)
 if page_grip:
  d.arc((hx-28,hy-18,hx+22,hy+20),-80,90,fill=LIMB,width=5)

def pencil(im,tip,angle=.38,length=196,hand=True,side='right'):
 dx,dy=math.sin(angle),-math.cos(angle);tip=np.asarray(tip,float)
 grip=tip+np.array([dx,dy])*length*.43
 if hand:arm(im,grip,side)
 d=ImageDraw.Draw(im);end=tip+np.array([dx,dy])*length
 d.line([tuple(tip),tuple(end)],fill=(54,38,21,255),width=17)
 d.line([tuple(tip+np.array([dx,dy])*22),tuple(end)],fill=(231,177,39,255),width=12)
 d.line([tuple(tip),tuple(tip+np.array([dx,dy])*24)],fill=(224,195,146,255),width=8)
 d.ellipse((tip[0]-3,tip[1]-3,tip[0]+3,tip[1]+3),fill=LIMB)
 if hand:
  d.ellipse((grip[0]-19,grip[1]-16,grip[0]+19,grip[1]+16),fill=LIMB)

def anchor(im):arm(im,point(125,810),'left')


def leaf_point(u,v,theta,curl=50):
 z=u*math.sin(theta)+curl*math.sin(math.pi*u/580)*math.sin(theta)
 bx=600+u*math.cos(theta)
 sx,sy=point(bx,v)
 return (sx+(sx-540)*z/6500,sy-z*.44)

def flip_leaf(im,theta,front,back,curl=50):
 tex=front if theta<=math.pi/2 else back.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 # The short strips follow one physical hinged sheet; texture and hand share its mapping.
 for j in (range(25) if theta<math.pi/2 else reversed(range(25))):
  u0=580*j/25;u1=580*(j+1)/25
  quad=[leaf_point(u0,0,theta,curl),leaf_point(u1,0,theta,curl),leaf_point(u1,900,theta,curl),leaf_point(u0,900,theta,curl)]
  crop=tex.crop((round(tex.width*j/25),0,round(tex.width*(j+1)/25),tex.height))
  if abs((quad[1][0]-quad[0][0])*(quad[3][1]-quad[0][1])-(quad[1][1]-quad[0][1])*(quad[3][0]-quad[0][0]))>.4:warp_on(im,crop,quad)


def frame_c(t,dur):
 p=t/dur;mark=smooth((p-.18)/.40)*.7;im=page_base(texture('maths',hesitate=mark));anchor(im)
 tip=point(940+12*mark,278+3*mark)
 # Pause while the pencil still touches the unfinished mark; then lift clear.
 lift=smooth((p-.75)/.2)*30;tip=(tip[0],tip[1]-lift);pencil(im,tip)
 return im

def frame_d(t,dur):
 p=smooth((t/dur-.06)/.82);theta=math.pi*p
 im=page_base(texture('cricket',cross=0,alternate=0,circle=0));anchor(im)
 front=MATH.crop((600,0,1180,900));back=MATH.crop((20,0,600,900))
 # Drop shadow shrinks into the spine as the leaf rises.
 sh=Image.new('RGBA',(W,H));d=ImageDraw.Draw(sh);hx,hy=point(600,810)
 d.ellipse((hx-30,hy-110,hx+280*(1-p)+50,hy+45),fill=(25,17,8,90));im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
 flip_leaf(im,theta,front,back)
 grip=leaf_point(576,805,theta);arm(im,grip,'right',page_grip=True)
 # The pencil is resting, with no extra unattached writing hand.
 pencil(im,(980,1730),angle=1.42,length=160,hand=False)
 return im

def frame_e(t,dur):
 p=t/dur;under=0
 if p<.12:
  c=0;tip=point(698,267)
 elif p<.34:
  q=smooth((p-.12)/.22);c=.5*q;tip=point(698+220*q,267+25*q)
 elif p<.43:
  q=smooth((p-.34)/.09);c=.5;a=point(918,292);b=point(710,290);tip=(lerp(a[0],b[0],q),lerp(a[1],b[1],q)-20*math.sin(math.pi*q))
 elif p<.65:
  q=smooth((p-.43)/.22);c=.5+.5*q;tip=point(710+210*q,290-25*q)
 elif p<.78:
  q=smooth((p-.65)/.13);c=1;a=point(920,265);b=point(985,331);tip=(lerp(a[0],b[0],q),lerp(a[1],b[1],q)-28*math.sin(math.pi*q))
 else:
  q=smooth((p-.78)/.20);c=1;under=q;tip=point(985+155*q,331)
 # The alternative is a pre-existing note. Only the X and underline are newly
 # drawn, avoiding a misleading wipe-in pretending to be letter-by-letter pen work.
 im=page_base(texture('cricket',cross=c,alternate=1,circle=1,underline=under));anchor(im)
 pencil(im,tip,angle=.38)
 return im

def frame_g(t,dur):
 im=page_base(MATH);anchor(im)
 # Withdraw from the blank exercise to make the comparison a quick disappointed beat.
 p=smooth(t/dur);tip=point(950,280);pencil(im,(tip[0]+18*p,tip[1]-30*p))
 return im

def frame_h(t,dur):
 p=smooth((t/dur-.08)/.82);im=page_base(texture('cricket',cross=1,circle=p));anchor(im)
 theta=-math.pi/2+2*math.pi*p;tip=point(1016.5+43.5*math.cos(theta),186.5+18.5*math.sin(theta));pencil(im,tip)
 return im

def frame_j(t,dur):
 p=smooth((t/dur-.05)/.90);im=BG.copy()
 leftquad=[point(0,0),point(600,0),point(600,900),point(0,900)]
 shadow=Image.new('RGBA',(W,H));ImageDraw.Draw(shadow).polygon([(x+10,y+16) for x,y in leftquad],fill=(24,15,6,95));im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(16)))
 warp_on(im,CRICKET.crop((0,0,600,900)),leftquad)
 # Lift the right half and close it over the left; no laptop/new-scene render here.
 cover=Image.new('RGBA',(580,900),(68,61,53,255));d=ImageDraw.Draw(cover)
 d.rounded_rectangle((12,12,567,886),12,outline=(27,25,23,255),width=9);d.rectangle((28,32,550,862),outline=(164,145,107,255),width=3)
 text(d,(85,130),'MY NOTEBOOK',46,(225,216,191,255));text(d,(155,210),'IPL XI',33,(225,216,191,255))
 flip_leaf(im,math.pi*p,CRICKET.crop((600,0,1180,900)),cover,curl=12)
 arm(im,leaf_point(576,805,math.pi*p,12),'right',page_grip=True)
 return im

CLIPS=[('C_maths_hesitation',1.4,frame_c),('D_page_turn_reveal',1.0,frame_d),('E_cross_out_selection',1.8,frame_e),('G_sparse_maths',.7,frame_g),('H_dense_cricket',.8,frame_h),('J_notebook_close',.9,frame_j)]

def export_textures():
 OUT.mkdir(parents=True,exist_ok=True)
 for name,im in [('NOTEBOOK_MATHS',MATH),('NOTEBOOK_CRICKET_CLEAN',texture('cricket',cross=0,alternate=0,circle=0)),('NOTEBOOK_CRICKET_SELECTED',CRICKET)]:im.save(OUT/(name+'.png'))
 metadata={'scope':'Opening-only silent notebook cutaways','fps':FPS,'width':W,'height':H,'anatomical_writing_hand':'RIGHT','C3_writing_screen_side':'RIGHT','C1_frontal_writing_screen_side':'LEFT','notebook_texture_size':[1200,900],'pupil_view_notebook_top':'toward board / C3 screen-TOP','pupil_view_left_page':'maths','pupil_view_right_page':'cricket','C1_texture_transform':'rotate 180 degrees, never mirror','caption_safe_area_proposal':{'x':80,'y':1730,'width':920,'height':150},'classroom_axis':'C3 behind/beside pupil, looks toward room front','source_assets':['Original generated classroom wood patch','Existing authored schoolboy notebook content','Kalam OFL font'],'limitations':['2.5D articulated page/hand composites, not a simulated paper mesh.','Clip timing is provisional pending final synchronization against the approved Michael refinement.','Background room/teacher are outside the macro framing.','Silent clips have no narration, foley or captions.'],'clips':[]}
 for name,duration,fn in CLIPS:
  metadata['clips'].append({'name':name,'path':str(OUT/(name+'.mp4')),'duration':duration,'frames':round(duration*FPS),'action':name.split('_',1)[1],'flexible_handles':'First/last pose may be held briefly; do not time-stretch pencil contact independently.'})
 metadata['narration_cue_source']='outputs/michael-refinement/pronunciation-check/words.json'
 metadata['narration_lead_seconds']=.10;metadata['approved_opening_target_seconds']=12
 metadata['cue_suggestions_video_seconds']={'maths':[2.34,3.14],'way_more_important':[4.26,5.14],'Your_IPL_best_eleven':[6.26,8.42],'And_honestly':[8.42,9.54],'the_maths_can_wait':[9.54,10.81]}
 (OUT/'NOTEBOOK_METADATA.json').write_text(json.dumps(metadata,indent=2));return metadata

def render(name,duration,fn):
 dest=OUT/(name+'.mp4');temp=OUT/(name+'.rendering.mp4');frames=round(duration*FPS)
 command=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(temp)]
 p=subprocess.Popen(command,stdin=subprocess.PIPE)
 for i in range(frames):
  im=fn(i/FPS,duration).convert('RGB');p.stdin.write(im.tobytes())
 p.stdin.close();assert p.wait()==0
 temp.replace(dest)
 print('RENDERED',name,frames,flush=True)

if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--textures-only',action='store_true');ap.add_argument('--clip');args=ap.parse_args();export_textures()
 if not args.textures_only:
  for name,duration,fn in CLIPS:
   if not args.clip or name==args.clip:render(name,duration,fn)
