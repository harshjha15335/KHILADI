"""Assemble editable full-film scene project after clean plate rendering."""
import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent;OUT=ROOT/'outputs'
story=json.loads((ROOT/'work'/'story.json').read_text(encoding='utf-8'))['scenes']
bpy.ops.wm.read_factory_settings(use_empty=True)
for path in sorted((OUT/'blender_scenes').glob('*.blend')):
    with bpy.data.libraries.load(str(path),link=False) as (source,destination):destination.scenes=source.scenes
    for scene in destination.scenes:
        if not scene:continue
        scene.name=path.stem
        idx=next((i for i,s in enumerate(story) if s['id']==path.stem),0)
        expression='happy' if idx in [0,1,13,15] else ('surprised' if idx in [4,8,10,12] else 'determined')
        for o in scene.objects:
            p=o
            while p.parent:p=p.parent
            if p.type=='ARMATURE':
                o.hide_render=False;o.hide_viewport=False
                if o.name.startswith(('neutral |','happy |','determined |','surprised |')):
                    o.hide_render=not o.name.startswith(expression+' |');o.hide_viewport=o.hide_render
                if o.name.startswith('speech_'):o.hide_render=True;o.hide_viewport=True
            if o.name.startswith('Baked soft character contact shadow'):o.hide_render=True;o.hide_viewport=True
        scene.frame_set(1)
if bpy.context.window and bpy.data.scenes.get('01_notebook'):bpy.context.window.scene=bpy.data.scenes['01_notebook']
for scene in list(bpy.data.scenes):
    if not scene.objects and scene.name=='Scene':bpy.data.scenes.remove(scene)
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi_film.blend'))
print('FILM_PROJECT_SCENES',len(bpy.data.scenes),flush=True)
