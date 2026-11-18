import React,{useEffect,useRef} from "react";
import {gsap,ScrollTrigger,useGSAP} from "../utils/motion";
import "./editorial-matte-rise.css";
/** A single photographic editorial matte-rise chapter; no page-wide pinning. */
export function EditorialMatteRise(){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useGSAP(()=>{
  const media=gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)",()=>{
   gsap.timeline({scrollTrigger:{trigger:root.current,start:"top 86%",end:"bottom 25%",
       scrub:.8,invalidateOnRefresh:true}})
    .fromTo(".matte-rise__line",{yPercent:125,opacity:0,rotate:-5,filter:"blur(12px)"},
     {yPercent:0,opacity:1,rotate:0,filter:"blur(0px)",stagger:.14,ease:"power2.out"},0)
    .fromTo(".matte-rise__photo--left",{xPercent:-50,yPercent:28,rotation:-17,opacity:.15},
     {xPercent:0,yPercent:0,rotation:-7,opacity:1,ease:"power2.out"},.12)
    .fromTo(".matte-rise__photo--right",{xPercent:50,yPercent:-18,rotation:14,opacity:.1},
     {xPercent:0,yPercent:0,rotation:7,opacity:1,ease:"power2.out"},.16)
    .fromTo(".matte-rise__copy",{y:60,opacity:0},{y:0,opacity:1,ease:"power2.out"},.29);
  });
  return ()=>media.revert();
 },{scope:root});
 useEffect(()=>{
  const c=canvas.current;if(!c)return;const g=c.getContext("2d");if(!g)return;
  let raf=0,seen=true,alive=true;const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const resize=()=>{const rect=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
    c.width=Math.max(1,Math.floor(rect.width*d));c.height=Math.max(1,Math.floor(rect.height*d));
    g.setTransform(d,0,0,d,0,0)};
  resize();const ro=new ResizeObserver(resize);ro.observe(c);
  const io=new IntersectionObserver(x=>{seen=x[0]?.isIntersecting??false});
  if(root.current)io.observe(root.current);
  const draw=(time:number)=>{
   if(!alive)return;
   if(seen){
    const w=c.getBoundingClientRect().width,h=c.getBoundingClientRect().height;
    g.clearRect(0,0,w,h);const phase=reduced.matches?0:time*.00014;
    g.save();g.translate(w*.5,h*.53);g.rotate(-.28);
    const r=Math.min(w*.29,h*.58);
    g.strokeStyle="#2b55b32b";g.lineWidth=1.25;
    g.beginPath();g.ellipse(0,0,r,r*.43,0,0,Math.PI*2);g.stroke();
    g.strokeStyle="#e7358951";g.beginPath();g.ellipse(0,0,r*.81,r*.37,0,0,Math.PI*2);g.stroke();
    for(let i=0;i<9;i++){const a=i*Math.PI*2/9+phase;
      g.fillStyle=i%3?"#2654b5aa":"#e73589aa";g.beginPath();
      g.arc(Math.cos(a)*r,Math.sin(a)*r*.43,2.3,0,Math.PI*2);g.fill();}
    g.restore();
   }
   raf=requestAnimationFrame(draw);
  };
  raf=requestAnimationFrame(draw);
  return ()=>{alive=false;cancelAnimationFrame(raf);ro.disconnect();io.disconnect()};
 },[]);
 return <section ref={root} className="matte-rise" aria-labelledby="matte-rise-title">
  <canvas ref={canvas} className="matte-rise__orbit" aria-hidden="true"/>
  <div className="matte-rise__photo matte-rise__photo--left">
   <img src={import.meta.env.BASE_URL+"assets/gallery/moment-1.webp"} alt="A batter celebrates a significant cricket moment"
    loading="lazy" decoding="async"/>
  </div>
  <div className="matte-rise__photo matte-rise__photo--right">
   <img src={import.meta.env.BASE_URL+"assets/gallery/moment-3.webp"} alt="A bowler celebrates during an IPL cricket match"
    loading="lazy" decoding="async"/>
  </div>
  <div className="matte-rise__heading">
   <p>CRICKET IS MORE THAN A NUMBER</p>
   <h2 id="matte-rise-title"><span><span className="matte-rise__line">BEYOND THE</span></span>
    <span><span className="matte-rise__line"><em>SCORECARD.</em></span></span></h2>
   <p className="matte-rise__copy">Every number has a moment behind it.</p>
  </div>
 </section>;
}