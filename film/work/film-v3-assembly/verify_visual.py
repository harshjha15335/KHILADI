"""Actual encoded coverage/insertion checks, independent of render exit codes."""
from pathlib import Path
import json,subprocess,hashlib
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'outputs/film-v3-assembly';timings=json.loads((ROOT/'work/full-film-v3/timing.json').read_text());expected={r['id']:r['frames'] for r in timings}
def probe(path,count=False):
 args=['ffprobe','-v','error']+(['-count_frames'] if count else [])+['-show_streams','-show_format','-of','json',str(path)];return json.loads(subprocess.check_output(args))
manifest=json.loads((OUT/'render-manifest.json').read_text());film=OUT/'KHILADI_VISUAL_DRAFT_SILENT.mp4';p=probe(film,True);v=next(s for s in p['streams'] if s['codec_type']=='video')
checks={'sixteen_scenes':len(manifest['scenes'])==16,'same_scene_order':[r['id'] for r in manifest['scenes']]==[r['id'] for r in timings],'frame_total':int(v['nb_read_frames'])==sum(expected.values())==5992,'native_1080x1920':(v['width'],v['height'])==(1080,1920),'fps30':v['avg_frame_rate']=='30/1','h264_yuv420p':v['codec_name']=='h264' and v['pix_fmt']=='yuv420p','silent_visual_master':all(s['codec_type']!='audio' for s in p['streams']),'no_placeholder_plates':all(not s['pending_plate'] for s in manifest['scenes']),'corrected_opening':manifest['scenes'][0].get('opening_injected',False),'duration':abs(float(p['format']['duration'])-5992/30)<.05}
for scene in manifest['scenes']:
 q=probe(scene['path']);sv=next(s for s in q['streams'] if s['codec_type']=='video');checks['scene_'+scene['id']]=int(sv['nb_frames'])==expected[scene['id']]
website=[i for s in manifest['scenes'] for i in s.get('inserts',[]) if i.get('kind')=='actual_website'];report=[i for s in manifest['scenes'] for i in s.get('inserts',[]) if i.get('kind')=='qualified_report']
checks['real_website_exact4s']=len(website)==1 and website[0]['frames']==120 and int(probe(website[0]['path'])['streams'][0]['nb_frames'])==120
checks['qualified_report_exact10s']=len(report)==1 and report[0]['frames']==300 and int(probe(report[0]['path'])['streams'][0]['nb_frames'])==300
result=subprocess.run(['ffmpeg','-v','error','-i',str(film),'-f','null','-'],capture_output=True,text=True);checks['full_decode']=result.returncode==0 and not result.stderr.strip()
contact=Image.new('RGB',(864,1656),(28,28,28));d=ImageDraw.Draw(contact)
for i,(scene,timing) in enumerate(zip(manifest['scenes'],timings)):
 at=timing['start_seconds']+timing['duration']*.46;dest=OUT/f"FINAL_SCENE_{scene['id']}.png";subprocess.run(['ffmpeg','-v','error','-y','-ss',str(at),'-i',str(film),'-frames:v','1',str(dest)],check=True)
 with Image.open(dest) as image:image.thumbnail((216,384));contact.paste(image,((i%4)*216,(i//4)*414))
 d.text(((i%4)*216+5,(i//4)*414+390),scene['id'],fill='white')
contact.save(OUT/'FULL_VISUAL_CONTACT.png')
report=dict(checks=checks,frames=int(v['nb_read_frames']),duration=float(p['format']['duration']),source_sha256=hashlib.file_digest(film.open('rb'),'sha256').hexdigest(),website=website,report=report,decode_errors=result.stderr,limitations=['Silent master: root adds approved Michael narration, original score/foley and captions.','Hybrid2.5D retained puppet/evidence animation. Repeated paper/bust composition remains a style limitation.','Not a claim of exact reference likeness, continuous3D simulation, fully animated extras or independently rerun analysis.'])
(OUT/'VISUAL_TECHNICAL_QA.json').write_text(json.dumps(report,indent=2));print(json.dumps(checks,indent=2));assert all(checks.values())
