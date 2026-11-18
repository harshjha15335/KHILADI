"""Check final encoded film, audio levels, scene coverage and inserted real assets."""
from pathlib import Path
import json,subprocess,re,argparse
import numpy as np
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'outputs/full-film-v3';WORK=ROOT/'work/full-film-v3'
p=argparse.ArgumentParser();p.add_argument('--film',default=str(OUT/'KHILADI_FINAL_REEL.mp4'));a=p.parse_args();film=Path(a.film)
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
timing=json.loads((WORK/'timing.json').read_text());expected=sum(t['frames'] for t in timing)
probe=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(film)]).stdout);v=next(s for s in probe['streams'] if s['codec_type']=='video');au=next(s for s in probe['streams'] if s['codec_type']=='audio')
checks=dict(portrait1080=(v['width'],v['height'])==(1080,1920),fps30=v['avg_frame_rate']=='30/1',all_frames=int(v['nb_read_frames'])==expected,h264=v['codec_name']=='h264',pixel_format=v['pix_fmt']=='yuv420p',aac=au['codec_name']=='aac',audio48k=au['sample_rate']=='48000',duration=abs(float(probe['format']['duration'])-expected/30)<.08,sync=abs(float(v['duration'])-float(au['duration']))<.08)
dec=run(['ffmpeg','-v','error','-i',str(film),'-f','null','-']);checks['full_decode']=not dec.stderr.strip()
levels=run(['ffmpeg','-hide_banner','-i',str(film),'-vn','-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-']).stderr;m=re.search(r'\{\s*"input_i".*?\}',levels,re.S);loud=json.loads(m.group());checks['no_clipping']=float(loud['input_tp'])<=-1.0;checks['voice_level']=abs(float(loud['input_i'])+16)<=1.5
samples=OUT/'qa-frames';samples.mkdir(exist_ok=True);contact=Image.new('RGB',(1080,4*510),(24,24,24));draw=ImageDraw.Draw(contact);coverage=[]
for i,t in enumerate(timing):
 at=t['start_seconds']+t['duration']*.46;path=samples/(t['id']+'.png');run(['ffmpeg','-v','error','-y','-ss',str(at),'-i',str(film),'-frames:v','1',str(path)])
 with Image.open(path) as im:
  im.load();im.thumbnail((270,480));x=(i%4)*270;y=(i//4)*510;contact.paste(im,(x,y));draw.text((x+5,y+485),f"{t['id']}  {at:.2f}s",fill='white')
 coverage.append(dict(id=t['id'],start=t['start_seconds'],end=t['start_seconds']+t['duration'],frames=t['frames'],sample_time=at))
contact.save(OUT/'FINAL_REEL_CONTACT.png')
# Insert identity check excludes the caption zone, comparing the final encoded
# composition with original insert frames at the same source time.
by={t['id']:t for t in timing};insert_checks=[]
for label,sid,offset,source,at in [('batting','14_shortlist',2,ROOT/'outputs/qualified-report-reveal/QUALIFIED_REPORT_REVEAL.mp4',2.5),('bowling','14_shortlist',2,ROOT/'outputs/qualified-report-reveal/QUALIFIED_REPORT_REVEAL.mp4',7.5),('website','15_replay',184/30,ROOT/'outputs/website-capture/KHILADI_WEBSITE_INSERT_4S.mp4',3.5)]:
 gt=by[sid]['start_seconds']+offset+at;paths=[]
 for prefix,media,sec in [('final',film,gt),('source',source,at)]:
  dest=samples/f'{label}-{prefix}.png';run(['ffmpeg','-v','error','-y','-ss',str(sec),'-i',str(media),'-frames:v','1',str(dest)]);paths.append(dest)
 arrays=[]
 for path in paths:
  with Image.open(path) as im:arrays.append(np.asarray(im.convert('RGB').crop((0,0,1080,1700)).resize((270,425)),dtype=float))
 delta=float(np.abs(arrays[0]-arrays[1]).mean());insert_checks.append(dict(label=label,global_time=gt,mean_absolute_rgb_difference=delta,consistent_with_expected_insert=delta<8.0))
checks['report_and_website_insert_identity']=all(x['consistent_with_expected_insert'] for x in insert_checks)
report=dict(checks=checks,expected_frames=expected,duration_seconds=float(probe['format']['duration']),video={k:v.get(k) for k in ['codec_name','width','height','avg_frame_rate','nb_read_frames','pix_fmt']},audio={k:au.get(k) for k in ['codec_name','sample_rate','channels','duration']},audio_levels=loud,scenes=coverage,inserts=insert_checks,caption_alignment=json.loads((OUT/'CAPTION_ALIGNMENT_REPORT.json').read_text()),limits=['Encoded technical checks do not establish exact reference likeness or subjective sound quality.','Approved Michael voice was used; no source narrator/audio cloned or reused.','Classmates remain mostly still artwork; foreground is articulated2.5D performance, not fully simulated3D acting.'])
(OUT/'FINAL_TECHNICAL_QA.json').write_text(json.dumps(report,indent=2));print(json.dumps({'checks':checks,'audio_levels':loud,'insert_checks':insert_checks},indent=2));assert all(checks.values())
