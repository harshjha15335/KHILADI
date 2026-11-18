import React,{useEffect,useRef} from "react";
/** Canvas particle-gather typography inspired by the MIT ThreeUI seeded-particle
 *  wordmark. Inherits the existing intro lifecycle; no second loading state. */
export function KhiladiParticleWordmark(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const c=ref.current;if(!c)return;
  const context=c.getContext("2d");if(!context)return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)");
  if(reduce.matches)return;
  let raf=0,disposed=false,start=0;
  const size=()=>{const r=c.getBoundingClientRect();const d=Math.min(2,devicePixelRatio||1);
    c.width=Math.max(1,Math.ceil(r.width*d));c.height=Math.max(1,Math.ceil(r.height*d));
    context.setTransform(d,0,0,d,0,0)};
  size();const ro=new ResizeObserver(()=>{size();reset();});
  let seed=0x124fe7;
  const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};
  type Part={x:number;y:number;tx:number;ty:number;s:number;kind:number;delay:number};
  let parts:Part[]=[];
  const reset=()=>{
   const w=c.getBoundingClientRect().width,h=c.getBoundingClientRect().height;
   const off=document.createElement("canvas");off.width=Math.ceil(w);off.height=Math.ceil(h);
   const g=off.getContext("2d");if(!g)return;
   const textSize=Math.min(h*.75,w*.19);
   g.font="900 "+textSize+"px Impact,Arial Narrow,Arial,sans-serif";
   g.textAlign="center";g.textBaseline="middle";g.fillText("KHILADI",w/2,h/2);
   const pixels=g.getImageData(0,0,off.width,off.height).data;
   const stride=Math.max(3,Math.round(w/240));
   const out:Part[]=[];
   for(let y=0;y<off.height;y+=stride)for(let x=0;x<off.width;x+=stride){
    if(pixels[(y*off.width+x)*4+3]<90||rand()>.74)continue;
    const dx=(rand()-.5)*w*1.6,dy=(rand()-.5)*h*2;
    out.push({x:w/2+dx,y:h/2+dy,tx:x,ty:y,s:rand()*1.5+1,
      kind:rand()>.65?1:0,delay:rand()*.48});
   }
   parts=out;start=0;
  };
  reset();ro.observe(c);
  const draw=(now:number)=>{
   if(disposed)return;if(!start)start=now;
   const t=(now-start)/1000;
   const w=c.getBoundingClientRect().width,h=c.getBoundingClientRect().height;
   context.clearRect(0,0,w,h);
   context.globalAlpha=Math.min(1,t*3)*Math.min(1,Math.max(0,(1.6-t)*3));
   for(const p of parts){
    const f=Math.max(0,Math.min(1,(t-p.delay)/1.0));
    const e=1-Math.pow(1-f,3);
    const x=p.x+(p.tx-p.x)*e,y=p.y+(p.ty-p.y)*e;
    context.fillStyle=p.kind?"#e73589":"#2654b5";
    if(p.kind)context.fillRect(x,y,p.s,p.s);
    else{context.beginPath();context.arc(x,y,p.s*.6,0,Math.PI*2);context.fill()}
   }
   context.globalAlpha=1;
   if(t<1.85)raf=requestAnimationFrame(draw);
  };
  raf=requestAnimationFrame(draw);
  return ()=>{disposed=true;ro.disconnect();cancelAnimationFrame(raf)};
 },[]);
 return <canvas className="intro-particle-wordmark" ref={ref} role="img"
  aria-label="The KHILADI wordmark assembling from particles" />;
}