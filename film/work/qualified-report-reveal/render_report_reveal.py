"""Physical qualified-report insert, using only accepted supplied rankings.

Native portrait output; no portraits, invented IDs, unknown CIs or new models.
The complete primary batting page is revealed first, then turned to bowling.
"""
from pathlib import Path
import argparse,csv,json,math,hashlib,subprocess,xml.etree.ElementTree as ET
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageFont
import cairosvg
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/qualified-report-reveal';OUT=ROOT/'outputs/qualified-report-reveal';OUT.mkdir(exist_ok=True)
W,H,FPS,FRAMES=1080,1920,30,300
FONT=ROOT/'work/opening_v2/DejaVuSans-Bold.ttf';HAND=ROOT/'work/opening_v2/Kalam-Regular.ttf'
INK=(31,31,28,255);PAPER=(237,225,195,255);LIMB=(27,23,20,255)
PAGE_QUAD=np.array([(117,86),(1002,69),(1007,1706),(104,1720)],float)


def smooth(v):v=max(0,min(1,float(v)));return v*v*(3-2*v)
def font(size,hand=False):return ImageFont.truetype(str(HAND if hand else FONT),size)
def label(d,xy,text,size,fill=PAPER,hand=False):d.text(xy,text,font=font(size,hand),fill=fill)

def homography(src,dst):
 a=[];b=[]
 for (x,y),(u,v) in zip(src,dst):
  a.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);b.extend([u,v])
 return np.append(np.linalg.solve(np.asarray(a,float),np.asarray(b,float)),1).reshape(3,3)
MAT=homography([(0,0),(1080,0),(1080,1920),(0,1920)],PAGE_QUAD)
def point(x,y):
 p=MAT@np.array([x,y,1]);return (float(p[0]/p[2]),float(p[1]/p[2]))

def warp(im,asset,quad):
 quad=np.asarray(quad,float);x0=max(0,math.floor(quad[:,0].min())-2);y0=max(0,math.floor(quad[:,1].min())-2);x1=min(W,math.ceil(quad[:,0].max())+2);y1=min(H,math.ceil(quad[:,1].max())+2)
 if x1<=x0 or y1<=y0:return
 local=quad-np.array([x0,y0]);src=[(0,0),(asset.width,0),(asset.width,asset.height),(0,asset.height)]
 try:inverse=homography(local,src)
 except np.linalg.LinAlgError:return
 layer=asset.transform((x1-x0,y1-y0),Image.Transform.PERSPECTIVE,tuple(inverse.flat[:8]),Image.Resampling.BICUBIC);im.alpha_composite(layer,(x0,y0))


