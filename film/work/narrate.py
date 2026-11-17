import asyncio, json, pathlib, subprocess, math
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parent.parent
WORK=ROOT/'work'
VOICE='en-IN-PrabhatNeural'
async def main():
    story=json.loads((WORK/'story.json').read_text(encoding='utf-8'))
    folder=WORK/'narration'; folder.mkdir(exist_ok=True)
    timing=[]
    for s in story['scenes']:
        audio=folder/(s['id']+'.mp3')
        metadata=folder/(s['id']+'.jsonl')
        if not audio.exists() or not metadata.exists():
            for attempt in range(3):
                try:
                    await edge_tts.Communicate(s['narration'],VOICE,rate='+9%',pitch='+2Hz',boundary='WordBoundary').save(str(audio),str(metadata))
                    break
                except Exception:
                    if attempt==2: raise
                    await asyncio.sleep(2)
        duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(audio)]).decode().strip())
        frames=math.ceil((duration+.30)*30)
        timing.append({'id':s['id'],'duration':frames/30,'audio_duration':duration,'frames':frames,'audio':str(audio)})
        print(s['id'],duration,flush=True)
        (WORK/'timing.json').write_text(json.dumps(timing,indent=2),encoding='utf-8')
    (ROOT/'outputs'/'narration-script.txt').write_text('\n\n'.join(s['narration'] for s in story['scenes']),encoding='utf-8')
    print('TOTAL',sum(t['duration'] for t in timing),flush=True)
asyncio.run(main())
