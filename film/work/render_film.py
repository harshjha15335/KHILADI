"""Deterministic Khiladi film shots, using the approved master character rig.

Blender 5.3: blender -b --python work/render_film.py
KHILADI_DRAFT=1 renders one audit frame per shot; KHILADI_SCENE selects one.
timing.json accepts a list, a dict keyed by shot id, or {'scenes': [...]}.
"""
import bpy, os, math, json, shutil, time
from pathlib import Path
from mathutils import Vector, Quaternion

ROOT = Path(__file__).resolve().parent.parent
WORK, OUT = ROOT/'work', ROOT/'outputs'
STORY = json.loads((WORK/'story.json').read_text(encoding='utf-8'))['scenes']
DRAFT = os.getenv('KHILADI_DRAFT', '0') == '1'
SELECT = os.getenv('KHILADI_SCENE', '')
WIDTH = int(os.getenv('KHILADI_WIDTH', '540' if DRAFT else '1080'))
HEIGHT = int(os.getenv('KHILADI_HEIGHT', '960' if DRAFT else '1920'))
FPS = 30
TIMINGS = {}
if (WORK/'timing.json').exists():
    timing = json.loads((WORK/'timing.json').read_text(encoding='utf-8'))
    if isinstance(timing, dict) and 'scenes' in timing: timing=timing['scenes']
    TIMINGS = {s['id']:s for s in timing} if isinstance(timing,list) else timing
for p in [WORK/'film_previews',WORK/'film_frames',OUT/'blender_scenes']: p.mkdir(parents=True,exist_ok=True)

def mat(name, rgb, rough=.8, emission=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*rgb,1);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*rgb,1)
    p.inputs['Roughness'].default_value=rough
    if emission: p.inputs['Emission Color'].default_value=(*rgb,1);p.inputs['Emission Strength'].default_value=emission
    return m

def cube(name, loc, scale, material, bevel=.045):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    o.data.materials.append(material)
    if bevel:
        b=o.modifiers.new('soft edges','BEVEL');b.width=bevel;b.segments=2
        o.modifiers.new('weighted normals','WEIGHTED_NORMAL')
    return o

def rod(name, a, b, radius, material):
    a,b=Vector(a),Vector(b);v=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=radius,depth=v.length,location=(a+b)/2)
    o=bpy.context.object;o.name=name;o.rotation_euler=v.to_track_quat('Z','Y').to_euler();o.data.materials.append(material)
    return o

def text(body,x,y,z,size=.22,material=None,align='CENTER'):
    d=bpy.data.curves.new('Typography '+body,'FONT');d.body=body;d.align_x=align;d.size=size;d.extrude=.001
    o=bpy.data.objects.new('Type | '+body,d);bpy.context.scene.collection.objects.link(o)
    o.location=(x,y,z);o.rotation_euler=(math.pi/2,0,0);d.materials.append(material or M['ink'])
    return o

def line(points,material,radius=.013,name='ink stroke'):
    d=bpy.data.curves.new(name,'CURVE');d.dimensions='3D';d.bevel_depth=radius;d.bevel_resolution=2
    s=d.splines.new('POLY');s.points.add(len(points)-1)
    for p,co in zip(s.points,points):p.co=(*co,1)
    o=bpy.data.objects.new(name,d);bpy.context.scene.collection.objects.link(o);d.materials.append(material);return o

