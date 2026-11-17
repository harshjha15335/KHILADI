import bpy,hashlib,json
from pathlib import Path
root=Path.cwd();file=root/'outputs/khiladi-master-v3.blend';bpy.ops.wm.open_mainfile(filepath=str(file))
def stamp():
 h=hashlib.sha256()
 for o in sorted(bpy.data.objects,key=lambda o:o.name):
  if o.type=='MESH':
   h.update(o.name.encode())
   for v in o.data.vertices:h.update(str(tuple(v.co)).encode())
  elif o.type=='CURVE':
   h.update(o.name.encode())
   for s in o.data.splines:
    for p in s.bezier_points:h.update(str(tuple(p.co)).encode())
 return h.hexdigest()
before=stamp();count=0
for screen in bpy.data.screens:
 for area in screen.areas:
  if area.type=='VIEW_3D':
   space=area.spaces.active;space.shading.type='MATERIAL';space.shading.use_scene_lights=True;space.shading.use_scene_world=True;space.overlay.show_overlays=False
   if space.region_3d:space.region_3d.view_perspective='CAMERA'
   if hasattr(space,'camera'):space.camera=bpy.context.scene.camera
   count+=1
assert stamp()==before
bpy.ops.wm.save_as_mainfile(filepath=str(file));print('UI_METADATA_ONLY',count,'viewports','geometry_unchanged',before,flush=True)
