import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
const output = process.env.AUDIT_OUTPUT || "../../docs/qa/delta-live";
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||"/usr/bin/chromium",args:["--no-sandbox"]});
const targets=[
  ["delta-desktop","https://deltacafes.com/en",1440,900],
  ["khiladi-desktop","https://harshjha15335.github.io/KHILADI/#home",1440,900],
  ["delta-mobile","https://deltacafes.com/en",390,844],
  ["khiladi-mobile","https://harshjha15335.github.io/KHILADI/#home",390,844],
  ...["database","rankings","data-explorer","pressure-lab","comparison","war-room","batting-intel","bowling-intel","command-centre","methodology"].map(r=>[r,"https://harshjha15335.github.io/KHILADI/#"+r,1440,900])
];
const results=[];
for(const [id,url,width,height] of targets){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:"no-preference"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const failed=[];page.on("requestfailed",r=>failed.push({url:r.url(),reason:r.failure()?.errorText}));
 let response=null;let error=null;
 try{
   response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:25000});
   await page.waitForTimeout(id.startsWith("delta")?2000:4400);
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
await fs.writeFile(path.join(output,"metrics.json"),JSON.stringify(results,null,2));
await fs.writeFile(path.join(output,"SUMMARY.md"),[
 "# Khiladi vs Delta live screenshot audit",
 "Chromium desktop + mobile. See metrics.json and corresponding scroll-depth PNG captures.",
 ...results.map(r=>`- ${r.id}: HTTP ${r.status}; nav ${r.metrics.navPosition} at ${r.metrics.navTop}; images ${r.metrics.loadedImages}/${r.metrics.images}; broken ${r.metrics.brokenImages?.length}; cards ${r.metrics.playerCards}; overflow ${r.metrics.overflow}; browser errors ${r.errors.length}`),
 "Public D20 remains a separate protected dataset and must not be replaced with legacy statistics."
].join("\n"));
await browser.close();
