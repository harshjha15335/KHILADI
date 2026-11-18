"""Assemble corrected opening from validated silent hero and notebook clips.
No audio generation. Whole-clip retiming preserves hand/pencil/page contact.
"""
from pathlib import Path
import argparse,json,subprocess,hashlib,os
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'work/film-v3-assembly';OUT=ROOT/'outputs/film-v3-assembly'
NB=ROOT/'outputs/opening-v3-notebook';FPS=30

def probe(path):
 return json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_streams','-of','json',str(path)]))['streams'][0]
def main():
 p=argparse.ArgumentParser();p.add_argument('--hero-a',required=True);p.add_argument('--hero-b');p.add_argument('--hero-f',required=True);p.add_argument('--hero-i',required=True);a=p.parse_args();OUT.mkdir(exist_ok=True)
 # Actual Michael cues start after .1s lead: maths2.34–3.14; waymoreimportant
 #4.26–5.14; IPL6.26–8.42; honestly8.42–9.54; maths canwait9.54–10.81.
 edits=[('A_intro',Path(a.hero_a),45,None),('C_maths',NB/'C_maths_hesitation.mp4',54,None),('A_intense',Path(a.hero_a),60,'crop=iw*.91:ih*.91:iw*.045:ih*.015,scale=1080:1920'),('D_reveal',NB/'D_page_turn_reveal.mp4',30,None),('E_selection',NB/'E_cross_out_selection.mp4',54,None),('F_conceal',Path(a.hero_f),48,None),('G_maths',NB/'G_sparse_maths.mp4',12,None),('H_cricket',NB/'H_dense_cricket.mp4',12,None),('I_reaction',Path(a.hero_i),24,None),('J_close',NB/'J_notebook_close.mp4',21,None)]
 if a.hero_b:
  edits[2:3]=[('B_classroom',Path(a.hero_b),24,None),('A_intense',Path(a.hero_a),36,'crop=iw*.91:ih*.91:iw*.045:ih*.015,scale=1080:1920')]
 assert sum(r[2] for r in edits)==360
 manifest=[];clips=[];cursor=0;cache=OUT/'opening-cache';cache.mkdir(exist_ok=True)
 for label,source,frames,extra in edits:
  if '/private/' in str(source):raise ValueError('Reference media cannot be used')
  info=probe(source);n=int(info['nb_read_frames']);assert info['avg_frame_rate']=='30/1';assert (info['width'],info['height'])==(1080,1920)
  digest=hashlib.sha256(source.read_bytes()+json.dumps([frames,extra]).encode()+Path(__file__).read_bytes()).hexdigest()[:16];dest=cache/f'{label}-{digest}.mp4'
  if not dest.exists():
   ratio=(frames-1)/max(n-1,1);vf=f'setpts={ratio:.12f}*PTS,fps=30,tpad=stop_mode=clone:stop_duration=3,trim=end_frame={frames},setpts=PTS-STARTPTS'
   if extra:vf+=','+extra
   temp=dest.with_name(dest.stem+'.rendering.mp4');subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-an','-vf',vf,'-frames:v',str(frames),'-r','30','-c:v','libx264','-threads','2','-preset','veryfast','-crf','17','-pix_fmt','yuv420p',str(temp)],check=True);os.replace(temp,dest)
  out=probe(dest);assert int(out['nb_read_frames'])==frames
  clips.append(dest);manifest.append(dict(id=label,source=str(source),source_frames=n,frames=frames,start_frame=cursor,end_frame=cursor+frames,start_seconds=cursor/30,end_seconds=(cursor+frames)/30,whole_clip_rate_factor=(frames-1)/max(n-1,1),reframe=extra,source_sha256=hashlib.file_digest(source.open('rb'),'sha256').hexdigest()));cursor+=frames
 listing=OUT/'opening-concat.txt';listing.write_text('\n'.join("file '"+str(c.resolve())+"'" for c in clips));dest=OUT/'KHILADI_OPENING_V3_SILENT.mp4';temp=dest.with_name(dest.stem+'.rendering.mp4')
 subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(listing),'-an','-c','copy','-movflags','+faststart',str(temp)],check=True);os.replace(temp,dest)
 final=probe(dest);assert int(final['nb_read_frames'])==360 and float(final['duration'])==12
 subprocess.run(['ffmpeg','-v','error','-i',str(dest),'-f','null','-'],check=True)
 (OUT/'OPENING_EDIT_DECISIONS.json').write_text(json.dumps(dict(frames=360,duration=12,fps=30,camera_geography='C1 at room front, teacher front-left/offscreen; C3 notebook behind/right of RIGHT-handed pupil',silence=True,edits=manifest,limitations=['Whole-clip uniform retiming changes pacing; it does not interpolate new limb motion.','No invented teacher context; maths/OTS cutaway establishes the subject.']),indent=2));print(dest,flush=True)
if __name__=='__main__':main()
