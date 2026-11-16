"""Capture comparison interactions at the uploaded clips’ native viewport sizes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parents[2]/'docs/qa/reference-replication';base='http://127.0.0.1:3000/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name in ['delta','crl','extrafazant','cyera','auge']:
  w,h=(1918,896) if name=='auge' else (1900,828)
  ctx=b.new_context(viewport={'width':w,'height':h},record_video_dir=str(out/'raw'),record_video_size={'width':w,'height':h})
  page=ctx.new_page();page.goto(base,wait_until='domcontentloaded')
  if name=='crl':page.wait_for_timeout(4600)
  else:
   page.keyboard.press('Escape');page.locator('.squad-player').first.wait_for()
   if name=='delta':
    page.wait_for_timeout(2000);page.locator('.hero-chapters button').nth(1).click();page.wait_for_timeout(1200)
    for selector in ['.squad-chapter','.editorial-chapter','.heritage-composition']:
     y=page.locator(selector).evaluate('(e)=>e.getBoundingClientRect().top+scrollY')
     page.evaluate('''async(to)=>{const from=scrollY,start=performance.now();await new Promise(resolve=>{const step=now=>{const t=Math.min(1,(now-start)/1800);scrollTo(0,from+(to-from)*t);t<1?requestAnimationFrame(step):resolve();};requestAnimationFrame(step);});}''',y)
     page.wait_for_timeout(1500)
    page.wait_for_timeout(2000)
   else:
    page.goto(base+'#database');page.locator('.discovery-open').first.wait_for()
    if name=='cyera':
     page.get_by_role('searchbox').fill('Jofra Archer');page.locator('.discovery-open').focus();page.wait_for_timeout(500);page.keyboard.press('Enter');page.wait_for_timeout(2200)
     page.keyboard.press('Escape');page.wait_for_timeout(1500)
    elif name=='extrafazant':
     rect=page.locator('.kinetic-text').bounding_box()
     for x in [.15,.4,.7,.9,.5,.2]:page.mouse.move(rect['x']+rect['width']*x,rect['y']+rect['height']*.6,steps=20);page.wait_for_timeout(650)
     page.mouse.move(4,100);page.wait_for_timeout(900)
    else:
     for i in range(10):
      box=page.locator('.editorial-player img').nth(2 if i%2 else 1).bounding_box();page.mouse.move(max(10,box['x']+box['width']/2),box['y']+box['height']/2,steps=12);page.wait_for_timeout(500)
     page.mouse.move(4,100);page.wait_for_timeout(500)
  video=page.video;ctx.close();video.save_as(str(out/f'matched-{name}.webm'));print(name,w,h,flush=True)
 b.close()
