import React,{useEffect,useRef,useState} from "react";
import { playerImage } from "../utils/media";
import { NeutralPlayerAvatar } from "./NeutralPlayerAvatar";
import "./ranking-filmstrip.css";
export type FilmstripRank = {
  player_id:number;player_name:string;rank:number;pressure_impact_index:number;
  pressure_strike_rate?:number;pressure_economy?:number;
  pressure_balls_faced?:number;pressure_balls_bowled?:number;
};
function Portrait({p}:{p:FilmstripRank}) {
  const [failed,setFailed]=useState(false);
  const image=playerImage(p);
  return <span className="rank-filmstrip__portrait">
    {image&&!failed?<img src={image} alt="" width="370" height="450" decoding="async"
      loading="lazy" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:
      <NeutralPlayerAvatar className="rank-neutral-avatar"
        label={`No verified IPL portrait for ${p.player_name}`} />}
  </span>;
}
const wrap=(n:number,total:number)=>((n%total)+total)%total;
export function RankingFilmstrip({rows,role,onInspect}:{
 rows:FilmstripRank[];role:"batting"|"bowling";onInspect:(id:number)=>void;
}) {
 const root=useRef<HTMLDivElement>(null);
 const items=useRef<(HTMLButtonElement|null)[]>([]);
 const moveTo=useRef<(n:number)=>void>(()=>{});
 const [selected,setSelected]=useState(0);
 useEffect(()=>{
   const el=root.current;if(!el||!rows.length)return;
   const nodes=items.current.slice(0,rows.length);const count=nodes.length;
   const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
   let phase=0,target=0,base=0,active=false,px=0,py=0,last=performance.now(),frame=0;
   let previous=performance.now(), released=false;
   const deltaAt=(idx:number,v:number)=>{
     let delta=idx-v;
     while(delta>count/2)delta-=count;
     while(delta< -count/2)delta+=count;
     return delta;
   };
   const goto=(index:number)=>{
     const current=wrap(Math.round(phase),count);
     let delta=index-current;
     if(delta>count/2)delta-=count;
     if(delta< -count/2)delta+=count;
     base+=delta;target=base;active=false;last=performance.now();
   };
   moveTo.current=goto;
   const pointer=(e:PointerEvent)=>{
     if(e.pointerType==="touch")return;
     const r=el.getBoundingClientRect();
     px=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2));
     py=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2));
     active=true;target=base+px*(r.width<650?2.2:3.1);last=performance.now();
     el.style.setProperty("--pointer-x",`${(px+1)*50}%`);
   };
   const leave=()=>{active=false;target=base;px=0;py=0;el.style.setProperty("--pointer-x","50%")};
   let touchX=0,touchY=0;
   const touchStart=(e:TouchEvent)=>{touchX=e.touches[0]?.clientX??0;touchY=e.touches[0]?.clientY??0};
   const touchEnd=(e:TouchEvent)=>{
     const dx=(e.changedTouches[0]?.clientX??touchX)-touchX;
     const dy=(e.changedTouches[0]?.clientY??touchY)-touchY;
     if(Math.abs(dx)>35&&Math.abs(dx)>Math.abs(dy)){base+=dx<0?1:-1;target=base;last=performance.now()}
   };
   const wheel=(e:WheelEvent)=>{
     const axis=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:0;
     if(!axis)return; e.preventDefault();
     base+=Math.sign(axis);target=base;active=false;last=performance.now();
   };
   el.addEventListener("pointermove",pointer);
   el.addEventListener("pointerleave",leave);
   el.addEventListener("touchstart",touchStart,{passive:true});
   el.addEventListener("touchend",touchEnd,{passive:true});
   el.addEventListener("wheel",wheel,{passive:false});
   const render=(time:number)=>{
     if(released)return;
     const dt=Math.min(32,time-previous);previous=time;
     if(!active&&!reduce&&time-last>4200)
       target=base+Math.sin((time-last-4200)*.00042)*1.35;
     const ease=reduce?1:1-Math.pow(.001,dt/1000);
     phase+=(target-phase)*ease;
     const compact=el.clientWidth<650;
     const main=wrap(Math.round(phase),count);
     if(selected!==main)setSelected(main);
     const step=Math.min(180,Math.max(95,el.clientWidth*.12));
     nodes.forEach((card,i)=>{
       if(!card)return;
       const d=deltaAt(i,phase),dist=Math.abs(d),focus=Math.exp(-dist*dist*1.28);
       const side=Math.max(0,1-dist/5),dir=Math.sign(d);
       const x=compact?d*30+Math.sin(d*.9)*23:d*step;
       const y=compact?d*85:dist*8+py*focus*10;
       const z=focus*145-dist*148;
       const scale=.54+side*.15+focus*.54;
       const rx=compact?d*2.1:-py*focus*3.5;
       const ry=compact?-d*5:-dir*(dist>.2?14+Math.min(dist,3)*5:0)+px*focus*3;
       const rz=compact?-d*1.4:d*.7;
       card.style.setProperty("--focus",String(focus));
       card.style.zIndex=String(Math.round(1000-dist*100));
       card.style.opacity=String(Math.max(.1,side*.76+focus*.24));
       card.style.filter=`blur(${Math.max(0,dist-1.5)*.38}px)`;
       card.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
       card.setAttribute("aria-current",String(i===main));
     });
     frame=requestAnimationFrame(render);
   };
   frame=requestAnimationFrame(render);
   return ()=>{released=true;cancelAnimationFrame(frame);el.removeEventListener("pointermove",pointer);
     el.removeEventListener("pointerleave",leave);el.removeEventListener("touchstart",touchStart);
     el.removeEventListener("touchend",touchEnd);el.removeEventListener("wheel",wheel)};
 },[rows,role]);
 if(!rows.length)return null;
 return <section className="rank-filmstrip" aria-label={`${role} leaderboard perspective gallery`}>
  <div className="rank-filmstrip__heading"><span>FEATURED PLAYER FILMSTRIP</span>
   <strong>Move to explore. Select to inspect.</strong></div>
  <div ref={root} className="rank-filmstrip__stage" data-testid="ranking-filmstrip">
   <div className="rank-filmstrip__deck">
    {rows.map((p,i)=><button key={p.player_id} type="button" ref={node=>{items.current[i]=node}}
       className="rank-filmstrip__card"
       onFocus={()=>moveTo.current(i)}
       onClick={()=>onInspect(p.player_id)}
       aria-label={`Open ${p.player_name}, legacy rank ${p.rank}`}>
      <Portrait p={p}/>
      <span className="rank-filmstrip__footer">
       <em>{String(p.rank).padStart(2,"0")}</em>
       <span><strong>{p.player_name}</strong><small>{role==="batting"?
        `Pressure SR ${p.pressure_strike_rate?.toFixed(1)??"—"} · ${p.pressure_balls_faced??"—"} balls`:
        `Pressure economy ${p.pressure_economy?.toFixed(2)??"—"} · ${p.pressure_balls_bowled??"—"} balls`}</small></span>
      </span>
    </button>)}
   </div>
   <span className="rank-filmstrip__hint" aria-hidden="true">MOVE / DRAG / ARROWS</span>
  </div>
  <div className="rank-filmstrip__controls">
   <button type="button" onClick={()=>moveTo.current(wrap(selected-1,rows.length))}>← Previous</button>
   <span>LEGACY PUBLIC RANK #{rows[selected]?.rank??1} · {rows[selected]?.player_name}</span>
   <button type="button" onClick={()=>moveTo.current(wrap(selected+1,rows.length))}>Next →</button>
  </div>
 </section>;
}
