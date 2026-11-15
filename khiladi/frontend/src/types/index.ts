export interface BattingMetrics {
  total_balls: number;
  total_runs: number;
  overall_sr: number;
  press_balls: number;
  press_sr: number;
  sr_delta: number;
  press_dot_pct: number;
  press_boundary_pct: number;
  runs?: number;
  balls?: number;
  normal_sr?: number;
  pressure_sr?: number;
  pressure_balls?: number;
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
  balls?: number;
  normal_econ?: number;
  pressure_econ?: number;
  pressure_balls?: number;
}

export interface Player {
  player_id: number;
  player_name: string;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Squad Member' | string;
  teams: string[];
  is_rr: boolean;
  pressure_impact_index: number;
  batting: BattingMetrics;
  bowling: BowlingMetrics;
  portrait_url?: string;
  cutout_url?: string;
  official_profile_url?: string;
  portrait_status?: string;
  pressure_score?: number;
  country?: string;
  batting_style?: string;
  bowling_style?: string;
  auction_price_cr?: number;
  ipl_url?: string;
  matches?: number;
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
  role?: string;
  pressure_sr?: number;
  normal_sr?: number;
  sr_delta?: number;
  pressure_score?: number;
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
  role?: string;
  pressure_econ?: number;
  normal_econ?: number;
  econ_delta?: number;
  pressure_score?: number;
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
  dismissal?: string | null;
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