def data_and_pages():
 source=ROOT/'data/accepted_primary_rankings.csv';rows=list(csv.DictReader(source.open()))
 assert len(rows)==20
 checks={'twenty_rows':len(rows)==20,'source_csv_order_preserved':True,'only_buttler_ci_supplied':True,'no_inferred_player_ids':True,'no_portraits':True}
 for role in ['batter','bowler']:
  role_rows=[r for r in rows if r['role']==role]
  assert [int(r['rank']) for r in role_rows]==list(range(1,11))
  for r in role_rows:
   assert int(r['pressure_events'])>=60 and int(r['pressure_matches'])>=12
   shares=sum(float(r[k]) for k in ['ipl_pressure_share_percent','t20i_pressure_share_percent','other_t20_pressure_share_percent'])
   assert abs(shares-100)<.11
   assert all(0<=float(r[k])<=100 for k in ['bootstrap_top10_percent','ipl_pressure_share_percent','t20i_pressure_share_percent','other_t20_pressure_share_percent'])
   if r['player']!='Jos Buttler':assert not r['ci95_lower_if_supplied'] and not r['ci95_upper_if_supplied']
  original=ROOT/f'outputs/report-{role}-top10.svg';tree=ET.fromstring(original.read_text())
  values=[n.text for n in tree.iter() if n.tag.endswith('text')]
  positioned={(n.attrib.get('x'),n.attrib.get('y')):n.text for n in tree.iter() if n.tag.endswith('text')}
  for i,r in enumerate(role_rows):
   y=350+i*122
   assert positioned[('65',str(y))]==f"{r['rank']}. {r['player']}"
   assert positioned[('65',str(y+40))]==f"Rating {r['rating_display']} · {r['tier']}"
   assert positioned[('580',str(y))]==f"{r['pressure_events']} / {r['pressure_matches']}"
   assert positioned[('855',str(y))]==r['bootstrap_top10_percent']+'%'
   assert positioned[('580',str(y+40))]==f"IPL {r['ipl_pressure_share_percent']}% · T20I {r['t20i_pressure_share_percent']}%"
  # Verify every displayed player/value in the existing authored source against CSV.
  for r in role_rows:
   assert f"{r['rank']}. {r['player']}" in values
   assert f"Rating {r['rating_display']} · {r['tier']}" in values
   assert f"{r['pressure_events']} / {r['pressure_matches']}" in values
   assert r['bootstrap_top10_percent']+'%' in values
   assert f"IPL {r['ipl_pressure_share_percent']}% · T20I {r['t20i_pressure_share_percent']}%" in values
   if r['other_t20_pressure_share_percent']!='0':assert 'Other T20 '+r['other_t20_pressure_share_percent']+'%' in values
  # Keep table and source ordering exactly. Only replace the lower source/caveat
  # footer so the distinction requested for this film is explicit on both pages.
  for n in list(tree):
   if n.tag.endswith('text') and float(n.attrib.get('y','0'))>=1600:tree.remove(n)
  ns='{http://www.w3.org/2000/svg}'
  footer=[(1607,'TOP-10 RATE: CONDITIONAL HISTORICAL STABILITY',23),(1644,'750 whole-match resamples; not future IPL success probability.',22),(1681,'Format shares describe pressure-event exposure; IPL transfer unestablished.',20),(1718,'Only supplied individual CI: Buttler 1.064–4.562. Others unavailable.',21),(1755,'Batting forward signal absent; bowling advantage over economy unproven.',20),(1816,'Source: supplied methodology and accepted primary rankings.',21),(1853,'Analytical pipeline not independently rerun for this film.',21)]
  for y,text,size in footer:
   node=ET.SubElement(tree,ns+'text',{'x':'65','y':str(y),'font-family':'DejaVu Sans,sans-serif','font-size':str(size),'fill':'#142333'});node.text=text
  svg=OUT/f'qualified-{role}-page.svg';ET.ElementTree(tree).write(svg,encoding='utf-8',xml_declaration=True)
  cairosvg.svg2png(url=str(svg),write_to=str(svg.with_suffix('.png')))
 daryl=next(r for r in rows if r['player']=='Daryl Mitchell');fakhar=next(r for r in rows if r['player']=='Fakhar Zaman')
 assert daryl['rating_display']==fakhar['rating_display']=='1.571'
 assert float(daryl['exact_rating_if_supplied'])>float(fakhar['exact_rating_if_supplied']) and int(daryl['rank'])<int(fakhar['rank'])
 buttler=next(r for r in rows if r['player']=='Jos Buttler');assert (buttler['ci95_lower_if_supplied'],buttler['ci95_upper_if_supplied'])==('1.064','4.562')
 checks['known_unrounded_daryl_fakhar_order_checked']=True
 checks['other_exact_ratings_not_invented']=True
 checks['svg_field_to_player_row_positions_checked']=True
 report={'checks':checks,'source_csv':str(source),'source_sha256':hashlib.file_digest(source.open('rb'),'sha256').hexdigest(),'row_count':len(rows),'batting_order':[r['player'] for r in rows if r['role']=='batter'],'bowling_order':[r['player'] for r in rows if r['role']=='bowler'],'note':'CSV rank order is authoritative. Only the supplied Daryl/Fakhar near-tie can be checked against exact values here; no unavailable exact ratings, IDs or intervals are inferred. Bootstrap rates are conditional historical stability, not future IPL success.'}
 (OUT/'REPORT_DATA_CHECKS.json').write_text(json.dumps(report,indent=2))
 return Image.open(OUT/'qualified-batter-page.png').convert('RGBA'),Image.open(OUT/'qualified-bowler-page.png').convert('RGBA')


