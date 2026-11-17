"""Native-30fps character animation over native-1080 Blender set plates.

KHILADI_LAYER_MODE=test: first shot plates plus full first pose cycle.
KHILADI_LAYER_MODE=plates/actors/all: production components.
KHILADI_SCENE=id,id selects plate shots. KHILADI_CYCLE_FRAMES defaults60.
Writes layer_manifest.json for deterministic post-production.
"""
import bpy, math, os, json, sys, shutil, time
from pathlib import Path
from mathutils import Vector,Quaternion
from bpy_extras.object_utils import world_to_camera_view
ROOT=Path(__file__).resolve().parent.parent;WORK=ROOT/'work';OUT=ROOT/'outputs'
sys.path.insert(0,str(WORK))
import render_film as F
F.WIDTH=1080;F.HEIGHT=1920
MODE=os.getenv('KHILADI_LAYER_MODE','test')
POSE_FRAMES=int(os.getenv('KHILADI_CYCLE_FRAMES','60'))
LAYER=WORK/'layers';LAYER.mkdir(exist_ok=True)
MANIFEST=LAYER/'layer_manifest.json'
data=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'width':1080,'height':1920,'fps':30,'cycle_frames':POSE_FRAMES,'scenes':[],'loops':{}}
data['pipeline']='Blender 3D set plates, same fixed rig native30fps RGBA pose cycles, smooth composite camera push'

def save():
    # Resolve cropped source sprites against camera-projected anchor points.
    for s in data['scenes']:
        for cut in s['cuts']:
            loop=data['loops'].get(cut.get('loop'))
            if loop:
                scale=cut['actor_scale'];crop=loop['crop'];ref=loop['anchor'];anchor=cut['actor_anchor']
                cut['actor_x']=round(anchor[0]-(ref[0]-crop[0])*scale)
                cut['actor_y']=round(anchor[1]-(ref[1]-crop[1])*scale)
                cut['actor_width']=round(crop[2]*scale);cut['actor_height']=round(crop[3]*scale)
    MANIFEST.write_text(json.dumps(data,indent=2),encoding='utf-8')

def set_samples(scene,n):
    if hasattr(scene,'eevee'):
        for prop in ['taa_render_samples','taa_samples','render_samples']:
            if hasattr(scene.eevee,prop):setattr(scene.eevee,prop,n)

def character_objects(rig):
    result=[]
    for o in bpy.data.objects:
        p=o
        while p.parent:p=p.parent
        if p==rig:result.append(o)
    return result