def board(title, lines, x=.9, z=4.15, width=2.65, height=2.45, blue=False):
    x-=.28
    width=min(width,2.48)
    concise={
      'THE BACK OF MY NOTEBOOK':('MY IPL XI',['FAVOURITES FIRST','Homework later.']),
      'RAJASTHAN ROYALS':('RAJASTHAN ROYALS',['SupeRR Selector','THE HACKATHON','Evidence first.']),
      'RECONSTRUCT FIRST':('RECONSTRUCT FIRST',['200,999 RAW EVENTS','194,509 ELIGIBLE','Clean before judging.']),
      'ILLUSTRATIVE PRE-BALL STATE':('BEFORE THE BALL',['28 FROM 12','Required rate: 14','Illustrative situation']),
      'DIFFICULT vs CONSEQUENTIAL':('WHAT CAN CHANGE?',['39 RPO: almost over','2 OFF 1: next ball matters','Difficulty + consequence']),
      'MODEL D':('MODEL D',['Difficulty + leverage','Context percentiles','TOP 20% / INNINGS']),
      'ABOVE EXPECTATION':('BETTER THAN WHAT?',['Runs + survival','Runs saved + wickets','AGAINST EXPECTATION']),
      'DECLARE THE ASSUMPTIONS':('DECLARE THE CHOICES',['1 WICKET = 15 RUNS','Test 10 / 15 / 20','Context / era / opposition']),
      'SMALL SAMPLES, SMALLER CLAIMS':('SHRINK SMALL SAMPLES',['25 EVENTS','','400 EVENTS','','Towards the average']),
      'QUALITY IS NOT DELTA':('QUALITY vs DELTA',['Good under pressure?','Better than normal?','BOWLING DELTA: UNVALIDATED']),
      '2026: UNSEEN-SEASON TEST':('2026 HOLDOUT',['BAT: rho = -0.043','BOWL: rho = +0.304','Economy advantage unproven']),
      '750 MATCH BOOTSTRAPS':('750 MATCH BOOTSTRAPS',['Matches, not balls','','HISTORICAL STABILITY']),
      'THE RANKINGS MOVE':('CHANGE THE DEFINITION',['D10 retained: BAT 5/10','D10 retained: BOWL 4/10','Rankings depend on choices.']),
      'PRIMARY D20 SHORTLIST':('PRIMARY D20 BATTERS',['1  JOS BUTTLER','2  Abhishek Sharma','3  Nicholas Pooran']),
      'BOWLERS':('PRIMARY D20 BOWLERS',['1  JASPRIT BUMRAH','2  Sunil Narine','3  Abrar Ahmed']),
      'REPLAY: SEED 42':('REPLAY: SEED 42',['41 CHECKS PASSED','20 / 20 REPRODUCED','Limitations still apply.']),
      'KHILADI':('KHILADI',['BEYOND THE SCOREBOARD','What does evidence support?','How sure should we be?'])}
    title,lines=concise.get(title,(title,lines))
    cube('Framed evidence board',(x,1.38,z),(width+.13,.13,height+.13),M['wood'])
    cube('Evidence board surface',(x,1.29,z),(width,.08,height),M['navy'] if blue else M['paper'])
    fg=M['white'] if blue else M['ink']
    title_obj=text(title,x,1.235,z+height/2-.38,.22,fg)
    objects=[title_obj]
    spacing=.4 if len(lines)<=3 else .31
    for i,body in enumerate(lines): objects.append(text(body,x,1.23,z+height/2-.9-i*spacing,.22 if len(lines)<=3 else .17,fg))
    bpy.context.view_layer.update()
    for o in objects:
        if o.dimensions.x>width-.22:o.scale*= (width-.22)/o.dimensions.x
    return (x,z)

def table(x,y,z=1.9,width=2.6):
    cube('Rounded timber desktop',(x,y,z),(width,1.25,.12),M['wood'])
    for dx in [-width*.4,width*.4]:
        for dy in [-.42,.42]:cube('Desk leg',(x+dx,y+dy,z/2),(.075,.075,z),M['navy'],.01)

def notebook(x,y,z=2.0,blue=True):
    cube('Notebook pages',(x,y,z),(.64,.78,.055),M['paper'],.025)
    cube('Notebook cover',(x,y,z-.045),(.69,.82,.035),M['blue'] if blue else M['pink'],.02)
    for k in range(6):cube('Notebook writing',(x,y-.28+k*.10,z+.032),(.43,.012,.003),M['muted'],.001)

def laptop(x,y,z=2.05):
    cube('Laptop keyboard',(x,y,z),(.85,.58,.035),M['navy'],.025)
    cube('Laptop screen frame',(x,y+.27,z+.34),(.87,.045,.67),M['navy'],.025)
    cube('Laptop illuminated display',(x,y+.239,z+.34),(.77,.012,.55),M['blue'],.01)
    for k in range(4):cube('Spreadsheet row',(x,y+.23,z+.52-k*.1),(.62,.008,.012),M['mint'],.001)