def background():
 original=Image.open(ROOT/'work/opening_v2/classroom-master.png').convert('RGB').resize((W,H),Image.Resampling.LANCZOS)
 # Reuse the approved desk's wood only. No original reference footage is used.
 sample=original.crop((170,1480,900,1890)).resize((W,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(2))
 return sample.convert('RGBA')
BG=background()

def bound_page(page):
 im=BG.copy();shadow=Image.new('RGBA',(W,H));d=ImageDraw.Draw(shadow)
 board=[(82,57),(1030,45),(1038,1746),(72,1760)]
 d.polygon([(x+15,y+19) for x,y in board],fill=(20,13,7,140));im.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(22)))
 d=ImageDraw.Draw(im);d.polygon(board,fill=(24,39,50,255));d.line(board+[board[0]],fill=(15,20,23,255),width=9)
 # Stacked paper edges ground the report's thickness and bind it to a spine.
 for step in range(5):
  q=PAGE_QUAD+np.array([2+step*.9,5+step*1.2]);d.polygon([tuple(p) for p in q],fill=(211-step*4,200-step*4,174-step*4,255))
 warp(im,page,PAGE_QUAD)
 d=ImageDraw.Draw(im);d.line([(91,62),(82,1748)],fill=(9,21,29,255),width=22)
 for y in [420,870,1320]:
  d.ellipse((73,y-19,115,y+19),outline=(84,87,82,255),width=8);d.arc((76,y-18,113,y+18),60,235,fill=(201,197,177,255),width=3)
 return im

def cover():
 im=Image.new('RGBA',(1080,1920),(26,41,53,255));d=ImageDraw.Draw(im)
 d.rounded_rectangle((20,20,1058,1898),18,outline=(11,20,26,255),width=16);d.rectangle((55,70,1024,1848),outline=(159,131,72,255),width=5)
 label(d,(130,380),'KHILADI',114);label(d,(135,545),'PLAYER ANALYSIS',48);label(d,(138,730),'A QUALIFIED SHORTLIST',40)
 label(d,(140,890),'WHAT DOES THE',38,hand=True);label(d,(140,950),'EVIDENCE SUPPORT?',49,hand=True)
 label(d,(140,1400),'PRIMARY PRESSURE QUALITY',31);label(d,(140,1480),'Exposure · uncertainty · format',29)
 label(d,(140,1690),'SUPPLIED RESEARCH / 2022–2026',28)
 return im
COVER=cover();BACK=Image.new('RGBA',(1080,1920),(232,220,191,255))


def leaf_point(u,v,theta,curl=35):
 z=u*math.sin(theta)+curl*math.sin(math.pi*u/1080)*math.sin(theta)
 # Hinge is along the report's left binding, not a detached floating panel.
 x=u*math.cos(theta);sx,sy=point(x,v)
 return (sx+(sx-540)*z/18000,sy-z*.18)

def leaf(im,theta,front,back,curl=35):
 tex=front if theta<=math.pi/2 else back.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 for j in (range(30) if theta<=math.pi/2 else reversed(range(30))):
  u0=1080*j/30;u1=1080*(j+1)/30
  quad=[leaf_point(u0,0,theta,curl),leaf_point(u1,0,theta,curl),leaf_point(u1,1920,theta,curl),leaf_point(u0,1920,theta,curl)]
  area=abs((quad[1][0]-quad[0][0])*(quad[3][1]-quad[0][1])-(quad[1][1]-quad[0][1])*(quad[3][0]-quad[0][0]))
  if area<.5:continue
  piece=tex.crop((round(tex.width*j/30),0,round(tex.width*(j+1)/30),tex.height));warp(im,piece,quad)

