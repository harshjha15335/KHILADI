import React, { useMemo } from "react";
import type { Player } from "../types";
import { TypographyVortexCanvas } from "../vendor/threeui/TypographyVortexCanvas";
import { IridescentActionButton } from "./IridescentActionButton";
import "./metric-vortex.css";

type SceneMeta = { kicker: string; title: string; subtitle: string; metricNames: string[]; next: string; action: string; };
const SCENES: Record<string, SceneMeta> = {
  "database": {kicker:"THE PLAYER ARCHIVE", title:"Find the difference.", subtitle:"Every name is a real record. Follow the evidence before the selection.", metricNames:["PLAYER ROLE","PRESSURE BALLS","STRIKE RATE","WICKETS","LEGACY IMPACT INDEX"], next:"rankings", action:"Explore rankings"},
  "rankings": {kicker:"THE SHORTLIST", title:"Moments make rankings.", subtitle:"A recorded historical sample, clearly separated from the accepted private D20 model.", metricNames:["PRESSURE INDEX","PRESSURE STRIKE RATE","PRESSURE ECONOMY","TOP 10 BATTERS","TOP 10 BOWLERS"], next:"database", action:"Browse players"},
  "pressure-lab": {kicker:"THE MOMENT OF TRUTH", title:"Pressure changes everything.", subtitle:"Read the score and match context. Follow each recorded delivery.", metricNames:["LEVERAGE INDEX","PRESSURE RUNS","PRESSURE BALLS","WICKETS","DOT BALL PERCENT"], next:"comparison", action:"Compare players"},
  "comparison": {kicker:"THE DECISION", title:"Two names. One question.", subtitle:"Put real batting and bowling histories side by side.", metricNames:["PLAYER COMPARISON","STRIKE RATE DELTA","ECONOMY DELTA","PRESSURE BALLS","RECORDED WICKETS"], next:"war-room", action:"Build a squad"},
  "war-room": {kicker:"THE AUCTION ROOM", title:"Build your next chapter.", subtitle:"A planning workspace using example budgets, not live auction prices.", metricNames:["SQUAD PLANNING","REMAINING PURSE","EXAMPLE BIDS","ROLE BALANCE","PRESSURE INDEX"], next:"database", action:"Scout players"},
  "data-explorer": {kicker:"THE SOURCE OF TRUTH", title:"Start with the sample.", subtitle:"Explore the public canonical player pool and its coverage.", metricNames:["PLAYER RECORDS","ROLE DISTRIBUTION","BATTING EXPOSURE","BOWLING EXPOSURE","RECORDED SAMPLE"], next:"database", action:"Discover players"},
  "batting-intel": {kicker:"BATTING / DECISIVE MOMENTS", title:"Every ball matters.", subtitle:"Strike rate is a chapter, not the whole story.", metricNames:["PRESSURE STRIKE RATE","STRIKE RATE DELTA","BOUNDARY PERCENT","DOT BALL PERCENT","PRESSURE RUNS"], next:"comparison", action:"Compare batters"},
  "bowling-intel": {kicker:"BOWLING / DECISIVE MOMENTS", title:"Every run saved counts.", subtitle:"Explore wickets, economy and recorded pressure exposure.", metricNames:["PRESSURE ECONOMY","RECORDED WICKETS","ECONOMY DELTA","DOT BALL PERCENT","PRESSURE BALLS"], next:"comparison", action:"Compare bowlers"},
  "command-centre": {kicker:"THE KHILADI EXPERIENCE", title:"From evidence to instinct.", subtitle:"Choose a journey through the available cricket data.", metricNames:["RECORDED SAMPLE","PLAYER DISCOVERY","PRESSURE CONTEXT","BATTING METRICS","BOWLING METRICS"], next:"database", action:"Discover the players"},
};

const sum = (players: Player[], extract: (p:Player)=>boolean) => players.reduce((n,p)=>n+(extract(p)?1:0),0);

export function MetricVortexScene({
  route, players, onNavigate, planningBudget
}: {route:string;players:Player[];onNavigate:(p:string)=>void;planningBudget:number}) {
  const meta = SCENES[route];
  const phrase = useMemo(() => {
    if (!meta) return "KHILADI / CRICKET INTELLIGENCE / ";
    const terms = [...meta.metricNames];
    // Figures below are computed from actual public records and app state only.
    if (players.length) {
      if (route==="database" || route==="data-explorer" || route==="command-centre")
        terms.push(`PLAYER RECORDS ${players.length.toLocaleString("en-IN")}`);
      if (route==="batting-intel" || route==="data-explorer")
        terms.push(`BATTING EXPOSURE ${sum(players,p=>p.batting.press_balls>0)}`);
      if (route==="bowling-intel" || route==="data-explorer")
        terms.push(`BOWLING EXPOSURE ${sum(players,p=>p.bowling.press_balls>0)}`);
    }
    if(route==="war-room") terms.push(`EXAMPLE PLANNING BUDGET ${planningBudget.toFixed(1)} CRORE`);
    return terms.join(" / ")+" / ";
  }, [route,players,planningBudget,meta]);
  if (!meta) return null;
  return <section className={`metric-vortex-scene metric-vortex-scene--${route}`} aria-label={meta.kicker}>
    <div className="metric-vortex-scene__art" data-testid="metric-vortex">
      <TypographyVortexCanvas mode="dark" phrase={phrase} className="metric-vortex-scene__canvas" />
    </div>
    <div className="metric-vortex-scene__copy">
      <span className="metric-vortex-scene__kicker">{meta.kicker}</span>
      <h2>{meta.title}</h2>
      <p>{meta.subtitle}</p>
      <IridescentActionButton onClick={()=>onNavigate(meta.next)} size="md">{meta.action}</IridescentActionButton>
    </div>
    <div className="metric-vortex-scene__hint">MOVE / DISSOLVE &nbsp;·&nbsp; CLICK / SUCTION</div>
  </section>;
}
