"""Reference-constrained Khiladi v3 master and eight-second rig validation.
Modes: preview (default), sheet, motion; no film scenes are constructed.
"""
import bpy, bmesh, math, os, json, hashlib
from pathlib import Path
from mathutils import Vector, Quaternion
ROOT=Path(__file__).resolve().parent.parent; OUT=ROOT/'outputs'; WORK=ROOT/'work'
for p in [OUT,WORK/'v3_sheet',WORK/'v3_motion']:p.mkdir(parents=True,exist_ok=True)
MODE=os.getenv('KHILADI_V3_MODE','preview')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE' if bpy.app.version>=(5,0,0) else 'BLENDER_EEVEE_NEXT'
s.render.resolution_x=int(os.getenv('KHILADI_V3_WIDTH','540'));s.render.resolution_y=int(os.getenv('KHILADI_V3_HEIGHT','960'));s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.fps=30;s.frame_start=1;s.frame_end=240
s.eevee.taa_render_samples=int(os.getenv('KHILADI_V3_SAMPLES','24'));s.eevee.use_raytracing=False
s.view_settings.view_transform='Standard';s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.30,.265,.245,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.45

def mat(name,col,grain=0,emission=False):
 m=bpy.data.materials.new(name);m.diffuse_color=(*col,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*col,1);bs.inputs['Roughness'].default_value=.94;bs.inputs['Specular IOR Level'].default_value=.07
 if emission:bs.inputs['Emission Color'].default_value=(*col,1);bs.inputs['Emission Strength'].default_value=1
 if grain:
  ns=m.node_tree.nodes;lk=m.node_tree.links;n=ns.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=190;n.inputs['Detail'].default_value=2.2
  ramp=ns.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=(*(c*.88 for c in col),1);ramp.color_ramp.elements[1].color=(*(min(1,c*1.06) for c in col),1);lk.new(n.outputs['Fac'],ramp.inputs[0]);lk.new(ramp.outputs[0],bs.inputs['Base Color'])
  bump=ns.new('ShaderNodeBump');bump.inputs['Strength'].default_value=grain;bump.inputs['Distance'].default_value=.012;lk.new(n.outputs['Fac'],bump.inputs['Height']);lk.new(bump.outputs['Normal'],bs.inputs['Normal'])
 return m
INK=mat('Irregular ink',(.004,.002,.001),emission=True);HULL=INK.copy();HULL.name='Exterior ink backface';HULL.use_backface_culling=True
if hasattr(HULL,'use_backface_culling_shadow'):HULL.use_backface_culling_shadow=True
SKIN=mat('Warm peach | fine roughness',(.68,.30,.13),.13);WHITE=mat('Plain off-white bean',(.89,.87,.82),.12);HAIR=mat('Existing flat dark brown cap',(.045,.020,.012),.18);FLOOR=mat('Existing warm grey backdrop',(.36,.315,.29),.02);TEETH=mat('Ivory teeth',(.94,.91,.80),emission=True);PINK=mat('Tongue',(.74,.07,.13),emission=True);PAPER=mat('Notebook paper',(.78,.75,.66),.1);COVER=mat('Notebook grey cover',(.20,.18,.16),.1)

def zmap(z):
 return .077+(z-.077)*(.80 if z<.96 else 1)-(.1766 if z>=.96 else 0)
def ptmap(p):return (p[0],p[1],zmap(p[2]))

def mesh(name,verts,faces,material):
 me=bpy.data.meshes.new(name);me.from_pydata([ptmap(v) for v in verts],[],faces);me.update();o=bpy.data.objects.new(name,me);s.collection.objects.link(o);me.materials.append(material)
 bm=bmesh.new();bm.from_mesh(me);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.normal_update()
 if name.startswith(('Head','Hair','Torso')):
  center=Vector((0,0,zmap(1.455 if name.startswith('Torso') else 2.67)))
  if sum(f.normal.dot(f.calc_center_median()-center) for f in bm.faces)<0:bmesh.ops.reverse_faces(bm,faces=list(bm.faces))
 bm.normal_update();bm.to_mesh(me);bm.free()
 for p in me.polygons:p.use_smooth=True
 return o

def sphere(name,loc,scale,material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=48,ring_count=32,location=ptmap(loc));o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 for p in o.data.polygons:p.use_smooth=True
 return o

