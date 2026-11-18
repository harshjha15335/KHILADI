import { chromium } from "playwright";
import { readFileSync,writeFileSync,mkdirSync } from "node:fs";
import {resolve} from "node:path";
const entries=Object.entries(JSON.parse(readFileSync("src/components/player-cards/official-portraits.json","utf8")))
 .map(([id,v])=>({id,name:v.name,url:v.url,source:v.source}));
const dir=resolve("../../docs/qa/portrait-identity-audit");
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const results=[];
for(let batch=0;batch<Math.ceil(entries.length/20);batch++){
 const members=entries.slice(batch*20,batch*20+20);
 const page=await browser.newPage({viewport:{width:1440,height:1150},deviceScaleFactor:1});
 const cards=members.map((v)=>`<div class="card"><div class="id">${v.id} · ${v.name.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</div>
 <img src="${v.url.replace(/&/g,"&amp;").replace(/"/g,"&quot;")}"
 alt="${v.name.replace(/"/g,"&quot;")}"><small>${v.url.includes("fallback=")?"FALLBACK QUERY PARAM":"DIRECT URL"}</small></div>`).join("");
 await page.setContent(`<!doctype html><html><head><style>
 *{box-sizing:border-box}body{margin:0;background:#f4f5f8;font:15px Arial,sans-serif}
 .grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:8px}
 .card{position:relative;border:2px solid #bdc5d4;background:#fff;height:292px;overflow:hidden}
 .id{height:31px;padding:8px 4px;font-size:13px;font-weight:700;white-space:nowrap;color:#21355a}
 .card img{display:block;background:#e3e8ef;object-fit:contain;width:100%;height:235px}
 .card small{display:block;font:10px monospace;padding:6px;color:#6b7087}
 </style></head><body><div class="grid">${cards}</div></body></html>`,{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(7500);
 const evaluated=await page.locator(".card").evaluateAll((divs)=>divs.map((el)=>{
  const img=el.querySelector("img");
  return {id:el.querySelector(".id")?.textContent?.trim(),state:img?.naturalWidth?"loaded":"missing",width:img?.naturalWidth??0,height:img?.naturalHeight??0};
 }));
 results.push(...evaluated);
 await page.screenshot({path:resolve(dir,`batch-${batch+1}.png`),fullPage:true});
 await page.close();
}
await writeFileSync(resolve(dir,"results.json"),JSON.stringify(results,null,2));
await browser.close();
console.log("Audited "+results.length+" manifest images; loaded "+results.filter(x=>x.state==="loaded").length);
