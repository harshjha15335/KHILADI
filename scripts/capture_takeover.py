"""Capture the implemented interactions, not a claim of reference parity."""
from pathlib import Path
import json,time,statistics
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/qa/reference-fidelity';OUT.mkdir(exist_ok=True)
EVENTS=[]
START=time.time()
def shot(page,name):
 page.screenshot(path=str(OUT/(name+'.png')))
 EVENTS.append({'event':name,'time':time.time(),'seconds':time.time()-START,'scrollY':page.evaluate('scrollY')})
def travel(page,selector):
 target=page.locator(selector).evaluate('e=>e.getBoundingClientRect().top+scrollY-110')
 current=page.evaluate('scrollY')
 for i in range(1,22):
  page.evaluate('(y)=>scrollTo(0,y)',current+(target-current)*i/21);page.wait_for_timeout(45)
 page.wait_for_timeout(600)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':1440,'height':900},record_video_dir=str(OUT/'walkthrough-raw'),record_video_size={'width':1440,'height':900})
 START=time.time();page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000',wait_until='domcontentloaded');page.wait_for_timeout(200);shot(page,'loader-start');page.wait_for_timeout(1000);shot(page,'loader-middle');page.wait_for_timeout(1100);shot(page,'loader-zoom');page.wait_for_timeout(1200);shot(page,'desktop-hero')
 page.mouse.move(120,720,steps=15);page.locator('.hero-copy .chapter-button').hover();page.wait_for_timeout(400);shot(page,'button-hover');page.mouse.move(800,400,steps=15)
 for selector,name in [('.squad-chapter','squad-parade'),('.editorial-chapter','editorial'),('.heritage-chapter','heritage-entry'),('.heritage-composition','heritage-collage'),('.quiz-chapter','quiz-start')]:
  travel(page,selector);shot(page,name)
 if page.locator('.archive-photo').count():page.locator('.archive-photo--0').hover();page.wait_for_timeout(400);shot(page,'heritage-colour')
 quiz=page.locator('.quiz-chapter').evaluate('e=>e.getBoundingClientRect().top+scrollY')
 for delta,name in [(100,'quiz-middle'),(400,'quiz-settled'),(-300,'quiz-reverse'),(450,'quiz-final')]:
  page.evaluate('(y)=>scrollTo(0,y)',quiz+delta);page.wait_for_timeout(900);shot(page,name)
 travel(page,'.closing-chapter');shot(page,'closing');travel(page,'.quiz-introduction')
 page.locator('.quiz-introduction button').click();page.get_by_role('radio',name='Runs on the board').check();page.get_by_role('button',name='Next question').click();page.get_by_role('button',name='Show my players').click();page.locator('.quiz-result').first.wait_for();shot(page,'quiz-results')
 page.locator('.quiz-result').first.click();page.wait_for_timeout(800);shot(page,'profile-open');page.get_by_text('See the performance evidence',exact=True).click();shot(page,'profile-evidence');page.keyboard.press('Escape');page.wait_for_timeout(600)
 page.get_by_role('button',name='Menu',exact=False).click();shot(page,'menu-open');page.get_by_role('navigation',name='Main navigation').get_by_role('link',name='Explore players').click();page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').wait_for();page.wait_for_timeout(600);page.locator('.discovery-open').hover();page.mouse.move(250,600,steps=20);shot(page,'database-hover');page.locator('.discovery-open').click();page.wait_for_timeout(700);shot(page,'profile-archer');page.keyboard.press('Escape');page.wait_for_timeout(500)
 page.goto('http://127.0.0.1:3000/#home');page.wait_for_timeout(500)
 performance=page.evaluate('''async()=>{
  const times=[];let previous=performance.now();const tasks=[];
  const observer=new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));observer.observe({type:'longtask',buffered:true});
  for(let i=0;i<300;i++){await new Promise(requestAnimationFrame);const now=performance.now();if(i>5)times.push(now-previous);previous=now;window.scrollTo(0,(i%200)*25);document.dispatchEvent(new PointerEvent('pointermove',{clientX:100+(i%100)*10,clientY:400,bubbles:true}));}
  observer.disconnect();return {frameIntervalsMs:times,longTasks:tasks,viewport:{width:innerWidth,height:innerHeight},userAgent:navigator.userAgent};
 }''')
 intervals=sorted(performance['frameIntervalsMs']);performance.update({'meanMs':statistics.mean(intervals),'medianMs':statistics.median(intervals),'p95Ms':intervals[int(len(intervals)*.95)],'framesOver33ms':sum(v>33.34 for v in intervals),'measurement':'Chromium headless, software/cloud machine, requestAnimationFrame sampling during programmatic scrolling and pointer events; this is not hardware FPS or a guarantee of reference parity.'})
 (OUT/'performance.json').write_text(json.dumps(performance,indent=2));print('frame timing',performance['meanMs'],performance['p95Ms'],flush=True)
 video=page.video;ctx.close();video.save_as(str(OUT/'desktop-walkthrough.webm'))
 for label,width,height in [('mobile',390,844),('tablet',768,1024)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=label=='mobile',has_touch=True,record_video_dir=str(OUT/'walkthrough-raw'),record_video_size={'width':width,'height':height})
  page=ctx.new_page();page.goto('http://127.0.0.1:3000');page.wait_for_timeout(3300);shot(page,label+'-hero')
  for selector,name in [('.squad-chapter','squad'),('.heritage-composition','collage'),('.quiz-introduction','quiz'),('.closing-chapter','closing')]:travel(page,selector);shot(page,label+'-'+name)
  page.get_by_role('button',name='Menu',exact=False).click();shot(page,label+'-menu');page.keyboard.press('Escape');video=page.video;ctx.close();video.save_as(str(OUT/(label+'-walkthrough.webm')))
 (OUT/'capture-events.json').write_text(json.dumps(EVENTS,indent=2));(OUT/'browser-errors.json').write_text(json.dumps(errors,indent=2));browser.close()
print('Capture complete',flush=True)