def curve(name,points,radius=.014,material=INK,radii=None):
 d=bpy.data.curves.new(name,'CURVE');d.dimensions='3D';d.resolution_u=5;d.bevel_depth=radius;d.bevel_resolution=2;sp=d.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
 for i,(p,co) in enumerate(zip(sp.bezier_points,points)):
  p.co=ptmap(co);p.handle_left_type='AUTO';p.handle_right_type='AUTO';p.radius=(radii[i] if radii else [1,.77,1.08,.88,1.02][i%5])
 o=bpy.data.objects.new(name,d);s.collection.objects.link(o);d.materials.append(material);return o

def shell(o,width):
 h=o.copy();h.data=o.data.copy();h.name=o.name+' | contour';s.collection.objects.link(h);h.data.materials.clear();h.data.materials.append(HULL)
 if hasattr(h,'visible_shadow'):h.visible_shadow=False
 bm=bmesh.new();bm.from_mesh(h.data);bm.normal_update()
 if o.name.startswith(('Head','Hair','Torso')):
  center=Vector((0,0,zmap(1.455 if o.name.startswith('Torso') else 2.67)))
  if sum(f.normal.dot(f.calc_center_median()-center) for f in bm.faces)<0:bmesh.ops.reverse_faces(bm,faces=list(bm.faces));bm.normal_update()
 for v in bm.verts:v.co+=v.normal*width
 bmesh.ops.reverse_faces(bm,faces=list(bm.faces));bm.to_mesh(h.data);bm.free();return h

wbs=WHITE.node_tree.nodes.get('Principled BSDF');wbs.inputs['Emission Color'].default_value=(.89,.87,.82,1);wbs.inputs['Emission Strength'].default_value=.18

# Skeleton is fixed. All body meshes stay rigidly attached to it.
ad=bpy.data.armatures.new('Khiladi v3 | fixed eleven bone skeleton');rig=bpy.data.objects.new('Khiladi v3 | master rig',ad);s.collection.objects.link(rig);bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT');bones={}
def bone(name,head,tail,parent=None):
 b=ad.edit_bones.new(name);b.head=ptmap(head);b.tail=ptmap(tail)
 if parent:b.parent=bones[parent]
 bones[name]=b
bone('root',(0,0,.10),(0,0,.35));bone('body',(0,0,.88),(0,0,1.98),'root');bone('head',(0,0,1.98),(0,0,2.90),'body')
for side,sgn in [('L',-1),('R',1)]:
 bone('upper_arm.'+side,(sgn*.25,0,1.91),(sgn*.58,-.02,1.50),'body');bone('forearm.'+side,(sgn*.58,-.02,1.50),(sgn*.57,-.09,1.07),'upper_arm.'+side)
 bone('thigh.'+side,(sgn*.245,0,.96),(sgn*.255,-.01,.54),'root');bone('shin.'+side,(sgn*.255,-.01,.54),(sgn*.265,-.02,.14),'thigh.'+side)
bpy.ops.object.mode_set(mode='OBJECT');bpy.context.view_layer.update();rig.show_in_front=True

def attach(o,b):
 bpy.context.view_layer.update();world=o.matrix_world.copy();o.parent=rig;o.parent_type='BONE';o.parent_bone=b;o.matrix_world=world;return o
base=[]
def baseobj(o,b,outline=None):
 base.append(o)
 if outline:
  h=shell(o,outline);base.append(h);attach(h,b)
 attach(o,b);return o

# Compact v2 silhouette, with a small persistent asymmetry (not changing by view).
verts=[];faces=[];nu=64;nv=40
for j in range(nv+1):
 t=math.pi*j/nv
 for i in range(nu):
  p=2*math.pi*i/nu;irreg=1+.010*math.sin(3*p+.4)*math.sin(t)**2+.007*math.cos(5*t+p)
  verts.append((.83*math.sin(t)*math.cos(p)*irreg,.52*math.sin(t)*math.sin(p)*irreg,2.67+.79*math.cos(t)*(1+.007*math.sin(3*p))))
for j in range(nv):
 for i in range(nu):
  a=j*nu+i;b=j*nu+(i+1)%nu;faces.append((a,a+nu,b+nu,b))
