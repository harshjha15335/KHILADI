"""Khiladi original reel: physical environments and three perspective plates per scene.

REEL_DRAFT=1 renders 540x960; REEL_SCENES selects comma-separated IDs.
The approved hero is composited separately. All evidence here is a scene prop.
"""
import bpy, math, os, json, random, time
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parent.parent
WORK=ROOT/'work'; OUT=ROOT/'outputs'; REEL=WORK/'reel'
DRAFT=os.getenv('REEL_DRAFT','0')=='1'
SELECT=os.getenv('REEL_SCENES','').split(',')
W,H=(540,960) if DRAFT else (1080,1920)
FOLDER=REEL/('previews' if DRAFT else 'plates')
FOLDER.mkdir(parents=True,exist_ok=True)
STORY=json.loads((WORK/'story.json').read_text(encoding='utf8'))['scenes']
TIMES={s['id']:s for s in json.loads((WORK/'timing.json').read_text(encoding='utf8'))}
M={}; S=None; CUBES={}; SPHERES={}

def material(name,rgb,emission=0,grain=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*rgb,1);p.inputs['Roughness'].default_value=.76
 if emission:p.inputs['Emission Color'].default_value=(*rgb,1);p.inputs['Emission Strength'].default_value=emission
 if grain:
  n=m.node_tree.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=grain
  b=m.node_tree.nodes.new('ShaderNodeBump');b.inputs['Strength'].default_value=.12;b.inputs['Distance'].default_value=.035
  m.node_tree.links.new(n.outputs['Fac'],b.inputs['Height']);m.node_tree.links.new(b.outputs[0],p.inputs['Normal'])
 return m

def cube(name,p,d,m,bev=.035):
 material=M[m] if isinstance(m,str) else m
 key=(*d,material.name)
 if key not in CUBES:
  me=bpy.data.meshes.new(name+' geometry');hx,hy,hz=[v/2 for v in d]
  me.from_pydata([(-hx,-hy,-hz),(-hx,-hy,hz),(-hx,hy,-hz),(-hx,hy,hz),(hx,-hy,-hz),(hx,-hy,hz),(hx,hy,-hz),(hx,hy,hz)],[],[(0,4,6,2),(1,3,7,5),(0,1,5,4),(2,6,7,3),(0,2,3,1),(4,5,7,6)])
  me.materials.append(material);me.update();CUBES[key]=me
 o=bpy.data.objects.new(name,CUBES[key]);S.collection.objects.link(o);o.location=p
 if bev:
  b=o.modifiers.new('Rounded physical edge','BEVEL');b.width=bev;b.segments=2
  o.modifiers.new('Corner normals','WEIGHTED_NORMAL')
 return o

def rod(name,a,b,r,m):
 a,b=Vector(a),Vector(b);v=b-a
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=v.length,location=(a+b)/2)
 o=bpy.context.object;o.name=name;o.rotation_euler=v.to_track_quat('Z','Y').to_euler();o.data.materials.append(M[m]);return o

def sphere(name,p,r,m,scale=None):
 if m not in SPHERES:
  bpy.ops.mesh.primitive_uv_sphere_add(segments=16,ring_count=8,radius=1)
  temp=bpy.context.object;me=temp.data;me.materials.append(M[m]);SPHERES[m]=me;bpy.data.objects.remove(temp,do_unlink=True)
 o=bpy.data.objects.new(name,SPHERES[m]);S.collection.objects.link(o);o.location=p
 o.scale=tuple(r*v for v in (scale or (1,1,1)));return o

def text(body,p,size=.22,m='ink',flat=False,angle=0,align='CENTER'):
 d=bpy.data.curves.new('Lettering '+body,'FONT');d.body=body;d.align_x=align;d.size=size;d.extrude=.0006
 if flat and (body=='IPL XI' or body[0:2] in ['1.','2.','3.','4.'] or '=' in body):
  handwriting=Path('C:/Windows/Fonts/segoepr.ttf')
  if handwriting.exists():d.font=bpy.data.fonts.get('SegoePrint') or bpy.data.fonts.load(str(handwriting))
 o=bpy.data.objects.new('Prop lettering | '+body,d);S.collection.objects.link(o);o.location=p
 o.rotation_euler=(0,0,angle) if flat else (math.pi/2,0,angle);d.materials.append(M[m]);return o

