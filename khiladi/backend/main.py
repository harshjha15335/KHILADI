import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="KHILADI API",
    description="Cricket Pressure Intelligence, Player Analytics & IPL Auction Strategy Engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

PLAYERS_DB = load_json("player_database.json")
TOP_BATTERS = load_json("top_10_batters.json")
TOP_BOWLERS = load_json("top_10_bowlers.json")
RR_SQUAD_2026 = load_json("rr_squad_2026.json")
MATCH_REPLAY = load_json("sample_match_replay.json")

# Load portraits manifest
manifest_path = os.path.join(ASSETS_DIR, "ipl_official_portraits.json")
PORTRAITS_MANIFEST = []
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        PORTRAITS_MANIFEST = json.load(f)

PORTRAIT_LOOKUP = {p["player_id"]: p for p in PORTRAITS_MANIFEST}

# Enrich player objects with portrait and cutout metadata
for p in PLAYERS_DB:
    port = PORTRAIT_LOOKUP.get(p["player_id"])
    if port:
        p["portrait_url"] = port.get("local_asset_path")
        p["cutout_url"] = port.get("quiz_cutout_path")
        p["official_profile_url"] = port.get("official_profile_url")
        p["portrait_status"] = port.get("status")
    else:
        p["portrait_url"] = None
        p["cutout_url"] = None
        p["official_profile_url"] = f"https://www.iplt20.com/players/{p['player_name'].lower().replace(' ', '-')}"
        p["portrait_status"] = "SILHOUETTE_FALLBACK"

for p in RR_SQUAD_2026:
    port = PORTRAIT_LOOKUP.get(p["player_id"])
    if port:
        p["portrait_url"] = port.get("local_asset_path")
        p["cutout_url"] = port.get("quiz_cutout_path")
    else:
        p["portrait_url"] = None
        p["cutout_url"] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "KHILADI Cricket Pressure Intelligence Platform",
        "canonical_players_count": len(PLAYERS_DB),
        "top_batters_count": len(TOP_BATTERS),
        "top_bowlers_count": len(TOP_BOWLERS),
        "rr_squad_count": len(RR_SQUAD_2026),
        "verified_ipl_portraits": len([p for p in PORTRAITS_MANIFEST if p.get("status") == "VERIFIED_IPL_OFFICIAL"])
    }

@app.get("/api/players")
def get_players(
    search: Optional[str] = None,
    role: Optional[str] = None,
    is_rr: Optional[bool] = None,
    min_pii: Optional[float] = 0.0,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    sort_by: str = "pressure_impact_index",
    order: str = "desc"
):
    results = PLAYERS_DB
    
    if search:
        s = search.lower().strip()
        results = [p for p in results if s in p["player_name"].lower()]
        
    if role and role != "All":
        results = [p for p in results if p["role"].lower() == role.lower()]
        
    if is_rr is not None:
        results = [p for p in results if p["is_rr"] == is_rr]
        
    if min_pii > 0:
        results = [p for p in results if p["pressure_impact_index"] >= min_pii]
        
    # Sort
    reverse = (order.lower() == "desc")
    if sort_by == "pressure_impact_index":
        results = sorted(results, key=lambda x: x["pressure_impact_index"], reverse=reverse)
    elif sort_by == "name":
        results = sorted(results, key=lambda x: x["player_name"], reverse=not reverse)
    elif sort_by == "press_sr":
        results = sorted(results, key=lambda x: x["batting"]["press_sr"], reverse=reverse)
    elif sort_by == "press_econ":
        results = sorted(results, key=lambda x: (x["bowling"]["press_econ"] if x["bowling"]["press_balls"] > 0 else 99.0), reverse=not reverse)
        
    total = len(results)
    start_idx = (page - 1) * limit
    paginated = results[start_idx:start_idx + limit]
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "players": paginated
    }