head=baseobj(mesh('Head | v2 volume with uneven contour',verts,faces,SKIN),'head',.029)
verts=[];faces=[];nu=56;nv=36
for j in range(nv+1):
 t=math.pi*j/nv;wid=1-.12*math.cos(t)
 for i in range(nu):
  p=2*math.pi*i/nu;v=1+.014*math.sin(p*3+.5)*math.sin(t)
  verts.append((.505*math.sin(t)*math.cos(p)*wid*v,.285*math.sin(t)*math.sin(p),1.455+.52*math.cos(t)))
for j in range(nv):
 for i in range(nu):
  a=j*nu+i;b=j*nu+(i+1)%nu;faces.append((a,a+nu,b+nu,b))
body=baseobj(mesh('Torso | plain compact white bean',verts,faces,WHITE),'body',.027)
# Hair cap stays the existing dark, shallow, simple patch, not a new hairstyle.
verts=[];faces=[];nu=64;nv=22
for j in range(nv+1):
 for i in range(nu):
  p=2*math.pi*i/nu;front=(1-math.sin(p))/2;limit=1.63-.61*front+.024*math.sin(p*7+.3)+.012*math.sin(p*13);t=limit*j/nv
  verts.append((.843*math.sin(t)*math.cos(p),.533*math.sin(t)*math.sin(p),2.67+.802*math.cos(t)))
for j in range(nv):
 for i in range(nu):
  a=j*nu+i;b=j*nu+(i+1)%nu;faces.append((a,a+nu,b+nu,b))
baseobj(mesh('Hair | unchanged dark flat cap',verts,faces,HAIR),'head',.014)
for side,sgn in [('L',-1),('R',1)]:
 baseobj(curve('Upper thin arm.'+side,[(sgn*.25,0,1.91),(sgn*.51,-.025,1.70),(sgn*.58,-.02,1.50)],.014),'upper_arm.'+side)
 baseobj(sphere('Elbow.'+side,(sgn*.58,-.02,1.50),(.016,.017,.016),INK),'forearm.'+side)
 baseobj(curve('Lower thin arm.'+side,[(sgn*.58,-.02,1.50),(sgn*.588,-.065,1.29),(sgn*.57,-.09,1.07)],.014),'forearm.'+side)
 baseobj(sphere('Small hand.'+side,(sgn*.57,-.09,1.07),(.055,.045,.057),INK),'forearm.'+side)
 baseobj(curve('Upper thin leg.'+side,[(sgn*.245,0,1.06),(sgn*.26,-.004,.73),(sgn*.255,-.01,.54)],.017),'thigh.'+side)
 baseobj(curve('Lower thin leg.'+side,[(sgn*.255,-.01,.54),(sgn*.26,-.018,.33),(sgn*.265,-.02,.14)],.017),'shin.'+side)
 baseobj(sphere('Small foot.'+side,(sgn*.265,-.055,.12),(.10,.11,.035),INK),'shin.'+side)

# Facial drawing lies ON the 3D ellipsoid and foreshortens under real rotation.
def fp(x,z,off=.021):
 r=max(.018,1-(x/.83)**2-((z-2.67)/.79)**2);return (x,-.52*math.sqrt(r)-off,z)
