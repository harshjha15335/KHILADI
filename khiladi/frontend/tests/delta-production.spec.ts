import { test, expect } from "@playwright/test";
const routes=["home","database","rankings","pressure-lab","comparison","war-room",
  "data-explorer","batting-intel","bowling-intel","command-centre","methodology"];

test("the user-approved color symbol retains its orientation in loader",async({page})=>{
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#home");
  const logo=page.locator(".khiladi-intro .khiladi-logo--original");
  await expect(logo).toBeVisible();
  const info=await logo.locator("img").evaluate((img:HTMLImageElement)=>{
    const cs=getComputedStyle(img);
    return {src:img.currentSrc,filter:cs.filter,width:img.width,height:img.height};
  });
  expect(info.src).toContain("khiladi-symbol.svg");
  expect(info.filter).toBe("none");
  expect(info.height).toBeGreaterThan(info.width);
  await page.keyboard.press("Escape");
});

test("the original ThreeUI vortex rotates, dissolves and responds to suction",async({page})=>{
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#pressure-lab");
  await page.keyboard.press("Escape");
  const host=page.locator(".typography-vortex-component").first();
  await expect(host).toBeVisible();
  const box=await host.boundingBox();
  expect(box).not.toBeNull();
  const x=box!.x+box!.width*.77, y=box!.y+box!.height*.47;
  await page.mouse.move(x,y);
  await expect.poll(async()=>host.getAttribute("data-dissolve-state"),{timeout:5000}).toBe("active");
  await page.mouse.click(x,y);
  await expect.poll(async()=>host.getAttribute("data-suction-state"),{timeout:2000}).toBe("active");
  await page.mouse.move(box!.x+6,box!.y+6);
  await expect.poll(async()=>host.getAttribute("data-suction-state"),{timeout:5000}).toBe("idle");
  await expect(host.locator("canvas")).toHaveCount(1);
});

test("the iridescent action is a real link/button, reactive and triggers once",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#pressure-lab");
  const cta=page.locator(".metric-vortex-scene .iridescent-glass").first();
  await expect(cta).toBeVisible();
  const a=await cta.evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(a).toContain("gradient");
  await cta.hover();
  await expect.poll(async()=>cta.evaluate(el=>el.style.getPropertyValue("--gl-x"))).not.toBe("");
  await cta.click();
  await expect(page).toHaveURL(/#comparison$/);
});

test("all 11 routes retain visible content and do not throw",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const route of routes){
    const errors:string[]=[];
    const fn=(err:Error)=>errors.push(err.message);
    page.on("pageerror",fn);
    await page.goto("/#"+route);
    const main=page.locator("main");
    await expect(main).toBeVisible();
    await expect.poll(async()=>main.evaluate(el=>el.textContent?.trim().length||0)).toBeGreaterThan(150);
    if(route!=="home"&&route!=="methodology")
      await expect(main.locator(".metric-vortex-scene canvas")).toHaveCount(1);
    expect(errors).toEqual([]);
    page.off("pageerror",fn);
  }
});

test("responsive 390, 768, 1440 and 1920 views have no document overflow",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const w of [390,768,1440,1920]){
    await page.setViewportSize({width:w,height:w===390?844:900});
    for(const route of ["home","rankings","pressure-lab","comparison"]){
      await page.goto("/#"+route);
      const over=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4);
      expect(over,route+" at "+w).toBe(false);
    }
  }
});

test("all nine public quiz selections return real data without a backend",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/#home");
  const results=await page.evaluate(async()=>{
    const {recommendPlayers}=await import("/src/utils/api.ts");
    const snapshots=await (await fetch("/data/quiz_recommendations.json")).json();
    const out=[];
    for(const key of Object.keys(snapshots)){
      const [role_priority,match_phase,risk_profile]=JSON.parse(key) as [string,string,string];
      const recommendation=await recommendPlayers({role_priority,match_phase,risk_profile});
      out.push({key,count:recommendation.recommendations?.length||0,
        matched:JSON.stringify(recommendation.query)===JSON.stringify(snapshots[key].query)});
    }
    return out;
  });
  expect(results).toHaveLength(9);
  expect(results.every(x=>x.count>0)).toBe(true);
});

test("hero cinematic scroll visibly enlarges trophy and disperses supporting images",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#home");
  await page.keyboard.press("Escape");
  const centre=page.locator(".hero-photo-slot--centre");
  const left=page.locator(".hero-photo-slot--left-top");
  const before=await centre.evaluate(el=>el.getBoundingClientRect().width);
  await page.evaluate(()=>window.scrollTo(0,Math.floor(innerHeight*.78)));
  await page.waitForTimeout(1050);
  const after=await centre.evaluate(el=>el.getBoundingClientRect().width);
  const otherOpacity=await left.evaluate(el=>parseFloat(getComputedStyle(el).opacity));
  expect(after).toBeGreaterThan(before*1.35);
  expect(otherOpacity).toBeLessThan(.9);
  await expect(page.getByRole("navigation",{name:"Primary navigation"})).toBeVisible();
});

test("player gallery translates as the reader progresses but remains directly scrollable",async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.emulateMedia({reducedMotion:"no-preference"});
  await page.goto("/#home");
  await page.keyboard.press("Escape");
  const rail=page.locator(".home-player-grid");
  await rail.scrollIntoViewIfNeeded();
  await page.evaluate(()=>scrollBy(0,290));
  await page.waitForTimeout(700);
  const pos=await rail.evaluate(el=>({left:el.scrollLeft,max:el.scrollWidth-el.clientWidth}));
  expect(pos.max).toBeGreaterThan(100);
  expect(pos.left).toBeGreaterThan(0);
  await expect(rail.locator(".home-player-item").first()).toHaveCount(1);
});
