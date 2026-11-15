"""Fresh browser motion evidence for targeted Phase 2 refinements; not reference-parity certification."""
from pathlib import Path
import json,statistics,time
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'docs/qa/phase2';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:3000';events=[];errors=[]
def shot(page,name):
 page.screenshot(path=str(OUT/(name+'.png')));events.append({'capture':name,'scrollY':page.evaluate('scrollY')})
def travel(page,selector,seconds=1.8,offset=0):
 target=page.locator(selector).evaluate('e=>e.getBoundingClientRect().top+scrollY')+offset
 current=page.evaluate('scrollY')
 for i in range(1,37):
  t=i/36;ease=t*t*(3-2*t);page.evaluate('(y)=>scrollTo(0,y)',current+(target-current)*ease);page.wait_for_timeout(seconds*1000/36)
 page.wait_for_timeout(550)
def record(browser,name,width=1440,height=900,mobile=False):
 ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile,record_video_dir=str(OUT/'raw'),record_video_size={'width':width,'height':height})
 page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));return ctx,page
def save(ctx,page,name):
 video=page.video;ctx.close();video.save_as(str(OUT/(name+'.webm')))
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx,page=record(browser,'desktop');page.goto(BASE,wait_until='domcontentloaded');page.wait_for_timeout(3500);shot(page,'hero-no-sound')
 page.locator('.hero-copy button').hover();page.wait_for_timeout(650);shot(page,'hero-hover');page.mouse.move(1000,400)
 travel(page,'.squad-chapter');shot(page,'names-only-parade');page.wait_for_timeout(4000)
 travel(page,'.editorial-chapter');shot(page,'editorial-crest-cleared')
 travel(page,'.heritage-chapter');shot(page,'collage-entrance');travel(page,'.heritage-composition',offset=-300);shot(page,'collage-middle');travel(page,'.heritage-composition',offset=110);shot(page,'collage-arranged')
 page.locator('.archive-photo--0').hover();page.wait_for_timeout(700);shot(page,'collage-hover');page.wait_for_timeout(1500)
 travel(page,'.quiz-chapter');shot(page,'discovery-settled');positions=[]
 for i in range(13):
  positions.append({'second':i,'transforms':page.locator('.quiz-figure-drift').evaluate_all('(es)=>es.map(e=>getComputedStyle(e).transform)')});page.wait_for_timeout(1000)
 shot(page,'discovery-drift-later');travel(page,'.heritage-composition');travel(page,'.quiz-chapter')
 page.locator('.quiz-introduction button').click();page.get_by_role('button',name='Next question').click();page.get_by_role('button',name='Show my players').click();page.locator('.quiz-result').first.wait_for();shot(page,'quiz-results');page.locator('.quiz-result').first.click();page.wait_for_timeout(750);shot(page,'profile');page.keyboard.press('Escape');page.get_by_role('button',name='Close quiz').click()
 travel(page,'.closing-chapter');shot(page,'closing');travel(page,'footer');page.get_by_role('button',name='Menu',exact=False).click();shot(page,'compact-menu');page.wait_for_timeout(1500);page.keyboard.press('Escape')
 save(ctx,page,'desktop-uninterrupted-homepage')
 (OUT/'discovery-position-samples.json').write_text(json.dumps(positions,indent=2))
 ctx,page=record(browser,'mobile',390,844,True);page.goto(BASE);page.wait_for_timeout(3500);shot(page,'mobile-hero')
 for sel in ['.squad-chapter','.editorial-chapter','.heritage-composition','.quiz-chapter','.closing-chapter']:travel(page,sel);page.wait_for_timeout(1800)
 page.get_by_role('button',name='Menu',exact=False).click();shot(page,'mobile-menu');page.wait_for_timeout(900);page.keyboard.press('Escape');save(ctx,page,'mobile-uninterrupted-homepage')
 ctx=browser.new_context(viewport={'width':1440,'height':900});page=ctx.new_page();page.goto(BASE);page.wait_for_timeout(3500);travel(page,'.quiz-chapter');button=page.locator('.quiz-introduction .chapter-button');button.hover();page.wait_for_timeout(650);page.mouse.move(10,10);page.wait_for_timeout(650);shot(page,'button-before');button.hover()
 page.evaluate('''()=>document.getAnimations().forEach(a=>a.pause())''')
 for progress,label in [(0,'start'),(.25,'25'),(.5,'50'),(.75,'75'),(1,'100')]:
  page.evaluate('(p)=>document.getAnimations().forEach(a=>{if(a.effect?.getTiming().duration!==Infinity)a.currentTime=Number(a.effect.getTiming().duration)*p})',progress);shot(page,'button-hover-'+label)
 page.evaluate('()=>document.getAnimations().forEach(a=>a.play())');page.mouse.move(10,10);page.wait_for_timeout(650);shot(page,'button-exit')
 performance=page.evaluate('''async()=>{const intervals=[];let old=performance.now();const longTasks=[];const observer=new PerformanceObserver(l=>longTasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));observer.observe({type:'longtask'});for(let i=0;i<240;i++){await new Promise(requestAnimationFrame);const now=performance.now();if(i>4)intervals.push(now-old);old=now;window.scrollBy(0,i<120?6:-6);window.dispatchEvent(new PointerEvent('pointermove',{clientX:200+i*3,clientY:300,bubbles:true}));}observer.disconnect();return {intervalsMs:intervals,longTasks}}''')
 vals=sorted(performance['intervalsMs']);performance.update({'medianMs':statistics.median(vals),'p95Ms':vals[int(.95*len(vals))],'over33ms':sum(v>33.34 for v in vals),'environment':'Headless Chromium, Codex Cloud, one session; rAF intervals during scroll and pointer movement, not user hardware FPS','heroVideoElements':page.locator('.hero-film').count(),'heroVideoReason':'No cleared RR assets; official embeds blocked (HTTP 403)'})
 (OUT/'performance.json').write_text(json.dumps(performance,indent=2));ctx.close()
 (OUT/'capture-events.json').write_text(json.dumps(events,indent=2));(OUT/'browser-errors.json').write_text(json.dumps(errors,indent=2));browser.close()
print('Motion evidence captured:',len(events),'screenshots; errors',errors,flush=True)