def fixed_camera(scene,cut,n):
    # Capture at the exact start of each real camera cut. All composited layers
    # subsequently receive the same editorial dolly; their registration is fixed.
    frame=[1,max(2,n//3),max(3,2*n//3)][cut-1]
    scene.frame_set(frame)
    cam=scene.camera
    for marker in sorted(scene.timeline_markers,key=lambda x:x.frame):
        if marker.frame<=frame and marker.camera:cam=marker.camera
    scene.camera=cam
    pos=cam.matrix_world.copy();scale=cam.data.ortho_scale
    cam.animation_data_clear();cam.data.animation_data_clear();cam.matrix_world=pos;cam.data.ortho_scale=scale
    return cam

def actor_rect(scene,cam,rig):
    # Geometry bounds across every pose keep waving hands inside the crop.
    coords=[]
    for o in character_objects(rig):
        if o.type in ['MESH','CURVE'] and not o.hide_render:
            for p in o.bound_box:coords.append(world_to_camera_view(scene,cam,o.matrix_world@Vector(p)))
    xmin=max(0,min(c.x for c in coords)-.025);xmax=min(1,max(c.x for c in coords)+.025)
    ymin=max(0,min(c.y for c in coords)-.02);ymax=min(1,max(c.y for c in coords)+.02)
    return [math.floor(xmin*1080),math.floor((1-ymax)*1920),math.ceil((xmax-xmin)*1080),math.ceil((ymax-ymin)*1920)]

def shadow(scene):
    # Soft contact shadow plate: radially feathered transparent ellipse on floor.
    m=bpy.data.materials.new('Layered contact shadow');m.use_nodes=True
    ns=m.node_tree.nodes;ns.clear();out=ns.new('ShaderNodeOutputMaterial');mix=ns.new('ShaderNodeMixShader')
    transparent=ns.new('ShaderNodeBsdfTransparent');dark=ns.new('ShaderNodeEmission');dark.inputs[0].default_value=(.035,.02,.012,1)
    tex=ns.new('ShaderNodeTexCoord');dist=ns.new('ShaderNodeVectorMath');dist.operation='DISTANCE';dist.inputs[1].default_value=(.5,.5,0)
    ramp=ns.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].position=0;ramp.color_ramp.elements[0].color=(.22,.22,.22,1)
    ramp.color_ramp.elements[1].position=.5;ramp.color_ramp.elements[1].color=(0,0,0,1)
    links=m.node_tree.links;links.new(tex.outputs['Generated'],dist.inputs[0]);links.new(dist.outputs['Value'],ramp.inputs[0]);links.new(ramp.outputs[0],mix.inputs[0]);links.new(transparent.outputs[0],mix.inputs[1]);links.new(dark.outputs[0],mix.inputs[2]);links.new(mix.outputs[0],out.inputs[0])
    if hasattr(m,'surface_render_method'):m.surface_render_method='DITHERED'
    bpy.ops.mesh.primitive_plane_add(size=1,location=(-.88,-.22,.11));o=bpy.context.object;o.name='Baked soft character contact shadow';o.scale=(1.55,.65,1);o.data.materials.append(m)

def foreground_objects(scene):
    names=('Rounded timber desktop','Desk leg','Notebook pages','Notebook cover','Notebook writing','Laptop','Coffee mug','Desk lamp')
    # Only the foreground desk at y<0.6; background school furniture is not a mask.
    return [o for o in scene.objects if o.type not in ['CAMERA','LIGHT','ARMATURE'] and o.name.startswith(names) and o.location.y<.6 and o.location.x>-1.5]

def pose_for(idx):
    if idx in [0,15]:return 'writing'
    if idx in [1,13,14]:return 'celebration'
    if idx in [4,8,10,12]:return 'thinking'
    return 'pointing'

def render_plates():
    selected=os.getenv('KHILADI_SCENE','').split(',') if os.getenv('KHILADI_SCENE') else None
    shots=F.STORY[:1] if MODE=='test' else F.STORY
    for shot in shots:
        if selected and shot['id'] not in selected:continue
        idx=F.STORY.index(shot);scene,n=F.build(shot,idx);set_samples(scene,48)
        rig=bpy.data.objects['Bean | animation rig'];actors=character_objects(rig)
        for o in actors:o.hide_render=True
        shadow(scene)
        # Freeze animated evidence bars at their fully expanded measurement.
        for o in scene.objects:
            if o.name.startswith('Evidence chart bar'):o.animation_data_clear();o.scale.x=1
        shotdir=LAYER/'plates'/shot['id'];shotdir.mkdir(parents=True,exist_ok=True)
        shotdata={'id':shot['id'],'frames':n,'pose':pose_for(idx),'cuts':[]}
        for cut in range(1,4):
            camera=fixed_camera(scene,cut,n)
            # No actor geometry is edited. Re-show temporarily only to measure
            # camera placement, then restore for the clean environment plate.
            if cut!=2:
                for o in actors:o.hide_render=not (o.type in ['MESH','CURVE'])
                rect=actor_rect(scene,camera,rig)
                for o in actors:o.hide_render=True
            else:rect=None
            plate=shotdir/f'cut{cut}.png';scene.render.film_transparent=False;scene.render.image_settings.color_mode='RGB';scene.render.filepath=str(plate)
            if not plate.exists() or os.getenv('KHILADI_FORCE_PLATES')=='1':bpy.ops.render.render(write_still=True)
            start=[0,n//3,2*n//3][cut-1];end=[n//3,2*n//3,n][cut-1]
            anchor=world_to_camera_view(scene,camera,Vector((-.88,-.22,2.45)))
            entry={'cut':cut,'frames':end-start,'plate':str(plate),'actor_rect':rect,'loop':pose_for(idx) if cut!=2 else None,'actor_offset':(idx*7)%POSE_FRAMES,'foreground':None,'push':1.035,'graphics':[],
                'actor_anchor':[anchor.x*1080,(1-anchor.y)*1920],'actor_scale':7.35/camera.data.ortho_scale}
            # Render foreground only for desk scenes where it actually occludes.
            if cut!=2 and shot['set']!='stadium':
                foreground=foreground_objects(scene)
                if foreground:
                    hidden={o:o.hide_render for o in scene.objects}
                    for o in scene.objects:
                        if o.type not in ['LIGHT','CAMERA']:o.hide_render=o not in foreground
                    scene.render.film_transparent=True;scene.render.image_settings.color_mode='RGBA';fp=shotdir/f'cut{cut}_foreground.png';scene.render.filepath=str(fp)
                    if not fp.exists() or os.getenv('KHILADI_FORCE_PLATES')=='1':bpy.ops.render.render(write_still=True)
                    entry['foreground']=str(fp)
                    for o,h in hidden.items():o.hide_render=h
            shotdata['cuts'].append(entry)
            data['scenes']=[s for s in data['scenes'] if s['id']!=shot['id']]+[shotdata];data['scenes'].sort(key=lambda s:s['id']);save()
            print('PLATE_READY',shot['id'],cut,flush=True)
        data['scenes']=[s for s in data['scenes'] if s['id']!=shot['id']]+[shotdata];data['scenes'].sort(key=lambda s:s['id']);save()
        bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'blender_scenes'/(shot['id']+'.blend')))