def room(classroom=False):
    cube('Room floor',(0,1,-.06),(18,20,.18),M['sand'],.02)
    cube('Back plaster wall',(0,4.6,4),(18,.2,8),M['cream'],.02)
    cube('Left plaster wall',(-4.2,1.4,4),(.2,6.5,8),M['cream'],.02)
    for z in [1.05,1.1]:cube('Wall skirting',(0,4.43,z),(17,.06,.045),M['wood'],.005)
    # A warm window and visible mullions make the room dimensional.
    cube('Window wood frame',(-3.93,1.8,4.1),(.12,2.55,2.4),M['wood'])
    cube('Warm sky through window',(-3.85,1.8,4.1),(.04,2.34,2.18),M['sky'])
    for pos in [1.8]:cube('Window mullion',(-3.80,pos,4.1),(.05,.065,2.25),M['cream'],.01)
    cube('Window crossbar',(-3.8,1.8,4.1),(.05,2.34,.06),M['cream'],.01)
    if classroom:
        cube('Classroom chalkboard',(0,4.36,4.3),(6.6,.14,2.55),M['wood'])
        cube('Green chalk surface',(0,4.25,4.3),(6.36,.05,2.32),M['green'])
        text('MATHEMATICS',-.7,4.20,5.0,.31,M['white'])
        text('x + y = ?',-.6,4.20,4.45,.34,M['white'])
        for x,y in [(-2.9,2.3),(2.6,2.7),(-2.7,-1.5),(2.7,-1.0)]:
            table(x,y,1.55,1.5);notebook(x,y,1.66)
            cube('School stool',(x,y+.9,.9),(.65,.65,.12),M['blue'])
    else:
        # Shelves, books and practical light: the analysis room is lived in.
        for z in [1.8,2.6,3.4,4.2]:
            cube('Wall shelf',(-2.65,3.9,z),(2.3,.55,.075),M['wood'])
            for k in range(7):
                cube('Reference book',(-3.55+k*.25,3.91,z+.29),(.17,.35,.5),[M['blue'],M['pink'],M['green']][k%3],.012)
        table(.65,-.15,1.65,2.4);laptop(.55,-.1,1.74);notebook(1.4,-.2,1.76)
        cube('Coffee mug',(1.58,.1,1.93),(.2,.2,.31),M['white'])
        rod('Desk lamp stem',(1.6,.45,1.75),(1.6,.45,2.6),.025,M['navy'])
        cube('Desk lamp shade',(1.6,.45,2.66),(.4,.3,.16),M['gold'])

def stadium():
    cube('Stadium grass',(0,1,-.07),(25,28,.2),M['grass'],.02)
    cube('Cricket pitch',(0,2,.05),(2.6,14,.04),M['pitch'],.02)
    for x in [-.6,-.42,-.24]:rod('Stump',(x,2.1,.06),(x,2.1,.85),.028,M['wood'])
    rod('Bail',(-.65,2.1,.87),(-.20,2.1,.87),.025,M['wood'])
    for y in [.95,3.1]:cube('Pitch crease',(0,y,.077),(2.45,.045,.006),M['white'],.001)
    for tier in range(5):
        y=5+tier*.58;z=.6+tier*.45
        cube('Terraced concrete grandstand',(0,y,z-.25),(20,.62,.55),M['sand'],.01)
        for k in range(36):
            cube('Grandstand seat',(-9+k*.52,y,z+.12),(.39,.36,.22),[M['pink'],M['blue'],M['gold']][(tier+k)%3],.035)
    for x in [-4,4]:
        rod('Floodlight mast',(x,5.5,0),(x,5.5,8),.10,M['navy'])
        cube('Floodlight bank',(x,5.5,8),(1.5,.2,.8),M['navy'])
        for j in range(5):cube('Floodlight lens',(x-.58+j*.29,5.37,8),(.2,.035,.5),M['white'])
    # Physical scoreboard support poles, rather than a floating classroom board.
    for x in [-.52,1.76]:rod('Scoreboard steel support',(x,1.49,.1),(x,1.49,5.5),.055,M['navy'])

