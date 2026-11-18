import os
"""Approved Michael voice, original second-person story, new isolated outputs."""
from pathlib import Path
import json,re,math,hashlib,subprocess,shutil
import numpy as np,soundfile as sf,onnxruntime as ort
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[3];WORK=ROOT/'work/full-film-v3';OUT=ROOT/'outputs/full-film-v3';N=WORK/'narration';N.mkdir(exist_ok=True)
legacy=json.loads((ROOT/'work/story.json').read_text());draft=(ROOT/'outputs/opening-v2/SECOND_PERSON_NARRATION_DRAFT.md').read_text();rows=re.findall(r'^\d+\. \*\*([^*]+)\*\* (.+)$',draft,re.M);assert len(rows)==16
refine=json.loads((ROOT/'outputs/michael-refinement/MICHAEL_REFINEMENT.json').read_text());texts=[t for _,t in rows];texts[0]=refine['display_text']
# Retain report provenance as an on-screen/source footnote, not production commentary.
texts[14]="Finally, your report's replay reproduces all twenty rankings and passes forty-one checks. The code repeats. The statistical limitations stay."
opts=ort.SessionOptions();opts.intra_op_num_threads=3;opts.inter_op_num_threads=1
session=ort.InferenceSession(str(Path(os.getenv('KHILADI_KOKORO_HOME','/workspace/tools/kokoro'))/'kokoro-v1.0.onnx'),sess_options=opts,providers=['CPUExecutionProvider']);k=Kokoro.from_session(session,str(Path(os.getenv('KHILADI_KOKORO_HOME','/workspace/tools/kokoro'))/'voices-v1.0.bin'))
settings=dict(voice='am_michael',speed=1.05,lang='en-us',sentence_pause=.08,clause_pause=.04)
story={**legacy,'title':'KHILADI — What the evidence supports','voice_status':'User approved revised Michael for remaining narration','source':'User-supplied accepted methodology; analytical pipeline not rerun in this animation workspace.','scenes':[]}
timing=[];parts=[];offset=0;sr=24000
for i,(old,text) in enumerate(zip(legacy['scenes'],texts)):
 scene={**old,'narration':text};sid=scene['id'];dest=N/(sid+'.wav');signature=hashlib.sha256((text+json.dumps(settings,sort_keys=True)).encode()).hexdigest();meta=N/(sid+'.generation.json')
 if i==0:
  shutil.copy2(ROOT/'outputs/michael-refinement/MICHAEL_REFINED.wav',dest);spoken=refine['synthesis_text'];phones=refine['verified_phonemes']
 elif not dest.exists() or not meta.exists() or json.loads(meta.read_text()).get('signature')!=signature:
  spoken=re.sub(r'\bIPL\b','I P L',text).replace('SupeRR','Super')
  phones=k.tokenizer.phonemize(spoken,'en-us');audio,rate=k.create(phones,is_phonemes=True,**settings);assert rate==sr;sf.write(dest,audio,sr)
 else:
  prior=json.loads(meta.read_text());spoken=prior['synthesis_text'];phones=prior['phonemes']
 audio,rate=sf.read(dest);assert rate==sr and audio.ndim==1
 lead=.1 if i==0 else .08;frames=360 if i==0 else math.ceil((lead+len(audio)/sr+.28)*30);length=frames*800;wave=np.zeros(length,dtype=np.float32);start=round(lead*sr);wave[start:start+len(audio)]=audio;parts.append(wave)
 item=dict(id=sid,frames=frames,duration=frames/30,audio=str(dest),audio_duration=len(audio)/sr,lead_seconds=lead,start_frame=offset,start_seconds=offset/30)
 timing.append(item);offset+=frames;story['scenes'].append(scene)
 meta.write_text(json.dumps(dict(signature=signature,display_text=text,synthesis_text=spoken,phonemes=phones,settings=settings,voice_approval='Use revised Michael',sample_rate=sr,audio_duration=len(audio)/sr,sha256=hashlib.file_digest(dest.open('rb'),'sha256').hexdigest()),indent=2));print('NARRATION',sid,frames,'frames',round(len(audio)/sr,3),'seconds',flush=True)
(WORK/'story.json').write_text(json.dumps(story,indent=2));tmp=WORK/'timing.tmp.json';tmp.write_text(json.dumps(timing,indent=2));tmp.replace(WORK/'timing.json')
sf.write(OUT/'MICHAEL_FULL_NARRATION.wav',np.concatenate(parts),sr)
(OUT/'NARRATION_STATUS.json').write_text(json.dumps(dict(voice='am_michael',approved=True,scene_count=16,frames=offset,duration_seconds=offset/30,fps=30,words=sum(len(t.split()) for t in texts),source='Same approved Michael settings and existing first take preserved',full_film_finished=False),indent=2));print('TOTAL',offset,'frames',offset/30,'seconds',flush=True)
