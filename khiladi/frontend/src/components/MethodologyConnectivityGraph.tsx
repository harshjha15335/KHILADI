import React,{useEffect,useRef,useState} from "react";
import "./methodology-connectivity.css";
type Node={id:string,label:string,detail:string,x:number,y:number,kind:string};
const nodes:Node[]=[
{id:"records",label:"Historical records",detail:"Player identities and historical deliveries in the public data pack.",x:.49,y:.12,kind:"source"},
{id:"context",label:"Match context",detail:"Recorded match state used to describe the public legacy pressure sample.",x:.26,y:.30,kind:"source"},
{id:"batballs",label:"Batting balls",detail:"Observed batting delivery counts and recorded runs.",x:.18,y:.56,kind:"source"},
{id:"bowlballs",label:"Bowling balls",detail:"Observed bowling deliveries, wickets and runs conceded.",x:.77,y:.32,kind:"source"},
{id:"sr",label:"Pressure strike rate",detail:"Runs per 100 recorded pressure batting deliveries.",x:.37,y:.70,kind:"metric"},
{id:"econ",label:"Pressure economy",detail:"Runs conceded per six recorded pressure bowling deliveries.",x:.78,y:.68,kind:"metric"},
{id:"ranking",label:"Legacy ranking",detail:"Historical public heuristic ranking; it is not the protected accepted D20 output.",x:.55,y:.51,kind:"surface"},
{id:"compare",label:"Compare players",detail:"Compares publicly recorded metrics side by side.",x:.49,y:.87,kind:"surface"},
];
const links:[number,number][]=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,4],[3,5],[4,6],[5,6],[4,7],[5,7],[6,7]];
const byId=(id:string)=>nodes.findIndex(x=>x.id===id);
export function MethodologyConnectivityGraph(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const host=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState("records");
 useEffect(()=>{
  const el=host.current,c=canvas.current;if(!el||!c)return;
  const ctx=c.getContext("2d");if(!ctx)return;
  let width=1,height=1,frame=0,visible=true,disposed=false;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const resize=()=>{
   const rect=el.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);
   const dpr=Math.min(2,window.devicePixelRatio||1);
   c.width=Math.ceil(width*dpr);c.height=Math.ceil(height*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  const ro=new ResizeObserver(resize);ro.observe(el);resize();
  const io=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;},{rootMargin:"150px"});
  io.observe(el);
  const rng=(seed:number)=>{let n=seed>>>0;return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296}};
  const rand=rng(27659);
  const dots=Array.from({length:70},()=>({x:rand(),y:rand(),speed:rand()*.00007+.000015,phase:rand()*Math.PI*2}));
  const draw=(time:number)=>{
   if(disposed)return;
   if(visible){
    ctx.clearRect(0,0,width,height);
    const compact=width<650;
    const point=(i:number)=>{
      const p=nodes[i]; const breathing=reduced.matches?0:Math.sin(time*.00045+i*1.7)*3;
      return {x:p.x*width,y:p.y*height+breathing};
    };
    ctx.save();
    const bg=ctx.createLinearGradient(0,0,width,height);bg.addColorStop(0,"#edf3fe");bg.addColorStop(.5,"#f8eef9");bg.addColorStop(1,"#dbe7f8");
    ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);
    for(const d of dots){
     const x=d.x*width,y=((d.y+(reduced.matches?0:time*d.speed))%1)*height;
     ctx.globalAlpha=.18+.13*Math.sin(time*.0005+d.phase);
     ctx.fillStyle="#4c75be";ctx.beginPath();ctx.arc(x,y,compact?1.1:1.5,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    for(const [i,j] of links){
      const a=point(i),b=point(j);
      const chosen=i===byId(active)||j===byId(active);
      ctx.strokeStyle=chosen?"rgba(231,53,137,.72)":"rgba(54,103,179,.28)";
      ctx.lineWidth=chosen?2.1:1.05;
      ctx.beginPath();ctx.moveTo(a.x,a.y);
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      ctx.quadraticCurveTo(mx,my-(compact?9:20),b.x,b.y);
      ctx.stroke();
      if(!reduced.matches){
       const t=(time*.00011+(i+j)*.09)%1;
       const x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t;
       ctx.beginPath();ctx.fillStyle=chosen?"#e73589":"#6a91c7";ctx.arc(x,y,chosen?3:1.5,0,Math.PI*2);ctx.fill();
      }
    }
    nodes.forEach((p,i)=>{
      const v=point(i),chosen=p.id===active;
      ctx.beginPath();ctx.arc(v.x,v.y,chosen?13:8,0,Math.PI*2);
      ctx.fillStyle=chosen?"#e73589":p.kind==="source"?"#2a56b4":p.kind==="metric"?"#7660c6":"#b24b96";
      ctx.shadowBlur=chosen?20:9;ctx.shadowColor=chosen?"#ff92d1":"#b2c4e9";ctx.fill();
      ctx.shadowBlur=0;
      ctx.beginPath();ctx.arc(v.x,v.y,3,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();
    });
    ctx.restore();
   }
   frame=requestAnimationFrame(draw);
  };
  frame=requestAnimationFrame(draw);
  return ()=>{disposed=true;cancelAnimationFrame(frame);io.disconnect();ro.disconnect()};
 },[active]);
 const chosen=nodes.find(x=>x.id===active)??nodes[0];
 return <section className="method-connectivity" aria-labelledby="method-connectivity-title">
  <header><p className="eyebrow">HOW THE NUMBERS CONNECT</p><h2 id="method-connectivity-title">From delivery to decision.</h2>
   <p>Follow the recorded observations through derived batting and bowling metrics into the public analytical views. Lines represent data relationships—not causation or private D20 scores.</p></header>
  <div ref={host} className="method-connectivity__field">
   <canvas ref={canvas} aria-hidden="true" data-testid="methodology-graph"/>
   {nodes.map((p)=><button type="button" key={p.id}
     className={"method-connectivity__node "+(p.id===active?"is-active":"")}
     style={{left:(p.x*100)+"%",top:(p.y*100)+"%"}}
     onClick={()=>setActive(p.id)} onFocus={()=>setActive(p.id)} onMouseEnter={()=>setActive(p.id)}
     aria-pressed={p.id===active} aria-label={p.label+": "+p.detail}>{p.label}</button>)}
  </div>
  <div className="method-connectivity__description" aria-live="polite"><strong>{chosen.label}</strong><p>{chosen.detail}</p></div>
  <div className="method-connectivity__legend"><span>● Source observations</span><span>● Derived metrics</span><span>● Public analytical views</span></div>
 </section>;
}