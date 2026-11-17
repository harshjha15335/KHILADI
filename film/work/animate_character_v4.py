"""V4 acting pass: loads the provisionally approved V3 asset; never rebuilds it."""
import bpy, os, math, json, hashlib
from pathlib import Path
from mathutils import Vector, Quaternion, Matrix
from bpy_extras.object_utils import world_to_camera_view
ROOT=Path(__file__).resolve().parent.parent;WORK=ROOT/'work';OUT=ROOT/'outputs'
MODE=os.getenv('KHILADI_V4_MODE','draft')
for p in [WORK/'v4_draft',WORK/'v4_motion',WORK/'v4_stills',OUT]:p.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(OUT/'khiladi-master-v3.blend'))
s=bpy.context.scene;s.frame_set(1);bpy.context.view_layer.update()
rig=bpy.data.objects['Khiladi v3 | master rig'];cam=s.camera

def actor(o):
 p=o
 while p.parent:p=p.parent
 return p==rig
actors=[o for o in s.objects if actor(o) and o.type in ['MESH','CURVE']]

def fingerprint():
 h=hashlib.sha256()
 for o in sorted(actors,key=lambda x:x.name):
  h.update(o.name.encode());h.update(o.type.encode())
  if o.type=='MESH':
   for v in o.data.vertices:h.update((','.join(f'{x:.7f}' for x in v.co)).encode())
  else:
   for sp in o.data.splines:
    for p in sp.bezier_points:
     h.update((','.join(f'{x:.7f}' for x in p.co)).encode());h.update(str(round(p.radius,7)).encode())
 return h.hexdigest()
baseline_hash=fingerprint();materials={o.name:[m.name for m in o.data.materials] for o in actors};bones_before={b.name:b.length for b in rig.data.bones}
# Keep actual rest data intact, remove the restrained V3 performance only.
rig.animation_data_clear();cam.animation_data_clear();cam.data.animation_data_clear()
for p in rig.pose.bones:
 p.location=(0,0,0);p.rotation_mode='QUATERNION';p.rotation_quaternion=Quaternion();p.scale=(1,1,1)
for o in actors:
 o.animation_data_clear();o.delta_location=(0,0,0)
 if o.type=='CURVE':o.data.animation_data_clear()
 if o.type=='MESH' and o.data.shape_keys:
  o.data.shape_keys.animation_data_clear()
  for k in o.data.shape_keys.key_blocks:
   if k.name!='Basis':k.value=0
# Torso squash is not inherited by the head/hair/face or the arm lengths.
for name in ['head','upper_arm.L','upper_arm.R']:rig.data.bones[name].inherit_scale='NONE'
for name in ['forearm.L','forearm.R']:rig.data.bones[name].inherit_scale='NONE'

faces={name:[o for o in actors if o.name.startswith(name+' | ')] for name in ['neutral','confused','realization','angry','laugh']}

def show(name,frame):
 for label,objs in faces.items():
  for o in objs:
   o.hide_render=label!=name;o.hide_viewport=label!=name;o.keyframe_insert('hide_render',frame=frame);o.keyframe_insert('hide_viewport',frame=frame)
for name,f in [('neutral',1),('confused',43),('neutral',55),('realization',61),('angry',91),('laugh',151),('realization',211),('neutral',216)]:show(name,f)

def rotate(name,x=0,y=0,z=0):
 pb=rig.pose.bones[name];basis=rig.data.bones[name].matrix_local.to_3x3().inverted();q=Quaternion()
 for axis,angle in [(Vector((1,0,0)),x),(Vector((0,1,0)),y),(Vector((0,0,1)),z)]:q=Quaternion(basis@axis,math.radians(angle))@q
 pb.rotation_quaternion=q

def locworld(name,delta):rig.pose.bones[name].location=rig.data.bones[name].matrix_local.to_3x3().inverted()@Vector(delta)

