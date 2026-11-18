import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const output = process.env.AUDIT_OUTPUT || "../../docs/qa/delta-live";
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||"/usr/bin/chromium",args:["--no-sandbox"]});
const KHILADI_BASE_URL=process.env.KHILADI_BASE_URL || "https://harshjha15335.github.io/KHILADI/#";
const KHILADI_PRODUCTION_URL = process.env.KHILADI_PRODUCTION_URL || "https://khiladi-six.vercel.app/#";
const khiladiRoutes=["home","database","rankings","pressure-lab","comparison","war-room",
 "data-explorer","batting-intel","bowling-intel","command-centre","methodology"];
const deltaRoutes=["","/about","/history","/coffee-cycle","/products","/sustainability",
 "/journal","/coffee-science-centre","/barista-academy"];
const viewports=[["desktop",1440,900],["mobile",390,844]];
const targets=[
 ...deltaRoutes.flatMap(route=>viewports.map(([v,w,h])=>[
  "delta-"+(route.slice(1)||"home")+"-"+v,"https://deltacafes.com/en"+route,w,h
 ])),
 ...khiladiRoutes.flatMap(route=>viewports.map(([v,w,h])=>[
  "khiladi-"+route+"-"+v,KHILADI_BASE_URL+route,w,h
 ])),
 ...["home","rankings","pressure-lab","comparison","command-centre"].flatMap(route=>viewports.map(([v,w,h])=>[
  "vercel-"+route+"-"+v,KHILADI_PRODUCTION_URL+route,w,h
 ])),
];
const results=[];
for(const [id,url,width,height] of targets){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:"no-preference"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const failed=[];page.on("requestfailed",r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
 let response=null;let error=null;
 try{
   response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:25000});
   if(id.startsWith("delta")){
     // Delta currently shows a real consent banner that otherwise hides the reference.
     for(const label of [/Rejeitar todos/i,/Negar cookies/i,/Recusar cookies/i,/Reject all/i,/Deny cookies/i,/Recusar todos/i]){
       const button=page.getByRole("button",{name:label}).first();
       if(await button.isVisible().catch(()=>false)){await button.click({timeout:3000}).catch(()=>{});break;}
     }
     // For audit framing only, remove Cookiebot's consent overlay after
   // attempting the proper decline action, so actual reference content is visible.
   await page.evaluate(()=>{
     for(const sel of ["#CybotCookiebotDialog","#CybotCookiebotDialogBodyUnderlay",
       "#CookiebotWidget","#CookiebotWidget-widgetContent"]){
       document.querySelectorAll(sel).forEach(el=>{el.style.setProperty("display","none","important")});
     }
   }).catch(()=>{});
   // Preserve an authentic visitor decision first. In the screenshot-only
   // reference we can then dismiss any remaining fixed cookie overlay so the
   // underlying page composition is actually comparable.
   await page.evaluate(()=>{
     const candidates=[...document.querySelectorAll("iframe,dialog,aside,section,div")];
     for(const el of candidates){
       const node=el;
       const cs=getComputedStyle(node);
       const rect=node.getBoundingClientRect();
       const isCookieFrame=node.tagName==="IFRAME"&&/cookiebot|usercentrics/i.test(node.getAttribute("src")||"");
       const fixedCookieBanner=(cs.position==="fixed"||cs.position==="sticky")&&
         rect.width>=innerWidth*.65&&rect.height>=80&&
         rect.top>=innerHeight*.2&&
         /cookiebot|utilizamos cookies|we use cookies|consentimento de cookies/i.test((node.textContent||"").slice(0,7000));
       if(isCookieFrame||fixedCookieBanner) node.style.setProperty("display","none","important");
     }
   }).catch(()=>{});
   await page.waitForTimeout(4400);
   }else await page.waitForTimeout(2200);
   if(!id.startsWith("delta")){await page.keyboard.press("Escape");await page.waitForTimeout(600)}
 }catch(e){error=String(e)}
 const initialMetrics=await page.evaluate(()=>{
   const n=document.querySelector(".khiladi-top-nav,.khiladi-bottom-dock,header nav,nav");
   const imgs=[...document.images],r=n?.getBoundingClientRect();
   return {title:document.title,viewport:[innerWidth,innerHeight],pageHeight:document.documentElement.scrollHeight,
    navPosition:n?getComputedStyle(n).position:null,navTop:r?.top,navBottom:r?.bottom,
    navBlur:n?getComputedStyle(n).backdropFilter:null,
    brokenImages:imgs.filter(i=>i.complete && i.naturalWidth===0).map(i=>i.currentSrc).slice(0,30),
    images:imgs.length,loadedImages:imgs.filter(i=>i.complete&&i.naturalWidth>0).length,
    playerCards:document.querySelectorAll(".pc-preview,.discovery-player,.home-player-item").length,
    overflow:document.documentElement.scrollWidth>innerWidth+2,
    heading:document.querySelector("h1")?.textContent?.trim().slice(0,120),
    introVisible:!!document.querySelector(".intro-root"),videos:document.querySelectorAll("video,iframe").length};
 }).catch(e=>({evaluationError:String(e)}));
 for(const [i,fraction] of [0,.35,.7,1].entries()){
   await page.evaluate(f=>window.scrollTo(0,Math.max(0,document.documentElement.scrollHeight-innerHeight)*f),fraction);
   await page.waitForTimeout(550);
   await page.screenshot({path:path.join(output,`${id}-${i}.png`)}).catch(()=>{});
 }
 const metricsFinal=await page.evaluate(()=>{
   const imgs=[...document.images];
   const canvas=document.querySelector(".typography-vortex-component");
   const nav=document.querySelector(".khiladi-top-nav");
   return { images:imgs.length,loadedImages:imgs.filter(i=>i.complete&&i.naturalWidth>0).length,
     pendingImages:imgs.filter(i=>!i.complete).length,
     brokenImages:imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.currentSrc).slice(0,80),
     loadedPortraits:imgs.filter(i=>i.currentSrc.includes("iplt20.com")&&i.naturalWidth>0).length,
     nativeHorizontalOverflow:document.documentElement.scrollWidth>innerWidth+3,
     navTop:nav?.getBoundingClientRect().top??null,
     vortex:!!canvas,canvasDissolve:canvas?.getAttribute("data-dissolve-state")??null,
     contentCharacters:document.querySelector("main")?.textContent?.trim().length??0 };
 });
 const record={id,url,status:response?.status()||null,error,metrics:{...initialMetrics,...metricsFinal},errors,failed:failed.slice(0,30)};
 results.push(record);console.log("AUDIT "+JSON.stringify(record));
 await page.close();
}
// Frame-based proof: native intro, original vortex hover/suction and glass CTA.
const motion={intro:[],interaction:[],errors:[]};
for(const [label,root] of [["preview",KHILADI_BASE_URL],["production",KHILADI_PRODUCTION_URL]]){
 for(const view of [["desktop",1440,900],["mobile",390,844]]){
  const [tag,w,h]=view; const page=await browser.newPage({viewport:{width:w,height:h}});
  try{
   await page.goto(root+"home",{waitUntil:"domcontentloaded",timeout:25000});
   let elapsed=0;
   for(const delay of [250,500,650,800]){
    await page.waitForTimeout(delay);elapsed+=delay;
    const file=path.join(output,`intro-${label}-${tag}-${elapsed}.png`);
    await page.screenshot({path:file}).catch(()=>{});
    motion.intro.push({label,viewport:tag,atMs:elapsed,file});
   }
  }catch(error){motion.errors.push(String(error))}
  await page.close();
 }
}
{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.goto(KHILADI_BASE_URL+"pressure-lab",{waitUntil:"domcontentloaded"});
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1100);
  const host=page.locator(".typography-vortex-component").first();
  const box=await host.boundingBox();
  if(box){
   const x=box.x+box.width*.78,y=box.y+box.height*.52;
   for(const state of ["idle","hover","suction","recover"]){
    if(state==="hover")await page.mouse.move(x,y);
    if(state==="suction")await page.mouse.click(x,y);
    if(state==="recover"){await page.mouse.move(0,0);await page.waitForTimeout(1080)}
    await page.waitForTimeout(state==="hover"?300:state==="suction"?90:120);
    const data=await host.evaluate(el=>({
      dissolve:el.getAttribute("data-dissolve-state"),
      suction:el.getAttribute("data-suction-state"),
      particles:el.getAttribute("data-particles")
    }));
    const file=path.join(output,"vortex-"+state+".png");
    await page.screenshot({path:file});
    motion.interaction.push({state,...data,file});
   }
  }
  const button=page.locator(".metric-vortex-scene .iridescent-glass").first();
  await button.screenshot({path:path.join(output,"glass-button-idle.png")}).catch(()=>{});
  await button.hover().catch(()=>{});
  await button.screenshot({path:path.join(output,"glass-button-hover.png")}).catch(()=>{});
 }catch(error){motion.errors.push(String(error))}
 await page.close();
}
await fs.writeFile(path.join(output,"motion-results.json"),JSON.stringify(motion,null,2));

