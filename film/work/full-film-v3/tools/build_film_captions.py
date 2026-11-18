from pathlib import Path
import json,re,math
import torch,whisperx
ROOT=Path(__file__).resolve().parents[3];WORK=ROOT/'work/full-film-v3';OUT=ROOT/'outputs/full-film-v3';CAP=WORK/'captions';WORDS=WORK/'words';CAP.mkdir(exist_ok=True);WORDS.mkdir(exist_ok=True)
torch.set_num_threads(1)
story=json.loads((WORK/'story.json').read_text())['scenes'];timing={r['id']:r for r in json.loads((WORK/'timing.json').read_text())};model,meta=whisperx.load_align_model('en','cpu',model_dir=str(ROOT/'work/full-film-v3/model-cache'))
HEADER='''[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,DejaVu Sans,60,&H00FFFFFF,&H0000FFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,6,1,2,85,85,90,1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
def clock(t):
 c=round(t*100);return f'{c//360000}:{c//6000%60:02}:{c//100%60:02}.{c%100:02}'
def srtclock(t):
 c=round(t*1000);return f'{c//3600000:02}:{c//60000%60:02}:{c//1000%60:02},{c%1000:03}'
def escape(t):return t.replace('\\','\\\\').replace('{','\\{').replace('}','\\}')
all_events=[];all_srt=[];summary=[]
for scene in story:
 sid=scene['id'];t=timing[sid];cache=WORDS/(sid+'.json')
 if cache.exists():aligned=json.loads(cache.read_text())
 else:
  audio=whisperx.load_audio(t['audio']);aligned=whisperx.align([dict(start=0,end=t['audio_duration'],text=scene['narration'])],model,meta,audio,'cpu',return_char_alignments=False);cache.write_text(json.dumps(aligned,indent=2))
 words=[w for w in aligned['word_segments'] if 'start' in w and 'end' in w];assert words,sid
 groups=[];current=[]
 for word in words:
  proposed=' '.join(w['word'] for w in current+[word])
  if current and (len(current)>=4 or len(proposed)>29):groups.append(current);current=[]
  current.append(word)
  if word['word'].endswith(('.', '?', '!', ':', ',')) and len(current)>=2:groups.append(current);current=[]
 if current:groups.append(current)
 keyword=scene.get('highlight','').casefold();events=[]
 for g in groups:
  start=t['lead_seconds']+g[0]['start'];end=min(t['duration'],t['lead_seconds']+g[-1]['end']+.035)
  assert 0<=start<end<=t['duration']+.001,(sid,start,end)
  items=[escape(w['word']) for w in g]
  chosen=next((i for i,w in enumerate(g) if keyword and keyword in w['word'].casefold()),None)
  if chosen is None:
   eligible=[(len(w['word']),i) for i,w in enumerate(g) if re.sub(r'\W','',w['word']).casefold() not in ['you','your','the','and','of','to','a','in','is','it','but','for','with','that','be','an','so']]
   chosen=max(eligible)[1] if eligible else len(g)-1
  items[chosen]=r'{\c&H00FFFF&}'+items[chosen]+r'{\c&HFFFFFF&}'
  rendered=' '.join(items);events.append(f'Dialogue: 0,{clock(start)},{clock(end)},Main,,0,0,0,,{rendered}')
  gs=start+t['start_seconds'];ge=end+t['start_seconds'];all_events.append(f'Dialogue: 0,{clock(gs)},{clock(ge)},Main,,0,0,0,,{rendered}');all_srt.append((gs,ge,' '.join(w['word'] for w in g)))
 (CAP/(sid+'.ass')).write_text(HEADER+'\n'.join(events)+'\n');summary.append(dict(id=sid,words=len(words),phrases=len(groups),minimum_word_score=min(w.get('score',0) for w in words),missing_word_times=len(aligned['word_segments'])-len(words)))
 print('CAPTIONS',sid,len(words),'words',len(groups),'phrases',flush=True)
(OUT/'FULL_CAPTIONS.ass').write_text(HEADER+'\n'.join(all_events)+'\n')
(OUT/'FULL_CAPTIONS.srt').write_text('\n\n'.join(f'{i}\n{srtclock(a)} --> {srtclock(b)}\n{text}' for i,(a,b,text) in enumerate(all_srt,1))+'\n')
(OUT/'CAPTION_ALIGNMENT_REPORT.json').write_text(json.dumps(dict(method='WhisperX forced alignment against known approved narration text; not independent ASR',scenes=summary,events=len(all_events),full_film_frames=sum(t['frames'] for t in timing.values())),indent=2))