facesets={};brows={}
def expression(name):
 group=[]
 def stroke(label,coords,r=.013,radii=None):
  o=attach(curve(name+' | '+label,[fp(x,z) for x,z in coords],r,radii=radii),'head');group.append(o)
  if name in ['angry','laugh'] and 'eye' in label:
   for point in o.data.splines[0].bezier_points:point.handle_left_type='VECTOR';point.handle_right_type='VECTOR'
  if 'brow' in label:brows.setdefault(name,[]).append(o)
  return o
 def dot(label,x,z,rx=.033,rz=.035):
  o=attach(sphere(name+' | '+label,fp(x,z,.029),(rx,.020,rz),INK),'head');group.append(o)
 def patch(label,coords,m,off=.033):
  o=attach(mesh(name+' | '+label,[fp(x,z,off) for x,z in coords],[tuple(range(len(coords)))],m),'head');group.append(o)
 if name=='neutral':
  stroke('left brow',[(-.39,2.97),(-.30,2.982),(-.21,2.97)],.010,[.6,1.1,.5]);stroke('right brow',[(.15,3.005),(.25,3.035),(.37,3.065)],.010,[.6,1,.5])
  stroke('left lid',[(-.39,2.88),(-.28,2.873),(-.15,2.865)],.014,[.6,1.1,.7]);stroke('right lid',[(.12,2.875),(.25,2.90),(.39,2.895)],.013,[.7,1.1,.5]);dot('left pupil',-.255,2.853,.027,.033);dot('right pupil',.277,2.85,.029,.031)
  stroke('crooked mouth',[(-.105,2.455),(-.012,2.48),(.095,2.48),(.125,2.51)],.014,[.4,.9,1.1,.5])
 elif name=='angry':
  stroke('left brow',[(-.43,3.02),(-.30,2.99),(-.13,2.92)],.021,[.5,1.15,.65]);stroke('right brow',[(.12,2.96),(.27,3.01),(.43,3.07)],.018,[.7,1.2,.4])
  stroke('left squeezed eye',[(-.39,2.90),(-.14,2.82),(-.32,2.74)],.016,[.5,1.2,.45]);stroke('right squeezed eye',[(.37,2.92),(.15,2.825),(.39,2.77)],.014,[.5,1.2,.65])
  patch('shout mouth',[(-.21,2.47),(-.20,2.55),(-.11,2.60),(.03,2.58),(.16,2.53),(.20,2.43),(.13,2.36),(-.10,2.385)],INK)
  patch('irregular teeth',[(-.16,2.42),(-.09,2.45),(.02,2.43),(.14,2.445),(.13,2.395),(-.13,2.405)],TEETH,.052)
  stroke('left eye rough under-stroke',[(-.37,2.89),(-.18,2.82),(-.29,2.765)],.006,[.25,.8,.3]);stroke('right eye rough under-stroke',[(.34,2.905),(.18,2.83),(.35,2.785)],.006,[.25,.9,.4])
  stroke('scribble anger fold',[(-.13,2.58),(-.06,2.61),(.04,2.595),(.12,2.55)],.009)
 elif name=='confused':
  stroke('left brow',[(-.40,2.99),(-.27,3.012),(-.14,2.99)],.011,[.5,1.2,.6]);stroke('right brow',[(.15,3.005),(.19,3.065),(.27,3.08),(.36,3.025)],.013,[.5,1,.9,.5])
  stroke('left lid',[(-.37,2.90),(-.25,2.915),(-.12,2.90)],.014);dot('left pupil',-.24,2.865,.028,.031);dot('right wondering eye',.28,2.91,.023,.041)
  stroke('zigzag mouth',[(-.14,2.48),(-.06,2.515),(.025,2.46),(.08,2.50),(.135,2.56)],.014,[.5,1.05,.8,1,.5])
 elif name=='laugh':
  stroke('left brow',[(-.41,3.01),(-.33,3.08),(-.25,3.045),(-.20,2.99)],.013,[.5,1.1,.85,.4]);stroke('right brow',[(.15,3.00),(.27,3.045),(.37,3.075)],.011,[.5,1,.5])
  stroke('left laughing eye',[(-.41,2.95),(-.14,2.84),(-.37,2.77)],.017,[.45,1.15,.55]);stroke('right laughing eye',[(.39,2.99),(.15,2.86),(.37,2.78)],.015,[.45,1.1,.6])
  stroke('left eye brush fragment',[(-.38,2.93),(-.18,2.84)],.006,[.3,.8]);stroke('right eye brush fragment',[(.355,2.965),(.18,2.86)],.005,[.4,.8])
  patch('wide laughing mouth',[(-.28,2.60),(-.14,2.57),(.03,2.59),(.26,2.63),(.24,2.48),(.13,2.34),(-.02,2.31),(-.17,2.36),(-.25,2.48)],INK)
  patch('uneven top teeth',[(-.23,2.575),(-.10,2.55),(.06,2.57),(.22,2.60),(.205,2.54),(.05,2.51),(-.17,2.52)],TEETH,.052)
  patch('tongue',[(-.12,2.36),(-.10,2.42),(-.035,2.46),(.045,2.45),(.12,2.40),(.14,2.365),(.02,2.34)],PINK,.057)
 else:
  stroke('left brow',[(-.40,3.005),(-.32,3.065),(-.20,3.035)],.013);stroke('right brow',[(.17,3.045),(.26,3.09),(.38,3.035)],.012)
  for label,cx,zz,rx,rz in [('left',-.25,2.88,.095,.125),('right',.27,2.91,.088,.13)]:
   coords=[(cx+rx*math.cos(i*2*math.pi/24),zz+rz*math.sin(i*2*math.pi/24)) for i in range(25)];patch(label+' eye white',coords[:-1],TEETH,.030);stroke(label+' eye outline',coords,.011);dot(label+' tiny pupil',cx+.012,zz-.02,.022,.035)
  coords=[(.064*math.cos(i*2*math.pi/24),2.45+.09*math.sin(i*2*math.pi/24)) for i in range(24)];patch('realization o mouth',coords,INK,.035)
 stroke('small broken nose',[(-.005,2.76),(-.03,2.71),(.008,2.705)],.009,[.4,1,.5]);facesets[name]=group
