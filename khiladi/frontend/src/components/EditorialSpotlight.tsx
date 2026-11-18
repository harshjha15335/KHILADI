import React, { useState } from "react";
import { playerImage } from "../utils/media";
import "./editorial-spotlight.css";

export type SpotlightEntry = {
  player_id:number; player_name:string; role?:string;
  value?:string; label?:string; eyebrow?:string;
};
function Portrait({entry}:{entry:SpotlightEntry}) {
  const [failed,setFailed]=useState(false);
  const src=playerImage(entry);
  if (!src||failed) return <span className="editorial-spotlight__fallback" aria-hidden="true">
    {entry.player_name.split(" ").map(x=>x[0]).slice(0,2).join("")}
  </span>;
  return <img src={src} alt="" decoding="async" loading="lazy" referrerPolicy="no-referrer"
    width="400" height="470" onError={()=>setFailed(true)} />;
}
/** Source-linked player photography in a deliberately asymmetric editorial composition.
 *  Values are passed from the visible public dataset, never reconstructed from a private model.
 */
export function EditorialSpotlight({title,entries,onInspect,subtitle}:{
  title:string; subtitle?:string;entries:SpotlightEntry[];
  onInspect:(id:number)=>void;
}) {
  if (!entries.length) return null;
  return <section className="editorial-spotlight" aria-labelledby="spotlight-title">
    <div className="editorial-spotlight__heading">
      <p className="eyebrow">PEOPLE BEHIND THE NUMBERS</p>
      <h2 id="spotlight-title">{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    <div className="editorial-spotlight__grid">
      {entries.slice(0,3).map((entry,i)=>(
        <button type="button" key={entry.player_id}
          className={`editorial-spotlight__player editorial-spotlight__player--${i}`}
          aria-label={`Open player record for ${entry.player_name}`}
          onClick={()=>onInspect(entry.player_id)}>
          <span className="editorial-spotlight__visual">
            <Portrait entry={entry}/>
            <span className="editorial-spotlight__index">0{i+1}</span>
          </span>
          <span className="editorial-spotlight__copy">
            <span className="editorial-spotlight__name">{entry.player_name}</span>
            <span className="editorial-spotlight__metric">
              <span>{entry.label??entry.role??"Recorded player"}</span>
              {entry.value && <strong>{entry.value}</strong>}
            </span>
            <span className="editorial-spotlight__open">EXPLORE PROFILE ↗</span>
          </span>
        </button>
      ))}
    </div>
  </section>;
}
