"""Regression: legacy player profiles must not manufacture accepted research metrics."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from khiladi.backend.main import get_player_profile

def main():
    for player_id in (813, 2933, 6819):
        payload = get_player_profile(player_id)
        assert payload["player"]["player_id"] == player_id
        assert payload["radar_metrics"] is None
        auction = payload["rr_auction_fit"]
        assert auction["available"] is False
        assert auction["fit_score"] is None
        assert auction["tactical_role"] is None
        assert auction["recommended_strategy"] is None
        assert "not estimated" in auction["reason"]
    print("Legacy profile inference guard: passed, 3 canonical identities.")

if __name__ == "__main__":
    main()