def cycle(rig,pose,frame):
    a=2*math.pi*(frame-1)/POSE_FRAMES
    if pose=='writing':angles=(30+2*math.sin(a*2),70+4*math.sin(a*4),-8,-40)
    elif pose=='thinking':angles=(-57-10*math.sin(a),-23,50+10*math.sin(a),25)
    elif pose=='celebration':angles=(-83-12*math.sin(a),-35,65+12*math.sin(a),-32)
    else:angles=(-72-8*math.sin(a),-10+5*math.sin(a*2),8,-12)
    for name,angle in zip(['upper_arm.R','forearm.R','upper_arm.L','forearm.L'],angles):F.pose_rotation(rig,name,angle)
    if pose=='writing':
        rig.pose.bones['upper_arm.R'].location=rig.data.bones['upper_arm.R'].matrix_local.to_3x3().inverted()@Vector((0,-.40,0))
    F.pose_rotation(rig,'head',2.5*math.sin(a));F.pose_rotation(rig,'body',.75*math.sin(a))
    # Feet remain planted. Only the torso/head carry the tiny puppet bob.
    rig.pose.bones['body'].location=(0,.012*math.sin(a*2),0)
    for p in rig.pose.bones:p.keyframe_insert('rotation_quaternion',frame=frame);p.keyframe_insert('location',frame=frame)