def stroke(name,pts,m='ink',r=.009):
 d=bpy.data.curves.new(name,'CURVE');d.dimensions='3D';d.bevel_depth=r;d.bevel_resolution=1
 sp=d.splines.new('POLY');sp.points.add(len(pts)-1)
 for v,p in zip(sp.points,pts):v.co=(*p,1)
 o=bpy.data.objects.new(name,d);S.collection.objects.link(o);d.materials.append(M[m]);return o

def light(name,p,target,energy,size,col):
 d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;d.color=col
 o=bpy.data.objects.new(name,d);S.collection.objects.link(o);o.location=p;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()

def make_materials():
 global M
 colors={'ink':(.025,.033,.041),'navy':(.021,.054,.10),'blue':(.036,.22,.45),'teal':(.045,.36,.36),'pink':(.65,.12,.26),'gold':(.88,.49,.07),'red':(.66,.055,.035),'paper':(.90,.84,.66),'white':(.93,.92,.85),'wood':(.30,.105,.035),'woodlight':(.51,.27,.105),'plaster':(.63,.57,.43),'floor':(.35,.32,.25),'metal':(.12,.15,.17),'green':(.025,.105,.075),'grass':(.055,.20,.045),'pitch':(.42,.29,.12),'glass':(.19,.43,.50),'sky':(.73,.68,.49),'coffee':(.075,.028,.012),'mint':(.27,.66,.47)}
 M={k:material('Reel | '+k,v,emission=(.7 if k=='sky' else 0),grain=(110 if k in ['wood','floor','plaster','grass'] else 0)) for k,v in colors.items()}

def desk(x,y,z=1.5,width=2.5,depth=1.25):
 cube('Timber worktop',(x,y,z),(width,depth,.12),'woodlight')
 for dx in [-width*.40,width*.40]:
  for dy in [-depth*.35,depth*.35]:rod('Tubular table leg',(x+dx,y+dy,.06),(x+dx,y+dy,z-.03),.038,'metal')
 for dy in [-depth*.35,depth*.35]:rod('Desk cross brace',(x-width*.4,y+dy,.48),(x+width*.4,y+dy,.48),.02,'metal')

def chair(x,y,z=0):
 cube('Seat cushion',(x,y,z+.83),(.68,.65,.12),'teal')
 cube('Chair back',(x,y+.27,z+1.2),(.68,.09,.65),'teal')
 for dx in [-.24,.24]:
  for dy in [-.23,.23]:rod('Chair leg',(x+dx,y+dy,z+.04),(x+dx,y+dy,z+.8),.028,'metal')

def book(x,y,z,m='blue',angle=0):
 o=cube('Book cover',(x,y,z),(.54,.75,.10),m,.012);o.rotation_euler.z=angle
 o=cube('Book paper edges',(x,y,z+.025),(.51,.72,.065),'paper',.008);o.rotation_euler.z=angle

def sheet(x,y,z,width=.58,depth=.75,m='paper',angle=0):
 o=cube('Loose research paper',(x,y,z),(width,depth,.009),m,.002);o.rotation_euler.z=angle
 # Short ink marks make paper read as working notes, not blank scenery.
 for k in range(4):
  xx=x+math.sin(angle)*(.20-k*.10);yy=y-math.cos(angle)*(.20-k*.10)
  q=cube('Handwritten note stroke',(xx,yy,z+.007),(width*.6,.009,.003),'ink',0);q.rotation_euler.z=angle
 return o

def mug(x,y,z):
 rod('Ceramic coffee mug',(x,y,z),(x,y,z+.28),.12,'white');rod('Coffee surface',(x,y,z+.28),(x,y,z+.285),.105,'coffee')
 bpy.ops.mesh.primitive_torus_add(major_radius=.095,minor_radius=.022,major_segments=16,minor_segments=6,location=(x+.13,y,z+.15),rotation=(math.pi/2,0,0));bpy.context.object.data.materials.append(M['white'])

def laptop(x,y,z):
 cube('Laptop base',(x,y,z),(.98,.66,.045),'metal')
 for r in range(4):
  for c in range(10):cube('Keyboard key',(x-.40+c*.086,y-.20+r*.085,z+.029),(.06,.052,.01),'navy',.002)
 cube('Laptop screen surround',(x,y+.28,z+.39),(1.02,.055,.74),'navy')
 cube('Laptop screen',(x,y+.247,z+.39),(.92,.008,.64),'blue',.006)
 for i,v in enumerate([.30,.5,.24,.65,.43,.72,.56]):cube('Laptop data column',(x-.37+i*.12,y+.239,z+.12+v*.22),(.07,.005,v*.44),'mint',.001)