# Key tuple: root x,y,z; torso pitch/roll/yaw; head pitch/roll/yaw;
# upper R(y,x), fore R(y,x), upper L(y,x), fore L(y,x); vertical squash.
K=[
 (1,0,0,-.025, 3,0,0, 20,0,-13, -2,-4,4,-2, 8,-5,-12,-3, .995),
 (18,-.025,-.005,-.034, 5,-3,-2, 25,-4,-19, -6,-7,9,0, 18,-8,-26,-7,.985),
 (30,.020,0,-.018, 2,2,1, 18,3,-7, 1,-3,2,0, 12,-5,-18,-4,1.01),
 (40,.025,0,-.028, 4,3,0, 25,4,-15, 3,-4,6,1, 19,-8,-28,-7,.99),
 (49,-.035,.005,-.030, 1,-4,-2, 10,-6,16, -8,-4,12,-2, 10,-4,-8,-3,.995),
 (57,-.025,0,-.046, 7,-3,0, 27,-4,-19, 3,-3,3,0, 15,-8,-23,-6,.975),
 (61,-.018,-.015,-.070, 12,-2,0, 31,0,-18, 7,0,-2,-4, 12,-9,-17,-5,.955),
 (65,.055,.095,-.010, -13,5,0, -22,-7,24, -66,-16,43,-14, 36,-13,-22,-8,1.035),
 (70,.025,.055,-.025, -8,2,0, -13,-3,17, -53,-12,31,-10, 29,-10,-17,-6,1.015),
 (83,.025,.055,-.025, -8,2,0, -13,-3,17, -53,-12,31,-10, 29,-10,-17,-6,1.015),
 (88,-.040,-.020,-.078, 15,-8,-3, 26,-12,-27, 7,-8,30,-18, 23,-10,-24,-8,.95),
 (94,.055,-.025,-.055, 12,7,2, 14,10,28, -96,-20,78,-18, 26,-15,-28,-10,.965),
 (101,-.060,-.030,-.080, 17,-8,-3, 18,-10,-28, 18,-18,38,-18, 14,-12,-21,-9,.95),
 (108,.060,.005,-.045, 5,8,2, -2,12,30, -94,-22,94,-20, 31,-13,-25,-8,.99),
 (118,-.055,-.025,-.073, 15,-7,-3, 23,-10,-24, 17,-19,42,-20, 17,-14,-24,-10,.955),
 (129,.060,-.005,-.045, 7,8,2, 0,12,31, -102,-23,81,-15, 32,-13,-28,-7,.985),
 (140,-.055,-.030,-.075, 16,-8,-3, 20,-12,-30, 14,-18,44,-17, 17,-15,-21,-9,.955),
 (149,-.010,-.010,-.070, 11,-4,0, 17,-5,-17, -29,-12,36,-8, 18,-10,-21,-5,.965),
 (154,.050,.020,-.025, -6,7,0, -25,-8,19, -81,-18,20,-12, 44,-17,-35,-10,1.035),
 (160,-.045,-.015,-.083, 8,-7,-2, 7,9,-18, -43,-11,64,-19, 18,-8,-10,-5,.945),
 (167,.045,.020,-.025, -7,7,1, -26,-9,21, -86,-20,24,-10, 48,-16,-37,-9,1.035),
 (174,-.045,-.015,-.080, 7,-6,-2, 7,9,-20, -42,-10,62,-19, 19,-8,-12,-5,.95),
 (181,.050,.020,-.022, -6,8,1, -27,-8,20, -89,-19,20,-10, 45,-16,-34,-10,1.04),
 (188,-.045,-.015,-.082, 8,-7,-2, 8,10,-19, -43,-10,63,-18, 19,-8,-11,-5,.945),
 (196,.048,.020,-.025, -6,7,1, -25,-8,23, -84,-20,22,-10, 46,-17,-35,-9,1.035),
 (203,-.042,-.015,-.080, 7,-6,-2, 6,9,-18, -45,-11,65,-18, 20,-8,-12,-5,.95),
 (209,.028,.012,-.033, -4,5,0, -20,-5,15, -75,-15,31,-10, 38,-12,-29,-8,1.02),
 (212,-.045,.020,-.065, 6,-7,-2, -2,-10,31, -74,-13,29,-9, 37,-11,-28,-7,.97),
 (218,-.015,.006,-.035, 1,-3,0, 2,-8,19, -45,-10,42,-8, 29,-8,-18,-6,.995),
 (224,-.015,0,-.027, 1,-2,0, 2,-7,17, 4,-3,-4,1, 6,-3,-6,-1,1.005),
 (229,-.015,0,-.030, 1,-2,0, 2,-7,17, -8,-4,11,-2, 12,-5,-17,-4,.995),
 (234,-.015,0,-.030, 1,-2,0, 2,-7,17, -2,-3,3,0, 8,-4,-11,-2,1),
 (240,-.015,0,-.030, 1,-2,0, 2,-7,17, -2,-3,3,0, 8,-4,-11,-2,1),
]

def sample(frame):
 for a,b in zip(K,K[1:]):
  if a[0]<=frame<=b[0]:
   t=(frame-a[0])/(b[0]-a[0]);t=t*t*(3-2*t)
   return [x+(y-x)*t for x,y in zip(a[1:],b[1:])]
 return list(K[-1][1:])