def render_actors():
    poses=['writing','thinking','pointing','celebration'][:1] if MODE=='test' else ['writing','thinking','pointing','celebration']
    if os.getenv('KHILADI_POSE'):poses=[p for p in poses if p in os.getenv('KHILADI_POSE').split(',')]
    for pose in poses:
        scene,n=F.build(F.STORY[0],0);camera=fixed_camera(scene,1,n);set_samples(scene,16)
        rig=bpy.data.objects['Bean | animation rig'];rig.animation_data_clear()
        for p in rig.pose.bones:p.location=(0,0,0);p.rotation_quaternion=(1,0,0,0)
        bpy.context.view_layer.update()
        actors=character_objects(rig)
        if pose=='writing':
            hand_obj=bpy.data.objects['Round hand.R'];hand=hand_obj.matrix_world.translation.copy()
            pencil=F.rod('Writing pencil',hand+Vector((-.04,-.055,0)),hand+Vector((.28,-.055,0)),.014,F.M['gold'])
            pencil.parent=hand_obj;pencil.matrix_parent_inverse.identity();pencil.location=(.10,-.055,0);pencil.rotation_euler=(0,math.pi/2,0);actors.append(pencil)
        for o in scene.objects:
            if o.type not in ['CAMERA','LIGHT']:o.hide_render=o not in actors
        expression='happy' if pose in ['writing','celebration'] else ('surprised' if pose=='thinking' else 'determined')
        mouthfrags=['open smile','white teeth','pink tongue','small mouth','frown','little o mouth']
        for o in actors:
            if o.name.startswith(('neutral |','happy |','determined |','surprised |')):
                o.hide_render=not o.name.startswith(expression+' |') or any(s in o.name for s in mouthfrags)
            if o.name.startswith('Notebook |'):o.hide_render=pose!='writing'
        coords=[]
        for frame in range(1,POSE_FRAMES+1):
            cycle(rig,pose,frame);scene.frame_set(frame);bpy.context.view_layer.update()
            for o in actors:
                if o.type in ['MESH','CURVE'] and not o.hide_render:
                    for p in o.bound_box:coords.append(world_to_camera_view(scene,camera,o.matrix_world@Vector(p)))
            opened=(frame%11 not in [0,1,2,7])
            for name,visible in [('speech_open | mouth',opened),('speech_closed | mouth',not opened)]:
                o=bpy.data.objects.get(name)
                if o:o.hide_render=not visible;o.keyframe_insert('hide_render',frame=frame)
        xmin=max(0,min(c.x for c in coords)-.012);xmax=min(1,max(c.x for c in coords)+.012)
        ymin=max(0,min(c.y for c in coords)-.012);ymax=min(1,max(c.y for c in coords)+.012)
        # Oversample the source by1.21 so the medium shot never enlarges pixels.
        scene.render.resolution_x=1308;scene.render.resolution_y=2324
        scene.render.use_border=True;scene.render.use_crop_to_border=True
        scene.render.border_min_x=xmin;scene.render.border_max_x=xmax;scene.render.border_min_y=ymin;scene.render.border_max_y=ymax
        scene.render.film_transparent=True;scene.render.image_settings.color_mode='RGBA'
        folder=LAYER/'actors'/pose;folder.mkdir(parents=True,exist_ok=True)
        scene.frame_start=1;scene.frame_end=POSE_FRAMES
        scene.render.filepath=str(folder/'frame_');scene.frame_set(1)
        if MODE=='actor_preview':
            audit=LAYER/'actor_audit';audit.mkdir(exist_ok=True);scene.render.filepath=str(audit/(pose+'.png'));bpy.ops.render.render(write_still=True)
            print('ACTOR_PREVIEW_READY',pose,flush=True);continue
        bpy.ops.render.render(animation=True)
        anchor=world_to_camera_view(scene,camera,Vector((-.88,-.22,2.45)))
        data['loops'][pose]={'directory':str(folder),'pattern':'frame_%04d.png','frame_count':POSE_FRAMES,'crop':[int(xmin*1080),int((1-ymax)*1920),int((xmax-xmin)*1080),int((ymax-ymin)*1920)],'anchor':[anchor.x*1080,(1-anchor.y)*1920],'reference_camera_scale':7.35}
        save();print('ACTOR_READY',pose,flush=True)

if MODE in ['test','plates','all']:render_plates()
if MODE in ['test','actors','all','actor_preview']:render_actors()
if MODE=='all':
    # One editable film project containing every staged shot scene.
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for path in sorted((OUT/'blender_scenes').glob('*.blend')):
        with bpy.data.libraries.load(str(path),link=False) as (source,destination):destination.scenes=source.scenes
        for scene in destination.scenes:
            if scene:
                scene.name=path.stem
                idx=next((i for i,s in enumerate(F.STORY) if s['id']==path.stem),0)
                expression='happy' if idx in [0,1,13,15] else ('surprised' if idx in [4,8,10,12] else 'determined')
                for o in scene.objects:
                    p=o
                    while p.parent:p=p.parent
                    if p.type=='ARMATURE':
                        o.hide_render=False
                        if o.name.startswith(('neutral |','happy |','determined |','surprised |')):o.hide_render=not o.name.startswith(expression+' |')
                        if o.name.startswith('speech_'):o.hide_render=True
                    if o.name.startswith('Baked soft character contact shadow'):o.hide_render=True
                scene.frame_set(1)
    if bpy.context.window and bpy.data.scenes.get('01_notebook'):bpy.context.window.scene=bpy.data.scenes['01_notebook']
    for scene in list(bpy.data.scenes):
        if not scene.objects and scene.name=='Scene':bpy.data.scenes.remove(scene)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi_film.blend'))
for filename in ['render_layers.py','render_film.py']:shutil.copy2(WORK/filename,OUT/filename)
print('LAYER_RENDER_COMPLETE',MODE,flush=True)
