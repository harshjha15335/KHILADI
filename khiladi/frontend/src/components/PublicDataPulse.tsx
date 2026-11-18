import React, { useEffect, useState } from "react";
import { loadPlayers, requestJSON } from "../utils/api";
import type { Player, TopBatter, TopBowler } from "../types";
import "./public-data-pulse.css";

type Snapshot={
  playerCount:number;
  rrPlayers:number;
  battingExposure:number;
  bowlingExposure:number;
  legacyBatting:number;
  legacyBowling:number;
};
export const PublicDataPulse: React.FC<{
  onNavigate:(route:string)=>void;
  compact?:boolean;
}> = ({onNavigate,compact=false}) => {
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [error,setError]=useState(false);
  useEffect(()=>{
    let active=true;
    Promise.all([
      loadPlayers(),
      requestJSON<TopBatter[]>("/data/top_10_batters.json"),
      requestJSON<TopBowler[]>("/data/top_10_bowlers.json"),
    ]).then(([all,bat,bowl])=>{
      if(!active)return;
      setSnapshot({
        playerCount:all.length,
        rrPlayers:all.filter((p:Player)=>p.is_rr).length,
        battingExposure:all.filter((p:Player)=>p.batting.press_balls>0).length,
        bowlingExposure:all.filter((p:Player)=>p.bowling.press_balls>0).length,
        legacyBatting:bat.length,legacyBowling:bowl.length,
      });
    }).catch(()=>{if(active)setError(true)});
    return ()=>{active=false};
  },[]);
  return <section className={`public-data-pulse ${compact?"public-data-pulse--compact":""}`}
    aria-labelledby="data-pulse-heading">
    <header>
      <p className="eyebrow">THE PUBLIC EVIDENCE</p>
      <h2 id="data-pulse-heading">Real records. <em>Real decisions.</em></h2>
      <p>Explore the stored competition data. These sample statistics are not the private accepted D20 model.</p>
    </header>
    {error ? <p role="alert">The public data could not be loaded. Try refreshing the page.</p> :
      !snapshot ? <p role="status" className="data-pulse-loading">Loading verified competition records…</p> :
      <div className="public-data-pulse__grid">
        <div className="public-data-pulse__stat"><strong>{snapshot.playerCount.toLocaleString("en-IN")}</strong><span>Canonical player records</span></div>
        <div className="public-data-pulse__stat"><strong>{snapshot.rrPlayers.toLocaleString("en-IN")}</strong><span>RR-affiliated records in source data</span></div>
        <div className="public-data-pulse__stat"><strong>{snapshot.battingExposure.toLocaleString("en-IN")}</strong><span>Players with recorded pressure batting deliveries</span></div>
        <div className="public-data-pulse__stat"><strong>{snapshot.bowlingExposure.toLocaleString("en-IN")}</strong><span>Players with recorded pressure bowling deliveries</span></div>
      </div>}
    <footer className="public-data-pulse__actions">
      <button type="button" onClick={()=>onNavigate("data-explorer")}>Browse complete dataset <span aria-hidden="true">↗</span></button>
      <button type="button" onClick={()=>onNavigate("rankings")}>View the public top ten <span aria-hidden="true">↗</span></button>
    </footer>
  </section>;
};
