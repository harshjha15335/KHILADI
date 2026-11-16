"""Private local reference evidence; never uploads protected recordings or imagery."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, statistics, time
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'docs/qa/reference-replication'
OUT.mkdir(parents=True,exist_ok=True)
BASE='http://127.0.0.1:3000'
events=[];errors=[];summaries=[]
def snap(page,name):
 page.screenshot(path=str(OUT/(name+'.png')))
 events.append({'event':name,'wallTime':time.time(),'scrollY':page.evaluate('scrollY')})
def travel(page,selector,duration=1400,offset=80):
 y=page.locator(selector).evaluate('(e)=>e.getBoundingClientRect().top+scrollY')-offset
 page.evaluate('''async ({to, duration})=>{
 const from=scrollY,start=performance.now();
 await new Promise(resolve=>{function frame(now){const t=Math.min(1,(now-start)/duration);scrollTo(0,from+(to-from)*t);if(t<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
 }''',{'to':max(0,y),'duration':duration})
 page.wait_for_timeout(350)
def start(browser,name,width=1440,height=900,touch=False,reduced=False):
 ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=touch,has_touch=touch,
  reduced_motion='reduce' if reduced else 'no-preference',
  record_video_dir=str(OUT/'raw'),record_video_size={'width':width,'height':height})
 page=ctx.new_page();page.on('pageerror',lambda e:errors.append({'recording':name,'error':str(e)}))
 page.goto(BASE,wait_until='domcontentloaded')
 return ctx,page
def finish(ctx,page,name):
 video=page.video;ctx.close();video.save_as(str(OUT/(name+'.webm')))
def database(page):
 page.goto(BASE+'/#database');page.locator('.discovery-open').first.wait_for()
def moving_hover(page,index=1):
 box=page.locator('.editorial-player img').nth(index).bounding_box()
 if box:page.mouse.move(max(10,box['x']+box['width']/2),box['y']+box['height']/2,steps=15)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 # Continuous homepage with chapter changes, every section, and a reverse-scroll check.
 ctx,page=start(browser,'homepage-continuous')
 page.wait_for_timeout(3700);snap(page,'homepage-start')
 for i in [1,2,0]:page.locator('.hero-chapters button').nth(i).click();page.wait_for_timeout(750)
 sections=['.squad-chapter','.editorial-chapter','.heritage-chapter','.heritage-composition','.journey-chapter','.portrait-chapter','.editorial-bridge','.quiz-chapter','.home-notes','.closing-chapter','.brand-footer']
 for i,selector in enumerate(sections):
  if page.locator(selector).count():travel(page,selector,1800);snap(page,f'homepage-section-{i:02}')
 travel(page,'.quiz-chapter',1800);page.wait_for_timeout(2200)
 travel(page,'.journey-chapter',1400);travel(page,'.hero-chapter',2200,0)
 finish(ctx,page,'homepage-continuous')
 print('homepage captured',flush=True)
 # Loader starts without a session suppression flag, records the complete transition.
 ctx,page=start(browser,'crl-loader');page.wait_for_timeout(4200);finish(ctx,page,'crl-loader')
 # Non-home mixed typography and cursor-follow preview.
 ctx,page=start(browser,'extrafazant-hover');page.keyboard.press('Escape');database(page)
 heading=page.locator('.kinetic-text').bounding_box()
 for x in [0.15,0.4,0.7,0.9,0.55,0.2]:
  page.mouse.move(heading['x']+heading['width']*x,heading['y']+heading['height']*.6,steps=18);page.wait_for_timeout(500)
 snap(page,'extrafazant-preview');page.mouse.move(5,100);page.wait_for_timeout(700);finish(ctx,page,'extrafazant-hover')
 # Thin surface, intermediate white card, image, settled text, reverse and focus restoration.
 ctx,page=start(browser,'cyera-profile');page.keyboard.press('Escape');database(page)
 page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').focus();page.wait_for_timeout(500)
 page.keyboard.press('Enter');page.wait_for_timeout(120);snap(page,'profile-thin-surface')
 page.wait_for_timeout(400);snap(page,'profile-expanding-surface')
 page.wait_for_timeout(400);snap(page,'profile-image-stage')
 page.wait_for_timeout(600);snap(page,'profile-settled')
 page.get_by_text('See the performance evidence',exact=True).click();page.wait_for_timeout(700);snap(page,'profile-data')
 page.keyboard.press('Escape');page.wait_for_timeout(1400);snap(page,'profile-closed')
 finish(ctx,page,'cyera-profile')
 # AUGE strip is deliberately moving while the pointer and small label follow the image.
 ctx,page=start(browser,'auge-media');page.keyboard.press('Escape');database(page)
 for i in range(8):
  moving_hover(page,1 if i%2 else 2);page.wait_for_timeout(550)
 snap(page,'auge-context-label');page.mouse.move(5,100);page.wait_for_timeout(600);finish(ctx,page,'auge-media')
 # Continuous independent discovery, quiz -> genuine canonical recommendation -> open/close.
 ctx,page=start(browser,'player-discovery');page.keyboard.press('Escape');travel(page,'.quiz-chapter',1600,0);page.wait_for_timeout(2500)
 page.locator('.quiz-introduction button').click();page.get_by_role('button',name='Next question').click();page.get_by_role('button',name='Show my players').click()
 page.locator('.quiz-result').first.wait_for();page.wait_for_timeout(700);page.locator('.quiz-result').first.click();page.wait_for_timeout(1600)
 page.keyboard.press('Escape');page.wait_for_timeout(1200);finish(ctx,page,'player-discovery')
 # Phone walkthrough includes the entire homepage and menu, database and profile actions.
 ctx,page=start(browser,'mobile-walkthrough',390,844,True);page.wait_for_timeout(3700)
 for selector in sections:
  if page.locator(selector).count():travel(page,selector,1300);page.wait_for_timeout(300)
 page.get_by_role('button',name='Menu',exact=False).click();page.wait_for_timeout(400)
 page.get_by_role('navigation',name='Main navigation').get_by_role('link',name='Explore players').click()
 page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').click();page.wait_for_timeout(1600);snap(page,'mobile-profile')
 page.get_by_role('button',name='Close profile').click();page.wait_for_timeout(1200);finish(ctx,page,'mobile-walkthrough')
 print('motion captures complete',flush=True)
 # All requested exact viewport pairs; normal and reduced-motion states.
 for width,height in [(1920,1080),(1440,900),(1366,768),(768,1024),(390,844),(360,800)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},reduced_motion='reduce')
  page=ctx.new_page();page.goto(BASE);page.locator('.squad-player').first.wait_for()
  checks=[]
  for selector in ['.hero-chapter','.heritage-chapter','.journey-chapter','.portrait-chapter','.editorial-bridge','.quiz-chapter','.home-notes','.brand-footer']:
   travel(page,selector,100,0)
   checks.append({'section':selector,'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth+1')})
   snap(page,f'{width}x{height}-{selector[1:]}')
  database(page);page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').click();snap(page,f'{width}x{height}-profile')
  box=page.locator('.profile-dialog').bounding_box();checks.append({'profileBounds':box,'inViewport':box['x']>=0 and box['y']>=0 and box['x']+box['width']<=width+1 and box['y']+box['height']<=height+1})
  page.keyboard.press('Escape');summaries.append({'width':width,'height':height,'reducedMotion':True,'checks':checks});ctx.close()
 # Performance on an otherwise idle headless browser, after recordings have finished.
 ctx=browser.new_context(viewport={'width':1440,'height':900});page=ctx.new_page();page.goto(BASE);page.keyboard.press('Escape');page.locator('.squad-player').first.wait_for()
 perf=page.evaluate('''async()=>{
 const times=[],tasks=[];const start=performance.now();let last=start;
 const observer=new PerformanceObserver(list=>tasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));observer.observe({type:'longtask'});
 const max=document.documentElement.scrollHeight-innerHeight;
 for(let i=0;i<360;i++) {await new Promise(requestAnimationFrame);const now=performance.now();if(i>5)times.push(now-last);last=now;scrollTo(0,max*i/359);}
 observer.disconnect();return {frameIntervalsMs:times,longTasks:tasks,durationMs:performance.now()-start,userAgent:navigator.userAgent};
 }''')
 intervals=sorted(perf['frameIntervalsMs']);perf.update({'meanMs':statistics.mean(intervals),'medianMs':statistics.median(intervals),'p95Ms':intervals[int(len(intervals)*.95)],'framesOver33ms':sum(v>33.34 for v in intervals),'limitation':'Cloud Chromium headless RAF intervals under programmatic continuous scroll, not hardware FPS or exact reference parity.'})
 (OUT/'performance.json').write_text(json.dumps(perf,indent=2));ctx.close();browser.close()
(OUT/'viewport-checks.json').write_text(json.dumps(summaries,indent=2));(OUT/'capture-events.json').write_text(json.dumps(events,indent=2));(OUT/'browser-errors.json').write_text(json.dumps(errors,indent=2))
print(json.dumps({'captures':len(events),'errors':errors,'meanMs':perf['meanMs'],'p95Ms':perf['p95Ms']}),flush=True)
