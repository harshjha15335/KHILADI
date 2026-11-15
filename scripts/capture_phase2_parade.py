"""Record one natural (unaccelerated) 243-second parade loop plus its boundary."""
from pathlib import Path
import json,time
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parents[1]/'docs/qa/phase2'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=b.new_context(viewport={'width':1440,'height':900},record_video_dir=str(OUT/'parade-raw'),record_video_size={'width':1440,'height':900});page=ctx.new_page();page.goto('http://127.0.0.1:3000');page.wait_for_timeout(3500);page.locator('.squad-chapter').evaluate('e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-130)');page.wait_for_timeout(750)
 samples=[];start=time.monotonic()
 for i in range(250):
  if i%30==0:print('Natural parade loop recording:',i,'seconds',flush=True)
  samples.append(page.evaluate('''async()=>{const {gsap}=await import('/src/utils/motion.ts');const el=document.querySelector('.squad-track');const t=gsap.getTweensOf(el)[0];return {wall:performance.now(),time:t.time(),iteration:t.iteration(),duration:t.duration(),x:gsap.getProperty(el,'xPercent'),width:el.getBoundingClientRect().width}}'''));page.wait_for_timeout(1000)
 samples.append({'elapsedWallSeconds':time.monotonic()-start});video=page.video;ctx.close();video.save_as(str(OUT/'parade-full-natural-loop.webm'));b.close();(OUT/'parade-loop-measurements.json').write_text(json.dumps(samples,indent=2))
print('Full parade loop captured',flush=True)