def make_materials():
    return {k:mat('Set | '+k,c,emission=e) for k,c,e in [
        ('ink',(.016,.021,.035),.2),('navy',(.025,.055,.13),0),('blue',(.035,.20,.60),0),
        ('pink',(.74,.10,.32),0),('gold',(.97,.65,.10),0),('sand',(.60,.43,.28),0),
        ('cream',(.82,.73,.58),0),('paper',(.94,.91,.81),0),('white',(.95,.95,.87),.5),
        ('wood',(.29,.105,.045),0),('green',(.045,.18,.11),0),('grass',(.14,.33,.055),0),
        ('pitch',(.57,.40,.20),0),('mint',(.30,.77,.63),.2),('muted',(.30,.36,.40),0),
        ('sky',(.91,.68,.34),.7),('red',(.75,.07,.055),0)]}

def bar(x,z,value,color,label='',width=1.7):
    cube('Chart baseline',(x+width/2,1.18,z), (width,.012,.016),M['muted'],.001)
    o=cube('Evidence chart bar',(x+value*width/2,1.14,z+.075),(max(.025,value*width),.05,.14),color,.015)
    if label:text(label,x,1.1,z+.25,.14,M['ink'],'LEFT')
    # Reveal bars with a gentle scale-in, without changing the character.
    o.scale.x=.03;o.keyframe_insert('scale',frame=1);o.scale.x=1;o.keyframe_insert('scale',frame=30)