for name in ['neutral','angry','confused','laugh','realization']:expression(name)

def show(name,frame=None):
 for label,objects in facesets.items():
  for o in objects:
   o.hide_render=label!=name;o.hide_viewport=label!=name
   if frame is not None:o.keyframe_insert('hide_render',frame=frame);o.keyframe_insert('hide_viewport',frame=frame)

# Notebook exists only during the animation, held to the same forearm bone.
props=[]
def box(name,loc,dims,material,bevel=.006):
 bpy.ops.mesh.primitive_cube_add(size=1,location=ptmap(loc));o=bpy.context.object;o.name=name;o.dimensions=dims;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(material)
 mod=o.modifiers.new('Subtle notebook edge','BEVEL');mod.width=bevel;mod.segments=2;props.append(attach(o,'forearm.L'));return o
box('Notebook | paper block',(-.40,-.29,1.23),(.38,.075,.32),PAPER);box('Notebook | grey back',(-.40,-.245,1.23),(.40,.012,.34),COVER);box('Notebook | exposed page',(-.40,-.335,1.23),(.355,.008,.295),PAPER)
for k in range(5):
 o=curve('Notebook | imperfect writing '+str(k),[(-.54,-.342,1.33-k*.041),(-.44,-.344,1.335-k*.041),(-.32+(k%2)*.028,-.342,1.331-k*.041)],.003);props.append(attach(o,'forearm.L'))

profile=[(-100,.077),(4,.077)]+[(4+3*math.sin(i*math.pi/32),.077+3*(1-math.cos(i*math.pi/32))) for i in range(1,17)]+[(7,20)]
cv=[(x,y,z) for y,z in profile for x in [-100,100]];cf=[(i*2,i*2+1,i*2+3,i*2+2) for i in range(len(profile)-1)]
# mesh() maps character Z, while the studio needs literal continuous coordinates.
floor=mesh('Unchanged warm grey continuous cyclorama',[(x,y,z+.1766 if z>=.96 else .077+(z-.077)/.80) for x,y,z in cv],cf,FLOOR)
def light(name,loc,energy,size,col):
 d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;d.color=col;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=loc;o.rotation_euler=(Vector((0,0,1.7))-o.location).to_track_quat('-Z','Y').to_euler()
light('Directional upper-left key',(-3.5,-4.2,6),420,3.0,(1,.82,.64));light('Dim neutral fill',(3,-3,3.8),90,4,(.86,.9,1));light('Low front soft body fill',(0,-4.5,1.45),35,3.5,(.97,.95,1));light('Soft contour rim',(1,2,5),130,3,(1,.87,.74))
cd=bpy.data.cameras.new('Validation perspective camera');cam=bpy.data.objects.new('Validation perspective camera',cd);s.collection.objects.link(cam);s.camera=cam;cd.type='PERSP';cd.lens=65;cd.sensor_fit='VERTICAL';cd.sensor_height=33
cam.location=(0,-8.2,2.65);target=Vector((0,0,1.66));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()

def rotate(name,x=0,y=0,z=0):
 pb=rig.pose.bones[name];basis=rig.data.bones[name].matrix_local.to_3x3().inverted();pb.rotation_mode='QUATERNION';q=Quaternion()
 for axis,angle in [(Vector((1,0,0)),x),(Vector((0,1,0)),y),(Vector((0,0,1)),z)]:q=Quaternion(basis@axis,math.radians(angle))@q
 pb.rotation_quaternion=q

