import os
import json
import numpy as np
import pandas as pd

def main():
    print("="*60)
    print("KHILADI CRICKET PRESSURE & RELIABILITY MODELING ENGINE")
    print("="*60)

    # 1. Load canonical mapping
    mapping_path = "Data Pack/competition_team_player_mapping.csv"
    mapping_df = pd.read_csv(mapping_path)
    canonical_players = mapping_df[['player_id', 'player_name']].drop_duplicates().sort_values('player_id')
    unique_player_ids = set(canonical_players['player_id'].unique())
    print(f"Canonical Whitelisted Players: {len(unique_player_ids)}")

    # 2. Load matches & competitions
    matches_df = pd.read_csv("Data Pack/matches.csv")
    comps_df = pd.read_csv("Data Pack/competitions.csv")
    matches_with_comp = matches_df.merge(comps_df, on="comp_id", how="left")
    print(f"Loaded {len(matches_df)} matches across {len(comps_df)} competitions.")

    # 3. Load ball-by-ball data
    print("Loading ball_by_ball.csv (this may take a few seconds)...")
    bbb = pd.read_csv("Data Pack/ball_by_ball.csv")
    print(f"Loaded {len(bbb)} ball-by-ball delivery records.")

    # Ensure integer fields
    bbb['runs'] = pd.to_numeric(bbb['runs'], errors='coerce').fillna(0).astype(int)
    bbb['is_four'] = bbb['is_four'].fillna(0).astype(int)
    bbb['is_six'] = bbb['is_six'].fillna(0).astype(int)
    bbb['is_wicket'] = bbb['is_wicket'].fillna(0).astype(int)
    bbb['extras1_runs'] = pd.to_numeric(bbb['extras1_runs'], errors='coerce').fillna(0).astype(int)
    bbb['extras_2_runs'] = pd.to_numeric(bbb['extras_2_runs'], errors='coerce').fillna(0).astype(int)
    
    # Total runs conceded on delivery
    bbb['total_ball_runs'] = bbb['runs'] + bbb['extras1_runs'] + bbb['extras_2_runs']
    
    # Identify legal ball for bowler and striker
    # Wides and no-balls are not legal balls for bowler
    bbb['is_wide_or_nb'] = bbb['extras_type'].str.contains('wide|no_ball', case=False, na=False)
    bbb['is_legal_ball'] = ~bbb['is_wide_or_nb']
    
    # Bowler wicket (excluding run out, retired hurt, timed out, obstructing field)
    bowler_dismissal_types = [
        'bowled', 'caught', 'caught and bowled', 'lbw', 'stumped', 'hit wicket'
    ]
    bbb['is_bowler_wicket'] = bbb['is_wicket'].astype(bool) & bbb['dismissal_type'].str.lower().isin(bowler_dismissal_types)

    # 4. Formulate Match State Pressure
    # Calculate cumulative score and wickets per match & innings
    print("Calculating match state leverage and pressure metrics...")
    
    # Sort chronologically by match, innings, overid, over_ball_num
    bbb = bbb.sort_values(['match_id', 'innings', 'overid', 'over_ball_num']).reset_index(drop=True)
    
    # Group by match & innings to get cumulative runs and wickets
    bbb['cum_runs'] = bbb.groupby(['match_id', 'innings'])['total_ball_runs'].cumsum()
    bbb['cum_wickets'] = bbb.groupby(['match_id', 'innings'])['is_wicket'].cumsum()
    
    # Over phase
    # overid is 1 to 20
    def get_phase(over):
        if over <= 6: return 'Powerplay'
        elif over <= 15: return 'Middle'
        else: return 'Death'
    bbb['phase'] = bbb['overid'].apply(get_phase)

    # Merge target score from 1st innings to 2nd innings
    first_inn_totals = bbb[bbb['innings'] == 1].groupby('match_id')['total_ball_runs'].sum().reset_index()
    first_inn_totals.columns = ['match_id', 'first_inn_total']
    bbb = bbb.merge(first_inn_totals, on='match_id', how='left')
    
    # Merge knockout flag
    match_ko = matches_df[['match_id', 'knock_out']].drop_duplicates()
    bbb = bbb.merge(match_ko, on='match_id', how='left')
    bbb['knock_out'] = bbb['knock_out'].fillna(0).astype(int)

    # Compute pre-ball Pressure Index (LI - Leverage Index)
    # Balls remaining in standard 20-over match
    bbb['balls_remaining'] = np.maximum(1, 120 - ((bbb['overid'] - 1) * 6 + bbb['over_ball_num']))
    
    # Target in 2nd innings
    bbb['target'] = bbb['first_inn_total'] + 1
    bbb['runs_needed'] = np.maximum(0, bbb['target'] - (bbb['cum_runs'] - bbb['total_ball_runs']))
    bbb['rrr'] = (bbb['runs_needed'] / (bbb['balls_remaining'] / 6.0)).clip(0, 36)
    
    # Base Leverage Index calculation
    # In 2nd innings: depends heavily on RRR and wickets down
    # In 1st innings: depends on death overs + wickets in hand + knockout
    def calculate_leverage(row):
        inn = row['innings']
        over = row['overid']
        wickets = row['cum_wickets'] - row['is_wicket']
        is_ko = row['knock_out']
        ko_mult = 1.25 if is_ko == 1 else 1.0

        if inn == 2:
            rrr = row['rrr']
            balls_left = row['balls_remaining']
            if balls_left <= 30: # Last 5 overs
                if rrr > 14.0 and wickets >= 7: return 1.2 * ko_mult # nearly lost
                elif rrr >= 9.0: return min(3.5, (rrr / 6.0) * (1.0 + (wickets/10.0))) * ko_mult
                elif rrr >= 7.0: return 2.0 * ko_mult
                else: return 1.2 * ko_mult
            elif balls_left <= 60: # Overs 11-15
                if rrr >= 10.0: return 2.2 * ko_mult
                elif rrr >= 8.0: return 1.6 * ko_mult
                else: return 1.1 * ko_mult
            else: # Powerplay
                if wickets >= 3: return 2.0 * ko_mult # early collapse
                else: return 1.0 * ko_mult
        else: # 1st innings
            if over >= 16: # Death overs
                if wickets <= 5: return 2.2 * ko_mult # high hitting leverage
                elif wickets <= 8: return 1.8 * ko_mult
                else: return 1.3 * ko_mult
            elif over <= 6: # Powerplay
                if wickets >= 2: return 1.8 * ko_mult # top order collapse
                else: return 1.0 * ko_mult
            else: # Middle overs
                if wickets >= 4: return 1.6 * ko_mult
                else: return 1.1 * ko_mult

    bbb['leverage_index'] = bbb.apply(calculate_leverage, axis=1)
    bbb['is_high_pressure'] = bbb['leverage_index'] >= 1.8
    print(f"High pressure deliveries: {bbb['is_high_pressure'].sum()} ({bbb['is_high_pressure'].mean()*100:.1f}%)")

    # 5. Batting Analysis & Metrics
    print("\nComputing Batter Metrics and Pressure Impact Index...")
    # Overall Batting
    bat_overall = bbb.groupby(['striker_id', 'striker_name']).agg(
        total_balls=('is_legal_ball', 'sum'),
        total_runs=('runs', 'sum'),
        fours=('is_four', 'sum'),
        sixes=('is_six', 'sum'),
        dismissals=('is_wicket', 'sum'),
        dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()
    
    bat_overall['overall_sr'] = (bat_overall['total_runs'] / np.maximum(1, bat_overall['total_balls'])) * 100.0
    bat_overall['overall_avg'] = bat_overall['total_runs'] / np.maximum(1, bat_overall['dismissals'])
    bat_overall['overall_dot_pct'] = (bat_overall['dots'] / np.maximum(1, bat_overall['total_balls'])) * 100.0
    bat_overall['overall_boundary_pct'] = ((bat_overall['fours'] + bat_overall['sixes']) / np.maximum(1, bat_overall['total_balls'])) * 100.0

    # High Pressure Batting
    bat_press = bbb[bbb['is_high_pressure']].groupby('striker_id').agg(
        press_balls=('is_legal_ball', 'sum'),
        press_runs=('runs', 'sum'),
        press_fours=('is_four', 'sum'),
        press_sixes=('is_six', 'sum'),
        press_dismissals=('is_wicket', 'sum'),
        press_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()

    bat_metrics = bat_overall.merge(bat_press, on='striker_id', how='left').fillna(0)
    bat_metrics['press_sr'] = (bat_metrics['press_runs'] / np.maximum(1, bat_metrics['press_balls'])) * 100.0
    bat_metrics['press_avg'] = bat_metrics['press_runs'] / np.maximum(1, bat_metrics['press_dismissals'])
    bat_metrics['press_dot_pct'] = (bat_metrics['press_dots'] / np.maximum(1, bat_metrics['press_balls'])) * 100.0
    bat_metrics['press_boundary_pct'] = ((bat_metrics['press_fours'] + bat_metrics['press_sixes']) / np.maximum(1, bat_metrics['press_balls'])) * 100.0
    
    # Delta SR under pressure
    bat_metrics['sr_delta'] = bat_metrics['press_sr'] - bat_metrics['overall_sr']

    # Batting Pressure Impact Index (PII) with Empirical Bayes Shrinkage
    # Prior mean SR under pressure ~ 125.0, weight prior with m=40 balls
    m_prior = 40.0
    prior_sr = 125.0
    shrunk_press_sr = (bat_metrics['press_runs'] + prior_sr * (m_prior / 100.0)) / (bat_metrics['press_balls'] + m_prior) * 100.0
    
    # Composite Batting PII:
    # 50% shrunk pressure SR + 25% boundary pct + 15% low dot bonus + 10% average
    bat_metrics['bat_pii'] = (
        (shrunk_press_sr / 150.0) * 5.0 +
        (bat_metrics['press_boundary_pct'] / 25.0) * 2.5 +
        np.maximum(0, (40.0 - bat_metrics['press_dot_pct']) / 40.0) * 1.5 +
        np.minimum(3.0, bat_metrics['press_avg'] / 20.0) * 1.0
    )
    
    # Filter for qualified batters: min 100 total balls & min 35 pressure balls
    qualified_batters = bat_metrics[
        (bat_metrics['total_balls'] >= 100) & 
        (bat_metrics['press_balls'] >= 35) &
        (bat_metrics['striker_id'].isin(unique_player_ids))
    ].sort_values('bat_pii', ascending=False).reset_index(drop=True)
    
    print("\nTop 10 Batters Under Pressure:")
    for i, row in qualified_batters.head(10).iterrows():
        print(f"Rank {i+1}: {row['striker_name']} (ID: {row['striker_id']}) — PII: {row['bat_pii']:.2f}, Press SR: {row['press_sr']:.1f}, Balls: {row['press_balls']}, Total Balls: {row['total_balls']}")

    # 6. Bowling Analysis & Metrics
    print("\nComputing Bowler Metrics and Pressure Impact Index...")
    bowl_overall = bbb.groupby(['bowler_id', 'bowler_name']).agg(
        total_balls=('is_legal_ball', 'sum'),
        total_runs_conceded=('total_ball_runs', 'sum'),
        wickets=('is_bowler_wicket', 'sum'),
        dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()

    bowl_overall['overall_econ'] = (bowl_overall['total_runs_conceded'] / np.maximum(1, bowl_overall['total_balls'])) * 6.0
    bowl_overall['overall_dot_pct'] = (bowl_overall['dots'] / np.maximum(1, bowl_overall['total_balls'])) * 100.0
    bowl_overall['overall_sr'] = bowl_overall['total_balls'] / np.maximum(1, bowl_overall['wickets'])

    # High Pressure Bowling
    bowl_press = bbb[bbb['is_high_pressure']].groupby('bowler_id').agg(
        press_balls=('is_legal_ball', 'sum'),
        press_runs_conceded=('total_ball_runs', 'sum'),
        press_wickets=('is_bowler_wicket', 'sum'),
        press_dots=('runs', lambda x: (x == 0).sum())
    ).reset_index()

    bowl_metrics = bowl_overall.merge(bowl_press, on='bowler_id', how='left').fillna(0)
    bowl_metrics['press_econ'] = (bowl_metrics['press_runs_conceded'] / np.maximum(1, bowl_metrics['press_balls'])) * 6.0
    bowl_metrics['press_dot_pct'] = (bowl_metrics['press_dots'] / np.maximum(1, bowl_metrics['press_balls'])) * 100.0
    bowl_metrics['press_sr'] = bowl_metrics['press_balls'] / np.maximum(1, bowl_metrics['press_wickets'])
    bowl_metrics['econ_delta'] = bowl_metrics['overall_econ'] - bowl_metrics['press_econ'] # positive means tighter under pressure

    # Bowler Pressure Impact Index (PII) with Empirical Bayes Shrinkage
    # Prior economy ~ 9.0, weight prior with m=40 balls
    shrunk_press_econ = (bowl_metrics['press_runs_conceded'] + 9.0 * (m_prior / 6.0)) / (bowl_metrics['press_balls'] + m_prior) * 6.0
    
    # Composite Bowling PII:
    # Reward sub-8 economy, high dot ball %, and wicket taking rate
    bowl_metrics['bowl_pii'] = (
        np.maximum(0, (12.0 - shrunk_press_econ) / 4.0) * 4.5 +
        (bowl_metrics['press_dot_pct'] / 40.0) * 3.0 +
        np.maximum(0, (24.0 - np.minimum(24.0, bowl_metrics['press_sr'])) / 12.0) * 2.5
    )

    # Filter for qualified bowlers: min 120 total balls & min 40 pressure balls
    qualified_bowlers = bowl_metrics[
        (bowl_metrics['total_balls'] >= 120) & 
        (bowl_metrics['press_balls'] >= 40) &
        (bowl_metrics['bowler_id'].isin(unique_player_ids))
    ].sort_values('bowl_pii', ascending=False).reset_index(drop=True)

    print("\nTop 10 Bowlers Under Pressure:")
    for i, row in qualified_bowlers.head(10).iterrows():
        print(f"Rank {i+1}: {row['bowler_name']} (ID: {row['bowler_id']}) — PII: {row['bowl_pii']:.2f}, Press Econ: {row['press_econ']:.2f}, Press Dots: {row['press_dot_pct']:.1f}%, Balls: {row['press_balls']}")

    # 7. Generate Competition Export CSVs and JSONs
    print("\nGenerating Top 10 Batters & Bowlers deliverables...")
    top10_batters = qualified_batters.head(10)[['striker_id', 'striker_name', 'bat_pii', 'press_sr', 'overall_sr', 'sr_delta', 'press_balls', 'total_balls']].copy()
    top10_batters.columns = ['player_id', 'player_name', 'pressure_impact_index', 'pressure_strike_rate', 'baseline_strike_rate', 'strike_rate_delta', 'pressure_balls_faced', 'total_balls_faced']
    top10_batters['rank'] = range(1, 11)
    
    top10_bowlers = qualified_bowlers.head(10)[['bowler_id', 'bowler_name', 'bowl_pii', 'press_econ', 'overall_econ', 'econ_delta', 'press_dot_pct', 'press_balls', 'total_balls']].copy()
    top10_bowlers.columns = ['player_id', 'player_name', 'pressure_impact_index', 'pressure_economy', 'baseline_economy', 'economy_delta', 'pressure_dot_percentage', 'pressure_balls_bowled', 'total_balls_bowled']
    top10_bowlers['rank'] = range(1, 11)

    top10_batters.to_csv("khiladi/data/top_10_batters.csv", index=False)
    top10_bowlers.to_csv("khiladi/data/top_10_bowlers.csv", index=False)
    top10_batters.to_json("khiladi/data/top_10_batters.json", orient="records", indent=2)
    top10_bowlers.to_json("khiladi/data/top_10_bowlers.json", orient="records", indent=2)

    # 8. Generate Complete All-Player Profile Database
    print("\nCompiling complete player database for all 1,217 canonical players...")
    all_players = []
    
    # Pre-map teams from competition mapping
    player_teams = mapping_df.groupby('player_id')['team_name'].apply(lambda x: list(set(x.dropna()))).to_dict()
    
    for pid in unique_player_ids:
        pname = canonical_players[canonical_players['player_id'] == pid]['player_name'].values[0]
        teams = player_teams.get(pid, [])
        
        # Check if batter stats exist
        b_match = bat_metrics[bat_metrics['striker_id'] == pid]
        # Check if bowler stats exist
        bw_match = bowl_metrics[bowl_metrics['bowler_id'] == pid]
        
        has_bat = len(b_match) > 0 and b_match['total_balls'].values[0] >= 10
        has_bowl = len(bw_match) > 0 and bw_match['total_balls'].values[0] >= 12
        
        # Determine primary role
        if has_bat and has_bowl:
            role = "All-Rounder"
        elif has_bowl:
            role = "Bowler"
        elif has_bat:
            role = "Batter"
        else:
            role = "Squad Member"
            
        bat_stat = b_match.iloc[0].to_dict() if len(b_match) > 0 else {}
        bowl_stat = bw_match.iloc[0].to_dict() if len(bw_match) > 0 else {}
        
        # Composite player PII
        b_pii = bat_stat.get('bat_pii', 0.0)
        bw_pii = bowl_stat.get('bowl_pii', 0.0)
        pii = round(float(max(b_pii, bw_pii)), 2)
        if role == "All-Rounder":
            pii = round(float((b_pii * 0.55) + (bw_pii * 0.55)), 2)
            
        all_players.append({
            "player_id": int(pid),
            "player_name": pname,
            "role": role,
            "teams": teams,
            "is_rr": "Rajasthan Royals" in teams,
            "pressure_impact_index": pii,
            "batting": {
                "total_balls": int(bat_stat.get('total_balls', 0)),
                "total_runs": int(bat_stat.get('total_runs', 0)),
                "overall_sr": round(float(bat_stat.get('overall_sr', 0.0)), 1),
                "press_balls": int(bat_stat.get('press_balls', 0)),
                "press_sr": round(float(bat_stat.get('press_sr', 0.0)), 1),
                "sr_delta": round(float(bat_stat.get('sr_delta', 0.0)), 1),
                "press_dot_pct": round(float(bat_stat.get('press_dot_pct', 0.0)), 1),
                "press_boundary_pct": round(float(bat_stat.get('press_boundary_pct', 0.0)), 1)
            },
            "bowling": {
                "total_balls": int(bowl_stat.get('total_balls', 0)),
                "wickets": int(bowl_stat.get('wickets', 0)),
                "overall_econ": round(float(bowl_stat.get('overall_econ', 0.0)), 2),
                "press_balls": int(bowl_stat.get('press_balls', 0)),
                "press_econ": round(float(bowl_stat.get('press_econ', 0.0)), 2),
                "econ_delta": round(float(bowl_stat.get('econ_delta', 0.0)), 2),
                "press_dot_pct": round(float(bowl_stat.get('press_dot_pct', 0.0)), 1),
                "press_wickets": int(bowl_stat.get('press_wickets', 0))
            }
        })
        
    with open("khiladi/data/player_database.json", "w", encoding="utf-8") as f:
        json.dump(all_players, f, indent=2)
    print(f"Saved {len(all_players)} player profiles to khiladi/data/player_database.json")

    # 9. Extract Latest Rajasthan Royals Squad (IPL 2026 from supplied pack)
    print("\nExtracting latest Rajasthan Royals squad (IPL 2026 from supplied pack)...")
    rr_2026 = mapping_df[(mapping_df['comp_id'] == 3298) & (mapping_df['team_name'] == 'Rajasthan Royals')].drop_duplicates(subset=['player_id'])
    rr_squad = []
    for _, r in rr_2026.iterrows():
        p_info = next((p for p in all_players if p['player_id'] == r['player_id']), None)
        rr_squad.append({
            "player_id": int(r['player_id']),
            "player_name": r['player_name'],
            "role": p_info['role'] if p_info else "Player",
            "pressure_impact_index": p_info['pressure_impact_index'] if p_info else 5.0,
            "season_label": "IPL 2026 — from supplied data"
        })
    with open("khiladi/data/rr_squad_2026.json", "w", encoding="utf-8") as f:
        json.dump(rr_squad, f, indent=2)
    print(f"Saved {len(rr_squad)} RR players to khiladi/data/rr_squad_2026.json")

    # 10. Extract High-Pressure Match Replay for Pressure Lab
    print("\nExtracting representative high-pressure match replay...")
    # Find match with highest number of high leverage deliveries
    top_matches = bbb[bbb['is_high_pressure']].groupby('match_id').size().sort_values(ascending=False).head(5)
    sample_match_id = top_matches.index[0]
    match_meta = matches_df[matches_df['match_id'] == sample_match_id].iloc[0].to_dict()
    
    match_deliveries = bbb[bbb['match_id'] == sample_match_id].sort_values(['innings', 'overid', 'over_ball_num'])
    balls_payload = []
    for _, d in match_deliveries.iterrows():
        balls_payload.append({
            "innings": int(d['innings']),
            "over": int(d['overid']),
            "ball": int(d['over_ball_num']),
            "striker": d['striker_name'],
            "striker_id": int(d['striker_id']),
            "bowler": d['bowler_name'],
            "bowler_id": int(d['bowler_id']),
            "runs": int(d['runs']),
            "total_runs": int(d['total_ball_runs']),
            "is_wicket": bool(d['is_wicket']),
            "dismissal": d['dismissal_type'] if pd.notna(d['dismissal_type']) else None,
            "leverage_index": round(float(d['leverage_index']), 2),
            "is_high_pressure": bool(d['is_high_pressure']),
            "cum_score": f"{d['cum_runs']}/{d['cum_wickets']}"
        })
    match_replay = {
        "match_id": int(sample_match_id),
        "home_team": match_meta.get('home_team', 'Team 1'),
        "away_team": match_meta.get('away_team', 'Team 2'),
        "winner": match_meta.get('win_team_id', 'Winner'),
        "total_deliveries": len(balls_payload),
        "deliveries": balls_payload
    }
    with open("khiladi/data/sample_match_replay.json", "w", encoding="utf-8") as f:
        json.dump(match_replay, f, indent=2)
    print(f"Saved match replay {sample_match_id} ({len(balls_payload)} deliveries) to khiladi/data/sample_match_replay.json")

    print("\n" + "="*60)
    print("CRICKET MODELING ENGINE COMPLETED SUCCESSFULLY!")
    print("="*60)

if __name__ == "__main__":
    main()
