from pathlib import Path
import csv,json,sys,unittest,importlib.util
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'khiladi/backend'))
from main import PLAYERS_DB,RR_SQUAD_2026,TOP_BATTERS,TOP_BOWLERS,QuizQuery,quiz_recommendation,get_players,get_player_profile
class Integrity(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  with (root/'Data Pack/competition_team_player_mapping.csv').open(encoding='utf-8-sig') as f:cls.rows=list(csv.DictReader(f))
  cls.ids={int(row['player_id']) for row in cls.rows}
 def test_every_player_is_canonical_and_unique(self):
  ids=[p['player_id'] for p in PLAYERS_DB];self.assertEqual(len(ids),len(set(ids)));self.assertTrue(set(ids)<=self.ids);self.assertEqual(len(ids),1217)
 def test_squad_is_exact_latest_rr_season_from_pack(self):
  rows=[r for r in self.rows if 'rajasthan' in r['team_name'].lower() and 'IPL' in r['comp_name'].upper()]
  latest=max(int(''.join(c for c in r['comp_name'] if c.isdigit())) for r in rows)
  expected={int(r['player_id']) for r in rows if str(latest) in r['comp_name']}
  self.assertEqual(expected,{p['player_id'] for p in RR_SQUAD_2026})
 def test_rankings_remain_exact_stored_exports(self):
  for kind,rankings in [('batters',TOP_BATTERS),('bowlers',TOP_BOWLERS)]:
   original=json.loads((root/f'khiladi/data/top_10_{kind}.json').read_text());self.assertEqual(rankings,original);self.assertEqual(len(rankings),10);self.assertTrue({r['player_id'] for r in rankings}<=self.ids)
 def test_quiz_all_roles_and_phases_return_canonical_ids(self):
  for role in ['Batting','Bowling','All-Rounder']:
   for phase in ['Powerplay','Death Overs','Chase Master']:
    result=quiz_recommendation(QuizQuery(role_priority=role,match_phase=phase,risk_profile='Consistent Reliability'))
    self.assertEqual(len(result['recommendations']),3);self.assertTrue({p['player_id'] for p in result['recommendations']}<=self.ids)
 def test_api_pagination_and_search_contract(self):
  result=get_players(search='Jofra Archer',role=None,is_rr=None,min_pii=0,page=1,limit=200,sort_by='pressure_impact_index',order='desc');self.assertEqual(len(result['players']),1);self.assertEqual(result['players'][0]['player_id'],3298)
 def test_profile_uses_wrapped_player_contract(self):
  profile=get_player_profile(3298);self.assertEqual(profile['player']['player_name'],'Jofra Archer')
if __name__=='__main__':unittest.main(verbosity=2)
