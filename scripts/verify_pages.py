"""Smoke-test the built/static or deployed Pages app with a real Chromium browser."""
from pathlib import Path
import json,sys
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1];base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4174/KHILADI/'
OUT=Path('/workspace/output/migration');OUT.mkdir(parents=True,exist_ok=True);errors=[];bad=[];api=[];checks=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);ctx=browser.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce',accept_downloads=True);page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.status>=400 and r.url.startswith(base) else None);page.on('request',lambda r:api.append(r.url) if '/api/' in r.url and r.url.startswith(base) else None)
 for route in ['home','command-centre','database','rankings','pressure-lab','batting-intel','bowling-intel','comparison','war-room','methodology']:
  response=page.goto(base+'#'+route,wait_until='domcontentloaded');expect(page.locator('main h1, main h2').first).to_be_visible();checks.append({'route':route,'http_status':response.status if response else None});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1')
 page.goto(base+'#database');page.get_by_role('searchbox').fill('Jofra Archer');expect(page.locator('.discovery-player')).to_have_count(1);page.locator('.discovery-open').click();expect(page.locator('.profile-dialog')).to_be_visible();page.get_by_role('button',name='Add to my squad').click();page.keyboard.press('Escape');page.goto(base+'#war-room');expect(page.locator('tbody')).to_contain_text('Jofra Archer');checks.append({'check':'search/profile/squad','passed':True})
 page.goto(base+'#rankings')
 for kind in ['Batters','Bowlers']:
  page.get_by_role('button',name=f'Top 10 {kind} Under Pressure').click()
  with page.expect_download() as info:page.get_by_role('button',name=f'Export {kind} CSV').click()
  download=info.value;assert len(Path(download.path()).read_text().strip().splitlines())==11
 checks.append({'check':'both ranking CSV downloads','passed':True})
 page.goto(base+'#home');page.locator('.quiz-introduction button').click();page.get_by_role('button',name='Next question').click();page.get_by_role('button',name='Show my players').click();expect(page.locator('.quiz-result')).to_have_count(3);expect(page.locator('.quiz-panel')).to_contain_text('saved outputs');checks.append({'check':'static quiz recommendations','passed':True})
 page.goto(base+'#home');page.screenshot(path=str(OUT/'pages-desktop.png'))
 for width,height in [(390,844),(768,1024)]:
  page.set_viewport_size({'width':width,'height':height});assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1');page.get_by_role('button',name='Menu',exact=False).click();expect(page.locator('.navigation-dialog')).to_be_visible();page.keyboard.press('Escape')
 page.screenshot(path=str(OUT/'pages-tablet.png'));ctx.close();browser.close()
result={'url':base,'checks':checks,'page_errors':errors,'failed_same_site_requests':bad,'unexpected_same_site_api_requests':api};(OUT/'pages-browser-results.json').write_text(json.dumps(result,indent=2));assert not errors and not bad and not api,result;print('Pages browser smoke passed:',len(checks),'checks; no failed requests or API dependencies')
