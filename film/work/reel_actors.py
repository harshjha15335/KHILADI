"""Render the retained character and V4 acting as reusable film layers."""
import bpy,math,json,os,hashlib
from pathlib import Path
from mathutils import Vector,Quaternion
ROOT=Path(__file__).resolve().parent.parent;WORK=ROOT/'work';OUT=ROOT/'outputs'
BASE=WORK/'v4_debug.blend';R=WORK/'reel';R.mkdir(exist_ok=True)
SELECT=os.getenv('REEL_POSES','')
POSES=[('reading',1,60,48,None,True),('thinking',1,60,48,'confused',False),('discovery',58,87,36,'realization',False),('frustration',91,150,48,'angry',False),('laugh',154,209,48,'laugh',False),('neutral',211,240,36,'neutral',False)]
manifest=R/'actors.json';data=json.loads(manifest.read_text()) if manifest.exists() else {'fps':30,'loops':{}}
bpy.ops.wm.open_mainfile(filepath=str(OUT/'khiladi-master-v3.blend'));bpy.context.scene.frame_set(1);bpy.context.view_layer.update()
foot_rest={side:bpy.data.objects['Small foot.'+side].matrix_world.copy() for side in ['L','R']}
for name,start,end,count,expression,book in POSES:
 if SELECT and name not in SELECT.split(','):continue
 folder=R/'actors_raw_corrected'/name;folder.mkdir(parents=True,exist_ok=True)
 if len(list(folder.glob('frame_*.png')))==count:
  data['loops'][name]={'raw_directory':str(folder),'pattern':'frame_%04d.png','frame_count':count};manifest.write_text(json.dumps(data,indent=2));continue
 bpy.ops.wm.open_mainfile(filepath=str(BASE));s=bpy.context.scene;rig=bpy.data.objects['Khiladi v3 | master rig'];cam=s.camera
 def actor(o):
  p=o
  while p.parent:p=p.parent
  return p==rig
 actors=[o for o in s.objects if actor(o) and o.type in ['MESH','CURVE']]
 for side,matrix in foot_rest.items():
  foot=bpy.data.objects['Small foot.'+side];foot.animation_data_clear();foot.parent=None;foot.matrix_world=matrix
 for o in s.objects:
  if o.type not in ['CAMERA','LIGHT','ARMATURE'] and o not in actors:o.hide_render=True
 cam.animation_data_clear();cam.data.animation_data_clear();cam.data.type='PERSP';cam.data.lens=50
 cam.location=(0,-11.4,2.5);cam.rotation_euler=(Vector((0,0,1.65))-cam.location).to_track_quat('-Z','Y').to_euler()
 s.render.engine='BLENDER_EEVEE';s.render.resolution_x=1308;s.render.resolution_y=2324;s.render.resolution_percentage=100;s.eevee.taa_render_samples=8;s.eevee.use_raytracing=False
 s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.image_settings.compression=15;s.render.fps=30
 s.frame_set(start);bpy.context.view_layer.update()
 rest={p.name:(p.location.copy(),p.rotation_quaternion.copy(),p.scale.copy()) for p in rig.pose.bones}
 feet={o.name:o.matrix_world.copy() for o in actors if o.name.startswith('Small foot.')}
 if name=='reading':
  s['film_asset']='Approved V3 appearance with V4 acting, shared across all shots.'
  bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi-character-production.blend'))
 for i in range(count):
  dest=folder/f'frame_{i+1:04d}.png'
  if dest.exists():continue
  source=start+(end-start)*i/max(count-1,1);s.frame_set(math.floor(source),subframe=source-math.floor(source));bpy.context.view_layer.update()
  # A short closing blend makes reusable gestures seamless, without interpolating raster frames.
  blend=max(0,(i-(count-9))/8);blend=blend*blend*(3-2*blend)
  if blend:
   for p in rig.pose.bones:
    loc,q,scale=rest[p.name];p.location=p.location.lerp(loc,blend);p.rotation_quaternion=p.rotation_quaternion.slerp(q,blend);p.scale=p.scale.lerp(scale,blend)
   bpy.context.view_layer.update()
   for key,matrix in feet.items():bpy.data.objects[key].matrix_world=matrix
  for o in actors:
   if o.name.startswith('Notebook |'):o.hide_render=not book
   if expression and any(o.name.startswith(state+' |') for state in ['neutral','confused','realization','angry','laugh']):o.hide_render=not o.name.startswith(expression+' |')
  s.render.filepath=str(dest);bpy.ops.render.render(write_still=True)
  print('REEL_ACTOR_FRAME',name,i+1,count,flush=True)
 data['loops'][name]={'raw_directory':str(folder),'pattern':'frame_%04d.png','frame_count':count,'source_frames':[start,end],'fixed_identity':'V3 mesh and material data; V4 rig acting'}
 manifest.write_text(json.dumps(data,indent=2),encoding='utf-8');print('REEL_ACTOR_COMPLETE',name,flush=True)
print('REEL_ACTORS_COMPLETE',flush=True)