foot_objects={side:bpy.data.objects['Small foot.'+side] for side in ['L','R']}
for o in foot_objects.values():o.rotation_mode='QUATERNION'
rest_ankles={side:rig.data.bones['shin.'+side].tail_local.copy() for side in ['L','R']}

def bone_between(name,start,end):
 rest=rig.data.bones[name];delta=(rest.tail_local-rest.head_local).rotation_difference(end-start)
 q=delta@rest.matrix_local.to_quaternion();rig.pose.bones[name].matrix=Matrix.Translation(start)@q.to_matrix().to_4x4()

def legs(rootdelta,frame):
 for side,sign in [('L',-1),('R',1)]:
  thigh=rig.data.bones['thigh.'+side];shin=rig.data.bones['shin.'+side]
  hip=thigh.head_local+Vector(rootdelta);ankle=rest_ankles[side].copy()
  dv=ankle-hip;distance=min(dv.length,thigh.length+shin.length-.001);direction=dv.normalized()
  a=(thigh.length**2-shin.length**2+distance**2)/(2*distance);h=math.sqrt(max(.000001,thigh.length**2-a*a))
  preferred=Vector((sign*.12,-1,0));plane=(preferred-direction*preferred.dot(direction)).normalized();knee=hip+direction*a+plane*h
  bone_between('thigh.'+side,hip,knee);bpy.context.view_layer.update();bone_between('shin.'+side,knee,ankle)
  for name in ['thigh.'+side,'shin.'+side]:
   p=rig.pose.bones[name];p.keyframe_insert('location',frame=frame);p.keyframe_insert('rotation_quaternion',frame=frame);p.keyframe_insert('scale',frame=frame)
 bpy.context.view_layer.update()
 for side,o in foot_objects.items():
  # A flat planted sole, while the knees and hips actually flex above it.
  yaw=0 if frame<90 else (2.5*math.sin(frame*.11)*(1 if side=='R' else -.5))
  q=Quaternion(Vector((0,0,1)),math.radians(yaw));a=rest_ankles[side]
  o.matrix_world=Matrix.Translation(a)@q.to_matrix().to_4x4()@Matrix.Translation(-a)
  o.keyframe_insert('location',frame=frame);o.keyframe_insert('rotation_quaternion',frame=frame);o.keyframe_insert('scale',frame=frame)

for frame in range(1,241):
 values=sample(frame);rx,ry,rz,bx,by,bz,hx,hy,hz,ar,ax,fr,fx,al,lx,fl,lfx,stretch=values
 locworld('root',(rx,ry,rz));rotate('body',bx,by,bz);rig.pose.bones['body'].scale=(1/math.sqrt(stretch),stretch,1/math.sqrt(stretch));rotate('head',hx,hy,hz)
 rotate('upper_arm.R',ax,ar,0);rotate('forearm.R',fx,fr,0);rotate('upper_arm.L',lx,al,0);rotate('forearm.L',lfx,fl,0)
 for name in ['root','body','head','upper_arm.R','forearm.R','upper_arm.L','forearm.L']:
  p=rig.pose.bones[name]
  for channel in ['location','rotation_quaternion','scale']:p.keyframe_insert(channel,frame=frame)
 legs((rx,ry,rz),frame)

# Eye tracking is an object transform over the existing drawings, not a new face.
head_basis=rig.data.bones['head'].matrix_local.to_3x3().inverted()
for eye in [o for o in faces['neutral'] if 'pupil' in o.name]:
 for f,v in [(1,(-.015,0,-.018)),(14,(.014,0,-.024)),(26,(-.014,0,-.018)),(38,(.013,0,-.023)),(53,(-.012,0,-.016)),(60,(-.012,0,-.016)),(65,(0,0,0)),(240,(0,0,0))]:
  eye.delta_location=head_basis@Vector(v);eye.keyframe_insert('delta_location',frame=f)
