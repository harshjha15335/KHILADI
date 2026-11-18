import os
from pathlib import Path
import os,json,subprocess,hashlib
import onnxruntime as ort,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
ROOT=Path(__file__).resolve().parents[3];OUT=ROOT/'outputs/michael-refinement'
opts=ort.SessionOptions();opts.intra_op_num_threads=3;opts.inter_op_num_threads=1
session=ort.InferenceSession(str(Path(os.getenv('KHILADI_KOKORO_HOME','/workspace/tools/kokoro'))/'kokoro-v1.0.onnx'),sess_options=opts,providers=['CPUExecutionProvider']);k=Kokoro.from_session(session,str(Path(os.getenv('KHILADI_KOKORO_HOME','/workspace/tools/kokoro'))/'voices-v1.0.bin'))
display="You're in school. You're supposed to be doing maths. But you've got something way more important to figure out. Your IPL best eleven. And honestly? The maths can wait."
synthesis="You're in school, you're supposed to be doing maths. But you've got something way more important to figure out: your I P L best eleven. And honestly? The maths can wait."
phonemes=k.tokenizer.phonemize(synthesis,'en-us')
assert 'wˈeɪ' in phonemes or 'wˌeɪ' in phonemes,phonemes
# Feed the verified phoneme sequence directly: way is a single word, while
# IPL is deliberately letter-by-letter. Same released Michael voice identity.
audio,sr=k.create(phonemes,voice='am_michael',speed=1.05,lang='en-us',is_phonemes=True,sentence_pause=.08,clause_pause=.04)
sf.write(OUT/'MICHAEL_REFINED.wav',audio,sr)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(OUT/'MICHAEL_REFINED.wav'),'-af','loudnorm=I=-18:TP=-2:LRA=7','-c:a','libmp3lame','-q:a','2',str(OUT/'MICHAEL_REFINED.mp3')],check=True)
meta=dict(voice='C — Michael / am_michael',casting_status='User selected C for refinement; final delivery still reviewable',display_text=display,synthesis_text=synthesis,verified_phonemes=phonemes,pronunciation_changes={'way':'single word /weɪ/, not W-A-Y','IPL':'intentional I P L acronym'},delivery_changes=['Connected first setup sentences','Colon connects investigation to IPL reveal','Shorter automatic punctuation pauses','Slight rate increase from1.02to1.05; no post pitch shift'],engine='Kokoro-82M v1.0 / kokoro-onnx0.6.1',speed=1.05,sentence_pause=.08,clause_pause=.04,sample_rate=sr,duration_seconds=len(audio)/sr,sha256=hashlib.file_digest((OUT/'MICHAEL_REFINED.wav').open('rb'),'sha256').hexdigest(),limits='This engine has no reliable instruction-based emotion control. Reduced robotic cadence is a direction, not a claimed listening-QA pass.')
(OUT/'MICHAEL_REFINEMENT.json').write_text(json.dumps(meta,indent=2));print(json.dumps({'duration_seconds':len(audio)/sr,'phonemes':phonemes},indent=2))
