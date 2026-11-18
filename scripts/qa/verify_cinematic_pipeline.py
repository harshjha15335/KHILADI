"""Test the actual native video component with synthetic QA media, never labelled RR footage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,subprocess,tempfile
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/qa/homepage-corrections';OUT.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(prefix='khiladi-video-qa-') as temporary:
 fixtures=Path(temporary)
 for i in range(3):
  subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','testsrc2=size=640x360:rate=30','-t','2','-vf',f'hue=h={i*80}','-an','-c:v','libx264','-pix_fmt','yuv420p','-movflags','+faststart',str(fixtures/f'qa-{i}.mp4')],check=True)
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(fixtures/f'qa-{i}.mp4'),'-frames:v','1',str(fixtures/f'qa-{i}.jpg')],check=True)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  page=browser.new_page(viewport={'width':1280,'height':800});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/__qa-media/*',lambda route:route.fulfill(path=str(fixtures/route.request.url.rsplit('/',1)[1])) if (fixtures/route.request.url.rsplit('/',1)[1]).exists() else route.fulfill(status=404,body='Expected missing QA fixture'))
  page.goto('http://127.0.0.1:3000/');page.locator('.intro-root').wait_for();page.keyboard.press('Escape');page.locator('.intro-root').wait_for(state='detached')
  page.evaluate('''async()=>{
   const React=(await import('/node_modules/.vite/deps/react.js')).default;
   const dom=await import('/node_modules/.vite/deps/react-dom_client.js');const createRoot=dom.createRoot || dom.default.createRoot;
   const {CinematicVideo}=await import('/src/components/CinematicVideo.tsx');
   const surface=document.createElement('div');surface.id='qa-video-harness';Object.assign(surface.style,{position:'fixed',inset:'0',zIndex:'10000',background:'#2450B8'});document.body.append(surface);
   const label=document.createElement('p');label.textContent='SYNTHETIC PLAYER TEST — NOT RAJASTHAN ROYALS FOOTAGE';Object.assign(label.style,{position:'absolute',top:'15px',left:'20px',zIndex:'10001',color:'white',background:'#182643',padding:'10px'});surface.append(label);
   const mount=document.createElement('div');mount.style.cssText='position:absolute;inset:60px 0 0';surface.append(mount);
   const root=createRoot(mount);const clips=[0,1,2].map(i=>({src:`/__qa-media/qa-${i}.mp4`,poster:`/__qa-media/qa-${i}.jpg`,caption:`Synthetic QA clip ${i}`,source:'Internal developer generated test pattern',permission:'Original QA fixture — no broadcast material'}));
   let active=0;window.__setVideo=(i)=>{active=i;root.render(React.createElement(CinematicVideo,{clips,activeIndex:active,onNext:()=>window.__setVideo((active+1)%3),className:'qa-films'}));};window.__setVideo(0);
   window.__failVideo=()=>{clips[0]={...clips[0],src:'/__qa-media/missing.mp4'};window.__setVideo(0);};
   window.__qaUnmount=()=>{root.unmount();surface.remove();};
  }''')
  page.add_style_tag(content='.qa-films{position:absolute;inset:0}')
  results=[]
  for i in range(3):
   page.evaluate('(i)=>window.__setVideo(i)',i)
   page.wait_for_function('''i=>{const v=document.querySelectorAll('#qa-video-harness video')[i];return v&&v.readyState>=2&&v.currentTime>.12&&!v.paused&&!v.error;}''',arg=i)
   state=page.locator('#qa-video-harness video').nth(i).evaluate('(v)=>({readyState:v.readyState,currentTime:v.currentTime,paused:v.paused,error:v.error?.message,muted:v.muted,playsInline:v.playsInline})');results.append(state)
  # Viewport exit and reduced motion stop the actual player rather than replacing it with a still test.
  page.locator('#qa-video-harness').evaluate("e=>e.style.transform='translateY(1800px)'")
  page.wait_for_function("Array.from(document.querySelectorAll('#qa-video-harness video')).every(v=>v.paused)")
  offscreen=True;page.locator('#qa-video-harness').evaluate("e=>e.style.transform=''")
  page.emulate_media(reduced_motion='reduce');page.wait_for_function("Array.from(document.querySelectorAll('#qa-video-harness video')).every(v=>v.paused)")
  reduced=True;page.emulate_media(reduced_motion='no-preference');page.evaluate('window.__failVideo()')
  page.wait_for_function("document.querySelector('#qa-video-harness video').error !== null")
  poster=page.locator('#qa-video-harness .film-poster').evaluate('(e)=>e.complete&&e.naturalWidth>0')
  assert poster
  assert page.locator('#qa-video-harness .film-play-control').count()==0
  page.evaluate('window.__qaUnmount()');browser.close()
(OUT/'cinematic-pipeline-tests.json').write_text(json.dumps({'fixtureType':'Synthetic FFmpeg test patterns outside repository; NOT actual RR footage','clips':results,'offscreenPauses':offscreen,'reducedMotionPauses':reduced,'failedClipPosterFallback':poster,'errors':errors,'actualRRPlayback':'Blocked; no authorized source clips configured'},indent=2))
print('Synthetic native player: three clips advanced, viewport/reduced-motion pause passed. This does not verify real RR footage.')
