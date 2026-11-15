export interface BattingMetrics {
  total_balls: number;
  total_runs: number;
  overall_sr: number;
  press_balls: number;
  press_sr: number;
  sr_delta: number;
  press_dot_pct: number;
  press_boundary_pct: number;
}

export interface BowlingMetrics {
  total_balls: number;
  wickets: number;
  overall_econ: number;
  press_balls: number;
  press_econ: number;
  econ_delta: number;
  press_dot_pct: number;
  press_wickets: number;
}

export interface Player {
  player_id: number;
  player_name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Squad Member';
  teams: string[];
  is_rr: boolean;
  pressure_impact_index: number;
  batting: BattingMetrics;
  bowling: BowlingMetrics;
  portrait_url?: string;
  cutout_url?: string;
  official_profile_url?: string;
  portrait_status?: string;
}

export interface TopBatter {
  rank: number;
  player_id: number;
  player_name: string;
  pressure_impact_index: number;
  pressure_strike_rate: number;
  baseline_strike_rate: number;
  strike_rate_delta: number;
  pressure_balls_faced: number;
  total_balls_faced: number;
  portrait_url?: string;
  official_profile_url?: string;
}

export interface TopBowler {
  rank: number;
  player_id: number;
  player_name: string;
  pressure_impact_index: number;
  pressure_economy: number;
  baseline_economy: number;
  economy_delta: number;
  pressure_dot_percentage: number;
  pressure_balls_bowled: number;
  total_balls_bowled: number;
  portrait_url?: string;
  official_profile_url?: string;
}

export interface RRPlayer {
  player_id: number;
  player_name: string;
  role: string;
  pressure_impact_index: number;
  season_label: string;
  portrait_url?: string;
  cutout_url?: string;
}

export interface Delivery {
  innings: number;
  over: number;
  ball: number;
  striker: string;
  striker_id: number;
  bowler: string;
  bowler_id: number;
  runs: number;
  total_runs: number;
  is_wicket: boolean;
  dismissal?: string;
  leverage_index: number;
  is_high_pressure: boolean;
  cum_score: string;
}

export interface MatchReplay {
  match_id: number;
  home_team: string;
  away_team: string;
  winner: number;
  total_deliveries: number;
  deliveries: Delivery[];
}