# Re-use the same brow shapes and deform their controls around their original points.
for state in ['neutral','realization','angry','laugh']:
 for o in faces[state]:
  if o.type!='CURVE' or 'brow' not in o.name:continue
  for i,p in enumerate(o.data.splines[0].bezier_points):
   co=p.co.copy();side=-1 if 'left' in o.name else 1
   if state=='angry':keys=[(1,0),(89,0),(94,.045),(101,-.018),(108,.055),(118,-.015),(129,.048),(140,-.01),(150,0),(240,0)]
   elif state=='realization':keys=[(1,0),(60,0),(64,.055 if side<0 else .035),(70,.025),(88,.025),(90,0),(211,.03),(215,0),(240,0)]
   elif state=='laugh':keys=[(1,0),(150,0),(154,.035),(160,-.025),(167,.04),(174,-.02),(181,.035),(188,-.02),(196,.04),(203,-.02),(210,0),(240,0)]
   else:keys=[(1,0),(24,0),(40,.01),(49,.025 if side>0 else -.008),(60,0),(240,0)]
   for f,v in keys:
    p.co=co+Vector((0,0,v*(1 if i%2 else -.45)));p.keyframe_insert('co',frame=f)
   p.co=co

# Animated jaw and eye scrunch preserve the existing drawing style and mesh basis.
def mesh_pulse(o,name,xscale,zscale):
 if not o.data.shape_keys:o.shape_key_add(name='Basis')
 key=o.shape_key_add(name=name);coords=[v.co.copy() for v in o.data.vertices];c=sum(coords,Vector())/len(coords)
 for p,co in zip(key.data,coords):p.co=(c.x+(co.x-c.x)*xscale,co.y,c.z+(co.z-c.z)*zscale)
 return key
for o in faces['angry']:
 if o.type=='MESH' and any(n in o.name for n in ['mouth','teeth']):
  key=mesh_pulse(o,'V4 reaction jaw',.96,.62)
  for f,v in [(1,0),(90,0),(94,0),(101,.85),(108,.05),(118,.95),(129,0),(140,.8),(150,0),(240,0)]:key.value=v;key.keyframe_insert('value',frame=f)
for o in faces['laugh']:
 if o.type=='MESH' and any(n in o.name for n in ['mouth','teeth','tongue']):
  old=o.data.shape_keys.key_blocks.get('Laugh jaw compression')
  if old:
   for f,v in [(1,0),(150,0),(154,0),(160,.90),(167,0),(174,.85),(181,0),(188,.95),(196,0),(203,.9),(210,0),(240,0)]:old.value=v;old.keyframe_insert('value',frame=f)
 if o.type=='CURVE' and 'eye' in o.name:
  for i,p in enumerate(o.data.splines[0].bezier_points):
   co=p.co.copy()
   for f,v in [(1,0),(150,0),(154,.008),(160,-.012),(167,.012),(174,-.009),(181,.010),(188,-.012),(196,.01),(203,-.008),(210,0),(240,0)]:
    p.co=co+Vector((0,0,v*(1 if i%2 else -.5)));p.keyframe_insert('co',frame=f)
   p.co=co

# The camera is fixed so V4 acting can be judged independently of camera animation.
s.frame_set(1);cam.location=(.035,-8.25,2.65);target=Vector((0,0,1.66));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
s.render.fps=30;s.frame_start=1;s.frame_end=240
if MODE=='inspect':
 for f in [1,65,104,160,240]:
  s.frame_set(f);bpy.context.view_layer.update();dg=bpy.context.evaluated_depsgraph_get();items=[]
  for o in actors:
   if o.hide_render:continue
   evaluated=o.evaluated_get(dg)
   corners=[evaluated.matrix_world@Vector(c) for c in evaluated.bound_box]
   extent=max(max(abs(v[i]) for v in corners) for i in range(3))
   items.append((round(extent,3),o.name,[list(v) for v in corners[:2]],list(evaluated.matrix_world.to_scale())))
  print('INSPECT_FRAME',f,sorted(items,reverse=True)[:8],flush=True)
 bpy.ops.wm.save_as_mainfile(filepath=str(WORK/'v4_debug.blend'))
 raise SystemExit(0)
# Scan the true visible geometry, including notebook and hand positions.
def visible_bounds():
 bounds=[1,1,0,0];per=[]
 for f in range(1,241):
  s.frame_set(f);bpy.context.view_layer.update();coords=[]
  depsgraph=bpy.context.evaluated_depsgraph_get()
  projection=cam.calc_matrix_camera(depsgraph,x=1080,y=1920)@cam.matrix_world.inverted()
  for o in actors:
   if o.hide_render:continue
   evaluated=o.evaluated_get(depsgraph)
   if o.type=='CURVE':
    controls=[Vector(v) for sp in o.data.splines for p in sp.bezier_points for v in [p.co,p.handle_left,p.handle_right]]
    margin=o.data.bevel_depth*1.3+.003
    axes=[(min(p[i] for p in controls)-margin,max(p[i] for p in controls)+margin) for i in range(3)]
    corners=[(x,y,z) for x in axes[0] for y in axes[1] for z in axes[2]]
   else:corners=evaluated.bound_box
   for corner in corners:
    point=projection@(evaluated.matrix_world@Vector(corner)).to_4d()
    if point.w>0:coords.append(Vector(((point.x/point.w+1)/2,(point.y/point.w+1)/2,point.z/point.w)))
  b=[min(p.x for p in coords),min(p.y for p in coords),max(p.x for p in coords),max(p.y for p in coords)];per.append(b)
  bounds=[min(bounds[0],b[0]),min(bounds[1],b[1]),max(bounds[2],b[2]),max(bounds[3],b[3])]
 return bounds,per
