import React, { useEffect, useState } from "react";
import type { Player } from "../types";
import { playerImage } from "../utils/media";
import { NeutralPlayerAvatar } from "./NeutralPlayerAvatar";
import { KhiladiAnimatedButton } from "./KhiladiAnimatedButton";
import "./khiladi-bento.css";

/** A portrait is a first-class player action, not decoration inside a navigation button. */
const Portrait: React.FC<{ player?: Player; onInspect: (p: Player) => void }> = ({player,onInspect}) => {
  const src=player ? playerImage(player) : undefined;
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[player?.player_id,src]);
  const photo=src&&!failed ?
    <img src={src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer"
      onError={()=>setFailed(true)} /> :
    <NeutralPlayerAvatar className="kb-neutral-avatar"
      label={player?`Portrait unavailable for ${player.player_name}`:"Player portrait unavailable"}/>;
  return player ?
    <button type="button" className="kb-mini-portrait" data-player-id={player.player_id}
      aria-label={`Open ${player.player_name}'s player card`} onClick={()=>onInspect(player)}>
      {photo}
    </button> :
    <span className="kb-mini-portrait">{photo}</span>;
};

export const KhiladiBento:React.FC<{
  featured:Player[]; onNavigate:(page:string)=>void; onSelectPlayer:(p:Player)=>void;
}> = ({featured,onNavigate,onSelectPlayer}) => {
  const first=featured[0],second=featured[1],third=featured[2];
  return <section className="khiladi-bento" aria-labelledby="kb-heading">
    <div className="khiladi-bento__title">
      <p className="eyebrow">THE TOOLS BEHIND THE TEAM</p>
      <h2 id="kb-heading">Everything starts <em>with a player.</em></h2>
      <p>Discover, analyze, compare and plan using the recorded competition data.</p>
    </div>
    <div className="khiladi-bento__grid">
      <div className="kb-card kb-card--discover">
        <span className="kb-kicker">01 · DISCOVER</span>
        <strong>Meet the difference-makers.</strong>
        <p>Search the complete canonical player pool. Every selection opens a real player record.</p>
        <span className="kb-portrait-stack">
          <Portrait player={first} onInspect={onSelectPlayer}/>
          <Portrait player={second} onInspect={onSelectPlayer}/>
          <Portrait player={third} onInspect={onSelectPlayer}/>
        </span>
        <KhiladiAnimatedButton size="sm" variant="secondary" className="kb-card-link" onClick={()=>onNavigate("database")}>Explore players</KhiladiAnimatedButton>
      </div>
      <div className="kb-card kb-card--compare">
        <span className="kb-kicker">02 · COMPARE</span>
        <strong>Two players. One clearer picture.</strong>
        <div className="kb-head-to-head">
          <span><Portrait player={first} onInspect={onSelectPlayer}/><small>{first?.player_name??"Player A"}</small></span>
          <b>VS</b>
          <span><Portrait player={second} onInspect={onSelectPlayer}/><small>{second?.player_name??"Player B"}</small></span>
        </div>
        <KhiladiAnimatedButton size="sm" variant="secondary" className="kb-card-link" onClick={()=>onNavigate("comparison")}>Start comparison</KhiladiAnimatedButton>
      </div>
      <div className="kb-card kb-card--pressure">
        <span className="kb-kicker">03 · UNDERSTAND</span>
        <strong>Beyond the scoreboard.</strong>
        <p>The sample replay connects match-state and recorded events to the pressure analysis.</p>
        <div className="kb-pressure-visual" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div>
        <KhiladiAnimatedButton size="sm" variant="secondary" className="kb-card-link" onClick={()=>onNavigate("pressure-lab")}>Explore pressure</KhiladiAnimatedButton>
      </div>
      <div className="kb-card kb-card--squad">
        <span className="kb-kicker">04 · DECIDE</span>
        <strong>Build the team you'd back.</strong>
        <p>A real interactive squad planner with editable example bids and budget constraints.</p>
        <div className="kb-squad-total"><small>EXAMPLE PLANNING PURSE</small><b>₹120 <span>Cr</span></b></div>
        <KhiladiAnimatedButton size="sm" variant="secondary" className="kb-card-link" onClick={()=>onNavigate("war-room")}>Enter squad builder</KhiladiAnimatedButton>
      </div>
    </div>
  </section>;
};
