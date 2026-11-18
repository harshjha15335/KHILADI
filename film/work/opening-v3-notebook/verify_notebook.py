from pathlib import Path
import json,subprocess,hashlib
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'outputs/opening-v3-notebook'
metadata=json.loads((OUT/'NOTEBOOK_METADATA.json').read_text());reports=[]
contact=Image.new('RGB',(810,1020),(26,24,23));draw=ImageDraw.Draw(contact)
for i,clip in enumerate(metadata['clips']):
 p=Path(clip['path']);info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(p)]));v=next(s for s in info['streams'] if s['codec_type']=='video')
 checks={'size':(v['width'],v['height'])==(1080,1920),'fps':v['avg_frame_rate']=='30/1','frames':int(v['nb_read_frames'])==clip['frames'],'silent':not any(s['codec_type']=='audio' for s in info['streams']),'h264':v['codec_name']=='h264','duration':abs(float(info['format']['duration'])-clip['duration'])<.04}
 decode=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,text=True,check=True);checks['full_decode']=not decode.stderr.strip();assert all(checks.values()),(p,checks)
 dest=OUT/(clip['name']+'-encoded.png');subprocess.run(['ffmpeg','-v','error','-y','-ss',str(clip['duration']*.5),'-i',str(p),'-frames:v','1',str(dest)],check=True)
 with Image.open(dest) as im:
  im.load();im.thumbnail((270,480));contact.paste(im,((i%3)*270,(i//3)*510))
 draw.text(((i%3)*270+5,(i//3)*510+484),clip['name'],fill='white')
 reports.append({'clip':clip['name'],'checks':checks,'frames':int(v['nb_read_frames']),'sha256':hashlib.file_digest(p.open('rb'),'sha256').hexdigest(),'duration':float(info['format']['duration'])})
contact.save(OUT/'NOTEBOOK_CONTACT_SHEET.png');(OUT/'NOTEBOOK_TECHNICAL_QA.json').write_text(json.dumps(reports,indent=2))
# Short actual encoded preview, no audio or public/reference media.
listing=OUT/'notebook-clips.concat.txt';listing.write_text('\n'.join("file '"+c['path']+"'" for c in metadata['clips']))
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(OUT/'NOTEBOOK_CUTAWAYS_SILENT.mp4')],check=True)
print(json.dumps(reports,indent=2))