bounds,per=visible_bounds()
while min(bounds[:2])<.025 or max(bounds[2:])>.975:
 cam.location.y-=.15;cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();bounds,per=visible_bounds()
 if cam.location.y<-12:raise RuntimeError('Acting bounds could not fit the fixed camera')
s.frame_set(1);bpy.context.view_layer.update();after=fingerprint()
assert baseline_hash==after,'Rest geometry changed unexpectedly'
assert materials=={o.name:[m.name for m in o.data.materials] for o in actors},'Materials changed'
assert all(abs(b.length-bones_before[b.name])<1e-7 for b in rig.data.bones),'Bone lengths changed'
# Quantify articulation rather than relying on facial state changes alone.
head_scales=[];head_turns=[];body_scales=[];knees=[];head_ref=None
for f in range(1,241):
 s.frame_set(f);bpy.context.view_layer.update();q=rig.pose.bones['head'].matrix.to_quaternion()
 if head_ref is None:head_ref=q.copy()
 head_turns.append(math.degrees(head_ref.rotation_difference(q).angle));head_scales.append(list(bpy.data.objects['Head | v2 volume with uneven contour'].matrix_world.to_scale()));body_scales.append(rig.pose.bones['body'].scale.y)
 knees.append(list(rig.pose.bones['thigh.R'].tail))
audit={'source':'khiladi-master-v3.blend','rest_geometry_before':baseline_hash,'rest_geometry_after':after,'rest_geometry_identical':baseline_hash==after,'materials_identical':True,'bone_lengths_unchanged':True,'maximum_head_orientation_change_degrees':max(head_turns),'head_world_scale_min':[min(v[i] for v in head_scales) for i in range(3)],'head_world_scale_max':[max(v[i] for v in head_scales) for i in range(3)],'torso_vertical_pose_scale_range':[min(body_scales),max(body_scales)],'right_knee_trajectory_bounds':[[min(v[i] for v in knees),max(v[i] for v in knees)] for i in range(3)],'visible_projection_bounds_all_240_frames':bounds,'camera_fixed':True,'camera_location':list(cam.location),'frames':240,'fps':30,'seconds':8,'changes':'Animation and rig inheritance only; existing 11-bone skeleton and mesh/material identity preserved.'}
(OUT/'character-v4-rig-audit.json').write_text(json.dumps(audit,indent=2))
# Save an editable, full-resolution master independent of draft settings.
s.frame_set(1);s.render.resolution_x=1080;s.render.resolution_y=1920;s.render.resolution_percentage=100;s.eevee.taa_render_samples=24;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB'
s['test_timeline']='V4 acting: reading and suspicion / snap recoil / frustrated whole-body gesture / rhythmic laugh / abrupt deadpan recovery';s['master_status']='Design retained from V3; V4 motion candidate awaits user review. No full film.'
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi-master-v4.blend'))
(OUT/'animate_character_v4.py').write_text(Path(__file__).read_text(encoding='utf-8'),encoding='utf-8')
if MODE=='stills':
 s.render.resolution_x=720;s.render.resolution_y=1280;s.eevee.taa_render_samples=24;s.frame_set(104)
 for name,angle in [('front',0),('three_quarter',43)]:
  pos=Vector(cam.location);t=math.radians(angle);cam.location=(pos.x*math.cos(t)-pos.y*math.sin(t),pos.x*math.sin(t)+pos.y*math.cos(t),pos.z);cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();s.render.filepath=str(WORK/'v4_stills'/(name+'.png'));bpy.ops.render.render(write_still=True)
elif MODE in ['draft','production']:
 if MODE=='draft':s.render.resolution_x=360;s.render.resolution_y=640;s.eevee.taa_render_samples=4
 folder=WORK/('v4_draft' if MODE=='draft' else 'v4_motion');s.render.filepath=str(folder/'frame_');s.frame_set(1);bpy.ops.render.render(animation=True)
print('V4_COMPLETE',MODE,flush=True)
