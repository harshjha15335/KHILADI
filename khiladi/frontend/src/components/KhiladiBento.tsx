import React, { useEffect, useState } from "react";
import type { Player } from "../types";
import { playerImage } from "../utils/media";
import { NeutralPlayerAvatar } from "./NeutralPlayerAvatar";
import "./khiladi-bento.css";

const Portrait: React.FC<{player?:Player}> = ({player}) => {
  const src = player ? playerImage(player) : undefined;
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [player?.player_id, src]);
  return <span className="kb-mini-portrait">
    {src && !failed
      ? <img src={src} alt="" loading="lazy" decoding="async"
          referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      : <NeutralPlayerAvatar className="kb-neutral-avatar"
          label={player ? `Portrait unavailable for ${player.player_name}` : "Player portrait unavailable"} />}
  </span>;
};
export const KhiladiBento:React.FC<{featured:Player[];onNavigate:(page:string)=>void}> = ({featured,onNavigate}) => {
  const first=featured[0],second=featured[1],third=featured[2];
  return <section className="khiladi-bento" aria-labelledby="kb-heading">
    <div className="khiladi-bento__title">
      <p className="eyebrow">THE TOOLS BEHIND THE TEAM</p>
      <h2 id="kb-heading">Everything starts <em>with a player.</em></h2>
      <p>Discover, analyze, compare and plan using the recorded competition data.</p>
    </div>
    <div className="khiladi-bento__grid">
      <button type="button" className="kb-card kb-card--discover" onClick={()=>onNavigate("database")}>
        <span className="kb-kicker">01 · DISCOVER</span>
        <strong>Meet the difference-makers.</strong>
        <p>Search the complete canonical player pool. Every selection opens a real player record.</p>
        <span className="kb-portrait-stack">
          <Portrait player={first}/><Portrait player={second}/><Portrait player={third}/>
        </span>
        <span className="kb-card-link">Explore players ↗</span>
      </button>
      <button type="button" className="kb-card kb-card--compare" onClick={()=>onNavigate("comparison")}>
        <span className="kb-kicker">02 · COMPARE</span>
        <strong>Two players. One clearer picture.</strong>
        <div className="kb-head-to-head">
          <span><Portrait player={first}/><small>{first?.player_name??"Player A"}</small></span>
          <b>VS</b>
          <span><Portrait player={second}/><small>{second?.player_name??"Player B"}</small></span>
        </div>
        <span className="kb-card-link">Start comparison ↗</span>
      </button>
      <button type="button" className="kb-card kb-card--pressure" onClick={()=>onNavigate("pressure-lab")}>
        <span className="kb-kicker">03 · UNDERSTAND</span>
        <strong>Beyond the scoreboard.</strong>
        <p>The sample replay connects match-state and recorded events to the pressure analysis.</p>
        <div className="kb-pressure-visual" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div>
        <span className="kb-card-link">Explore pressure ↗</span>
      </button>
      <button type="button" className="kb-card kb-card--squad" onClick={()=>onNavigate("war-room")}>
        <span className="kb-kicker">04 · DECIDE</span>
        <strong>Build the team you'd back.</strong>
        <p>A real interactive squad planner with editable example bids and budget constraints.</p>
        <div className="kb-squad-total"><small>EXAMPLE PLANNING PURSE</small><b>₹120 <span>Cr</span></b></div>
        <span className="kb-card-link">Enter squad builder ↗</span>
      </button>
    </div>
  </section>;
};
