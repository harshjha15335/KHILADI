from pathlib import Path
import json,subprocess,hashlib,importlib.util
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'outputs/qualified-report-reveal';SOURCE=ROOT/'work/qualified-report-reveal/render_report_reveal.py'
# Recheck actual source/value-to-row bindings; does not change video content.
spec=importlib.util.spec_from_file_location('qualified_report',SOURCE);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);m.data_and_pages()
p=OUT/'QUALIFIED_REPORT_REVEAL.mp4';probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)]));v=next(s for s in probe['streams'] if s['codec_type']=='video')
checks={'size':(v['width'],v['height'])==(1080,1920),'fps':v['avg_frame_rate']=='30/1','frames':int(v['nb_read_frames'])==300,'duration':abs(float(probe['format']['duration'])-10)<.04,'h264':v['codec_name']=='h264','yuv420p':v['pix_fmt']=='yuv420p','silent':not any(s['codec_type']=='audio' for s in probe['streams'])}
decode=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,text=True,check=True);checks['full_decode']=not decode.stderr.strip()
contact=Image.new('RGB',(810,1040),(24,24,24));d=ImageDraw.Draw(contact)
for i,t in enumerate([.05,.45,2.5,4.85,5.25,7.5]):
 dest=OUT/f'encoded-check-{i}.png';subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(p),'-frames:v','1',str(dest)],check=True)
 with Image.open(dest) as im:im.load();im.thumbnail((270,480));contact.paste(im,((i%3)*270,(i//3)*520))
 d.text(((i%3)*270+5,(i//3)*520+486),f'{t:.2f}s',fill='white')
contact.save(OUT/'REPORT_REVEAL_CONTACT.png')
report={'checks':checks,'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),'frames':int(v['nb_read_frames']),'duration_seconds':float(probe['format']['duration']),'data_checks':json.loads((OUT/'REPORT_DATA_CHECKS.json').read_text()),'limits':['Technical decoding and source/row checks do not establish final perceived readability or motion approval.','All20 names and supplied fields are shown; viewers may pause to read every small value.','No independent analytical pipeline or41 replay checks were rerun.','No narrator/caption/foley sync is included in this silent insert.']}
(OUT/'REPORT_REVEAL_TECHNICAL_QA.json').write_text(json.dumps(report,indent=2));assert all(checks.values());print(json.dumps(report,indent=2))