def visuals(shot):
    sid=shot['id']
    if sid=='01_notebook':
        table(0,-.7,1.7,2.1);notebook(-.1,-.7,1.8)
        board('THE BACK OF MY NOTEBOOK',['MY IPL XI','1. Opener','2. Another opener','... homework later'],.7,4.2,2.45,2.15)
    elif sid=='02_hackathon':
        board('RAJASTHAN ROYALS',['SupeRR Selector','HACKATHON','From favourites...','...to evidence'],.8,4.35,2.55,2.35)
    elif sid=='03_clean':
        board('RECONSTRUCT FIRST',['200,999 raw events','194,509 model eligible','Wides / no-balls','Run-outs / rain flags'],.85,4.25,2.7,2.6)
        for i in range(6):cube('Audit paper stack',(1.4,-.55,1.76+i*.035),(.5,.7,.025),M['paper'],.005)
    elif sid=='04_preball':
        board('ILLUSTRATIVE PRE-BALL STATE',['28 RUNS / 12 BALLS','Required rate: 14','Score. Wickets. Resources.','The outcome comes NEXT.'],.9,4.7,2.7,2.5,True)
        # Unhit ball remains visibly separate from the pre-ball display.
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=16,radius=.1,location=(1.2,-.8,.2));bpy.context.object.data.materials.append(M['red'])
    elif sid=='05_pressure':
        board('DIFFICULT vs CONSEQUENTIAL',['39 runs per over','High difficulty / low leverage','','2 needed off 1','The next ball matters'],.7,4.45,2.9,2.9,True)
    elif sid=='06_hybrid':
        board('MODEL D',['Difficulty percentile','+ leverage percentile','Divide by two','Top 20% within innings'],.85,4.9,2.7,1.95)
        # A tangible balance makes the two pressure components visible.
        cube('Hybrid balance foot',(.6,.65,1.83),(1.4,.65,.15),M['navy'])
        rod('Hybrid balance pivot',(.6,.65,1.9),(.6,.65,3.1),.075,M['gold'])
        beam=cube('Difficulty leverage seesaw',(.6,.65,3.10),(2.2,.13,.12),M['navy'])
        for frame,angle in [(1,-.12),(36,.12),(72,-.04),(120,0)]:beam.rotation_euler.y=angle;beam.keyframe_insert('rotation_euler',frame=frame)
        for x,color,label in [(-.25,M['pink'],'A'),(1.45,M['blue'],'B')]:
            rod('Suspended pressure pan',(x,.65,3.1),(x,.65,2.65),.018,M['gold'])
            cube('Pressure balance pan',(x,.65,2.63),(.6,.55,.07),color)
            text(label,x,.33,2.77,.3,M['white'])
    elif sid=='07_expected':
        board('ABOVE EXPECTATION',['BAT: extra runs + survival','BOWL: runs prevented','+ credited wickets','Positive = better'],.8,4.3,2.7,2.5)
    elif sid=='08_adjust':
        board('DECLARE THE ASSUMPTIONS',['Context / era / opposition','1 wicket = 15 runs','Sensitivity: 10 / 15 / 20','Assumption, not a fact'],.8,4.35,2.75,2.5)
    elif sid=='09_shrink':
        board('SHRINKAGE',['25 is not 400','Small sample?','Pull towards the average.'],.85,5.0,2.7,1.75)
        # Physical evidence stacks, scaled illustratively; numerals give exposure.
        for x,levels,color,label in [(.05,2,M['pink'],'25'),(1.25,9,M['blue'],'400')]:
            for k in range(levels):
                cube('Illustrative sample stack',(x,.45,1.92+k*.15),(.72,.65,.12),color,.025)
            text(label,x,.08,2.2+levels*.15,.31,M['ink'])
        text('PRESSURE EVENTS',.65,.05,1.9,.18,M['ink'])
    elif sid=='10_delta':
        board('QUALITY IS NOT DELTA',['Good under pressure?','Different from normal?','','Bowling delta: not validated','Batting delta: tiny CV gains'],.85,4.3,2.8,2.85)
    elif sid=='11_holdout':
        board('2026: UNSEEN-SEASON TEST',['Batting: rho = -0.043','Bowling: rho = +0.304','Economy advantage unproven','First-innings WP: weak'],.85,4.35,2.8,2.6)
    elif sid=='12_uncertainty':
        board('750 BOOTSTRAPS',['WHOLE MATCHES','Resample -> rerank','Historical stability'],.8,5.0,2.8,1.9)
        for k in range(9):
            card=cube('Bootstrap match card',(.65+(k%3-.9)*.52,.3+(k//3)*.12,1.95+(k//3)*.12),(.48,.58,.035),M['paper'],.02)
            card.rotation_euler.z=(k-4)*.085
            text('MATCH',.65+(k%3-.9)*.52,.22+(k//3)*.12,2.03+(k//3)*.12,.08,M['ink'])
        for k in range(11):
            h=.78*math.exp(-((k-5)/2.8)**2)
            cube('Illustrative bootstrap distribution',(-.3+k*.18,.9,2.4+h/2),(.13,.16,max(.03,h)),M['blue'],.01)
        text('RANK DISTRIBUTION',.6,.72,3.38,.19,M['ink'])
    elif sid=='13_sensitivity':
        board('THE RANKINGS MOVE',['Pressure definition changes:','D10: 5/10 batters retained','D10: 4/10 bowlers retained','','Best season removed: 9/10 out'],.85,5.0,2.9,1.95)
        # Ranking cards actually change position in the native scene source.
        for k in range(5):
            card=cube('Sensitivity rank card',(1.03,.6,3.9-k*.36),(1.8,.07,.28),M['paper'],.02)
            text(str(k+1)+'   EVIDENCE',1.03,.55,3.83-k*.36,.16,M['ink'])
            if k>1:
                card.keyframe_insert('location',frame=1);card.location.x+=.45 if k%2 else -.45;card.location.z-=.45
                card.rotation_euler.y=.35 if k%2 else -.35;card.keyframe_insert('location',frame=70);card.keyframe_insert('rotation_euler',frame=70)
    elif sid=='14_shortlist':
        board('PRIMARY D20 SHORTLIST',['BATTERS','1. Jos Buttler  |  2.871','2. Abhishek Sharma','3. Nicholas Pooran'],.85,4.6,2.8,2.55)
        board('BOWLERS',['1. Jasprit Bumrah  |  2.669','2. Sunil Narine','3. Abrar Ahmed','Exposure / uncertainty / format'],.85,2.25,2.8,1.85)
    elif sid=='15_replay':
        board('REPLAY: SEED 42',['22 analytical CSV outputs','41 checks passed','20 / 20 rankings reproduced','','Limitations still apply'],.85,4.3,2.8,2.8)
    else:
        table(0,-.6,1.7,2.0);notebook(.2,-.6,1.8)
        board('KHILADI',['BEYOND THE SCOREBOARD','','What does evidence support?','How sure should we be?'],.8,4.3,2.8,2.6)

def pose_rotation(rig,name,angle):
    pb=rig.pose.bones[name];axis=rig.data.bones[name].matrix_local.to_3x3().inverted() @ Vector((0,1,0))
    pb.rotation_mode='QUATERNION';pb.rotation_quaternion=Quaternion(axis,math.radians(angle))

def animate(rig,camera,n,idx):
    rig.animation_data_clear();rig.location=(-.88,-.22,0)
    for p in rig.pose.bones:p.rotation_mode='QUATERNION';p.rotation_quaternion=(1,0,0,0);p.location=(0,0,0)
    # Continuous keys every 3 frames. Smooth accents sit inside spoken gestures.
    for f in range(1,n+1,3):
        t=(f-1)/FPS;progress=(f-1)/max(1,n-1)
        accent=(math.sin(t*1.9+idx*.7)+1)/2
        pose_rotation(rig,'head',3.6*math.sin(t*1.3+idx*.5))
        pose_rotation(rig,'body',1.4*math.sin(t*1.0))
        if idx in [0,15]: # notebook writing and the return to the first question
            angles=(-15-3*math.sin(t*3),-86+5*math.sin(t*5),-8,-45)
        elif idx in [1,13,14]: # delighted discovery / completed shortlist
            angles=(-62-18*accent,-40+10*math.sin(t*2),28+16*accent,-45)
        elif idx in [4,8,10,12]: # skeptical open-handed question / surprise
            angles=(-65-7*math.sin(t*2),-18,58+8*math.sin(t*2),25)
        elif idx in [3,5,6,7,11]: # measured point towards the evidence
            angles=(-76-9*accent,-12+7*math.sin(t*1.7),8,-12)
        else: # sorting and reconstructing events at the desk
            angles=(-25-16*accent,-42+12*math.sin(t*2.3),12+7*math.sin(t*1.7),-28)
        for name,angle in zip(['upper_arm.R','forearm.R','upper_arm.L','forearm.L'],angles):pose_rotation(rig,name,angle)
        for name in ['head','body','upper_arm.R','forearm.R','upper_arm.L','forearm.L']:
            rig.pose.bones[name].keyframe_insert('rotation_quaternion',frame=f)
        rig.pose.bones['body'].location=(0,.018*math.sin(t*2.0),0)
        rig.pose.bones['body'].keyframe_insert('location',frame=f)
    # Three editorial camera setups per spoken section, each with its own dolly.
    # The middle shot privileges the evidence, the other two keep our same actor.
    scene=bpy.context.scene
    for marker in list(scene.timeline_markers):scene.timeline_markers.remove(marker)
    boundaries=[1,max(2,n//3),max(3,2*n//3),n+1]
    evidence_z=3.0 if idx in [8,11] else (3.65 if idx in [5,12] else 4.28)
    targets=[Vector((.02,.6,2.95)),Vector((.48,1.1,evidence_z)),Vector((.02,.5,3.45))]
    scales=[7.35,5.25,6.1]
    for cut in range(3):
        cam=camera if cut==0 else camera.copy()
        if cut:
            cam.data=camera.data.copy();scene.collection.objects.link(cam)
            cam.animation_data_clear();cam.data.animation_data_clear()
        cam.name=f'Shot {idx+1:02} camera {cut+1}';start,end=boundaries[cut],boundaries[cut+1]-1
        marker=scene.timeline_markers.new(f'Camera cut {cut+1}',frame=start);marker.camera=cam
        pos=Vector((.12,-12.7,5.6));target=targets[cut]
        for frame,offset,zoom in [(start,Vector((0,0,0)),scales[cut]),(end,Vector((.15 if idx%2 else -.15,.65,-.06)),scales[cut]*.96)]:
            cam.location=pos+offset;cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=zoom
            cam.keyframe_insert('location',frame=frame);cam.keyframe_insert('rotation_euler',frame=frame);cam.data.keyframe_insert('ortho_scale',frame=frame)
    scene.camera=camera

def build(shot,idx):
    global M
    bpy.ops.wm.open_mainfile(filepath=str(OUT/'master_character.blend'))
    scene=bpy.context.scene
    # Preserve only the master character and studio lighting.
    for o in list(bpy.data.objects):
        if o.name.startswith('Studio floor'):bpy.data.objects.remove(o,do_unlink=True)
    M=make_materials();rig=bpy.data.objects['Bean | animation rig']
    if shot['set']!='classroom':
        for o in list(bpy.data.objects):
            if o.name.startswith('Notebook |'):bpy.data.objects.remove(o,do_unlink=True)
    for o in bpy.data.objects:
        if o.name.startswith(('neutral |','happy |','determined |','surprised |')):
            expression='happy' if idx in [0,1,13,15] else ('surprised' if idx in [4,8,10,12] else 'determined')
            o.hide_render=not o.name.startswith(expression+' |')
    if shot['set']=='stadium':stadium()
    else:room(shot['set']=='classroom')
    visuals(shot)
    camera=scene.camera;camera.data.type='ORTHO'
    # Avoid severe perspective hiding the reference's minimal face strokes.
    timing=TIMINGS.get(shot['id'],{})
    n=int(timing.get('frames',math.ceil(float(timing.get('duration',12))*FPS)))
    scene.frame_start=1;scene.frame_end=n;scene.render.fps=FPS
    scene.render.resolution_x=WIDTH;scene.render.resolution_y=HEIGHT;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
    scene.render.engine=os.getenv('KHILADI_RENDER_ENGINE','BLENDER_EEVEE')
    if scene.render.engine=='BLENDER_WORKBENCH':
        shading=scene.display.shading;shading.light='STUDIO';shading.studio_light='paint.sl';shading.color_type='MATERIAL'
        shading.show_shadows=True;shading.show_cavity=True;shading.cavity_type='BOTH';shading.curvature_ridge_factor=1.0;shading.curvature_valley_factor=.6
        shading.background_type='WORLD';scene.world.color=(.49,.56,.67)
        scene.display.render_aa='16'
    if hasattr(scene,'eevee'):
        if hasattr(scene.eevee,'taa_render_samples'):scene.eevee.taa_render_samples=16 if DRAFT else 24
        if hasattr(scene.eevee,'use_raytracing'):scene.eevee.use_raytracing=False
    scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.55,.64,.79,1) if shot['set']=='stadium' else (.65,.57,.43,1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
    animate(rig,camera,n,idx)
    scene['shot_id']=shot['id'];scene['narration']=shot['narration'];scene['source']= 'User supplied methodology; historical descriptive evidence'
    scene['style_audit']='One linked master rig geometry. Camera motion native 3D, 30fps. Warm soft lights. No website insert.'
    scene.frame_set(1)
    return scene,n

def main():
    for idx,shot in enumerate(STORY):
        if SELECT and shot['id'] not in SELECT.split(','):continue
        t=time.time();scene,n=build(shot,idx)
        if DRAFT:
            scene.frame_set(max(1,min(n,45)));scene.render.filepath=str(WORK/'film_previews'/(shot['id']+'.png'))
            bpy.ops.render.render(write_still=True)
            if os.getenv('KHILADI_AUDIT_CUTS')=='1':
                for cut,frame in [(2,n//2),(3,5*n//6)]:
                    scene.frame_set(frame);scene.render.filepath=str(WORK/'film_previews'/(shot['id']+f'_cut{cut}.png'))
                    bpy.ops.render.render(write_still=True)
            if os.getenv('KHILADI_BENCH')=='1':
                for extra in [1,2]:
                    started=time.time();scene.frame_set(scene.frame_current+1)
                    scene.render.filepath=str(WORK/'film_previews'/(shot['id']+f'_bench{extra}.png'))
                    bpy.ops.render.render(write_still=True)
                    print('WARM_FRAME_SECONDS',round(time.time()-started,3),flush=True)
        else:
            folder=WORK/'film_frames'/shot['id'];folder.mkdir(parents=True,exist_ok=True)
            scene.render.filepath=str(folder/'frame_')
            bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'blender_scenes'/(shot['id']+'.blend')))
            if idx==0:bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'khiladi_film.blend'))
            bpy.ops.render.render(animation=True)
        print('SHOT_COMPLETE',shot['id'],'frames',1 if DRAFT else n,'seconds',round(time.time()-t,2),flush=True)
    if Path(__file__).resolve()!=OUT/'render_film.py':shutil.copy2(__file__,OUT/'render_film.py')

if __name__=='__main__':main()