def hand(im,xy,side='right'):
 d=ImageDraw.Draw(im);hx,hy=xy;start=(W+70,H+30) if side=='right' else (-50,H+30);elbow=(min(W+40,hx+130),max(hy+100,1780)) if side=='right' else (max(-30,hx-130),max(hy+100,1780))
 pts=[]
 for i in range(25):
  u=i/24;pts.append(((1-u)**2*start[0]+2*(1-u)*u*elbow[0]+u*u*hx,(1-u)**2*start[1]+2*(1-u)*u*elbow[1]+u*u*hy))
 d.line(pts,fill=LIMB,width=10,joint='curve');d.ellipse((hx-18,hy-15,hx+18,hy+15),fill=LIMB)


def frame(t):
 if t<.75:
  im=BAT_BASE.copy();p=smooth((t-.04)/.67);theta=math.pi*p;leaf(im,theta,COVER,BACK,curl=8);hand(im,leaf_point(1065,1810,theta,8),'right');hand(im,point(35,1830),'left')
 elif t<4.70:
  im=BAT_BASE.copy();hand(im,point(35,1830),'left')
  # Reader's right hand approaches the corner just before the page turn.
  if t>4.35:
   p=smooth((t-4.35)/.35);a=np.array([1120,1860]);b=np.array(point(1065,1810));hand(im,a+(b-a)*p,'right')
 elif t<5.55:
  p=smooth((t-4.70)/.85);theta=math.pi*p;im=BOWL_BASE.copy();leaf(im,theta,BATTER,BACK);hand(im,leaf_point(1065,1810,theta),'right');hand(im,point(35,1830),'left')
 else:
  im=BOWL_BASE.copy();hand(im,point(35,1830),'left')
  # Small settling hand stays outside the data table; no presenter or chart pointer.
  if t<5.90:
   p=smooth((t-5.55)/.35);a=np.array(leaf_point(1065,1810,math.pi));b=np.array([-80,H+60]);hand(im,a+(b-a)*p,'right')
 return im.convert('RGB')


def main():
 global BATTER,BOWLER,BAT_BASE,BOWL_BASE
 ap=argparse.ArgumentParser();ap.add_argument('--stills',action='store_true');a=ap.parse_args()
 BATTER,BOWLER=data_and_pages();BAT_BASE=bound_page(BATTER);BOWL_BASE=bound_page(BOWLER)
 metadata={'scene':'14_shortlist','scope':'qualified report insert only','width':W,'height':H,'fps':FPS,'frames':FRAMES,'duration_seconds':10,'path':str(OUT/'QUALIFIED_REPORT_REVEAL.mp4'),'beats':[{'start':0,'end':.75,'action':'bound cover opens'},{'start':.75,'end':4.70,'action':'complete accepted batting top10 visible'},{'start':4.70,'end':5.55,'action':'physical bound leaf turns'},{'start':5.55,'end':10,'action':'complete accepted bowling top10 visible'}],'caption_safe_band':{'x':50,'y':1750,'width':980,'height':150},'source':'accepted_primary_rankings.csv and existing authored report SVG/PNG','limits':['All20 rows are visually present, but10s does not allow reading every field aloud; pause may be needed.','2.5D bound-page/hand perspective composites, not a simulated Blender paper mesh.','Input pages preserve supplied rank order; no unavailable IDs/ratings/intervals inferred.','This asset is silent and has no final narrator/caption/foley sync.']}
 (OUT/'REPORT_REVEAL_METADATA.json').write_text(json.dumps(metadata,indent=2))
 if a.stills:
  for i,t in enumerate([0,.45,2.4,4.4,5.0,5.35,7.5,9.5]):frame(t).save(OUT/f'report-preview-{i}.png')
  return
 dest=OUT/'QUALIFIED_REPORT_REVEAL.mp4';temp=OUT/'QUALIFIED_REPORT_REVEAL.rendering.mp4'
 p=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',str(temp)],stdin=subprocess.PIPE)
 for i in range(FRAMES):
  p.stdin.write(frame(i/FPS).tobytes())
  if i%60==0:print('REPORT_FRAME',i,flush=True)
 p.stdin.close();assert p.wait()==0;temp.replace(dest);print(dest,flush=True)

if __name__=='__main__':main()
