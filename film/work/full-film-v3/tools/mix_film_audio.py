"""Original restrained score/foley around approved Michael; no reference audio."""
from pathlib import Path
import json,math
import numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt
from scipy.ndimage import uniform_filter1d
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'outputs/full-film-v3';WORK=ROOT/'work/full-film-v3'
voice,sr=sf.read(OUT/'MICHAEL_FULL_NARRATION.wav');timing=json.loads((WORK/'timing.json').read_text());n=len(voice);mix=np.repeat((voice*.88)[:,None],2,axis=1);score=np.zeros_like(mix);rng=np.random.default_rng(42)
def add(wave,at,gain=1,pan=0,target=None):
 global mix
 target=mix if target is None else target;i=round(at*sr);wave=wave[:max(0,n-i)]*gain
 if len(wave):target[i:i+len(wave),0]+=wave*(1-pan*.35);target[i:i+len(wave),1]+=wave*(1+pan*.35)
def pluck(freq,dur=.6):
 t=np.arange(round(dur*sr))/sr;env=(1-np.exp(-t*100))*np.exp(-t*9)
 return (np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*2*t))*env
beat=60/96;notes=[293.665,None,440,None,349.228,None,None,523.251]
for j,at in enumerate(np.arange(0,n/sr,beat)):
 note=notes[j%len(notes)]
 if note:add(pluck(note),at,.009,(-1 if j%2 else 1)*.35,score)
 if j%4==0:add(pluck([146.832,130.813,174.614,130.813][(j//8)%4],.9),at,.007,0,score)
# Duck the original music bed during speech. Never use score to obscure words.
env=uniform_filter1d(np.abs(voice),size=round(sr*.12));duck=1/(1+env*24);score*=duck[:,None]
for row in timing:
 if row['id']=='11_holdout':
  a=round(row['start_seconds']*sr);b=a+row['frames']*800;score[a:b]*=.35
mix+=score

def foley(kind,dur):
 t=np.arange(round(dur*sr))/sr;env=np.sin(np.linspace(0,np.pi,len(t)))**1.2;noise=rng.normal(size=len(t))
 if kind=='pencil':return sosfilt(butter(2,[1800,6500],btype='bandpass',fs=sr,output='sos'),noise)*env*(.5+.5*np.sin(t*130))
 if kind=='paper':return sosfilt(butter(2,[450,5500],btype='bandpass',fs=sr,output='sos'),noise)*env
 if kind=='tap':return np.sin(2*np.pi*190*t)*np.exp(-t*35)*env
 return (np.sin(2*np.pi*78*t)+noise*.15)*np.exp(-t*22)*env
for at in [.2,.46,.72,1.05,3.52,3.79,4.03,6.65,6.93,7.19]:add(foley('pencil',.12),at,.018,.25)
add(foley('paper',.30),5.35,.025,.15);add(foley('tap',.10),8.20,.035,-.3);add(foley('paper',.23),8.67,.03);add(foley('close',.24),11.56,.06)
room=sosfilt(butter(2,[140,1100],btype='bandpass',fs=sr,output='sos'),rng.normal(size=round(12*sr)))*.0009;add(room,0)
for row in timing[1:]:
 at=row['start_seconds']+row['duration']*.28+.06
 kind='tap' if row['id'] in ['04_preball','05_pressure','11_holdout'] else 'paper'
 add(foley(kind,.12 if kind=='tap' else .22),at,.018,.1)
 if row['id']=='14_shortlist':add(foley('paper',.30),row['start_seconds']+6.0,.025)
fade=min(round(sr*.20),n);mix[:sr//10]*=np.linspace(0,1,sr//10)[:,None];mix[-fade:]*=np.linspace(1,0,fade)[:,None]
peak=float(np.abs(mix).max());assert peak<1,peak
sf.write(OUT/'MICHAEL_FULL_MIX.wav',mix,sr,subtype='PCM_24')
(OUT/'AUDIO_MIX_NOTES.json').write_text(json.dumps(dict(voice='Approved revised Michael',sample_rate=sr,duration_seconds=n/sr,pre_master_peak=peak,source_reference_audio_used=False,score='Original mathematical pluck/percussion composition; sparse96BPM; speech-ducked',foley='Original synthesized pencil, paper, tap, book close and low room tone',final_master_target='-16LUFS / -1.5dBTP in final mux',final_audio_listening_review='Not independently auditioned by an audio-capable model; voice approved by user'),indent=2));print('MIX_READY',n/sr,'seconds','peak',peak)
