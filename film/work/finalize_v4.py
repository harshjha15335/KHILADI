"""Encode the V4 validation test and compare it with the retained V3."""
import argparse,json,pathlib,subprocess
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parent.parent
WORK=ROOT/'work';OUT=ROOT/'outputs'
def run(args):subprocess.run(args,check=True)
def font(size):
    try:return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',size)
    except OSError:return ImageFont.load_default()
def probe(path):return json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(path)]))
def encode_frames(folder,dest,native=True):
    frames=sorted(folder.glob('frame_*.png'))
    if len(frames)!=240 or [int(p.stem.split('_')[-1]) for p in frames]!=list(range(1,241)):raise ValueError(f'{folder}: incomplete sequence')
    dims={Image.open(p).size for p in frames}
    if native and dims!={(1080,1920)}:raise ValueError(f'Not native1080: {dims}')
    pad=len(frames[0].stem.split('_')[-1])
    run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','30','-start_number','1','-i',str(folder/f'frame_%0{pad}d.png'),'-frames:v','240','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','16' if native else '18','-r','30','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',str(dest)])
    return frames
def comparison(v4,dest):
    label=Image.new('RGBA',(1080,64),(54,48,44,255));d=ImageDraw.Draw(label)
    d.text((270,32),'V3',fill='white',font=font(32),anchor='mm');d.text((810,32),'V4',fill='white',font=font(32),anchor='mm');label.save(WORK/'v4_compare_labels.png')
    run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(OUT/'character-motion-test-v3.mp4'),'-i',str(v4),'-loop','1','-framerate','30','-i',str(WORK/'v4_compare_labels.png'),'-filter_complex_threads','2','-filter_complex','[0:v]scale=540:960,setsar=1[a];[1:v]scale=540:960,setsar=1[b];[a][b]hstack=inputs=2,pad=1080:1024:0:64:color=0x36302c[base];[base][2:v]overlay=0:0,format=yuv420p[v]','-map','[v]','-an','-frames:v','240','-r','30','-c:v','libx264','-preset','veryfast','-crf','17','-movflags','+faststart',str(dest)])
def contact(frames,dest):
    samples=[(1,'0.00 / reading'),(45,'1.47 / suspicion'),(70,'2.30 / realization'),(107,'3.53 / frustration'),(144,'4.77 / frustration'),(164,'5.43 / laughter'),(198,'6.57 / laughter'),(231,'7.67 / recovery')]
    canvas=Image.new('RGB',(1440,1370),(155,143,132));d=ImageDraw.Draw(canvas)
    for i,(n,label) in enumerate(samples):
        im=Image.open(frames[n-1]).convert('RGB');im.thumbnail((360,640));x=(i%4)*360;y=(i//4)*685
        canvas.paste(im,(x,y));d.text((x+180,y+661),label,font=font(18),fill=(20,16,14),anchor='mm')
    canvas.save(dest)
def main():
    ap=argparse.ArgumentParser();ap.add_argument('--draft',action='store_true');a=ap.parse_args()
    if a.draft:
        video=OUT/'motion-timing-preview-v4.mp4';frames=encode_frames(WORK/'v4_draft',video,False)
        comparison(video,OUT/'motion-v3-v4-draft-comparison.mp4');contact(frames,WORK/'v4-draft-timing-contact.png');print('V4 draft encoded');return
    video=OUT/'character-motion-test-v4.mp4';frames=encode_frames(WORK/'v4_motion',video)
    comparison(video,OUT/'motion-v3-v4-comparison.mp4');contact(frames,OUT/'motion-timing-contact-v4.png')
    info=probe(video);s=info['streams'][0]
    decoded=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','NUL'],capture_output=True,text=True)
    checks={'native_1080_portrait':(s['width'],s['height'])==(1080,1920),'30_fps':s['avg_frame_rate']=='30/1','240_frames':int(s['nb_read_frames'])==240,'8_seconds':abs(float(s['duration'])-8)<.001,'complete_decode':decoded.returncode==0 and not decoded.stderr.strip()}
    report={'checks':checks,'video_stream':{k:s.get(k) for k in ['width','height','duration','nb_read_frames','avg_frame_rate','codec_name','pix_fmt']},'note':'Silent acting test. V3 appearance retained; full film awaits motion approval.'}
    (OUT/'motion-technical-audit-v4.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
    if not all(checks.values()):raise SystemExit(1)
if __name__=='__main__':main()
