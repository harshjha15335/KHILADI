"""Verify the preserved migration snapshot without rendering or changing files."""
import argparse,hashlib,json,pathlib,subprocess,shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--media',action='store_true');args=p.parse_args()
    manifest=json.loads((ROOT/'ASSET_MANIFEST.json').read_text());errors=[]
    for item in manifest['files']:
        path=ROOT/item['path']
        if not path.is_file():errors.append('Missing '+item['path']);continue
        if hashlib.sha256(path.read_bytes()).hexdigest()!=item['sha256']:errors.append('Changed '+item['path'])
    plates=sorted((ROOT/'work/reel/plates').glob('*.png'));actors=sorted((ROOT/'work/reel/actors_raw_corrected/reading').glob('*.png'))
    if len(plates)!=21:errors.append(f'Expected21 plates; found{len(plates)}')
    if [f.name for f in actors]!=[f'frame_{i:04d}.png' for i in range(1,44)]:errors.append('Expected corrected reading frames0001–0043')
    if args.media:
        from PIL import Image
        for path in plates+actors:
            try:
                with Image.open(path) as image:
                    image.load();expected=((1080,1920),'RGB') if path in plates else ((1308,2324),'RGBA')
                    if (image.size,image.mode)!=expected:errors.append('Wrong image shape/mode '+str(path))
            except Exception as exc:errors.append(str(path)+': '+str(exc))
        if not shutil.which('ffprobe'):errors.append('ffprobe unavailable for MP4 verification')
        else:
            info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=width,height,nb_read_frames,avg_frame_rate,duration','-of','json',str(ROOT/'outputs/character-motion-test-v3.mp4')]))['streams'][0]
            if (info['width'],info['height'],info['avg_frame_rate'],int(info['nb_read_frames']))!=(1080,1920,'30/1',240):errors.append('V3 video metadata mismatch')
    print(json.dumps({'files_hashed':len(manifest['files']),'plates':len(plates),'corrected_reading_frames':len(actors),'errors':errors,'production_complete':False},indent=2))
    if errors:raise SystemExit(1)
if __name__=='__main__':main()
