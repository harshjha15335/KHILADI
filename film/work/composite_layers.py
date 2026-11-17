"""Composite fixed Blender character cycles and 3D plates at native 30 fps."""
import argparse, json, pathlib, subprocess, shutil, sys

ROOT=pathlib.Path(__file__).resolve().parent.parent
WORK=ROOT/'work'; OUT=ROOT/'outputs'
FFMPEG=shutil.which('ffmpeg')

def run(args):
    subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-y',*map(str,args)],check=True)

def path_filter(p):
    return str(pathlib.Path(p).resolve()).replace('\\','/').replace(':',r'\:').replace("'",r"\'")

def concat(clips,dest):
    listing=dest.with_suffix('.concat.txt')
    listing.write_text('\n'.join("file '"+str(c.resolve()).replace('\\','/').replace("'","'\\''")+"'" for c in clips),encoding='utf-8')
    run(['-f','concat','-safe','0','-i',listing,'-c','copy','-movflags','+faststart',dest])

def reusable(dest,frames,deps):
    if not dest.exists() or any(pathlib.Path(p).stat().st_mtime>dest.stat().st_mtime for p in deps):return False
    try:
        result=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=nb_frames','-of','json',str(dest)]))
        return int(result['streams'][0]['nb_frames'])==frames
    except (ValueError,KeyError,IndexError,subprocess.CalledProcessError):return False

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--metadata',default=str(WORK/'layers'/'layout.json'));ap.add_argument('--scene');ap.add_argument('--preview',action='store_true');args=ap.parse_args()
    data=json.loads(pathlib.Path(args.metadata).read_text(encoding='utf-8'))
    width=data.get('width',1080);height=data.get('height',1920);fps=data.get('fps',30)
    enc=WORK/'layer_clips';enc.mkdir(exist_ok=True)
    timing={s['id']:s for s in json.loads((WORK/'timing.json').read_text(encoding='utf-8'))}
    loop_files={}
    for name,loop in data['loops'].items():
        dest=enc/(name+'.mov');loop_files[name]=dest
        sources=list(pathlib.Path(loop['directory']).glob('frame_*.png'))
        if len(sources)!=loop['frame_count']:raise ValueError(f'{name}: incomplete actor cycle')
        if reusable(dest,loop['frame_count'],sources):continue
        run(['-framerate',fps,'-start_number',loop.get('start_number',1),'-i',pathlib.Path(loop['directory'])/loop.get('pattern','frame_%04d.png'),'-frames:v',loop['frame_count'],'-c:v','qtrle','-pix_fmt','argb',dest])
    scene_files=[]
    for scene in data['scenes']:
        sid=scene['id']
        if args.scene and sid!=args.scene:continue
        cut_files=[]
        for ci,cut in enumerate(scene['cuts']):
            dest=enc/f'{sid}_{ci}.mp4';cut_files.append(dest)
            frames=cut['frames'];duration=frames/fps
            deps=[cut['plate']]
            if cut.get('loop'):deps.append(loop_files[cut['loop']])
            if cut.get('foreground'):deps.append(cut['foreground'])
            deps.extend(g['path'] for g in cut.get('graphics',[]))
            if not args.preview and reusable(dest,frames,deps):continue
            inputs=['-loop','1','-framerate',fps,'-i',cut['plate']]
            filters=[f'[0:v]scale={width}:{height},setsar=1,format=rgba[bg]'];last='bg';input_index=1
            if cut.get('loop'):
                inputs+=['-stream_loop','-1','-i',loop_files[cut['loop']]]
                aw=cut.get('actor_width',data['loops'][cut['loop']].get('width'))
                ah=cut.get('actor_height',data['loops'][cut['loop']].get('height'))
                actor=f'[{input_index}:v]setpts=PTS-STARTPTS,format=rgba'
                if aw and ah:actor+=f',scale={aw}:{ah}:flags=lanczos'
                actor+='[actor]';filters.append(actor)
                filters.append(f'[{last}][actor]overlay=x={cut.get("actor_x",0)}:y={cut.get("actor_y",0)}:format=auto:shortest=1[withactor]');last='withactor';input_index+=1
            if cut.get('foreground'):
                inputs+=['-loop','1','-framerate',fps,'-i',cut['foreground']]
                filters.append(f'[{input_index}:v]scale={width}:{height},format=rgba[fg]')
                filters.append(f'[{last}][fg]overlay=0:0:format=auto[withfg]');last='withfg';input_index+=1
            for gi,g in enumerate(cut.get('graphics',[])):
                inputs+=['-loop','1','-framerate',fps,'-i',g['path']]
                filters.append(f'[{input_index}:v]format=rgba[graphic{gi}]')
                x=g.get('x',0);y=g.get('y',0)
                filters.append(f'[{last}][graphic{gi}]overlay=x={x}:y={y}:format=auto[withg{gi}]');last=f'withg{gi}';input_index+=1
            # Every output frame has fresh rig motion; this smooth push adds camera movement.
            filters.append(f'[{last}]zoompan=z=\'1+0.025*on/{max(frames-1,1)}\':x=\'iw/2-iw/zoom/2\':y=\'ih/2-ih/zoom/2\':d=1:s={width}x{height}:fps={fps},format=yuv420p[v]')
            run([*inputs,'-filter_complex_threads','2','-filter_complex',';'.join(filters),'-map','[v]','-an','-frames:v',1 if args.preview else frames,'-r',fps,'-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p',dest])
            print('CUT',sid,ci,frames,flush=True)
            if args.preview:
                png=OUT/f'composite-preview-{sid}-{ci}.png'
                run(['-i',dest,'-frames:v','1',png]);print(png,flush=True);return
        raw=enc/(sid+'_raw.mp4');concat(cut_files,raw)
        dest=enc/(sid+'.mp4');scene_files.append(dest)
        ass=WORK/'captions'/(sid+'.ass');audio=WORK/'narration'/(sid+'.mp3')
        run(['-i',raw,'-i',audio,'-vf',f"subtitles='{path_filter(ass)}'",'-af','apad,loudnorm=I=-16:TP=-1.5:LRA=9','-t',scene['frames']/fps,'-r',fps,'-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',dest])
        print('SCENE',sid,flush=True)
    if not args.scene:
        concat(scene_files,OUT/'khiladi-film.mp4')
    shutil.copy2(__file__,OUT/'composite_layers.py')

if __name__=='__main__':main()

