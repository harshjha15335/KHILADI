import bpy,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parent.parent
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'outputs/khiladi-master-v3.blend'))
s=bpy.context.scene
head=bpy.data.objects['Head | v2 volume with uneven contour']
hull=bpy.data.objects[head.name+' | contour']
center=Vector(tuple((min(v.co[i] for v in head.data.vertices)+max(v.co[i] for v in head.data.vertices))/2 for i in range(3)))
dots=[p.normal.dot(p.center-center) for p in head.data.polygons if p.area>1e-9]
outward=sum(d>0 for d in dots)/len(dots)
expanded=all(min(v.co[i] for v in hull.data.vertices)<min(v.co[i] for v in head.data.vertices) and max(v.co[i] for v in hull.data.vertices)>max(v.co[i] for v in head.data.vertices) for i in range(3))
feet=[bpy.data.objects['Small foot.'+side] for side in ['L','R']]
book=bpy.data.objects['Notebook | paper block'];hand=bpy.data.objects['Small hand.L']
def centroid(o):return o.matrix_world@(sum((v.co for v in o.data.vertices),Vector())/len(o.data.vertices))
ref_feet=None;ref_relative=None;max_feet=0;max_relative=0
for f in range(1,241):
 s.frame_set(f);bpy.context.view_layer.update()
 cs=[centroid(o) for o in feet];rel=hand.matrix_world.inverted()@book.matrix_world
 if ref_feet is None:ref_feet=cs;ref_relative=rel.copy()
 max_feet=max(max_feet,*( (c-r).length for c,r in zip(cs,ref_feet)))
 max_relative=max(max_relative,max(abs(rel[i][j]-ref_relative[i][j]) for i in range(4) for j in range(4)))
report={'outward_head_normals_fraction':outward,'head_contour_expands_outward':expanded,'max_foot_world_drift':max_feet,'max_notebook_hand_relative_matrix_drift':max_relative,'frames_examined':240,'checks':{'head_normals_outward':outward>.99,'contour_expands':expanded,'feet_planted':max_feet<1e-5,'notebook_attachment_stable':max_relative<1e-5}}
(ROOT/'outputs/rig-motion-audit-v3.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2),flush=True)
if not all(report['checks'].values()):raise SystemExit(1)
