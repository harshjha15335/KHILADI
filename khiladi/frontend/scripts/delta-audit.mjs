import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const output = process.env.AUDIT_OUTPUT || "../../docs/qa/delta-live";
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||"/usr/bin/chromium",args:["--no-sandbox"]});
const KHILADI_BASE_URL=process.env.KHILADI_BASE_URL || "https://harshjha15335.github.io/KHILADI/#";
const targets=[
  ["delta-desktop","https://deltacafes.com/en",1440,900],
  ["khiladi-desktop",KHILADI_BASE_URL+"home",1440,900],
  ["delta-mobile","https://deltacafes.com/en",390,844],
  ["khiladi-mobile",KHILADI_BASE_URL+"home",390,844],
  ...["database","rankings","data-explorer","pressure-lab","comparison","war-room","batting-intel","bowling-intel","command-centre","methodology"].map(r=>[r,KHILADI_BASE_URL+r,1440,900])
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
     for(const label of [/Rejeitar todos/i,/Reject all/i,/Recusar todos/i]){
       const button=page.getByRole("button",{name:label}).first();
       if(await button.isVisible().catch(()=>false)){await button.click({timeout:3000}).catch(()=>{});break;}
     }
     await page.waitForTimeout(4400);
   }else await page.waitForTimeout(3100);
   if(!id.startsWith("delta")){await page.keyboard.press("Escape");await page.waitForTimeout(600)}
 }catch(e){error=String(e)}
 const metrics=await page.evaluate(()=>{
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
 for(const [i,fraction] of (id.startsWith("delta")||id.includes("desktop")?[0,.35,.7,1]:[0,.75]).entries()){
   await page.evaluate(f=>window.scrollTo(0,Math.max(0,document.documentElement.scrollHeight-innerHeight)*f),fraction);
   await page.waitForTimeout(550);
   await page.screenshot({path:path.join(output,`${id}-${i}.png`)}).catch(()=>{});
 }
 const record={id,url,status:response?.status()||null,error,metrics,errors,failed:failed.slice(0,30)};
 results.push(record);console.log("AUDIT "+JSON.stringify(record));
 await page.close();
}
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
 ...results.map(r=>`- ${r.id}: HTTP ${r.status}; nav ${r.metrics.navPosition} at ${r.metrics.navTop}; images ${r.metrics.loadedImages}/${r.metrics.images}; broken ${r.metrics.brokenImages?.length}; cards ${r.metrics.playerCards}; overflow ${r.metrics.overflow}; browser errors ${r.errors.length}`),
 "Public D20 remains a separate protected dataset and must not be replaced with legacy statistics."
].join("\n"));
await browser.close();