@app.get("/api/players/{player_id}")
def get_player_profile(player_id: int):
    player = next((p for p in PLAYERS_DB if p["player_id"] == player_id), None)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found in canonical whitelist")
        
    # Calculate radar chart scores (0 - 100)
    bat = player["batting"]
    bowl = player["bowling"]
    
    radar = {
        "pressure_handling": min(100, int(player["pressure_impact_index"] * 7.5)),
        "boundary_potency": min(100, int(bat["press_boundary_pct"] * 3.5)),
        "dot_control": min(100, int((45 - min(45, bat["press_dot_pct"])) * 2.2 + (bowl["press_dot_pct"] * 1.2))),
        "economy_discipline": min(100, int(max(0, (12 - bowl["press_econ"]) * 14))) if bowl["press_balls"] > 0 else 50,
        "consistency": min(100, int(player["pressure_impact_index"] * 7.0)),
        "clutch_finishing": min(100, int((bat["press_sr"] / 220) * 100)) if bat["press_balls"] > 0 else 40
    }
    
    return {
        "player": player,
        "radar_metrics": radar,
        "rr_auction_fit": {
            "fit_score": min(98, max(65, int(player["pressure_impact_index"] * 7.8))),
            "tactical_role": "High Leverage Finisher / Anchor" if player["role"] in ["Batter", "All-Rounder"] else "Death Overs Boundary Denier",
            "recommended_strategy": "Aggressive RTM Match" if player["is_rr"] else "Primary Target Tier 1"
        }
    }

@app.get("/api/rankings/batters")
def get_top_batters():
    # Enrich with portrait info
    enriched = []
    for b in TOP_BATTERS:
        port = PORTRAIT_LOOKUP.get(b["player_id"])
        b_copy = dict(b)
        b_copy["portrait_url"] = port.get("local_asset_path") if port else None
        b_copy["official_profile_url"] = port.get("official_profile_url") if port else f"https://www.iplt20.com/players/{b['player_name'].lower().replace(' ', '-')}"
        enriched.append(b_copy)
    return {
        "category": "Top 10 Batters Under Pressure",
        "competition": "Rajasthan Royals SupeRR Selector Season 2",
        "rankings": enriched
    }

@app.get("/api/rankings/bowlers")
def get_top_bowlers():
    enriched = []
    for bw in TOP_BOWLERS:
        port = PORTRAIT_LOOKUP.get(bw["player_id"])
        bw_copy = dict(bw)
        bw_copy["portrait_url"] = port.get("local_asset_path") if port else None
        bw_copy["official_profile_url"] = port.get("official_profile_url") if port else f"https://www.iplt20.com/players/{bw['player_name'].lower().replace(' ', '-')}"
        enriched.append(bw_copy)
    return {
        "category": "Top 10 Bowlers Under Pressure",
        "competition": "Rajasthan Royals SupeRR Selector Season 2",
        "rankings": enriched
    }

@app.get("/api/rr-squad")
def get_rr_squad():
    return {
        "team": "Rajasthan Royals",
        "season_label": "IPL 2026 — from supplied data",
        "squad_size": len(RR_SQUAD_2026),
        "players": RR_SQUAD_2026
    }

@app.get("/api/match-replay")
def get_match_replay():
    return MATCH_REPLAY

class QuizQuery(BaseModel):
    role_priority: str  # "Batting", "Bowling", "All-Rounder"
    match_phase: str    # "Powerplay", "Death Overs", "Chase Master"
    risk_profile: str   # "Consistent Reliability", "Explosive Upside"

@app.post("/api/quiz/recommend")
def quiz_recommendation(query: QuizQuery):
    candidates = PLAYERS_DB
    
    # Filter by role
    if query.role_priority == "Batting":
        candidates = [p for p in candidates if p["role"] in ["Batter", "All-Rounder"] and p["batting"]["press_balls"] >= 20]
        if query.match_phase == "Death Overs":
            candidates = sorted(candidates, key=lambda x: x["batting"]["press_sr"], reverse=True)
        else:
            candidates = sorted(candidates, key=lambda x: x["pressure_impact_index"], reverse=True)
    elif query.role_priority == "Bowling":
        candidates = [p for p in candidates if p["role"] in ["Bowler", "All-Rounder"] and p["bowling"]["press_balls"] >= 24]
        if query.match_phase == "Death Overs":
            candidates = sorted(candidates, key=lambda x: (x["bowling"]["press_econ"], -x["bowling"]["press_dot_pct"]))
        else:
            candidates = sorted(candidates, key=lambda x: x["pressure_impact_index"], reverse=True)
    else: # All-Rounder
        candidates = [p for p in candidates if p["role"] == "All-Rounder"]
        candidates = sorted(candidates, key=lambda x: x["pressure_impact_index"], reverse=True)
        
    top3 = candidates[:3]
    return {
        "query": query.dict(),
        "matched_count": len(candidates),
        "recommendations": top3
    }

@app.get("/api/portraits/manifest")
def get_portrait_manifest():
    return PORTRAITS_MANIFEST

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
