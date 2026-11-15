"""Index actual recorded scene frames and make review excerpts/comparisons."""
from pathlib import Path
import tempfile,json,subprocess
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/qa/reference-fidelity'
with tempfile.TemporaryDirectory(prefix='khiladi-review-') as tmp:
 subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-i',str(OUT/'desktop-walkthrough.webm'),'-vf','fps=4,scale=360:225',tmp+'/%03d.png'],check=True)
 frames=sorted(Path(tmp).glob('*.png'));pixels=[np.asarray(Image.open(f).resize((90,56)),dtype=float) for f in frames];matches=[]
 for name,target in [('preloader','loader-start'),('button-interaction','button-hover'),('squad-parade','squad-parade'),('photo-composition','heritage-collage'),('quiz-choreography','quiz-middle'),('profile-reveal','profile-open'),('cursor-and-warp','database-hover')]:
  expected=np.asarray(Image.open(OUT/(target+'.png')).convert('RGB').resize((90,56)),dtype=float);scores=[float(np.mean(np.abs(a-expected))) for a in pixels];index=int(np.argmin(scores));timestamp=index/4;start=max(0,timestamp-(1.0 if name=='profile-reveal' else .6))
  subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-y','-ss',str(start),'-i',str(OUT/'desktop-walkthrough.webm'),'-t','4','-c:v','libvpx','-deadline','realtime','-cpu-used','8','-threads','2','-b:v','1M',str(OUT/(name+'.webm'))],check=True)
  matches.append({'clip':name,'matched_screenshot':target,'video_seconds':timestamp,'mean_absolute_thumbnail_error':scores[index]})
 (OUT/'video-scene-index.json').write_text(json.dumps(matches,indent=2))
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
fig,axes=plt.subplots(2,2,figsize=(20,14),layout='constrained')
for ax,name,title in [(axes[0,0],'delta-clean-0.png','Delta — live hero'),(axes[0,1],'desktop-hero.png','KHILADI — private local review'),(axes[1,0],'delta-quiz-centred.png','Delta — live quiz composition'),(axes[1,1],'quiz-middle.png','KHILADI — quiz entry / settlement')]:
 ax.imshow(Image.open(OUT/name));ax.set_title(title,fontsize=14);ax.axis('off')
fig.suptitle('Reference review at 1440 × 900. Differences remain; this is not a parity pass.',fontsize=18);fig.savefig(OUT/'reference-comparison.png',dpi=120);plt.close(fig)
print('Generated indexed excerpts and actual reference comparison.')
