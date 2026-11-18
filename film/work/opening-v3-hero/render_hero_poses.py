"""Render retained V3 geometry through the V4 rig, for a seated 2.5D performance.
Only head/torso plates; arms, pencil and notebook are articulated editorial layers.
"""
import bpy, math, json, hashlib
from pathlib import Path
from mathutils import Vector, Quaternion
from bpy_extras.object_utils import world_to_camera_view
ROOT=Path(__file__).resolve().parents[2];DEST=ROOT/'work/opening-v3-hero/puppet';DEST.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'work/v4_debug.blend'))
s=bpy.context.scene;rig=bpy.data.objects['Khiladi v3 | master rig']
rig.animation_data_clear()
for p in rig.pose.bones:
 p.location=(0,0,0);p.rotation_mode='QUATERNION';p.rotation_quaternion=Quaternion();p.scale=(1,1,1)
for obj in s.objects:
 obj.animation_data_clear()
 obj.hide_render=obj.type not in ['LIGHT','CAMERA','ARMATURE']
 if obj.type in ['MESH','CURVE']:
  obj.data.animation_data_clear()
  if obj.type=='MESH' and obj.data.shape_keys:
   obj.data.shape_keys.animation_data_clear()
   for key in obj.data.shape_keys.key_blocks:
    if key.name!='Basis':key.value=0
cam=s.camera;cam.animation_data_clear();cam.data.animation_data_clear()
cam.location=(0,-6.8,2.65);target=Vector((0,0,2.04));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=65;cam.data.sensor_fit='VERTICAL';cam.data.sensor_height=33
s.render.engine='BLENDER_EEVEE';s.eevee.taa_render_samples=16;s.eevee.use_raytracing=False
s.render.resolution_x=900;s.render.resolution_y=1200;s.render.resolution_percentage=100
s.render.film_transparent=True;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA'
faces=['neutral','confused','realization','angry','laugh']

def rotate(name,x=0,y=0,z=0):
 p=rig.pose.bones[name];basis=rig.data.bones[name].matrix_local.to_3x3().inverted();q=Quaternion()
 for axis,a in [(Vector((1,0,0)),x),(Vector((0,1,0)),y),(Vector((0,0,1)),z)]:q=Quaternion(basis@axis,math.radians(a))@q
 p.rotation_quaternion=q

states=[('front_left_near','confused',10,-2,-12),('front_left_far','confused',4,-3,-26),('wry_neutral','neutral',5,3,-2)]
meta={'source':'V3 geometry/materials retained in V4 rig; no geometry rebuilt','states':{},'width':900,'height':1200}
for name,face,pitch,roll,yaw in states:
 for o in s.objects:
  if o.type in ['MESH','CURVE']:
   o.hide_render=not (o.name.startswith(('Head |','Hair |','Torso |',face+' | ')))
 rotate('head',pitch,roll,yaw);rotate('body',4,0,0)
 bpy.context.view_layer.update()
 anchors={}
 for label,point in [('shoulderL',(-.28,0,1.73)),('shoulderR',(.28,0,1.73))]:
  p=world_to_camera_view(s,cam,Vector(point));anchors[label]=[p.x*900,(1-p.y)*1200]
 dest=DEST/(name+'.png');s.render.filepath=str(dest)
 if not dest.exists():bpy.ops.render.render(write_still=True)
 meta['states'][name]={'expression':face,'head_pitch':pitch,'head_roll':roll,'head_yaw':yaw,'anchors':anchors}
 print('PUPPET',name,flush=True)
(DEST/'states.json').write_text(json.dumps(meta,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'outputs/opening-v3-hero/khiladi-opening-v3-hero.blend'))
