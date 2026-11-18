import React,{useEffect,useRef,useState} from "react";
import type {Player} from "../types";
import {playerImage} from "../utils/media";
import "./cricket-performance-gauge.css";
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
export function CricketPerformanceGauge({players,mode,onInspect}:{
 players:Player[];mode:"batting"|"bowling";onInspect:(p:Player)=>void;
}) {
 const [id,setId]=useState<number|null>(null);
 const [value,setValue]=useState(0);
 const raf=useRef(0);
 const p=players.find(p=>p.player_id===id)??players[0];
 const batting=mode==="batting",maximum=batting?250:18;
 const actual=p?(batting?p.batting.press_sr:p.bowling.press_econ):0;
 const v=Number.isFinite(actual)?actual:0;
 useEffect(()=>{
  cancelAnimationFrame(raf.current);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){setValue(v);return;}
  let start=0;
  const tick=(now:number)=>{
   if(!start)start=now;
   const t=clamp((now-start)/1050);
   setValue(v*(1-Math.pow(1-t,3)));
   if(t<1)raf.current=requestAnimationFrame(tick);
  };
  raf.current=requestAnimationFrame(tick);
  return ()=>cancelAnimationFrame(raf.current);
 },[p?.player_id,mode,v]);
 if(!p)return null;
 const ratio=clamp(value/maximum),deg=-120+240*ratio;
 const stats=batting?[
  ["Overall SR",p.batting.overall_sr.toFixed(1)],
  ["Pressure balls",String(p.batting.press_balls)],
  ["SR delta",p.batting.sr_delta.toFixed(1)],
  ["Runs",String(p.batting.total_runs)]
 ]:[
  ["Overall economy",p.bowling.overall_econ.toFixed(2)],
  ["Pressure balls",String(p.bowling.press_balls)],
  ["Economy delta",p.bowling.econ_delta.toFixed(2)],
  ["Wickets",String(p.bowling.wickets)]
 ];
 const src=playerImage(p);
 return <section className="kh-gauge" aria-label={batting?"Pressure strike rate instrument":"Pressure economy instrument"}>
  <header className="kh-gauge__header">
   <div><p>THE PERFORMANCE INSTRUMENT</p><h2>{batting?"Pressure strike rate.":"Pressure economy."}</h2>
    <small>Legacy recorded sample · {batting?"runs per 100 balls":"runs conceded per over (lower is preferable)"}</small></div>
   <label>SELECT PLAYER
    <select value={p.player_id} onChange={e=>setId(Number(e.target.value))}>
     {players.slice(0,30).map(x=><option value={x.player_id} key={x.player_id}>{x.player_name}</option>)}
    </select>
   </label>
  </header>
  <div className="kh-gauge__body">
   <div className="kh-gauge__instrument" role="img"
    aria-label={p.player_name+", "+v.toFixed(batting?1:2)+", fixed displayed domain zero to "+maximum+(v>maximum?", value exceeds domain":"")}>
    <span className="kh-gauge__ring" aria-hidden="true"
     style={{background:"conic-gradient(from 240deg,#e73589 0deg,#70d2de "+(ratio*240)+"deg,transparent "+(ratio*240)+"deg)"}}/>
    {Array.from({length:13},(_,i)=><span className="kh-gauge__tick" key={i}
      style={{transform:"rotate("+(-120+i*20)+"deg)"}}/>)}
    <span className="kh-gauge__needle" data-testid="gauge-needle"
     style={{transform:"translate(-50%,-94%) rotate("+deg+"deg)"}}/>
    <span className="kh-gauge__hub" aria-hidden="true"/>
    <span className="kh-gauge__display"><small>{batting?"PRESSURE STRIKE RATE":"PRESSURE ECONOMY"}</small>
     <strong data-testid="gauge-value">{value.toFixed(batting?1:2)}</strong>
     <small>{batting?"RUNS / 100 BALLS":"RUNS / OVER"}</small>
     {v>maximum&&<b>ABOVE VISUAL SCALE</b>}</span>
    <span className="kh-gauge__min">0</span><span className="kh-gauge__max">{maximum}</span>
   </div>
   <div className="kh-gauge__details">
    <div className="kh-gauge__player">
     {src&&<img src={src} width="100" height="125" loading="lazy" alt="" referrerPolicy="no-referrer"
      onError={e=>{e.currentTarget.style.display="none"}}/>}
     <div><small>PLAYER ID {p.player_id}</small><h3>{p.player_name}</h3></div>
    </div>
    <dl>{stats.map(([name,n])=><div key={name}><dt>{name}</dt><dd>{n}</dd></div>)}</dl>
    <button type="button" onClick={()=>onInspect(p)}>Explore player's recorded data ↗</button>
    <p>Fixed visual scale 0–{maximum}. The numeric value is never clipped.
     This display does not represent an accepted private D20 rating.</p>
   </div>
  </div>
 </section>;
}