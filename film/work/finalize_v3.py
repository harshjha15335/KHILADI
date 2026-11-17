"""Encode and inspect the eight-second master-character validation test."""
import json, pathlib, subprocess, hashlib
from PIL import Image, ImageDraw, ImageFont

ROOT=pathlib.Path(__file__).resolve().parent.parent
WORK=ROOT/'work';OUT=ROOT/'outputs'

def run(args):subprocess.run(args,check=True)

def font(size):
    try:return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',size)
    except OSError:return ImageFont.load_default()

def sheet():
    names=['front','three_quarter','angry','confused','laugh']
    labels=['NEUTRAL / FRONT','THREE-QUARTER','COMEDIC ANGER','CONFUSED','WIDE LAUGH']
    cells=[]
    for name in names:
        p=WORK/'v3_sheet'/(name+'.png')
        if not p.exists():raise FileNotFoundError(p)
        im=Image.open(p).convert('RGB');im.thumbnail((432,768));cells.append(im)
    canvas=Image.new('RGB',(2160,830),(155,143,132));d=ImageDraw.Draw(canvas)
    for i,(im,label) in enumerate(zip(cells,labels)):
        canvas.paste(im,(i*432+(432-im.width)//2,0))
        d.text((i*432+216,794),label,font=font(22),fill=(22,17,15),anchor='mm')
    canvas.save(OUT/'character-validation-v3.png')

def main():
    frames=sorted((WORK/'v3_motion').glob('frame_*.png'))
    if len(frames)!=240:raise ValueError(f'Expected240frames, found{len(frames)}')
    if [int(p.stem.split('_')[-1]) for p in frames]!=list(range(1,241)):raise ValueError('Non-contiguous frame sequence')
    sizes={Image.open(p).size for p in frames}
    if sizes!={(1080,1920)}:raise ValueError(f'Native render resolution mismatch: {sizes}')
    width=len(frames[0].stem.split('_')[-1])
    film=OUT/'character-motion-test-v3.mp4'
    run(['ffmpeg','-hide_banner','-loglevel','error','-y','-framerate','30','-start_number','1','-i',str(WORK/'v3_motion'/f'frame_%0{width}d.png'),'-frames:v','240','-vf','scale=out_color_matrix=bt709:out_range=tv,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','16','-r','30','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart',str(film)])
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(film)]))
    s=probe['streams'][0]
    checks={'native_1080_portrait':(s['width'],s['height'])==(1080,1920),'native_30fps':s['avg_frame_rate']=='30/1','240_frames':int(s['nb_read_frames'])==240,'exactly_8_seconds':abs(float(s['duration'])-8)<.001,'all_source_frames_present':True}
    decoded=subprocess.run(['ffmpeg','-v','error','-i',str(film),'-f','null','NUL'],capture_output=True,text=True)
    checks['full_file_decodes']=decoded.returncode==0 and not decoded.stderr.strip()
    captures=[(1,'0.00s / notebook'),(45,'1.47s / notebook'),(70,'2.30s / realization'),(107,'3.53s / frustration'),(144,'4.77s / frustration'),(164,'5.43s / laughter'),(198,'6.57s / laughter'),(231,'7.67s / pause')]
    contact=Image.new('RGB',(1440,1370),(155,143,132));d=ImageDraw.Draw(contact)
    for i,(n,label) in enumerate(captures):
        im=Image.open(frames[n-1]).convert('RGB');im.thumbnail((360,640));x=(i%4)*360;y=(i//4)*685
        contact.paste(im,(x,y));d.text((x+180,y+661),label,font=font(18),fill=(20,16,14),anchor='mm')
    contact.save(OUT/'motion-timing-contact-v3.png')
    report={'technical_checks':checks,'duration':s['duration'],'frame_count':s['nb_read_frames'],'fps':s['avg_frame_rate'],'source_frame_dimensions':list(sizes.pop()),'timing_specification':{'0–2':'Neutral, looking at notebook','2–3':'Sudden realization','3–5':'Frustration with brow deformation and arm movement','5–7':'Exaggerated laughter, head bobbing','7–8':'Neutral return and comedic pause'},'note':'Silent character validation test. No full-film production. Aesthetic review requires viewing against the original reel; technical checks do not establish style approval.'}
    (OUT/'motion-technical-audit-v3.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    sheet()
    print(json.dumps(report,indent=2))
    if not all(checks.values()):raise SystemExit(1)

if __name__=='__main__':main()