def plant(x,y,z=0):
 rod('Terracotta pot',(x,y,z),(x,y,z+.40),.23,'wood')
 for k in range(7):
  a=k*2.4;tip=(x+.35*math.cos(a),y+.3*math.sin(a),z+.75+(k%3)*.22)
  rod('Plant stem',(x,y,z+.3),tip,.017,'green');sphere('Plant leaf',tip,.20,'teal',(.45,1,.30))

def window(x,y,z,w=2.0,h=2.7):
 cube('Deep window recess',(x,y,z),(w+.18,.25,h+.18),'wood')
 cube('Window warm exterior',(x,y-.14,z),(w,.025,h),'sky')
 for xx in [-w/2,0,w/2]:cube('Window mullion',(x+xx,y-.18,z),(.055,.08,h),'navy',.008)
 for zz in [-h/2,0,h/2]:cube('Window crossbar',(x,y-.18,z+zz),(w,.08,.055),'navy',.008)
 cube('Window sill',(x,y-.30,z-h/2),(w+.25,.55,.12),'woodlight')

def pinned_chart(x,y,z,w=.65,h=.85,kind=0):
 cube('Pinned analysis page',(x,y,z),(w,.014,h),'paper',.003)
 sphere('Drawing pin',(x,y-.03,z+h*.43),.026,'red')
 text('ILLUSTRATIVE',(x,y-.027,z+h*.31),w*.075,'ink')
 stroke('Chart axes',[(x-w*.35,y-.02,z+h*.25),(x-w*.35,y-.02,z-h*.3),(x+w*.35,y-.02,z-h*.3)],'ink',.005)
 if kind%2:
  stroke('Chart line',[(x-w*.3+i*w*.12,y-.025,z-h*.20+h*v*.4) for i,v in enumerate([.15,.4,.3,.65,.5,.8])],'pink',.013)
 else:
  for i,v in enumerate([.2,.45,.7,.55,.35]):cube('Chart ink bar',(x-w*.25+i*w*.13,y-.025,z-h*.27+v*h*.3),(w*.08,.012,v*h*.6),'blue',.001)

def research_wall():
 # Dense working pinwall is a collection of small sheets and strings.
 cube('Cork research pinwall',(1.9,4.64,3.45),(3.0,.10,2.0),'woodlight')
 for r in range(2):
  for c in range(4):pinned_chart(.82+c*.73,4.57,2.98+r*.87,.61,.77,r+c)
 for a,b in [((.85,4.53,3.1),(2.27,4.53,3.8)),((1.6,4.53,3.8),(2.95,4.53,3.0))]:rod('Research connecting thread',a,b,.006,'red')
 for k in range(5):
  x=.9+k*.49;cube('Post-it reminder',(x,4.50,4.65),(.35,.012,.31),'gold',.006)
  stroke('Post-it scribble',[(x-.10,4.48,4.65),(x+.1,4.48,4.65)],'ink',.006)