def pose(frame,hx=0,hy=0,hz=0,ar=0,fr=0,al=0,fl=0,bob=0):
 rotate('head',hx,hy,hz);rotate('upper_arm.R',0,ar);rotate('forearm.R',0,fr);rotate('upper_arm.L',0,al);rotate('forearm.L',0,fl);rig.pose.bones['body'].location=(0,bob,0)
 for name in ['head','upper_arm.R','forearm.R','upper_arm.L','forearm.L']:
  rig.pose.bones[name].keyframe_insert('rotation_quaternion',frame=frame)
 rig.pose.bones['body'].keyframe_insert('location',frame=frame)

# Anticipation/overshoot keys, purposeful short holds, irregular comedic timing.
keys=[(1,22,1,-12,0,0,0,0,0),(40,24,1,-14,0,0,0,0,0),(58,24,1,-14,0,0,0,0,0),(61,25,-1,-12,0,0,0,0,-.015),(65,-7,-3,20,-8,8,4,-6,.035),(71,-2,1,14,-3,3,2,-3,.012),(87,-2,1,14,-3,3,2,-3,.012),(91,2,-8,-7,-65,68,30,-25,.02),(98,-4,9,8,-83,100,40,-36,.01),(107,2,-7,-9,-66,67,28,-20,.015),(117,-2,8,10,-85,90,43,-35,.025),(128,3,-6,-6,-66,63,31,-22,.005),(142,0,4,4,-76,83,36,-30,.01),(150,1,2,2,-65,75,25,-20,.01),(154,-10,-5,9,-45,20,30,-20,.035),(160,-17,4,13,-53,29,35,-25,.012),(167,-4,-4,4,-39,15,27,-16,.035),(174,-15,5,12,-54,33,37,-27,.01),(182,-3,-3,4,-40,19,28,-19,.035),(190,-13,5,13,-51,32,35,-28,.01),(199,-4,-4,5,-38,17,27,-18,.03),(207,-12,3,9,-49,28,34,-25,.012),(211,1,-2,2,-15,10,7,-6,0),(218,7,1,-6,0,0,0,0,0),(221,7,1,-6,0,0,0,0,0),(234,7,1,-6,0,0,0,0,0),(237,5,2,0,0,0,0,0,0),(240,5,2,0,0,0,0,0,0)]
for k in keys:pose(*k)
# Pupils look down-left at the notebook only during the opening hold.
for eye in [o for o in facesets['neutral'] if 'pupil' in o.name]:
 axis=rig.data.bones['head'].matrix_local.to_3x3().inverted()@Vector((-.008,0,-.022))
 for f,value in [(1,axis),(60,axis),(65,Vector((0,0,0))),(240,Vector((0,0,0)))]:
  eye.delta_location=value;eye.keyframe_insert('delta_location',frame=f)
for name,f in [('neutral',1),('realization',61),('angry',91),('laugh',151),('neutral',211)]:show(name,f)
# Deform actual eyebrow drawing controls during frustration, while base meshes stay fixed.
for o in brows['angry']:
 for idx,p in enumerate(o.data.splines[0].bezier_points):
  baseco=p.co.copy()
  for f,delta in [(90,0),(97,.027),(109,-.012),(121,.035),(135,-.008),(150,0)]:
   p.co=baseco+Vector((0,0,delta*(1 if idx%2 else -.55)));p.keyframe_insert('co',frame=f)
  p.co=baseco
for frame,pos in [(1,Vector((.035,-8.25,2.65))),(240,Vector((-.045,-8.08,2.65)))]:
 cam.location=pos;cam.rotation_euler=(target-pos).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=frame);cam.keyframe_insert('rotation_euler',frame=frame)
# Transform interpolation is quick and controlled, with deliberate held intervals.
if rig.animation_data and rig.animation_data.action:
 try:
  for fc in rig.animation_data.action.fcurves:
   for p in fc.keyframe_points:p.interpolation='LINEAR'
 except AttributeError:pass
s['test_timeline']='0-2 notebook /2-3 realization /3-5 frustration /5-7 laugh /7-8 neutral pause'
s['master_status']='V3 refinement candidate. Full film prohibited until this 8-second test is reviewed.'
rig['silhouette_lock']='Reference v2 silhouette retained: head1.66x1.58, torso1.02x1.04, visible legs0.64; plain white bean, same dark flat cap.'