const urls=[
  "https://www.iplt20.com/api/team-assets?pathname=player%2F8903%2F1558%2F28503.png&brand=ipl&fallback=fallback-player-men",
  "https://www.iplt20.com/api/team-assets?pathname=player%2F8903%2F1558%2F68314.png&brand=ipl",
  "https://www.iplt20.com/api/team-assets?pathname=player%2F8903%2F1558%2F83313.png&brand=ipl",
  "https://www.iplt20.com/_next/image?url=%2Fapi%2Fteam-assets%3Fpathname%3Dplayer%252F8903%252F1558%252F28503.png%26brand%3Dipl%26fallback%3Dfallback-player-men&w=1080&q=75",
];
const probe=await browser.newPage({viewport:{width:1440,height:900}});
await probe.goto(KHILADI_BASE_URL+"home",{waitUntil:"domcontentloaded"}).catch(()=>{});
const imageTests=await probe.evaluate(async urls=>Promise.all(urls.map(url=>new Promise(resolve=>{
  const img=new Image();img.referrerPolicy="no-referrer";let finished=false;
  const done=(state)=>{if(finished)return;finished=true;resolve({url,state,width:img.naturalWidth,height:img.naturalHeight})};
  const timeout=setTimeout(()=>done("timeout"),12000);
  img.onload=()=>{clearTimeout(timeout);done("loaded")};
  img.onerror=()=>{clearTimeout(timeout);done("error")};
  img.src=url;
}))),urls);
console.log("IPL_IMAGE_TEST "+JSON.stringify(imageTests));
await probe.close();
await fs.writeFile(path.join(output,"ipl-image-checks.json"),JSON.stringify(imageTests,null,2));
await fs.writeFile(path.join(output,"metrics.json"),JSON.stringify(results,null,2));
await fs.writeFile(path.join(output,"SUMMARY.md"),[
 "# Khiladi vs Delta live screenshot audit",
 "Chromium desktop + mobile. See metrics.json and corresponding scroll-depth PNG captures.",
 "Reference-only overlay policy: Cookiebot consent was declined when possible and visually hidden for layout comparisons; no source site content was changed.",
 ...results.map(r=>`- ${r.id}: HTTP ${r.status}; nav ${r.metrics.navPosition} at ${r.metrics.navTop}; images ${r.metrics.loadedImages}/${r.metrics.images}; broken ${r.metrics.brokenImages?.length}; cards ${r.metrics.playerCards}; overflow ${r.metrics.overflow}; browser errors ${r.errors.length}`),
 "Public D20 remains a separate protected dataset and must not be replaced with legacy statistics."
].join("\n"));
await browser.close();
