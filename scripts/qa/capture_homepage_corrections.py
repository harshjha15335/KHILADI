"""Actual cloud-browser evidence for the targeted homepage corrections, not a PDF or playback claim."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,statistics
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/qa/homepage-corrections';OUT.mkdir(parents=True,exist_ok=True)
BASE='http://127.0.0.1:3000/';errors=[];events=[]
def shot(page,name):
 page.screenshot(path=str(OUT/(name+'.png')));events.append({'state':name,'scrollY':page.evaluate('scrollY'),'brand':page.locator('.site-header').get_attribute('data-brand-placement')})
def move(page,selector,duration=1300):
 page.evaluate('''async({selector,duration})=>{const to=document.querySelector(selector).getBoundingClientRect().top+scrollY,from=scrollY,start=performance.now();await new Promise(resolve=>{function tick(now){const t=Math.min(1,(now-start)/duration);scrollTo(0,from+(to-from)*t);t<1?requestAnimationFrame(tick):resolve();}requestAnimationFrame(tick);});}''',{'selector':selector,'duration':duration});page.wait_for_timeout(500)
def context(browser,width=1440,height=900,touch=False):
 c=browser.new_context(viewport={'width':width,'height':height},is_mobile=touch,has_touch=touch,record_video_dir=str(OUT/'raw'),record_video_size={'width':width,'height':height});page=c.new_page();page.on('pageerror',lambda e:errors.append(str(e)));return c,page
def save(c,page,name):
 video=page.video;c.close();video.save_as(str(OUT/(name+'.webm')))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c,page=context(b);page.goto(BASE);page.wait_for_timeout(450);shot(page,'loader-blue');page.wait_for_timeout(1800);shot(page,'loader-pink-transition');page.wait_for_timeout(1600);shot(page,'hero-no-cards')
 page.reload();page.wait_for_timeout(3800);save(c,page,'loader-first-and-refresh')
 c,page=context(b);page.goto(BASE);page.locator('.intro-root').wait_for();page.keyboard.press('Escape');page.locator('.quiz-figure').first.wait_for();shot(page,'hero-intentional-brand')
 for selector,name in [('.editorial-chapter','editorial-white-corner-brand'),('.heritage-chapter','heritage-brand-exited'),('.heritage-composition','heritage-collage'),('.journey-chapter','journey-no-overlap'),('.quiz-chapter','quiz-no-overlap'),('.closing-chapter','closing'),('.brand-footer','footer-single-white-brand')]:
  if page.locator(selector).count():move(page,selector,1800);shot(page,name)
 move(page,'.hero-chapter',2200);move(page,'.quiz-chapter',2200);page.wait_for_timeout(2400);save(c,page,'homepage-and-brand-lifecycle')
 print('desktop/loader captured',flush=True)
 # Static player imagery makes the X/Y displacement unambiguous; the surrounding copy stays fixed.
 c,page=context(b,1918,896);page.goto(BASE+'#database');page.locator('.intro-root').wait_for();page.keyboard.press('Escape');page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').scroll_into_view_if_needed()
 surface=page.locator('.discovery-photo');bounds=surface.bounding_box();measurements=[]
 for name,x,y in [('enter',.5,.5),('horizontal-left',.15,.5),('horizontal-right',.85,.5),('vertical-top',.5,.15),('vertical-bottom',.5,.85),('diagonal-a',.2,.2),('diagonal-b',.8,.8)]:
  page.mouse.move(bounds['x']+bounds['width']*x,bounds['y']+bounds['height']*y,steps=25);page.wait_for_timeout(650);shot(page,'warp-'+name)
  measurements.append({'state':name,**surface.evaluate('''e=>({x:e.querySelector('feImage').getAttribute('x'),y:e.querySelector('feImage').getAttribute('y'),scale:e.querySelector('feDisplacementMap').getAttribute('scale'),filter:e.querySelector('img').style.filter})''')})
 page.mouse.move(1,1,steps=20);page.wait_for_timeout(1000);shot(page,'warp-reset');measurements.append({'state':'reset','filter':surface.locator('img').evaluate('(e)=>e.style.filter')})
 save(c,page,'auge-xy-diagonal-reset');(OUT/'warp-measurements.json').write_text(json.dumps(measurements,indent=2))
 # Mobile keeps the intact quiz, live recommendation API, menu and profile interactions.
 c,page=context(b,390,844,True);page.goto(BASE);page.wait_for_timeout(3800)
 for selector in ['.hero-chapter','.editorial-chapter','.heritage-chapter','.journey-chapter','.quiz-chapter','.closing-chapter','.brand-footer']:
  move(page,selector,1100);shot(page,'mobile-'+selector[1:])
 move(page,'.quiz-chapter',1300);page.locator('.quiz-introduction button').click();page.get_by_role('button',name='Next question').click();page.get_by_role('button',name='Show my players').click();page.locator('.quiz-result').first.wait_for();page.locator('.quiz-result').first.click();page.wait_for_timeout(1500);shot(page,'mobile-profile');page.keyboard.press('Escape');page.wait_for_timeout(1200);save(c,page,'mobile-homepage-and-live-quiz')
 checks=[]
 for w,h in [(1920,1080),(1440,900),(1366,768),(768,1024),(390,844),(360,800)]:
  c=b.new_context(viewport={'width':w,'height':h},reduced_motion='reduce');page=c.new_page();page.goto(BASE);page.locator('.quiz-figure').first.wait_for()
  row={'width':w,'height':h,'sections':[]}
  for selector in ['.hero-chapter','.editorial-chapter','.heritage-chapter','.journey-chapter','.quiz-chapter','.closing-chapter']:
   move(page,selector,80);row['sections'].append({'selector':selector,'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),'brand':page.locator('.site-header').get_attribute('data-brand-placement')});shot(page,f'{w}x{h}-{selector[1:]}')
  checks.append(row);c.close()
 # One isolated cloud sample after all video captures, with no claim of hardware FPS.
 c=b.new_context(viewport={'width':1440,'height':900});page=c.new_page();page.goto(BASE+'#database');page.locator('.intro-root').wait_for();page.keyboard.press('Escape');page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').scroll_into_view_if_needed()
 bounds=page.locator('.discovery-photo').bounding_box()
 perf=page.evaluate('''async(bounds)=>{const times=[];let last=performance.now();const target=document.querySelector('.discovery-photo img');for(let i=0;i<240;i++){await new Promise(requestAnimationFrame);const now=performance.now();if(i>5)times.push(now-last);last=now;target.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',clientX:bounds.x+bounds.width*(.5+Math.sin(i/15)*.3),clientY:bounds.y+bounds.height*(.5+Math.cos(i/17)*.3)}));}return {intervals:times,environment:navigator.userAgent};}''',bounds)
 ordered=sorted(perf['intervals']);perf.update({'meanMs':statistics.mean(ordered),'p95Ms':ordered[int(len(ordered)*.95)],'limitation':'Headless cloud browser under synthetic pointer events. Not exact AUGE parity, hardware FPS or a guarantee against all flicker.'});(OUT/'warp-performance.json').write_text(json.dumps(perf,indent=2));c.close();b.close()
(OUT/'viewport-checks.json').write_text(json.dumps(checks,indent=2));(OUT/'browser-errors.json').write_text(json.dumps(errors,indent=2));(OUT/'capture-events.json').write_text(json.dumps(events,indent=2))
print(json.dumps({'capturedStates':len(events),'browserErrors':errors,'warpMeanMs':perf['meanMs'],'warpP95Ms':perf['p95Ms']}),flush=True)