# A small jaw pulse makes laughter a performance rather than a static expression.
for o in facesets['laugh']:
 if o.type=='MESH' and any(label in o.name for label in ['wide laughing mouth','uneven top teeth','tongue']):
  o.shape_key_add(name='Basis');key=o.shape_key_add(name='Laugh jaw compression')
  center=zmap(2.48)
  for vertex in key.data:vertex.co.z=center+(vertex.co.z-center)*.78
  for f,value in [(1,0),(150,0),(154,.16),(160,0),(167,.35),(174,0),(182,.28),(190,0),(199,.32),(207,0),(211,0),(240,0)]:
   key.value=value;key.keyframe_insert('value',frame=f)

# Capture reusable base geometry audit separately from allowed face deformation.
def fingerprint():
 h=hashlib.sha256()
 for o in sorted(base,key=lambda x:x.name):
  h.update(o.name.encode())
  if o.type=='MESH':
   for v in o.data.vertices:h.update((','.join(f'{a:.7f}' for a in v.co)).encode())
  else:
   for sp in o.data.splines:
    for p in sp.bezier_points:h.update((','.join(f'{a:.7f}' for a in p.co)).encode())
 return h.hexdigest()
checks={};bonelengths={b.name:round(b.length,7) for b in rig.data.bones}
for f in [1,60,90,150,210,240]:s.frame_set(f);checks[str(f)]=fingerprint()
(OUT/'character-v3-audit.json').write_text(json.dumps({'base_geometry_hashes':checks,'fixed_base_geometry':len(set(checks.values()))==1,'bone_lengths':bonelengths,'bone_count':len(bonelengths),'proportions':{'head_width':1.66,'head_height':1.58,'torso_width':1.02,'torso_height':1.04,'visible_leg_height':.64,'leg_to_head_height':.405,'torso_to_head_height':.658},'allowed_face_animation':'Expression visibility, facial stroke points and brow controls intentionally change. Base head/body/hair/limbs remain fixed.','fps':30,'frames':240,'seconds':8,'software':bpy.app.version_string},indent=2))
# Open the editable master in material camera view; Solid view ignores hull culling.
for screen in bpy.data.screens:
 for area in screen.areas:
  if area.type=='VIEW_3D':
   space=area.spaces.active;space.shading.type='MATERIAL';space.shading.use_scene_lights=True;space.shading.use_scene_world=True
   space.overlay.show_overlays=False
   if space.region_3d:space.region_3d.view_perspective='CAMERA'
   if hasattr(space,'camera'):space.camera=cam

(OUT/'build_character_v3.py').write_text(Path(__file__).read_text(encoding='utf-8'),encoding='utf-8')
s.frame_set(1);show('neutral');bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi-master-v3.blend'))

def render(path):
 s.render.filepath=str(path);bpy.ops.render.render(write_still=True);print('V3_RENDER_READY',path,flush=True)
if MODE=='motion_preview':
 folder=WORK/'v3_motion_preview';folder.mkdir(exist_ok=True)
 for o in props:o.hide_render=False
 for f in [45,70,107,164,231]:
  s.frame_set(f);bpy.context.view_layer.update();render(folder/f'frame_{f:04d}.png')
elif MODE=='motion':
 for o in props:o.hide_render=False
 s.frame_set(1);s.render.filepath=str(WORK/'v3_motion'/'frame_');bpy.ops.render.render(animation=True)
elif MODE=='sheet':
 # Sheet poses use the exact same saved base geometry with facial states selected.
 rig.animation_data_clear();cam.animation_data_clear();cam.data.animation_data_clear()
 for o in props:o.hide_render=True
 for group in facesets.values():
  for o in group:o.animation_data_clear()
 for label,expression_name,angle in [('front','neutral',0),('three_quarter','neutral',43),('angry','angry',0),('confused','confused',0),('laugh','laugh',0)]:
  for pb in rig.pose.bones:pb.rotation_quaternion=Quaternion();pb.location=(0,0,0)
  rotate('root',0,0,angle);show(expression_name);bpy.context.view_layer.update();render(WORK/'v3_sheet'/(label+'.png'))
else:
 # Front and genuine three-quarter proof before committing a motion batch.
 for o in props:o.hide_render=True
 rig.animation_data_clear()
 for pb in rig.pose.bones:pb.rotation_quaternion=Quaternion();pb.location=(0,0,0)
 show('neutral');render(WORK/'v3_sheet'/'preview_front.png');rotate('root',0,0,43);bpy.context.view_layer.update();render(WORK/'v3_sheet'/'preview_three_quarter.png')
print('V3_MODE_COMPLETE',MODE,flush=True)