def room(classroom=False,warroom=False):
 cube('Concrete floor',(0,1,-.12),(16,21,.22),'floor',.01)
 cube('Back plaster wall',(0,5,3.8),(16,.25,7.8),'plaster',.01)
 cube('Left plaster wall',(-4.8,1,3.8),(.25,8,7.8),'plaster',.01)
 for x in [-4,-2,0,2,4]:cube('Floor tile seam',(x,1,.002),(.012,20,.006),'metal',0)
 for y in range(-7,6,2):cube('Floor tile seam',(0,y,.003),(16,.012,.006),'metal',0)
 cube('Low painted wall strip',(0,4.82,.65),(16,.05,1.3),'green' if classroom else 'teal',.005)
 for x in [-3.2,-.6]:window(x,4.80,3.5,1.9,2.7)
 for x in [-4.4,0,4.4]:rod('Exposed ceiling beam',(x,-3,6.4),(x,5,6.4),.10,'navy')
 for y in [-1.5,2.5]:
  rod('Pendant cable',(0,y,6.4),(0,y,5.8),.012,'metal');cube('Hanging warm lamp',(0,y,5.75),(.9,.35,.12),'gold')
  light('Pendant pool',(0,y,5.7),(0,y,1),100,1.5,(1,.69,.36))
 light('Window sunlight',(-3.4,1.8,6.1),(1,1,0),1450,3.0,(1,.70,.40))
 light('Soft room fill',(3,-4,5),(0,1,2),420,5,(.55,.68,1))
 if classroom:
  # Blackboard is incidental, without a title or a presentation layout.
  cube('Worn classroom chalkboard',(2.8,4.76,3.5),(2.8,.12,1.8),'wood')
  cube('Chalkboard inset',(2.8,4.67,3.5),(2.62,.03,1.62),'green')
  for k in range(6):stroke('Faint erased chalk',[(1.73+(k%2)*.2,4.645,3.0+k*.19),(3.5,4.645,3.0+k*.19)],'teal',.008)
  text('x + y = ?', (2.65,4.62,3.75),.19,'paper')
  for x,y in [(-2.6,3.0),(.2,3.2),(2.8,3.1),(-2.7,.6),(2.8,.55)]:
   desk(x,y,1.35,1.7,.95);chair(x,y+.9);book(x-.4,y,1.46,'blue');sheet(x+.35,y,1.42,.5,.6)
  plant(-4.0,4.0)
 else:
  research_wall()
  for z in [1.8,2.7,3.6]:
   cube('Bookcase shelf',(-3.9,4.45,z),(1.4,.6,.09),'wood')
   for k in range(7):cube('Research volume',(-4.45+k*.17,4.4,z+.28),(.13,.36,.5),['blue','paper','red','teal'][k%4],.008)
  desk(.85 if warroom else 1.1,1.4,1.55,4.6 if warroom else 3.1,2.5 if warroom else 1.55)
  laptop(2.3 if warroom else 1.9,1.95 if warroom else 1.65,1.64);mug(2.6 if warroom else 2.35,1.1,1.64)
  for k in range(7):sheet(-.1+(k%3)*.50,1.0+(k//3)*.35,1.63+k*.002,.52,.65,angle=(k-3)*.12)
  chair(1.3,2.9 if warroom else 2.6);plant(3.8,4.0)
  if warroom:
   for x in [-.8,2.8]:chair(x,2.95)
   for x in [-.7,2.5]:
    chair(x,-.1)
  desk(-2.3,3.0,1.5,1.6);laptop(-2.3,3.0,1.58)
  rod('Work lamp stem',(2.5,2.0,1.62),(2.5,2.0,2.5),.025,'metal')
  cube('Task lamp hood',(2.45,1.95,2.55),(.44,.33,.15),'gold')
  light('Task lamp glow',(2.45,1.85,2.48),(1.2,1.0,1.6),60,.4,(1,.60,.27))

def notebook():
 # Open notebook spans the front school desk; actual handwriting is geometry.
 desk(.7,.20,1.55,2.9,1.6)
 cube('Open notebook cover',(.7,.05,1.65),(1.75,1.18,.055),'blue',.018)
 cube('Left notebook page',(.26,.05,1.687),(.84,1.10,.025),'paper',.008)
 cube('Right notebook page',(1.13,.05,1.69),(.84,1.10,.025),'paper',.008)
 for k in range(8):cube('Notebook ruling',(.7,-.38+k*.12,1.708),(1.60,.005,.001),'glass',0)
 text('IPL XI',(1.13,.31,1.72),.17,'ink',True,angle=-.025)
 for k,body in enumerate(['1. Opener','2. Opener','3. Captain','4. Keeper']):text(body,(1.11,.06-k*.15,1.72),.075,'ink',True,angle=-.02,align='CENTER')
 for k,body in enumerate(['x + y = 7','2x - y = 5','x = ...']):text(body,(.25,.2-k*.23,1.72),.088,'ink',True,angle=.035)
 rod('Abandoned pencil',(1.72,-.39,1.73),(1.35,.55,1.73),.025,'gold')
 book(-.55,.5,1.72,'red',-.12);mug(1.9,.6,1.64)
 return Vector((.7,.05,1.7))

def tray(x,y,z,label,count=6,m='paper'):
 cube('Steel sorting tray',(x,y,z),(1.00,.85,.10),'metal')
 for k in range(count):cube('Audited match card',(x+math.sin(k)*.025,y,z+.07+k*.025),(.81,.68,.018),m,.004)
 cube('Tray paper label',(x,y-.46,z+.11),(.94,.024,.30),'paper',.006)
 text(label,(x,y-.48,z+.06),.13,'ink')

def evidence_props(sid):
 center=Vector((.45,1.10,2.0))
 if sid in ['01_notebook','16_end']:return notebook()
 if sid=='02_hackathon':
  cube('Hackathon lanyard card',(.30,.70,1.70),(.85,.65,.035),'pink')
  text('SupeRR',(.30,.78,1.73),.14,'white',True);text('SELECTOR',(.30,.58,1.73),.10,'white',True)
  stroke('Lanyard cord',[(-.05,.9,1.73),(-.2,1.5,1.72),(.45,1.75,1.72),(.62,.98,1.73)],'navy',.018)
  return Vector((.5,1.1,1.75))
 if sid=='03_clean':
  tray(-.05,.75,1.68,'200,999',9);tray(1.1,.75,1.68,'194,509',7,'white')
  for k in range(4):sheet(-.3+k*.37,.02,1.67+k*.004,.28,.45,'pink' if k%2 else 'gold',k*.12)
  return Vector((.50,.7,1.92))
 if sid=='06_hybrid':
  cube('Balance plinth',(.6,.9,1.72),(1.85,.8,.12),'navy');rod('Balance pillar',(.6,.9,1.75),(.6,.9,2.8),.065,'gold')
  rod('Balance crossbar',(-.4,.9,2.8),(1.6,.9,2.8),.045,'navy')
  for x,label,m in [(-.24,'A','pink'),(1.44,'B','blue')]:
   for dx in [-.23,.23]:rod('Scale suspension',(x,.9,2.8),(x+dx,.9,2.25),.012,'gold')
   cube('Scale pan',(x,.9,2.23),(.65,.6,.06),m);text(label,(x,.58,2.29),.28,'white')
  text('TOP 20%',(.6,.44,1.8),.17,'paper');center=Vector((.6,.9,2.37))
 elif sid=='07_expected':
  cube('Actual expected work card',(.55,.55,1.74),(1.8,1.2,.03),'paper')
  text('ACTUAL',(.10,.8,1.77),.13,'ink',True);text('EXPECTED',(1.0,.8,1.77),.13,'ink',True)
  for x,h,m in [(.10,.7,'teal'),(1.0,.46,'blue')]:cube('Runs comparison bar',(x,.15+h*.3,1.78),(.30,h,.025),m)
  text('ILLUSTRATIVE',(.55,.05,1.81),.085,'ink',True)
  center=Vector((.55,.55,1.75))
 elif sid=='08_adjust':
  for k,body in enumerate(['10','15','20']):
   cube('Declared assumption card',(-.15+k*.8,.7,1.74),(.65,.8,.04),'gold' if k==1 else 'paper');text(body,(-.15+k*.8,.74,1.77),.27,'ink',True)
  text('RUNS / WICKET',(.64,.3,1.78),.12,'ink',True);center=Vector((.65,.70,1.8))
 elif sid=='09_shrink':
  for x,n,m,label in [(-.05,2,'pink','25'),(1.15,12,'blue','400')]:
   for k in range(n):cube('Exposure evidence stack',(x,.8,1.70+k*.065),(.75,.75,.045),m,.008)
   text(label,(x,.405,1.72+n*.065),.28,'ink')
  rod('Average reference rail',(-.55,.9,2.8),(1.70,.9,2.8),.022,'gold')
  for x in [-.55,1.70]:rod('Reference rail stand',(x,.9,1.65),(x,.9,2.8),.022,'metal')
  for x,z in [(-.05,2.72),(1.15,2.5)]:sphere('Estimate position',(x,.80,z),.095,'gold')
  cube('Average reference label',(.52,.86,2.98),(.65,.035,.26),'paper',.008)
  text('MEAN',(.52,.83,2.92),.15,'ink');center=Vector((.55,.8,2.25))
 elif sid=='10_delta':
  for x,label in [(-.10,'QUALITY'),(1.1,'DELTA')]:
   cube('Separate research folder',(x,.7,1.73),(.94,1.10,.065),'teal' if x<0 else 'gold');text(label,(x,.9,1.78),.15,'ink',True)
   for k in range(3):sheet(x,.55,1.79+k*.012,.75,.6,angle=(k-1)*.08)
  center=Vector((.50,.70,1.8))
 elif sid=='11_holdout':
  cube('Desk calendar base',(.50,.75,1.8),(1.45,.8,.10),'navy');cube('Calendar upright page',(.50,.9,2.32),(1.40,.06,1.0),'paper')
  text('2026',(.50,.855,2.45),.35,'ink')
  for x in [-.04,.23,.5,.77,1.04]:
   for z in [2.05,2.23]:cube('Calendar day',(x,.85,z),(.17,.008,.11),'glass',.002)
  stroke('Holdout crossed seal',[(-.1,.82,2.64),(1.1,.82,1.96)],'red',.018);center=Vector((.50,.8,2.33))
  cube('First innings model audit printout',(1.65,.65,2.05),(1.04,.05,.76),'paper',.008)
  text('1ST INNINGS WP',(1.65,.61,2.28),.105,'ink')
  text('BRIER SCORE',(1.65,.61,2.11),.09,'ink')
  text('MODEL 0.2559',(1.65,.61,1.97),.085,'ink')
  text('BASE 0.2524',(1.65,.61,1.83),.085,'ink')
  rod('Audit printout stand',(1.65,.7,1.65),(1.65,.7,2.06),.018,'metal')
 elif sid=='12_uncertainty':
  tray(-.18,.65,1.68,'750 RESAMPLES',10)
  cube('Rank distribution printout',(1.15,.65,1.75),(1.15,1.4,.018),'paper')
  text('ILLUSTRATIVE',(1.15,1.15,1.78),.095,'ink',True)
  for k,h in enumerate([.12,.25,.52,.75,.65,.40,.20]):cube('Bootstrap rank histogram',(.70+k*.14,.10+h*.35,1.78),(.10,h,.025),'blue')
  center=Vector((.65,.6,1.85))
 elif sid=='13_sensitivity':
  for k in range(6):
   o=cube('Tipping shortlist card',(-.28+k*.32,.8,1.86),(.29,.10,.65),'paper');o.rotation_euler.y=(k-2)*.16
   sphere('Card pin',(-.28+k*.32,.72,2.0),.025,'red')
  for k,body in enumerate(['D10','D20','D25']):text(body,(-.1+k*.6,.1,1.76),.14,'ink',True)
  center=Vector((.6,.65,2.0))
 elif sid=='14_shortlist':
  # Real supplied shortlist names; no invented numerical performance ratings.
  for row,names in enumerate([['BUTTLER','ABHISHEK','POORAN'],['BUMRAH','NARINE','ABRAR']]):
   for k,name in enumerate(names):
    x=-.30+k*.83;y=.55+row*.90
    cube('Player selection card',(x,y,1.74),(.74,.81,.035),'paper');cube('Team card strip',(x,y+.29,1.77),(.69,.15,.012),'pink' if row==0 else 'blue')
    text(name,(x,y-.15,1.79),.103,'ink',True)
    sphere('Card portrait symbol',(x,y+.07,1.80),.09,'gold',(.75,1,.10))
  center=Vector((.6,1.0,1.8))
 elif sid=='15_replay':
  cube('Final research report',(.5,.65,1.77),(1.5,1.50,.065),'paper');text('KHILADI',(.5,1.1,1.81),.21,'ink',True)
  text('20 / 20',(.5,.65,1.81),.23,'teal',True);text('41 CHECKS',(.5,.25,1.81),.15,'ink',True)
  for k in range(4):stroke('Passed verification tick',[(1.37,.35+k*.25,1.81),(1.43,.29+k*.25,1.81),(1.58,.46+k*.25,1.81)],'teal',.014)
  center=Vector((.6,.65,1.8))
 return center

def stadium(sid):
 cube('Stadium grass',(0,4,-.1),(65,70,.20),'grass',.01)
 # Mown stripes and white boundary edge ground the stadium in physical depth.
 for k in range(12):cube('Mown grass stripe',(-27+k*5,6,.008),(2.5,64,.012),'green',0)
 cube('Clay cricket wicket',(0,3,.035),(2.8,18,.06),'pitch',.008)
 for y in [-3.0,9.0]:
  cube('Painted crease',(0,y,.075),(3.5,.05,.008),'paper',0)
  for x in [-.35,0,.35]:rod('Wooden wicket',(x,y+.4,.08),(x,y+.4,1.1),.035,'woodlight')
  rod('Bails',(-.4,y+.4,1.13),(.4,y+.4,1.13),.025,'woodlight')
 for tier in range(10):
  y=14+tier*.85;z=.4+tier*.5
  cube('Grandstand concrete tier',(0,y,z),(48,.90,.65),'floor',.008)
  for k in range(62):
   x=-23.5+k*.77;cube('Coloured stadium seat',(x,y,z+.49),(.55,.48,.19),['blue','pink','gold','teal'][(tier+k)%4],.035)
   if (k+tier)%3:
    sphere('Distant crowd spectator',(x,y,z+.88),.13,['paper','woodlight','gold'][(tier+k)%3]);cube('Distant crowd silhouette',(x,y,z+.63),(.25,.18,.30),'navy',.02)
 for x in [-7.5,7.5]:
  rod('Floodlight steel tower',(x,13,0),(x,13,13),.12,'metal');cube('Floodlight bank',(x,13,13),(3,.35,1.4),'navy')
  for k in range(8):cube('Warm floodlight lens',(x-1.18+(k%4)*.78,12.78,12.65+(k//4)*.70),(.55,.04,.40),'sky')
  light('Stadium floodlight',(x,9,12),(0,3,0),3200,5,(1,.78,.52))
 # The only scoreboard is naturally mounted in the grandstand.
 for x in [-2.5,3.5]:rod('Scoreboard girder',(x,13,0),(x,13,7.4),.12,'metal')
 cube('Stadium scoreboard',(.5,12.8,6.2),(6.3,.35,2.3),'navy')
 if sid=='04_preball':
  text('28 FROM 12',(.5,12.58,6.35),.68,'gold');text('ILLUSTRATIVE',(.5,12.57,5.70),.20,'paper')
 else:
  text('39 RPO',(.5,12.58,6.6),.61,'gold');text('2 OFF 1',(.5,12.58,5.80),.61,'paper')
 sphere('Cricket ball before delivery',(.9,-2.6,.20),.15,'red')
 stroke('Cricket ball seam',[(.78,-2.64,.27),(.84,-2.72,.32),(.97,-2.72,.30),(1.04,-2.63,.22)],'paper',.008)
 light('Pitch warm key',(-4,-5,8),(0,3,1),1800,5,(1,.67,.39));light('Cool stadium fill',(4,-4,6),(0,2,2),1000,6,(.40,.54,1))
 return Vector((.9,-2.6,.2))

def background_students():
 # Collection instances reuse the actual approved V3 geometry and skeleton.
 path=OUT/'khiladi-master-v3.blend'
 with bpy.data.libraries.load(str(path),link=False) as (a,b):
  b.objects=[n for n in a.objects if n.startswith(('Khiladi v3 | master rig','Head','Hair','Torso','Upper','Lower','Small foot','neutral |')) or 'arm' in n.lower() or 'leg' in n.lower() or 'hand' in n.lower()]
 col=bpy.data.collections.new('Approved V3 | distant classmates')
 for o in b.objects:
  if o is None:continue
  col.objects.link(o);o.animation_data_clear();o.hide_render=False
  if o.type=='ARMATURE':
   for pb in o.pose.bones:pb.rotation_mode='QUATERNION';pb.rotation_quaternion=(1,0,0,0);pb.location=(0,0,0)
 for x,y in [(-2.7,3.8),(2.8,3.9)]:
  inst=bpy.data.objects.new('Background classmate | approved V3',None);inst.instance_type='COLLECTION';inst.instance_collection=col;inst.location=(x,y,.65);inst.scale=(.48,.48,.48);S.collection.objects.link(inst)

def camera(name,p,target,lens=40):
 d=bpy.data.cameras.new(name);o=bpy.data.objects.new(name,d);S.collection.objects.link(o);d.type='PERSP';d.sensor_fit='VERTICAL';d.sensor_height=36;d.lens=lens
 o.location=p;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler();d.clip_end=160;return o

def build(shot):
 global S
 bpy.ops.wm.read_factory_settings(use_empty=True);CUBES.clear();SPHERES.clear();S=bpy.context.scene;make_materials()
 S.name=shot['id'];S.render.engine='BLENDER_EEVEE';S.eevee.taa_render_samples=16;S.eevee.use_raytracing=False
 S.eevee.taa_render_samples=16 if DRAFT else 24
 S.render.resolution_x=W;S.render.resolution_y=H;S.render.resolution_percentage=100;S.render.fps=30
 S.render.image_settings.file_format='PNG';S.render.image_settings.color_mode='RGB';S.render.film_transparent=False
 S.world=bpy.data.worlds.new('Warm ambient world');S.world.use_nodes=True
 S.world.node_tree.nodes['Background'].inputs[0].default_value=(.11,.15,.22,1) if shot['set']=='stadium' else (.42,.35,.25,1)
 S.world.node_tree.nodes['Background'].inputs[1].default_value=.20
 S.view_settings.view_transform='AgX'
 try:S.view_settings.look='AgX - Medium High Contrast'
 except TypeError:pass
 sid=shot['id']
 if shot['set']=='stadium':
  center=stadium(sid)
  cams=[camera('Wide pitch perspective',(6.5,-15,7.0),(.0,5,3.0),42),camera('Before ball detail',(2.6,-6.4,2.8),center,52),camera('Grandstand medium',(4,-11,5.8),(.5,10,5.0),48)]
  if sid=='05_pressure':cams[1]=camera('Pressure scoreboard detail',(6,-4,8),(.5,12.8,6.1),65)
 else:
  room(shot['set']=='classroom',shot['set']=='warroom')
  if shot['set']=='classroom':background_students()
  center=evidence_props(sid)
  # Wide and medium reserve the lower-left for the separate, fixed V3 hero.
  cams=[camera('Wide dimensional room',(5.5,-9.5,6.5),(.0,1.7,2.3),36),camera('Physical evidence closeup',(center.x+1.7,center.y-3.4,center.z+4.1),center,51),camera('Medium working desk',(3.2,-6.5,4.7),(.55,1.5,2.3),42)]
  if sid=='09_shrink':cams[1]=camera('Sample size comparison',(2.6,-3.2,3.9),center,52)
  if sid in ['06_hybrid','11_holdout','13_sensitivity']:cams[1]=camera('Evidence prop closeup',(2.6,-3.5,3.4),center,52)
  if sid=='16_end':
   # Close the loop with a real research report beside the old school notebook.
   cube('Bound final research report',(1.95,.05,1.74),(.85,1.05,.09),'paper')
   text('KHILADI',(1.95,.30,1.80),.13,'ink',True);text('EVIDENCE',(1.95,.03,1.80),.09,'teal',True)
 S['narration']=shot['narration'];S['source']='User supplied methodology; figures not recomputed';S['hero']='Separate fixed approved V3 RGBA acting layer'
 return cams

POSES=['reading','discovery','frustration','thinking','frustration','discovery','thinking','neutral','frustration','thinking','frustration','discovery','frustration','discovery','laugh','neutral']
def metadata():
 scenes=[]
 for idx,shot in enumerate(STORY):
  sid=shot['id'];n=TIMES[sid]['frames'];a=round(n*.32);b=round(n*.34);cuts=[]
  for cut,frames in enumerate([a,b,n-a-b]):
   cuts.append({'plate':str((REEL/'plates'/f'{sid}_{cut+1}.png').resolve()),'frames':frames,'loop':None if cut==1 else POSES[idx],
    'actor_x':60 if cut==0 else -25,'actor_y':820 if cut==0 else 650,'actor_width':None,'actor_height':900 if cut==0 else 1180,
    'actor_box':{'x':60 if cut==0 else -25,'y':820 if cut==0 else 650,'maxw':600 if cut==0 else 710,'maxh':900 if cut==0 else 1180},'foreground':None,'graphics':[]})
  scenes.append({'id':sid,'frames':n,'cuts':cuts})
 (REEL/'plates.json').write_text(json.dumps({'width':1080,'height':1920,'fps':30,'scenes':scenes},indent=2),encoding='utf8')

def main():
 if os.getenv('REEL_KEEP_METADATA')!='1':metadata()
 target=OUT/'khiladi-environments.blend';saved_ids=set()
 if not DRAFT and target.exists():
  with bpy.data.libraries.load(str(target),link=False) as (src,dst):saved_ids=set(src.scenes)
 for shot in STORY:
  sid=shot['id']
  if SELECT!=[''] and sid not in SELECT:continue
  paths=[FOLDER/f'{sid}_{c+1}.png' for c in range(3)]
  if all(p.exists() and p.stat().st_size>1000 for p in paths) and (DRAFT or sid in saved_ids) and os.getenv('REEL_FORCE')!='1':continue
  t=time.time();cams=build(shot)
  for cut,p in enumerate(paths):
   if p.exists() and os.getenv('REEL_FORCE')!='1':continue
   S.camera=cams[cut];S.render.filepath=str(p);bpy.ops.render.render(write_still=True)
   print('REEL_PLATE_READY',sid,cut+1,str(p),'seconds',round(time.time()-t,1),flush=True)
  if not DRAFT:
   # Store all three camera setups in editable native scenes in one blend.
   for c in S.collection.children:pass
   S.camera=cams[0]
   for cut,cam in enumerate(cams):S.timeline_markers.new('Cut '+str(cut+1),frame=1+cut*100).camera=cam
   # All scenes retained by linking each completed scene into the accumulated file.
   if target.exists():
    with bpy.data.libraries.load(str(target),link=False) as (src,dst):dst.scenes=[n for n in src.scenes if n!=sid]
   for saved_scene in bpy.data.scenes:saved_scene.use_fake_user=True
   # Blender forbids overwriting the file that was just used as an append library.
   # Save a new local file, then replace the final path after Blender releases it.
   staging=REEL/'plates'/'environments-staging.blend'
   bpy.ops.wm.save_as_mainfile(filepath=str(staging))
   os.replace(staging,target);saved_ids.add(sid)
  print('REEL_SCENE_COMPLETE',sid,flush=True)

if __name__=='__main__':main()
