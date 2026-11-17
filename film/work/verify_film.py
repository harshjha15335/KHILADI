import json,pathlib,subprocess
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parent.parent
WORK=ROOT/'work';OUT=ROOT/'outputs';film=OUT/'khiladi-film.mp4'
timing=json.loads((WORK/'timing.json').read_text())
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(film)]))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
expected=sum(s['frames'] for s in timing)
checks={'1080x1920':(v['width'],v['height'])==(1080,1920),'30fps':v['avg_frame_rate']=='30/1','all_frames':int(v['nb_read_frames'])==expected,'h264':v['codec_name']=='h264','audio_present':a['codec_name']=='aac','audio_sync':abs(float(v['duration'])-float(a['duration']))<.15,'duration':abs(float(probe['format']['duration'])-expected/30)<.15}
decode=subprocess.run(['ffmpeg','-v','error','-i',str(film),'-f','null','NUL'],capture_output=True,text=True)
checks['full_decode']=decode.returncode==0 and not decode.stderr.strip()
contact=Image.new('RGB',(960,4*460),(28,28,28));draw=ImageDraw.Draw(contact)
offset=0
for i,s in enumerate(timing):
    at=offset+min(s['duration']*.45,5);p=WORK/f'qa_shot_{i:02}.png'
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(at),'-i',str(film),'-frames:v','1',str(p)],check=True)
    im=Image.open(p);im.thumbnail((240,427));x=(i%4)*240;y=(i//4)*460;contact.paste(im,(x,y));draw.text((x+4,y+433),s['id'],fill='white');offset+=s['duration']
contact.save(OUT/'film-audit-contact.png')
report={'checks':checks,'expected_frames':expected,'duration_seconds':float(probe['format']['duration']),'video':{k:v.get(k) for k in ['codec_name','width','height','avg_frame_rate','nb_read_frames','pix_fmt']},'decode_errors':decode.stderr,'source':'User-supplied methodology; analysis figures not independently recomputed.','pipeline':'Blender EEVEE 3D plates and native30fps fixed-rig layers, composited1080portrait; website deferred.'}
(OUT/'film-technical-audit.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if not all(checks.values()):raise SystemExit(1)
